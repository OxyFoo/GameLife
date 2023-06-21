import { Platform } from 'react-native';
import { AdsConsent, AdsConsentStatus, FirebaseAdMobTypes, InterstitialAd, RewardedAd, TestIds } from '@react-native-firebase/admob';
import { getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency';

import langManager from 'Managers/LangManager';

const FIREBASE_DEFAULT = {"react-native": {
    "admob_app_id": "","admob_android_app_id": "","admob_ios_app_id": "",
    "ios": {"rewarded": {"shop": "","todo": ""}},
    "android": {"rewarded": {"shop": "","todo": ""}}
}};

const CGU_LINK = 'https://oxyfoo.com/cgu/';
const FIREBASE = __DEV__ ? FIREBASE_DEFAULT : require('../../firebase.json');
const VERSION = require('../../package.json').version;

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * 
 * @typedef {'shop'|'todo'} RewardedAds
 * @typedef {'none'} InterstitialAds
 * @typedef {RewardedAds|InterstitialAds} AdNames
 * 
 * @typedef {'watched'|'ready'|'notAvailable'|'wait'|'closed'|'error'} AdStates
 * 
 * @typedef {object} AdTypes
 * @property {FirebaseAdMobTypes.AdEventListener} custom
 * @property {(state: AdStates) => void} add30Ox
 */

class Ad {
    /** @type {AdNames} */
    name = 'none';
    /** @type {'rewarded'|'interstitial'} */
    type = 'interstitial';
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
        /** @type {UserManager} */
        this.user = user;

        /** @type {Array<Ad>} */
        this.ads = [];

        this.ad_consent = {
            nonPersonalized: true,
            version: ''
        };
        this.ios_tracking = {
            enabled: false,
            version: ''
        };
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
                newAd.ad.load();
                this.ads.push(newAd);
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
                newAd.ad.load();
                this.ads.push(newAd);
            });
        }

        return true;
    }

    /**
     * @template {keyof AdTypes} T
     * @param {RewardedAds} adName 
     * @param {T} type
     * @param {AdTypes[T]?} event
     * @returns {FirebaseAdMobTypes.RewardedAd?}
     */
    GetRewardedAd(adName, type, event = () => {}) {
        let rewarded = this.ads.find(ad => ad.name === adName && ad.type === 'rewarded') || null;
        if (rewarded === null) return null;

        let _event = event;
        if (type === 'add30Ox') _event = (type, error, data) => this.Event30Ox(type, error, data, rewarded, event);
        const unsubscriber = rewarded.ad.onAdEvent(_event);
        rewarded.unsubscriber = unsubscriber;
        if (type === 'add30Ox' && rewarded.ad?.loaded) {
            event('ready');
        } else if (!rewarded.ad.loaded) {
            rewarded.ad.load();
        }
        return rewarded.ad;
    }

    /**
     * @template {keyof AdTypes} T
     * @param {InterstitialAds} adName 
     * @param {T} type
     * @param {AdTypes[T]?} event
     * @returns {FirebaseAdMobTypes.InterstitialAd?}
     */
    GetInterstitialAd(adName, type, event = () => {}) {
        let interstitial = this.ads.find(ad => ad.name === adName && ad.type === 'interstitial') || null;
        if (interstitial === null) return null;

        // Add event listener
        let _event = event;
        if (type === 'add30Ox') _event = (type, error, data) => this.Event30Ox(type, error, data, interstitial, event);
        const unsubscriber = interstitial.ad.onAdEvent(_event);
        interstitial.unsubscriber = unsubscriber;

        // Check if ad is ready or load it
        if (type === 'add30Ox' && interstitial.ad?.loaded) {
            event('ready');
        } else if (!interstitial.ad.loaded) {
            interstitial.ad.load();
        }
        return interstitial.ad;
    }

    /**
     * @type {FirebaseAdMobTypes.AdEventListener}
     * @param {Ad} ad
     * @param {AdTypes['add30Ox']} callback
     */
    Event30Ox = async (type, error, data, ad, callback = () => {}) => {
        if (!!error) {
            this.user.interface.console.AddLog('error', 'Ad error:', error.message);
            callback('error');
            return;
        }

        if (this.user.informations.adRemaining <= 0 || !this.user.server.online) {
            callback('notAvailable');
            return;
        }

        switch (type) {
            case 'rewarded_loaded':
                callback('ready');
                break;
            case 'rewarded_earned_reward':
                const response = await this.user.server.Request('adWatched');
                if (response === null) break;

                this.user.interface.console.AddLog('info', 'Ad watched', response);
                if (response['status'] === 'ok') {
                    this.user.informations.ox.Set(parseInt(response['ox']), false);
                    this.user.informations.DecrementAdRemaining();
                    callback('watched');
                }
                break;
            case 'opened':
                callback('wait');
                break;
            case 'closed':
                this.user.informations.ox.Set();
                callback('closed');
                ad.ad.load();
                break;
            default:
                callback('error');
                break;
        }
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

    /**
     * @description Show tracking popup (for iOS only),
     * consent popup (for both iOS and Android) and save choices
     */
    async ShowTrackingPopup() {
        const ConsoleError = (err) => this.user.interface.console.AddLog('error', 'Ad consent popup:', err);

        if (Platform.OS === 'android') {
            await this.__trackingTransparencyPopup().catch(ConsoleError);
        }

        else if (Platform.OS === 'ios') {
            await this.__adConsentPopup().catch(ConsoleError);
        }

        await this.user.LocalSave();
    }

    /**
     * Show non personalized ad consent popup (both iOS and Android)
     * @param {boolean} force Show popup even if user has already accepted
     */
    async __adConsentPopup(force = false) {
        if (!force && (!this.ios_tracking.enabled || this.ad_consent.version === VERSION)) {
            return;
        }

        let nonPersonalized = true;
        const ad_consent_id = FIREBASE['react-native'][Platform.OS === 'ios' ? 'admob_ios_app_id' : 'admob_app_id'];
        const consentInfo = await AdsConsent.requestInfoUpdate([ad_consent_id]);

        // TODO - Debug on ios (tester les 2 codes)
        this.user.interface.console.AddLog('info', 'ad_consent_id', ad_consent_id);

        // if (consentInfo.status === AdsConsentStatus.UNKNOWN) {
        if (consentInfo && consentInfo.isRequestLocationInEeaOrUnknown) {
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

            this.ad_consent.nonPersonalized = nonPersonalized;
            this.ad_consent.version = VERSION;
        }
    }

    /**
     * Show consent tracking popup for iOS 14+ (android or old iOS are skipped)
     * @param {boolean} force Show popup even if user has already accepted
     */
    async __trackingTransparencyPopup(force = false) {
        if (this.ios_tracking.version === VERSION && !force) {
            return;
        }

        let enabled = true;
        const trackingStatus = await getTrackingStatus();
        if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
            const trackingStatus = await requestTrackingPermission();
            if (trackingStatus !== 'authorized') {
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
}

export default Admob;