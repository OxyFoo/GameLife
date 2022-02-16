import { Platform } from 'react-native';
import { AdsConsent, FirebaseAdMobTypes, InterstitialAd, RewardedAd, TestIds } from '@react-native-firebase/admob';

import langManager from '../Managers/LangManager';

const CGU_LINK = 'https://oxyfoo.com/cgu/';
const FIREBASE = require('../../firebase.json');
const VERSION = require('../../package.json').version;

/**
 * @typedef Ads
 * @property {Object} rewarded
 * @property {FirebaseAdMobTypes.RewardedAd} rewarded.shop
 * @property {Object} interstitial
 */

class Admob {
    constructor(user) {
        /** @type {import('../Managers/UserManager').UserManager} */
        this.user = user;

        /** @type {Ads} */
        this.ads = {
            rewarded: {},
            interstitial: {}
        };

        this.ad_consent = {
            enabled: false,
            version: ''
        };
        this.ios_tracking = {
            enabled: false,
            version: ''
        };
        this.isOS14OrNewer = this.__isiOS14OrNewer();
        this.isInEeaOrUnknown = false;
        this.__getIsInEeaOrUnknown()
            .then(isInEeaOrUnknown => this.isInEeaOrUnknown = isInEeaOrUnknown);
    }

    async LoadAds() {
        if (Platform.OS !== 'ios' && Platform.OS !== 'android') return false;
        const nonPersonalized = true;

        if (FIREBASE['react-native'][Platform.OS].hasOwnProperty('rewarded')) {
            const rewarded = FIREBASE['react-native'][Platform.OS]['rewarded'];
            Object.keys(rewarded).forEach(adName => {
                const adUnitId = __DEV__ ? TestIds.REWARDED : rewarded[adName];
                this.ads.rewarded[adName] = RewardedAd.createForAdRequest(adUnitId, {
                    requestNonPersonalizedAdsOnly: nonPersonalized,
                    keywords: ['video-game', 'sports']
                });
                //this.ads.rewarded[adName].load();
            });
        }

        if (FIREBASE['react-native'][Platform.OS].hasOwnProperty('interstitial')) {
            const interstitial = FIREBASE['react-native'][Platform.OS]['interstitial'];
            Object.keys(interstitial).forEach(adName => {
                const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : interstitial[adName];
                this.ads.interstitial[adName] = InterstitialAd.createForAdRequest(adUnitId, {
                    requestNonPersonalizedAdsOnly: nonPersonalized,
                    keywords: ['video-game', 'sports']
                });
                //this.ads.interstitial[adName].load();
            });
        }

        return true;
    }

    async ShowPopup() {
        // TODO - Recode this
        try {
            if (this.ios_tracking.version !== VERSION) {
                await this.__trackingTransparencyPopup();
            }
        }
        catch (error) {
            console.error('REALLYYYYY ?');
            console.error(error);
        }

        if (this.ios_tracking.enabled) {
            try {
                if (this.ad_consent.version !== VERSION) {
                    await this.__adConsentPopup();
                }
            }
            catch (error) {
                console.error('REALLYYYYY ?');
                console.error(error);
            }
        }

        // TODO - Save
        //this.user.SaveData();
    }

    // TODO - What it is & Finish it
    async __adConsentPopup() {
        const ad_consent_id = FIREBASE['react-native'][Platform.OS === 'ios' ? 'admob_ios_app_id' : 'admob_android_app_id'];
        const consentInfo = await AdsConsent.requestInfoUpdate([ad_consent_id]);
        // if (consentInfo.status === AdsConsentStatus.UNKNOWN) {
    
        if (consentInfo.isRequestLocationInEeaOrUnknown) {
            const formResult = await AdsConsent.showForm({
                privacyPolicy: this.GetLinkCGU(),
                withPersonalizedAds: true,
                withNonPersonalizedAds: true
            });

            // The user requested non-personalized or personalized ads
            const status = formResult.status;
            if (status === 0) {
                this.ad_consent.enabled = false;
                this.ad_consent.version = VERSION;
            }
            else if (status === 2) {
                this.ad_consent.enabled = true;
                this.ad_consent.version = VERSION;
            }
        } else {
            this.ad_consent.enabled = true;
            this.ad_consent.version = VERSION;
        }
    }

    // TODO - What it is & Finish it
    async __trackingTransparencyPopup(force = false) {
        const trackingStatus = await getTrackingStatus();
        if (trackingStatus !== 'unavailable') {
            const trackingStatus = await requestTrackingPermission();
            if (trackingStatus === 'denied') {
                this.ios_tracking.enabled = false;
                this.ios_tracking.version = VERSION;
            } else {
                this.ios_tracking.enabled = true;
                this.ios_tracking.version = VERSION;
            }
        } else {
            this.ios_tracking.enabled = true;
            this.ios_tracking.version = VERSION;
        }
    }

    GetLinkCGU() {
        let lang = 'en';
        if (['fr', 'en'].includes(langManager.currentLangageKey)) {
            lang = langManager.currentLangageKey;
        }
        return CGU_LINK + lang;
    }

    __isiOS14OrNewer() {
        return Platform.OS === 'ios' && Platform.Version >= 14;
    }
    async __getIsInEeaOrUnknown() {
        const ad_consent_id = FIREBASE['react-native']['admob_app_id'];
        const consentInfo = await AdsConsent.requestInfoUpdate([ad_consent_id]);
        return consentInfo.isRequestLocationInEeaOrUnknown;
    }
}

export default Admob;