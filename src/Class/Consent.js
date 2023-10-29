import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import mobileAds, { AdsConsent, AdsConsentStatus } from 'react-native-google-mobile-ads';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 */

const VERSION = require('../../package.json').version;

class Consent {
    loading = false;
    android_consent = {
        nonPersonalized: true,
        version: ''
    };
    ios_tracking = {
        enabled: false,
        version: ''
    };

    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;
    }

    Load(adSettings) {
        if (adSettings.hasOwnProperty('ad_consent')) {
            this.android_consent = adSettings['ad_consent'];
        }
        if (adSettings.hasOwnProperty('ios_tracking')) {
            this.ios_tracking = adSettings['ios_tracking'];
        }
    }

    Save() {
        const adSettings = {
            ad_consent: this.android_consent,
            ios_tracking: this.ios_tracking
        };
        return adSettings;
    }

    isPersonalized() {
        if (Platform.OS === 'android') {
            return !this.android_consent.nonPersonalized;
        }
        else if (Platform.OS === 'ios') {
            return this.ios_tracking.enabled;
        }
        return false;
    }

    /**
     * @description Show tracking popup (for iOS only),
     * consent popup (for both iOS and Android) and save choices
     * @param {boolean} [force=false] Show popup even if user has already accepted
     */
    async ShowTrackingPopup(force = false) {
        if (this.loading === true) {
            return;
        }
        this.loading = true;

        const ConsoleError = (err) => this.user.interface.console.AddLog('error', 'Ad consent popup:', err);

        if (Platform.OS === 'android') {
            await this.__adConsentPopup(force).catch(ConsoleError);
        }

        else if (Platform.OS === 'ios') {
            await this.__trackingTransparencyPopup(force).catch(ConsoleError);
        }

        await this.user.LocalSave();
        this.loading = false;
    }

    /**
     * Show non personalized ad consent popup (for Android)
     * @param {boolean} force Show popup even if user has already accepted
     */
    async __adConsentPopup(force = false) {
        if (!force && this.android_consent.version === VERSION) {
            return;
        }

        const consentInfo = await AdsConsent.requestInfoUpdate();

        if (consentInfo.isConsentFormAvailable || consentInfo.canRequestAds) {
            const formResult = await AdsConsent.showForm();

            // TODO: What is "formResult.privacyOptionsRequirementStatus" ?

            const status = formResult.status;
            const nonPersonalized = status !== AdsConsentStatus.OBTAINED;

            this.android_consent.nonPersonalized = nonPersonalized;
            this.android_consent.version = VERSION;
        }
    }

    /**
     * Show consent tracking popup for iOS 14+ (for new iOS)
     * @param {boolean} force Show popup even if user has already accepted
     */
    async __trackingTransparencyPopup(force = false) {
        if (!force && this.ios_tracking.version === VERSION) {
            return;
        }

        const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        if (result === RESULTS.DENIED) {
            await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        }

        const adapterStatuses = await mobileAds().initialize();

        this.ios_tracking.enabled = !!adapterStatuses[0].state;
        this.ios_tracking.version = VERSION;
    }
}

export default Consent;
