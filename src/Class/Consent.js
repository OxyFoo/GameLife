import { Alert, Platform, Linking } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { AdsConsent, AdsConsentStatus } from 'react-native-google-mobile-ads';

import langManager from 'Managers/LangManager';

import { IUserClass } from '@oxyfoo/gamelife-types/Interface/IUserClass';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('@oxyfoo/gamelife-types/Class/Consent').SaveObject_Consent} SaveObject_Consent
 *
 * @typedef {'ok' | 'not-needed' | 'not-available'} ConsentPopupOSResult
 * @typedef {'loading' | 'error' | ConsentPopupOSResult} ConsentPopupResult
 */

const VERSION = require('../../package.json').version;

/** @extends {IUserClass<SaveObject_Consent>} */
class Consent extends IUserClass {
    /** @type {UserManager} */
    #user;

    /** @param {UserManager} user */
    constructor(user) {
        super('consent');

        this.#user = user;
    }

    loading = false;

    /** @type {SaveObject_Consent['android_consent']} */
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
            return this.ios_tracking.enabled;
        }
        return false;
    }

    /**
     * @description Show tracking popup (for iOS only),
     * consent popup (for both iOS and Android) and save choices
     * @param {boolean} [force=false] Show popup even if user has already accepted
     * @returns {Promise<ConsentPopupResult>} Consent status
     */
    async ShowTrackingPopup(force = false) {
        if (this.loading === true) {
            return 'loading';
        }

        this.loading = true;

        /** @type {ConsentPopupResult} */
        let consentStatus = 'error';

        /**
         * @param {Error} err
         * @returns {ConsentPopupResult}
         */
        const ConsoleError = (err) => {
            this.#user.interface.console?.AddLog('error', 'Ad consent popup:', err);
            return 'error';
        };

        if (Platform.OS === 'android') {
            consentStatus = await this.__adConsentPopup(force).catch(ConsoleError);
        } else if (Platform.OS === 'ios') {
            consentStatus = await this.__trackingTransparencyPopup(force).catch(ConsoleError);
        }

        await this.#user.SaveLocal();
        this.loading = false;

        return consentStatus;
    }

    /**
     * Show non personalized ad consent popup (for Android)
     * @param {boolean} force Show popup even if user has already accepted
     * @returns {Promise<ConsentPopupOSResult>}
     */
    async __adConsentPopup(force = false) {
        if (!force && this.android_consent.version === VERSION) {
            return 'not-needed';
        }

        // Request consent info
        const consentInfo = await AdsConsent.requestInfoUpdate();
        this.#user.interface.console?.AddLog('info', 'Ad consent info:', consentInfo);

        // Check if consent form is available
        if (!consentInfo.isConsentFormAvailable || !consentInfo.canRequestAds) {
            return 'not-available';
        }

        // Show consent form
        const formResult = await AdsConsent.showForm();

        // TODO: What is "formResult.privacyOptionsRequirementStatus" ?

        const status = formResult.status;
        const nonPersonalized = status !== AdsConsentStatus.OBTAINED;

        this.android_consent.nonPersonalized = nonPersonalized;
        this.android_consent.version = VERSION;

        return 'ok';
    }

    /**
     * Show consent tracking popup for iOS 14+ (for new iOS)
     * @param {boolean} force Show popup even if user has already accepted
     * @returns {Promise<ConsentPopupOSResult>}
     */
    async __trackingTransparencyPopup(force = false) {
        if (!force && this.ios_tracking.version === VERSION) {
            return 'not-needed';
        }

        const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);

        const requestResult = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        this.#user.interface.console?.AddLog('info', 'Tracking permission request:', requestResult);

        const isFirstTime = result !== RESULTS.GRANTED && result !== RESULTS.LIMITED;

        if (result === RESULTS.UNAVAILABLE || result === RESULTS.BLOCKED) {
            return 'not-available';
        } else if (result === RESULTS.DENIED) {
            const isTrackingEnabled = await this.isTrackingEnabled();
            this.ios_tracking.enabled = isTrackingEnabled;
            this.ios_tracking.version = VERSION;
        } else if (force || isFirstTime) {
            const lang = langManager.curr['settings'];

            Alert.alert(lang['consent-ios-title'], lang['consent-ios-message'], [
                { text: lang['consent-ios-cancel'], style: 'cancel' },
                { text: lang['consent-ios-open-settings'], onPress: this.openiOSSettings }
            ]);
        }

        return 'ok';
    }

    openiOSSettings = () => {
        Linking.openSettings();
    };

    async isTrackingEnabled() {
        const status = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        return status === RESULTS.GRANTED;
    }
}

export default Consent;
