import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { IUserData } from '@oxyfoo/gamelife-types/Interface/IUserData';
import DynamicVar from 'Utils/DynamicVar';
import { DAY_TIME, GetLocalTime, GetTimeZone } from 'Utils/Time';
import { KeyOf, UsefulActivities } from '@oxyfoo/gamelife-types/Rules/OxEconomy';
import { GetLocalDayIndex } from '@oxyfoo/gamelife-types/Rules/Time';
import {
    HealOxPrice,
    MaxHP,
    RAID_MIN_LEVEL,
    RemainingHeal,
    SimulateParticipant
} from '@oxyfoo/gamelife-types/Rules/RaidEngine';
import RAIDS, { RAID_GENERIC } from 'Ressources/raids/raids';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').Activity} Activity
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').ActivitySaved} ActivitySaved
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidStatePayload} RaidStatePayload
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidSeasonPublic} RaidSeasonPublic
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidParticipantSelf} RaidParticipantSelf
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidSkip} RaidSkip
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidHit} RaidHit
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidSimulation} RaidSimulation
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidLeaderboardPlayer} RaidLeaderboardPlayer
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidFeedEvent} RaidFeedEvent
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidHistoryEntry} RaidHistoryEntry
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').SaveObject_Raids} SaveObject_Raids
 * @typedef {import('Ressources/raids/raids').RaidImages} RaidImages
 *
 * @typedef {'update-required' | 'locked' | 'no-season' | 'heroes-rest' | 'fighting' | 'healing' | 'defeated' | 'ended'} RaidStatus
 * @typedef {'ok' | 'not-healing' | 'limit-reached' | 'already-used'} HealAdAvailability
 * @typedef {'ok' | 'canceled' | 'not-healing' | 'not-enough-ox' | 'error'} HealOxResult
 * @typedef {'ok' | 'already-claimed' | 'not-claimable' | 'error'} ClaimResult
 * @typedef {'error-connection' | 'error-server'} LoadError
 *
 * @typedef {object} RaidSnapshot
 * @property {boolean} loaded Raid data received at least once (cache or server). False means
 * "not known yet", which `status` cannot express: it reports 'no-season' in that case too.
 * @property {RaidStatus} status
 * @property {number} level
 * @property {RaidSeasonPublic | null} season
 * @property {RaidParticipantSelf | null} self
 * @property {RaidSimulation | null} simulation Local preview (no critical), the server is authoritative
 * @property {number} now
 * @property {number | null} nextSeasonAt
 * @property {{ elapsedDays: number, totalDays: number, ratio: number }} seasonProgress
 * @property {number} healRemaining Seconds, 0 when not healing
 * @property {number} healPrice Ox to end the heal now, 0 when not healing
 * @property {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidRewardState} rewardState
 * @property {RaidImages} images
 */

const TICK_INTERVAL_MS = 60 * 1000;
const HEAL_AD_NAME = 'raid-heal';
const HEAL_AD_DEFAULT_MAX_PER_DAY = 3;

/**
 * Raids: monthly world boss. The server is authoritative; this class caches its last answer (so
 * the Home widget works offline) and previews the phase and the points from the local activities.
 * @extends {IUserData<SaveObject_Raids>}
 */
class Raids extends IUserData {
    /** @type {UserManager} */
    #user;

    /** @type {DynamicVar<RaidStatePayload | null>} Last answer of `get-raid`, null before the first one */
    payload = new DynamicVar(/** @type {RaidStatePayload | null} */ (null));

    /** @type {DynamicVar<RaidSimulation | null>} Local preview, recomputed on every activity change */
    simulation = new DynamicVar(/** @type {RaidSimulation | null} */ (null));

    /** @type {DynamicVar<number>} Bumped every minute and on every level change (countdowns, gates) */
    tick = new DynamicVar(0);

    /** @type {DynamicVar<{ points: number, critical: boolean } | null>} Last hit confirmed by save-activities */
    lastHit = new DynamicVar(/** @type {{ points: number, critical: boolean } | null} */ (null));

    /** Unix seconds of the last successful `get-raid` */
    fetchedAt = 0;

    /** A claim is in flight: the buttons must not fire twice */
    #claiming = false;

    /** @type {Symbol | null} */
    #listenerExperience = null;

    /** @type {Symbol | null} */
    #listenerActivities = null;

    /** @type {ReturnType<typeof setInterval> | null} */
    #interval = null;

    /** @param {UserManager} user */
    constructor(user) {
        super('raids');

        this.#user = user;
    }

    Clear = () => {
        this.payload.Set(null);
        this.simulation.Set(null);
        this.lastHit.Set(null);
        this.fetchedAt = 0;
    };

    Get = () => this.GetSnapshot();

    /** @param {Partial<SaveObject_Raids>} data */
    Load = (data) => {
        if (typeof data.cache !== 'undefined') {
            this.payload.Set(data.cache);
        }
        if (typeof data.fetchedAt === 'number') {
            this.fetchedAt = data.fetchedAt;
        }
        this.#recompute();
    };

    /** @returns {SaveObject_Raids} */
    Save = () => ({
        cache: this.payload.Get(),
        fetchedAt: this.fetchedAt
    });

    onMount = () => {
        this.#recompute();
        this.#listenerExperience = this.#user.experience.experience.AddListener(this.#bump);
        this.#listenerActivities = this.#user.activities.allActivities.AddListener(this.#recompute);
        this.#interval = setInterval(() => {
            this.#bump();
            this.#recompute();
        }, TICK_INTERVAL_MS);
    };

    Unmount = () => {
        if (this.#interval !== null) {
            clearInterval(this.#interval);
            this.#interval = null;
        }
        this.#user.experience.experience.RemoveListener(this.#listenerExperience);
        this.#user.activities.allActivities.RemoveListener(this.#listenerActivities);
    };

    #bump = () => {
        this.tick.Set(this.tick.Get() + 1);
    };

    /**
     * Fetch the state of the current raid. Only a lost connection is a failure: a server that does
     * not know the raids yet (old server) keeps the cache and does not break the global loading.
     * @returns {Promise<boolean>}
     */
    LoadOnline = async () => {
        const response = await this.#user.server2.tcp.SendAndWait({ action: 'get-raid' });

        if (response === 'interrupted' || response === 'not-sent' || response === 'timeout') {
            this.#user.interface.console?.AddLog('error', `[Raids] Failed to load raid (${response})`);
            return false;
        }

        if (response.status !== 'get-raid' || response.result === 'error') {
            this.#user.interface.console?.AddLog('warn', '[Raids] Raid not available on the server');
            return true;
        }

        this.payload.Set(response.result);
        this.fetchedAt = GetLocalTime();
        this.#recompute();
        this.#user.SaveLocal();
        return true;
    };

    /** SaveOnline is not needed: the server derives everything from the activities */
    SaveOnline = async () => true;

    //
    // Getters
    //

    /** @returns {RaidSeasonPublic | null} */
    GetSeason = () => this.payload.Get()?.season ?? null;

    /** @returns {RaidParticipantSelf | null} */
    GetSelf = () => this.payload.Get()?.self ?? null;

    /** @returns {RaidSkip[]} */
    GetSkips = () => this.payload.Get()?.skips ?? [];

    GetLevel = () => this.#user.experience.experience.Get().xpInfo.lvl;

    /**
     * The app does not embed the images of the current season and a newer app exists: the raid
     * waits for the update. Without any update available, the generic images are used instead.
     * @param {RaidSeasonPublic | null} season
     */
    #requiresUpdate = (season) => {
        if (season === null) {
            return false;
        }
        const known = season.imageID in RAIDS;
        return !known && this.#user.server2.serverState.status === 'update-optional';
    };

    /**
     * @param {number} [now]
     * @returns {RaidStatus}
     */
    GetStatus = (now = GetLocalTime()) => {
        const payload = this.payload.Get();
        const season = payload?.season ?? null;

        if (this.#requiresUpdate(season)) {
            return 'update-required';
        }
        if (this.GetLevel() < RAID_MIN_LEVEL || payload?.state === 'locked') {
            return 'locked';
        }
        if (payload === null || season === null) {
            return payload !== null && payload.nextSeasonAt !== null ? 'heroes-rest' : 'no-season';
        }
        if (now >= season.endTime) {
            return 'ended';
        }
        if (season.defeatedAt !== null) {
            return 'defeated';
        }
        const simulation = this.simulation.Get();
        return simulation?.current.kind === 'heal' && (simulation.current.end ?? 0) > now ? 'healing' : 'fighting';
    };

    /** @returns {RaidSimulation | null} */
    GetSimulation = () => this.simulation.Get();

    /**
     * Elapsed and total days of the season (30 days = 30 for the UI, not 30.5)
     * @param {number} [now]
     */
    GetSeasonProgress = (now = GetLocalTime()) => {
        const season = this.GetSeason();
        if (season === null || season.endTime <= season.startTime) {
            return { elapsedDays: 0, totalDays: 0, ratio: 0 };
        }
        const totalDays = Math.max(1, Math.round((season.endTime - season.startTime) / DAY_TIME));
        const ratio = Math.min(1, Math.max(0, (now - season.startTime) / (season.endTime - season.startTime)));
        const elapsedDays = Math.min(totalDays, Math.max(0, Math.floor((now - season.startTime) / DAY_TIME)));
        return { elapsedDays, totalDays, ratio };
    };

    /**
     * @param {number} [now]
     * @returns {number} Seconds, 0 when not healing
     */
    GetHealRemaining = (now = GetLocalTime()) => {
        const simulation = this.simulation.Get();
        return simulation === null ? 0 : RemainingHeal(simulation, now);
    };

    /** Heal ads allowed per day, from the ad row of the server */
    GetHealAdMaxPerDay = () => dataManager.ads.GetByName(HEAL_AD_NAME)?.MaxPerDay ?? HEAL_AD_DEFAULT_MAX_PER_DAY;

    /**
     * @param {number} [now]
     * @returns {HealAdAvailability}
     */
    GetHealAdAvailability = (now = GetLocalTime()) => {
        const simulation = this.simulation.Get();
        if (simulation === null || this.GetHealRemaining(now) <= 0) {
            return 'not-healing';
        }
        const maxPerDay = this.GetHealAdMaxPerDay();
        const today = GetLocalDayIndex({ startTime: now, timezone: GetTimeZone() });
        const skips = this.GetSkips();
        const adsToday = skips.filter(
            (skip) =>
                skip.kind === 'ad' && GetLocalDayIndex({ startTime: skip.time, timezone: GetTimeZone() }) === today
        ).length;
        const remainingFromServer = this.payload.Get()?.healAdRemaining ?? maxPerDay;
        if (adsToday >= maxPerDay || remainingFromServer <= 0) {
            return 'limit-reached';
        }
        // Exact phase comparison, like the server: a device clock off by a few minutes must not
        // let a second ad through, only to have the server answer 'already-used' after the view
        const phaseStart = simulation.current.start;
        if (skips.some((skip) => skip.kind === 'ad' && skip.phaseStart === phaseStart)) {
            return 'already-used';
        }
        return 'ok';
    };

    /**
     * Visual of a season: both images come from the same registry key, so a season is either fully
     * illustrated or fully generic — never a boss from one raid over the background of another.
     * @param {string | null} imageID
     * @returns {RaidImages}
     */
    GetRaidImages = (imageID) => RAIDS[imageID ?? ''] ?? RAID_GENERIC;

    /**
     * Points an activity brings to the raid: the hit the server replayed once the activity is saved
     * (critical known), the local preview otherwise (never any critical: the seed stays on the server)
     * @param {Activity} activity
     * @returns {RaidHit | null}
     */
    GetHit = (activity) => {
        const saved = /** @type {Partial<ActivitySaved>} */ (activity);
        const serverHit =
            typeof saved.ID === 'number'
                ? this.GetSelf()?.simulation.hits.find((hit) => hit.activityID === saved.ID)
                : undefined;
        return serverHit ?? this.simulation.Get()?.hits.find((hit) => hit.startTime === activity.startTime) ?? null;
    };

    /**
     * Everything the card and the widget read
     * @param {number} [now]
     * @returns {RaidSnapshot}
     */
    GetSnapshot = (now = GetLocalTime()) => {
        const payload = this.payload.Get();
        const season = payload?.season ?? null;
        const healRemaining = this.GetHealRemaining(now);
        return {
            loaded: this.fetchedAt > 0,
            status: this.GetStatus(now),
            level: this.GetLevel(),
            season,
            self: payload?.self ?? null,
            simulation: this.simulation.Get(),
            now,
            nextSeasonAt: payload?.nextSeasonAt ?? null,
            seasonProgress: this.GetSeasonProgress(now),
            healRemaining,
            healPrice: healRemaining > 0 ? HealOxPrice(healRemaining) : 0,
            rewardState: payload?.self?.rewardState ?? 'none',
            images: this.GetRaidImages(season?.imageID ?? null)
        };
    };

    //
    // Preview
    //

    /**
     * Activities that score, exactly as the server picks them: `UsefulActivities` of the ox module,
     * not `Activities.GetUseful` which keeps the activities of a skill without XP (they grant no ox
     * and no raid point, but they do appear in the XP list).
     * @returns {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidActivity[]}
     */
    #toRaidActivities = () => {
        /** @param {number} skillID */
        const xpOfSkill = (skillID) => dataManager.skills.GetByID(skillID)?.XP ?? 0;

        const rows = this.#user.activities.Get().map((activity) => {
            const saved = /** @type {Partial<ActivitySaved>} */ (activity);
            return {
                id: typeof saved.ID === 'number' ? saved.ID : null,
                skillID: activity.skillID,
                startTime: activity.startTime,
                duration: activity.duration,
                timezone: activity.timezone,
                addedTime: activity.addedTime
            };
        });

        const useful = UsefulActivities(rows, GetLocalTime(), xpOfSkill);
        return rows
            .filter((row) => useful.has(KeyOf(row)))
            .map((row) => ({
                id: row.id,
                skillID: row.skillID,
                startTime: row.startTime,
                duration: row.duration
            }));
    };

    /** Replay the local activities with the frozen stats of the season (never any critical: the seed stays on the server) */
    #recompute = () => {
        const payload = this.payload.Get();
        const season = payload?.season ?? null;
        const self = payload?.self ?? null;
        if (season === null || self === null) {
            this.simulation.Set(null);
            return;
        }
        this.simulation.Set(
            SimulateParticipant({
                seasonStart: season.startTime,
                seasonEnd: season.endTime,
                defeatedAt: season.defeatedAt,
                seed: null,
                stats: self.stats,
                activities: this.#toRaidActivities(),
                skips: payload?.skips ?? [],
                now: GetLocalTime()
            })
        );
    };

    /**
     * Outcome of a `save-activities`: the server total and progress win over the preview
     * @param {{ points: number, critical: boolean, damage: number, progress: number }} raid
     */
    ApplySaveResult = (raid) => {
        const payload = this.payload.Get();
        if (payload !== null && payload.season !== null && payload.self !== null) {
            const season = payload.season;
            const maxHP = MaxHP(season.hpPerParticipant, 1, 1) > 0 ? season.maxHP : 1;
            this.payload.Set({
                ...payload,
                season: { ...season, progress: raid.progress, hp: Math.floor(raid.progress * maxHP) },
                self: { ...payload.self, damage: raid.damage }
            });
        }
        this.lastHit.Set({ points: raid.points, critical: raid.critical });
        this.#recompute();
    };

    /**
     * Server state after an accelerated heal. Everything comes from the answer of the call that
     * wrote the skip: the simulation, the whole skip list (a purchase can also refund an older one)
     * and, for an ad, the quota left today. Nothing is guessed locally.
     * @param {RaidSimulation} simulation
     * @param {RaidSkip[] | null} [skips] Authoritative list, null leaves the local one untouched
     * @param {number | null} [healAdRemaining] Heal ads left today, null leaves the local count
     */
    ApplyHeal = (simulation, skips = null, healAdRemaining = null) => {
        const payload = this.payload.Get();
        if (payload !== null && payload.self !== null) {
            this.payload.Set({
                ...payload,
                skips: skips ?? payload.skips,
                healAdRemaining: healAdRemaining ?? payload.healAdRemaining,
                self: { ...payload.self, simulation }
            });
        }
        this.simulation.Set(simulation);
        this.#user.SaveLocal();
    };

    //
    // Server
    //

    /**
     * @param {string} title
     * @param {string} message
     * @returns {Promise<boolean>}
     */
    #confirm = (title, message) => {
        return new Promise((resolve) => {
            this.#user.interface.popup?.OpenT({
                type: 'yesno',
                data: { title, message },
                callback: (reason) => resolve(reason === 'yes')
            });
        });
    };

    /**
     * End the heal now for ox (2 per remaining minute), after a confirmation with the price
     * @param {number | null} [quotedPrice] Price sent back by the server after a 'quote-changed':
     * the local simulation is the one that was wrong, so re-deriving the price from it would send
     * the very quote the server just refused
     * @returns {Promise<HealOxResult>}
     */
    HealByOx = async (quotedPrice = null) => {
        const lang = langManager.curr['raids'];
        const remaining = this.GetHealRemaining();
        if (remaining <= 0) {
            return 'not-healing';
        }

        const price = quotedPrice ?? HealOxPrice(remaining);
        if (this.#user.informations.ox.Get() < price) {
            const langShop = langManager.curr['shop'];
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: { title: langShop['popup-notenoughox-title'], message: langShop['popup-notenoughox-message'] }
            });
            return 'not-enough-ox';
        }

        const message = (
            quotedPrice !== null ? lang['alert-heal-ox-quote-message'] : lang['alert-heal-ox-message']
        ).replace('{}', price.toString());
        if (!(await this.#confirm(lang['alert-heal-ox-title'], message))) {
            return 'canceled';
        }

        const response = await this.#user.server2.tcp.SendAndWait({ action: 'raid-heal-ox', expectedPrice: price });
        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'raid-heal-ox' ||
            response.result === 'error'
        ) {
            this.#user.informations.ox.Set();
            this.#showError(typeof response === 'string' ? response : 'error');
            return 'error';
        }

        if (response.result === 'quote-changed') {
            // Ask again once, with the server price and not ours: the refusal means our simulation
            // is behind, so recomputing locally would just re-send the quote that was refused
            if (quotedPrice === null && typeof response.price === 'number') {
                return this.HealByOx(response.price);
            }
            return 'canceled';
        }
        if (response.result === 'not-enough-ox') {
            this.#user.informations.ox.Set();
            const langShop = langManager.curr['shop'];
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: { title: langShop['popup-notenoughox-title'], message: langShop['popup-notenoughox-message'] }
            });
            return 'not-enough-ox';
        }
        if (response.result !== 'ok') {
            // 'not-healing', 'locked', 'no-season': the server view differs, refresh it
            await this.LoadOnline();
            return 'not-healing';
        }

        if (typeof response.ox === 'number') {
            this.#user.informations.ox.Set(response.ox);
        }
        if (response.simulation) {
            this.ApplyHeal(response.simulation, response.skips ?? null);
        }
        return 'ok';
    };

    /**
     * Take the reward of a season: the running one once its boss is down, or a past one from the raid
     * history. Nothing is credited until this call, and a reward never expires.
     * @param {number} seasonID
     * @returns {Promise<ClaimResult>}
     */
    ClaimReward = async (seasonID) => {
        const lang = langManager.curr['raids'];

        if (this.#claiming) {
            return 'error';
        }
        this.#claiming = true;

        const response = await this.#user.server2.tcp.SendAndWait({ action: 'claim-raid-reward', seasonID });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'claim-raid-reward' ||
            response.result === 'error'
        ) {
            this.#claiming = false;
            this.#showError(typeof response === 'string' ? response : 'error');
            return 'error';
        }

        if (typeof response.result === 'string') {
            this.#claiming = false;

            // The server view differs (taken from another device, boss still standing): resync
            await this.LoadOnline();
            if (response.result === 'already-claimed') {
                return 'already-claimed';
            }
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: { title: lang['alert-claim-error']['title'], message: lang['alert-claim-error']['message'] }
            });
            return 'not-claimable';
        }

        const { rewards, newOx } = response.result;
        await this.#user.rewards.ExecuteRewards(rewards, newOx);
        await this.#user.SaveLocal();
        this.#claiming = false;

        // The card must not offer the claim twice. No `get-raid` for that: the server just confirmed
        // the claim, so 'claimed' is its deterministic outcome, not a guess. The raid history is not
        // carried by the payload and was never refreshed by that call anyway.
        this.#MarkRewardClaimed(seasonID);
        await this.#user.rewards.ShowRewards(rewards, 'all', lang['claim-title'], lang['claim-message']);
        return 'ok';
    };

    /**
     * Mark the reward of a season as taken, when it is the season the payload carries
     * @param {number} seasonID
     */
    #MarkRewardClaimed = (seasonID) => {
        const payload = this.payload.Get();
        if (payload === null || payload.self === null || payload.season?.id !== seasonID) {
            return;
        }
        this.payload.Set({ ...payload, self: { ...payload.self, rewardState: 'claimed' } });
        this.#user.SaveLocal();
    };

    /** @param {string} code */
    #showError = (code) => {
        const lang = langManager.curr['raids'];
        this.#user.interface.popup?.OpenT({
            type: 'ok',
            data: { title: lang['alert-error']['title'], message: lang['alert-error']['message'].replace('{}', code) }
        });
    };

    /**
     * @returns {Promise<LoadError | { players: RaidLeaderboardPlayer[], self: RaidLeaderboardPlayer | null }>}
     */
    LoadLeaderboard = async () => {
        const response = await this.#user.server2.tcp.SendAndWait({ action: 'get-raid-leaderboard', limit: 100 });
        if (response === 'interrupted' || response === 'not-sent' || response === 'timeout') {
            return 'error-connection';
        }
        if (response.status !== 'get-raid-leaderboard' || response.result === 'error') {
            return 'error-server';
        }
        if (response.result === 'no-season') {
            return { players: [], self: null };
        }
        return { players: response.result.players, self: response.result.self };
    };

    /** @returns {Promise<LoadError | { events: RaidFeedEvent[] }>} */
    LoadFeed = async () => {
        const response = await this.#user.server2.tcp.SendAndWait({ action: 'get-raid-feed', limit: 50 });
        if (response === 'interrupted' || response === 'not-sent' || response === 'timeout') {
            return 'error-connection';
        }
        if (response.status !== 'get-raid-feed' || response.result === 'error') {
            return 'error-server';
        }
        return { events: response.result.events };
    };

    /** @returns {Promise<LoadError | { seasons: RaidHistoryEntry[] }>} */
    LoadHistory = async () => {
        const response = await this.#user.server2.tcp.SendAndWait({ action: 'get-raid-history' });
        if (response === 'interrupted' || response === 'not-sent' || response === 'timeout') {
            return 'error-connection';
        }
        if (response.status !== 'get-raid-history' || response.result === 'error') {
            return 'error-server';
        }
        return { seasons: response.result.seasons };
    };
}

export { RAID_MIN_LEVEL };
export default Raids;
