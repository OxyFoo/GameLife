import { Platform } from 'react-native';
import { AdsConsent, AdsConsentStatus, FirebaseAdMobTypes, InterstitialAd, RewardedAd, TestIds } from '@react-native-firebase/admob';
import { getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency';

import langManager from '../Managers/LangManager';
import { IsUndefined } from '../Utils/Functions';

const CGU_LINK = 'https://oxyfoo.com/cgu/';
const FIREBASE = require('../../firebase.json');
const VERSION = require('../../package.json').version;

/**
 * @typedef {'shop'} RewardedAds
 * @typedef {String} InterstitialAds
 * @typedef {RewardedAds|InterstitialAds} AdNames
 */

class Ad {
    /** @type {AdNames} */
    name = '';
    /** @type {'rewarded'|'interstitial'} */
    type = '';
    /** @type {FirebaseAdMobTypes.RewardedAd?|FirebaseAdMobTypes.InterstitialAd?} */
    ad = null;
    /** @type {Function?} */
    unsubscriber = null;

    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}

class Admob {
    constructor(user) {
        /** @type {import('../Managers/UserManager').UserManager} */
        this.user = user;

        /** @type {Array<Ad>} */
        this.ads = [];

        this.ad_consent = {
            nonPersonalized: false,
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

    Load(adSettings) {
        if (adSettings.hasOwnProperty('ad_consent')) {
            this.ad_consent = adSettings['ad_consent'];
        }
        if (adSettings.hasOwnProperty('ios_tracking')) {
            this.ios_tracking = adSettings['ios_tracking'];
        }
    }
    Save() {
        const adSettings = {
            ad_consent: this.ad_consent,
            ios_tracking: this.ios_tracking
        };
        return adSettings;
    }

    LoadAds() {
        if (Platform.OS !== 'ios' && Platform.OS !== 'android') return false;
        const nonPersonalized = true;

        if (FIREBASE['react-native'][Platform.OS].hasOwnProperty('rewarded')) {
            const rewarded = FIREBASE['react-native'][Platform.OS]['rewarded'];
            Object.keys(rewarded).forEach(adName => {
                const adUnitId = __DEV__ ? TestIds.REWARDED : rewarded[adName];
                const newAd = new Ad(adName, 'rewarded');
                newAd.ad = RewardedAd.createForAdRequest(adUnitId, {
                    requestNonPersonalizedAdsOnly: nonPersonalized,
                    keywords: ['video-game', 'sports']
                });
                this.ads.push(newAd);
                console.log('Ad added: ' + adName);
            });
        }

        if (FIREBASE['react-native'][Platform.OS].hasOwnProperty('interstitial')) {
            const interstitial = FIREBASE['react-native'][Platform.OS]['interstitial'];
            Object.keys(interstitial).forEach(adName => {
                const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : interstitial[adName];
                const newAd = new Ad(adName, 'interstitial');
                newAd.ad = InterstitialAd.createForAdRequest(adUnitId, {
                    requestNonPersonalizedAdsOnly: nonPersonalized,
                    keywords: ['video-game', 'sports']
                });
                this.ads.push(newAd);
                console.log('Ad added: ' + adName);
            });
        }

        return true;
    }

    /**
     * @param {RewardedAds} adName 
     * @param {FirebaseAdMobTypes.AdEventListener} event
     * @returns {FirebaseAdMobTypes.RewardedAd?}
     */
    GetRewardedAd(adName, event) {
        let rewarded = this.ads.find(ad => ad.name === adName && ad.type === 'rewarded') || null;
        if (rewarded === null) return null;

        const unsubscriber = rewarded.ad.onAdEvent(event);
        rewarded.unsubscriber = unsubscriber;
        if (!rewarded.ad.loaded) {
            rewarded.ad.load();
        }
        return rewarded.ad;
    }

    /**
     * @param {InterstitialAds} adName 
     * @param {FirebaseAdMobTypes.AdEventListener} event
     * @returns {FirebaseAdMobTypes.InterstitialAd?}
     */
    GetInterstitialAd(adName, event) {
        let interstitial = this.ads.find(ad => ad.name === adName && ad.type === 'interstitial') || null;
        if (interstitial === null) return null;

        const unsubscriber = interstitial.ad.onAdEvent(event);
        interstitial.unsubscriber = unsubscriber;
        if (!interstitial.ad.loaded) {
            interstitial.ad.load();
        }
        return interstitial.ad;
    }

    /**
     * @param {AdNames} adName 
     */
    ClearEvents(adName) {
        let ad = this.ads.find(ad => ad.name === adName) || null;
        if (ad !== null && ad.unsubscriber !== null) {
            ad.unsubscriber();
            ad.unsubscriber = null;
        }
    }

    async ShowPopup() {
        const ConsoleError = (err) => this.user.interface.console.AddLog('error', err);
        await this.__trackingTransparencyPopup().catch(ConsoleError);
        await this.__adConsentPopup().catch(ConsoleError);
        await this.user.LocalSave();
    }

    /**
     * Show non personalized ad consent popup
     * @param {Boolean} force Show popup even if user has already accepted
     */
    async __adConsentPopup(force = false) {
        if (!force && (!this.ios_tracking.enabled || this.ad_consent.version === VERSION)) {
            return;
        }

        let nonPersonalized = true;
        const ad_consent_id = FIREBASE['react-native'][Platform.OS === 'ios' ? 'admob_ios_app_id' : 'admob_android_app_id'];
        const consentInfo = await AdsConsent.requestInfoUpdate([ad_consent_id]);
        if (IsUndefined(consentInfo)) return;
        console.log('ad_consent_id', ad_consent_id);
        // if (consentInfo.status === AdsConsentStatus.UNKNOWN) {

        if (consentInfo.isRequestLocationInEeaOrUnknown) {
            const formResult = await AdsConsent.showForm({
                privacyPolicy: this.GetLinkCGU(),
                withPersonalizedAds: true,
                withNonPersonalizedAds: true
            });

            // The user requested non-personalized or personalized ads
            const status = formResult.status;
            if (status === AdsConsentStatus.PERSONALIZED) {
                nonPersonalized = false;
            }
        }

        this.ad_consent.nonPersonalized = nonPersonalized;
        this.ad_consent.version = VERSION;
    }

    /**
     * Show consent tracking popup for iOS 14+
     * @param {Boolean} force Show popup even if user has already accepted
     */
    async __trackingTransparencyPopup(force = false) {
        if (this.ios_tracking.version === VERSION && !force) {
            return;
        }

        let enabled = true;
        const trackingStatus = await getTrackingStatus();
        if (trackingStatus !== 'unavailable') {
            const trackingStatus = await requestTrackingPermission();
            if (trackingStatus === 'denied') {
                enabled = false;
            }
        }

        this.ios_tracking.enabled = enabled;
        this.ios_tracking.version = VERSION;
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