import { Dimensions, Platform } from 'react-native';
import Crypto from 'crypto-js';
import DeviceInfo from 'react-native-device-info';

import langManager from 'Managers/LangManager';
import Storage from 'Utils/Storage';

/**
 * DevEye audience client for a native app.
 *
 * The documented way to install DevEye is a `<script>` tag; there is no browser here, so this
 * module speaks the batch endpoint directly. It is the only place in the app that calls an HTTP
 * service outside `user.server2`, and that is deliberate: DevEye is a third party, it must never
 * share the pinned WebSocket, and a measurement must never be able to break the app that produces
 * it. Every path below swallows its own errors.
 *
 * What the server does with what we send:
 * - `browser`, `os`, `device` are declared rather than guessed. A native client sends `okhttp/…`
 *   or `CFNetwork/…` as user-agent, from which DevEye can only read "Autre"; what the client
 *   declares wins. `browser` therefore carries the app version, which turns the "Navigateurs"
 *   breakdown into a version breakdown - the axis is free and nothing else would use it.
 * - `visitorId` is what makes counting people possible at all. In anonymous mode DevEye identifies
 *   a visitor by `hash(IP, user-agent, daily salt)`; on mobile that is a carrier NAT address plus a
 *   user-agent shared by every Android install, so unrelated users would collapse into a single
 *   visitor *and a single session*, which would silently merge their funnels. A per-install
 *   identifier is the only way out, hence the site must be set to "Persistante" in DevEye.
 *   The raw device id never leaves the phone: only a salted digest of it does.
 *
 * Two things gate a send, and neither is compiled in.
 *
 * The **key** comes from the server (`App` table, row `DevEyeKey`, carried by `get-app-data`) and
 * is cached here so the next launch has it before the connection is up. An empty key switches the
 * measurement off for every client at once, without shipping a version.
 *
 * The **consent** is read through `SetConsentProvider`, a getter rather than a value, so the
 * settings screen needs no wiring: the next flush reads the current answer.
 *
 * Both start unknown, and unknown means *hold, do not drop*. The first screens of a launch happen
 * before the settings are read and long before the server answers, and they are the beginning of
 * every funnel; sending them before the user's choice is known is what must not happen, losing
 * them is merely what we avoid.
 */

/** The batch endpoint. `/api/t/e` takes one event at a time; grouping is the whole point here. */
const ENDPOINT = 'https://devapi.geremy.dev/api/t/b';

/** `AUDIENCE_BATCH_MAX` on the DevEye side: a longer array is rejected as a whole. */
const BATCH_MAX = 20;

/** Grouping window. The web tag uses ~500ms; a mobile radio is happier with a wider one. */
const FLUSH_DELAY_MS = 1500;

/** Retry delay after a failed send. Flat, not exponential: the queue is bounded anyway. */
const RETRY_DELAY_MS = 30 * 1000;

/**
 * Bound of the pending queue. Reached, the oldest go: a phone offline for a day must not grow a
 * queue it will never be able to send, and recent measurements are the ones worth keeping.
 */
const QUEUE_MAX = 120;

/** A measurement that hangs must not hold a socket open behind the app. */
const REQUEST_TIMEOUT_MS = 8000;

/**
 * @typedef {object} DevEyeEvent
 * @property {'view' | 'event'} type
 * @property {string} path Screen path, always the one that was displayed when it happened
 * @property {string} [name] Event name, required for `event` and ignored for `view`
 * @property {number} at Client timestamp in epoch seconds; the server clamps it to its own window
 */

/**
 * @typedef {Function} LoggerFunction
 * @param {'info' | 'warn' | 'error'} level Log level
 * @param {string} message Log message
 * @param {...any} args Additional arguments for logging
 * @returns {void}
 */

/** @type {DevEyeEvent[]} */
let queue = [];

/** @type {ReturnType<typeof setTimeout> | null} */
let flushTimer = null;

/** True while a request is in flight, so two flushes never send the same events twice. */
let sending = false;

/**
 * Reads the user's choice, or `null` while it is still unknown (settings not loaded yet).
 * @type {(() => boolean) | null}
 */
let consentProvider = null;

/**
 * The site key: `null` while unknown, `''` once the server has said the measurement is off, the
 * key itself otherwise.
 * @type {string | null}
 */
let siteKey = null;

/** @type {LoggerFunction | null} */
let loggerFunction = null;

/**
 * The screen currently displayed. An event carries the path it happened on, exactly like the web
 * tag: without it every event would be attached to `/`.
 */
let currentPath = '/';

/** @type {string | null} Computed once, on first use. */
let visitorId = null;

/** @type {{ browser: string, os: string, device: string, screenWidth: number } | null} */
let staticContext = null;

/**
 * Set the logger function to handle logs
 * @param {LoggerFunction | null} logFn Function to handle logs, or null to disable logging
 * @returns {void}
 */
function setLogger(logFn) {
    loggerFunction = logFn;
}

/**
 * @param {'info' | 'warn' | 'error'} level
 * @param {string} message
 * @param {...any} args
 */
function log(level, message, ...args) {
    loggerFunction?.(level, message, ...args);
}

/**
 * Read the key kept from the last launch, so the screens of a cold start are measured without
 * waiting for the connection. Never fails: no cache simply means the key stays unknown, and the
 * queue waits for the server instead of being thrown away.
 * @returns {Promise<void>}
 */
async function initialize() {
    try {
        /** @type {{ key: string } | null} */
        const cached = await Storage.Load('DEVEYE_KEY');
        if (cached !== null && typeof cached.key === 'string' && cached.key.length > 0) {
            siteKey = cached.key;
        }
    } catch (error) {
        log('warn', '[DevEye] Cached key unreadable', error);
    }
}

/**
 * The key as the server states it, from `get-app-data`. An empty string switches the measurement
 * off and clears the cache, so the next launch does not resurrect a revoked key.
 * @param {string} key
 * @returns {void}
 */
function setKey(key) {
    const next = typeof key === 'string' ? key.trim() : '';
    const changed = next !== siteKey;
    siteKey = next;

    if (changed) {
        // Fire and forget: a cache that fails to write costs one launch of measurement, and an
        // await here would put the boot sequence behind a disk write.
        Storage.Save('DEVEYE_KEY', next.length > 0 ? { key: next } : null);
    }

    if (next.length === 0) {
        queue = [];
        cancelSchedule();
        return;
    }

    schedule(FLUSH_DELAY_MS);
}

/**
 * The per-install visitor identifier, hashed.
 *
 * DevEye salts and hashes it again on its side; hashing here too means the device identifier
 * itself is never transmitted, and the digest is useless anywhere but on this site.
 * @returns {string}
 */
function getVisitorId() {
    if (visitorId !== null) {
        return visitorId;
    }

    try {
        const raw = DeviceInfo.getUniqueIdSync();
        visitorId = Crypto.SHA256(`gamelife-deveye:${raw}`).toString(Crypto.enc.Hex).slice(0, 32);
    } catch (error) {
        // No identifier: DevEye falls back to its anonymous hash on its own. The measurement is
        // degraded (visitors collapse), never broken.
        log('warn', '[DevEye] Device identifier unavailable', error);
        visitorId = '';
    }

    return visitorId;
}

/** @returns {{ browser: string, os: string, device: string, screenWidth: number }} */
function getStaticContext() {
    if (staticContext !== null) {
        return staticContext;
    }

    let version = '';
    let isTablet = false;
    let osVersion = '';
    try {
        version = DeviceInfo.getVersion();
        isTablet = DeviceInfo.isTablet();
        // Major only: `18.2.1` and `18.3` answer the same question ("can this OS be dropped") and
        // splitting them turns one readable list into forty lines.
        osVersion = DeviceInfo.getSystemVersion().split('.')[0];
    } catch (error) {
        log('warn', '[DevEye] Device informations unavailable', error);
    }

    staticContext = {
        // Not a browser: the axis is free on a native client, and the app version is what one
        // actually wants to slice by. Displayed as-is under "Navigateurs".
        browser: version ? `GameLife ${version}` : 'GameLife',
        os: `${Platform.OS === 'ios' ? 'iOS' : 'Android'}${osVersion ? ` ${osVersion}` : ''}`,
        device: isTablet ? 'tablet' : 'mobile',
        screenWidth: Math.round(Dimensions.get('window').width)
    };

    return staticContext;
}

/** @returns {string} IANA timezone name, or an offset when `Intl` is unavailable */
function getTimezone() {
    try {
        const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (zone) {
            return zone;
        }
    } catch (error) {
        // Hermes without full ICU: the offset below still carries the activity map.
    }

    const offset = -new Date().getTimezoneOffset() / 60;
    return `UTC${offset >= 0 ? '+' : ''}${offset}`;
}

/**
 * Queue an event and arm the grouping timer.
 * @param {DevEyeEvent} event
 */
function push(event) {
    // Measurement switched off server-side: nothing is queued. `null` is not that - it is "not
    // known yet", and those events are the ones worth holding.
    if (siteKey === '') {
        return;
    }

    // Consent already refused: nothing is queued, so nothing can leak on a later flush.
    if (consentProvider !== null && !consentProvider()) {
        return;
    }

    queue.push(event);
    if (queue.length > QUEUE_MAX) {
        queue = queue.slice(-QUEUE_MAX);
    }

    schedule(FLUSH_DELAY_MS);
}

/** @param {number} delay */
function schedule(delay) {
    if (flushTimer !== null) {
        return;
    }

    flushTimer = setTimeout(() => {
        flushTimer = null;
        flush();
    }, delay);
}

function cancelSchedule() {
    if (flushTimer !== null) {
        clearTimeout(flushTimer);
        flushTimer = null;
    }
}

/**
 * Send what is queued. Never throws, never reports: DevEye answers `204` on a refusal too, so
 * there is nothing to read in the response either way.
 * @returns {Promise<void>}
 */
async function flush() {
    if (sending || queue.length === 0) {
        return;
    }

    // Still unknown, either of them: hold. The first screens are seen before the settings are read
    // and before the server has answered, and they are the beginning of every funnel.
    if (siteKey === null || consentProvider === null) {
        return;
    }

    // Switched off, or refused, since these were queued: they are dropped rather than sent.
    if (siteKey === '' || !consentProvider()) {
        queue = [];
        return;
    }

    const batch = queue.slice(0, BATCH_MAX);
    queue = queue.slice(BATCH_MAX);
    sending = true;

    const context = getStaticContext();
    const timezone = getTimezone();
    const tzOffset = new Date().getTimezoneOffset();
    const language = langManager.currentLangageKey;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
                key: siteKey,
                visitorId: getVisitorId(),
                events: batch.map((event) => ({ ...event, ...context, timezone, tzOffset, language }))
            })
        });
    } catch (error) {
        // Offline, timeout, DNS: the batch goes back to the head of the queue and waits. Order is
        // preserved because each event carries its own `at`, so a late send is not a late event.
        queue = [...batch, ...queue].slice(-QUEUE_MAX);
        log('info', '[DevEye] Send failed, events kept for later', error);
        clearTimeout(timeout);
        sending = false;
        schedule(RETRY_DELAY_MS);
        return;
    }

    clearTimeout(timeout);
    sending = false;

    // More than one batch was waiting: drain without waiting for the grouping window.
    if (queue.length > 0) {
        schedule(0);
    }
}

/**
 * Give DevEye a way to read the user's choice. Until this is called nothing is sent.
 * @param {(() => boolean) | null} provider Reads `settings.statisticsEnabled`
 * @returns {void}
 */
function setConsentProvider(provider) {
    consentProvider = provider;

    if (provider === null) {
        return;
    }

    if (!provider()) {
        queue = [];
        return;
    }

    schedule(FLUSH_DELAY_MS);
}

/**
 * A screen shown. Also becomes the path carried by the following events.
 * @param {string} path Screen path, leading slash included
 * @returns {void}
 */
function view(path) {
    if (!path) {
        return;
    }

    currentPath = path;
    push({ type: 'view', path, at: Math.floor(Date.now() / 1000) });
}

/**
 * A step actually taken. Names are compared byte for byte on the DevEye side: never build one by
 * concatenation, always pass a constant from `Constants/Analytics`.
 * @param {string} name Event name
 * @returns {void}
 */
function trackEvent(name) {
    if (!name) {
        return;
    }

    push({ type: 'event', path: currentPath, name, at: Math.floor(Date.now() / 1000) });
}

/**
 * Send everything that is queued, right now. Called when the app leaves the foreground: the web
 * tag uses `sendBeacon` for the same reason, and a backgrounded mobile app may never come back -
 * the queue lives in memory only, so what has not left by then is lost with the process.
 *
 * Drains batch by batch rather than sending one: a long session can have queued far more than the
 * twenty an ingestion request accepts. The loop stops as soon as one send fails, that send having
 * already put its batch back.
 * @returns {Promise<void>}
 */
async function flushNow() {
    while (queue.length > 0) {
        // Inside the loop, not before it: a successful `flush` that leaves something behind arms
        // the next one itself, and that timer would otherwise outlive the drain and block the
        // grouping window of everything queued afterwards.
        cancelSchedule();

        const pending = queue.length;
        await flush();

        // Nothing moved: consent unknown or refused, a send already in flight, or a failure that
        // re-queued its batch. Insisting would spin.
        if (queue.length >= pending) {
            return;
        }
    }

    cancelSchedule();
}

export default {
    SetLogger: setLogger,
    Initialize: initialize,
    SetKey: setKey,
    SetConsentProvider: setConsentProvider,
    View: view,
    Event: trackEvent,
    Flush: flushNow
};
