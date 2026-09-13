import { Alert, Platform, Linking } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import mobileAds, {
    AdsConsent,
    AdsConsentDebugGeography,
    AdsConsentPrivacyOptionsRequirementStatus,
    AdsConsentStatus
} from 'react-native-google-mobile-ads';

import langManager from 'Managers/LangManager';

import { IUserClass } from '@oxyfoo/gamelife-types/Interface/IUserClass';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('@oxyfoo/gamelife-types/Class/Consent').SaveObject_Consent} SaveObject_Consent
 * @typedef {import('react-native-google-mobile-ads').AdsConsentInfo} AdsConsentInfo
 * @typedef {import('react-native-google-mobile-ads').AdsConsentInfoOptions} AdsConsentInfoOptions
 *
 * @typedef {'ok' | 'not-needed' | 'not-available'} ConsentPopupOSResult
 * @typedef {'loading' | 'error' | ConsentPopupOSResult} ConsentPopupResult
 */

const VERSION = require('../../package.json').version;

const ATT = PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY;

/**
 * Ad consent, following Google's recommended flow (react-native-google-mobile-ads docs,
 * "European User Consent"):
 *   1. UMP (GDPR consent form) on both OS, at every launch - the UMP SDK decides itself
 *      whether a form must be shown, so nothing is gated on the app version any more.
 *   2. App Tracking Transparency prompt on iOS, only once UMP allows ad requests and, when
 *      GDPR applies, only if the user consented to purpose 1 (storage).
 *   3. Google Mobile Ads SDK initialisation, only once UMP allows ad requests.
 * The persisted shape (`SaveObject_Consent`) is unchanged: `nonPersonalized` feeds the ad
 * requests, the `version` fields are kept for bookkeeping only.
 * @extends {IUserClass<SaveObject_Consent>}
 */
class Consent extends IUserClass {
    /** @type {UserManager} */
    #user;

    /** @param {UserManager} user */
    constructor(user) {
        super('consent');

        this.#user = user;
    }

    loading = false;

    /**
     * True once the UMP SDK allows ad requests (consent obtained or not required).
     * Reflects the previous session when the consent request fails. Not persisted.
     */
    canRequestAds = false;

    /**
     * True when Google requires a persistent "privacy options" entry point (EEA users).
     * Not persisted.
     */
    privacyOptionsRequired = false;

    /** @type {SaveObject_Consent['android_consent']} GDPR choice, written on both OS */
    android_consent = {
        nonPersonalized: true,
        version: ''
    };

    /** @type {SaveObject_Consent['ios_tracking']} */
    ios_tracking = {
        enabled: false,
        version: ''
    };

    /** @param {Partial<SaveObject_Consent>} adSettings */
    Load = (adSettings) => {
        if (typeof adSettings.android_consent !== 'undefined') {
            this.android_consent = adSettings.android_consent;
        }
        if (typeof adSettings.ios_tracking !== 'undefined') {
            this.ios_tracking = adSettings.ios_tracking;
        }
    };

    /** @returns {SaveObject_Consent} */
    Save = () => {
        return {
            android_consent: this.android_consent,
            ios_tracking: this.ios_tracking
        };
    };

    isPersonalized() {
        if (Platform.OS === 'android') {
            return !this.android_consent.nonPersonalized;
        } else if (Platform.OS === 'ios') {
            return this.ios_tracking.enabled && !this.android_consent.nonPersonalized;
        }
        return false;
    }

    /**
     * Startup flow: UMP consent form (both OS), then ATT prompt (iOS), then Mobile Ads SDK
     * initialisation. Never throws: ads must still load with the previous session's choices
     * when consent gathering fails.
     * @returns {Promise<ConsentPopupResult>}
     */
    async Initialize() {
        if (this.loading === true) {
            return 'loading';
        }

        this.loading = true;

        /** @type {ConsentPopupResult} */
        let result = 'error';

        try {
            result = await this.GatherConsent();
            await this.#RefreshCanRequestAds();

            if (this.canRequestAds) {
                if (Platform.OS === 'ios') {
                    await this.RequestTracking().catch((err) => this.#Log('error', 'Tracking request:', err));
                }
                await mobileAds()
                    .initialize()
                    .catch((err) => this.#Log('error', 'Mobile Ads init:', err));
            } else {
                this.#Log('warn', 'Ad consent: ad requests not allowed yet');
            }

            await this.#user.SaveLocal();
        } finally {
            this.loading = false;
        }

        return result;
    }

    /**
     * Request the consent information and show the GDPR form when the UMP SDK requires it.
     * @returns {Promise<ConsentPopupResult>} 'ok' when GDPR applies, 'not-needed' otherwise
     */
    async GatherConsent() {
        try {
            const info = await AdsConsent.gatherConsent(this.#GetRequestOptions());
            this.#Log('info', 'Ad consent info:', info);
            this.#StoreInfo(info);

            const gdprApplies = await this.#ApplyUmpChoices();
            return gdprApplies ? 'ok' : 'not-needed';
        } catch (err) {
            this.#Log('error', 'Ad consent gathering:', err);
            return 'error';
        }
    }

    /**
     * App Tracking Transparency prompt (iOS 14+). Shown by the system at most once per
     * install: a later call only reads the current status.
     * @returns {Promise<ConsentPopupOSResult>} 'ok' when the system prompt was shown
     */
    async RequestTracking() {
        if (Platform.OS !== 'ios') {
            return 'not-needed';
        }

        // Google: only ask for tracking when GDPR does not apply, or purpose 1 was consented
        const gdprApplies = await AdsConsent.getGdprApplies();
        if (gdprApplies) {
            const purposes = await AdsConsent.getPurposeConsents();
            if (!purposes.startsWith('1')) {
                this.#SetTracking(false);
                return 'not-needed';
            }
        }

        const before = await check(ATT);
        if (before === RESULTS.UNAVAILABLE) {
            this.#SetTracking(false);
            return 'not-available';
        }

        // DENIED means "not determined yet" for this permission: the prompt can be shown
        const after = before === RESULTS.DENIED ? await request(ATT) : before;
        this.#Log('info', 'Tracking permission:', before, '->', after);

        this.#SetTracking(after === RESULTS.GRANTED);
        return before === RESULTS.DENIED ? 'ok' : 'not-needed';
    }

    /**
     * Settings entry point: lets the user review the GDPR choices (privacy options form,
     * mandatory for EEA users) and, on iOS, the tracking permission.
     * @returns {Promise<ConsentPopupResult>} 'not-available' when nothing can be shown
     */
    async OpenPrivacyOptions() {
        if (this.loading === true) {
            return 'loading';
        }

        this.loading = true;

        try {
            const info = await AdsConsent.requestInfoUpdate(this.#GetRequestOptions());
            this.#Log('info', 'Ad consent info:', info);
            this.#StoreInfo(info);

            let shown = false;
            if (info.privacyOptionsRequirementStatus === AdsConsentPrivacyOptionsRequirementStatus.REQUIRED) {
                this.#StoreInfo(await AdsConsent.showPrivacyOptionsForm());
                await this.#ApplyUmpChoices();
                shown = true;
            } else if (info.status === AdsConsentStatus.REQUIRED && info.isConsentFormAvailable) {
                // First launch form never completed (e.g. no network at startup)
                this.#StoreInfo(await AdsConsent.loadAndShowConsentFormIfRequired());
                await this.#ApplyUmpChoices();
                shown = true;
            }

            if (Platform.OS === 'ios') {
                shown = (await this.#OpenTrackingOptions()) || shown;
            }

            await this.#user.SaveLocal();
            return shown ? 'ok' : 'not-available';
        } catch (err) {
            this.#Log('error', 'Ad consent popup:', err);
            return 'error';
        } finally {
            this.loading = false;
        }
    }

    /** Clear the UMP state to test the first launch again (development only) */
    ResetForDebug() {
        if (__DEV__) {
            AdsConsent.reset();
        }
    }

    openiOSSettings = () => {
        Linking.openSettings();
    };

    async isTrackingEnabled() {
        const status = await check(ATT);
        return status === RESULTS.GRANTED;
    }

    /**
     * iOS tracking part of the settings entry point.
     * @returns {Promise<boolean>} True when something was shown to the user
     */
    async #OpenTrackingOptions() {
        const status = await check(ATT);

        // Refused (or restricted): the system will not prompt again, send the user to Settings
        if (status === RESULTS.BLOCKED) {
            const lang = langManager.curr['settings'];
            Alert.alert(lang['consent-ios-title'], lang['consent-ios-message'], [
                { text: lang['consent-ios-cancel'], style: 'cancel' },
                { text: lang['consent-ios-open-settings'], onPress: this.openiOSSettings }
            ]);
            return true;
        }

        if (status === RESULTS.DENIED) {
            return (await this.RequestTracking()) === 'ok';
        }

        this.#SetTracking(status === RESULTS.GRANTED);
        return false;
    }

    /**
     * Derive the personalization flag from the TCF choices. Outside GDPR, personalized ads
     * are allowed; under GDPR they need purpose 1 (storage) and purposes 3/4 (personalised ads).
     * @returns {Promise<boolean>} Whether GDPR applies to this user
     */
    async #ApplyUmpChoices() {
        const gdprApplies = await AdsConsent.getGdprApplies();

        let nonPersonalized = false;
        if (gdprApplies) {
            nonPersonalized = true;
            try {
                const choices = await AdsConsent.getUserChoices();
                nonPersonalized = !(choices.storeAndAccessInformationOnDevice && choices.selectPersonalisedAds);
            } catch (err) {
                this.#Log('warn', 'Ad consent choices unreadable:', err);
            }
        }

        this.android_consent = { nonPersonalized, version: VERSION };
        return gdprApplies;
    }

    /** Read `canRequestAds` from the UMP SDK (previous session's value when the request failed) */
    async #RefreshCanRequestAds() {
        try {
            this.#StoreInfo(await AdsConsent.getConsentInfo());
        } catch (err) {
            this.#Log('error', 'Ad consent status:', err);
        }
    }

    /** @param {AdsConsentInfo} info */
    #StoreInfo(info) {
        this.canRequestAds = info.canRequestAds;
        this.privacyOptionsRequired =
            info.privacyOptionsRequirementStatus === AdsConsentPrivacyOptionsRequirementStatus.REQUIRED;
    }

    /** @param {boolean} enabled */
    #SetTracking(enabled) {
        this.ios_tracking = { enabled, version: VERSION };
    }

    /**
     * Development builds force the EEA geography so the GDPR form can be exercised anywhere.
     * Emulators are whitelisted automatically; a physical device needs its hashed id (printed
     * by the UMP SDK in the native logs) in `testDeviceIdentifiers` - keep it local, never commit it.
     * @returns {AdsConsentInfoOptions}
     */
    #GetRequestOptions() {
        if (!__DEV__) {
            return {};
        }
        return {
            debugGeography: AdsConsentDebugGeography.EEA,
            testDeviceIdentifiers: []
        };
    }

    /**
     * @param {'info' | 'warn' | 'error'} type
     * @param {string} text
     * @param {...any} params
     */
    #Log(type, text, ...params) {
        this.#user.interface.console?.AddLog(type, text, ...params);
    }
}

export default Consent;
