import { Platform } from 'react-native';
import { AdsConsent, AdsConsentStatus, FirebaseAdMobTypes, InterstitialAd, RewardedAd, TestIds } from '@react-native-firebase/admob';
import { getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency';

import langManager from 'Managers/LangManager';

const FIREBASE_DEFAULT = {"react-native": {
    "admob_app_id": "","admob_android_app_id": "","admob_ios_app_id": "",
    "ios": {"rewarded": {"shop": "","todo": ""}},
    "android": {"rewarded": {"shop": "","todo": ""}}
}};

const OX_AMOUNT = 10;
const CGU_LINK  = 'https://oxyfoo.com/cgu/';
const FIREBASE  = __DEV__ ? FIREBASE_DEFAULT : require('../../firebase.json');
const VERSION   = require('../../package.json').version;

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * 
 * @typedef {'rewarded'|'interstitial'} AdTypes
 * 
 * @typedef {'shop'|'todo'} RewardedAds
 * @typedef {'none'} InterstitialAds
 * @typedef {RewardedAds|InterstitialAds} AdNames
 * 
 * @typedef {'watched'|'ready'|'notAvailable'|'wait'|'closed'|'error'} AdStates
 * @typedef {(state: AdStates) => void} AdEvent
 */

class Ad {
    /** @type {AdNames} */
    name = 'none';
    /** @type {AdTypes} */
    type = 'interstitial';
    /** @type {FirebaseAdMobTypes.RewardedAd|FirebaseAdMobTypes.InterstitialAd|null} */
    ad = null;
    /** @type {Function|null} */
    unsubscriber = null;

    /**
     * @param {AdNames} name
     * @param {AdTypes} type
     */
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}

class Admob {
    /** @param {UserManager} user */
    constructor(user) {
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

    isPersonalized() {
        if (Platform.OS === 'android') {
            return !this.ad_consent.nonPersonalized;
        }
        else if (Platform.OS === 'ios') {
            return this.ios_tracking.enabled;
        }
        return false;
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
        if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
            this.user.interface.console.AddLog('error', `Ad error: Device unknown (${Platform.OS})`);
            return;
        }

        const adsRaw = FIREBASE['react-native'][Platform.OS];

        if (adsRaw.hasOwnProperty('rewarded')) {
            const rewarded = adsRaw['rewarded'];
            Object.keys(rewarded).forEach(/** @param {AdNames} name */ name => {
                const adUnitId = __DEV__ ? TestIds.REWARDED : rewarded[name];
                const newAd = new Ad(name, 'rewarded');
                newAd.ad = RewardedAd.createForAdRequest(adUnitId, {
                    requestNonPersonalizedAdsOnly: !this.isPersonalized(),
                    keywords: ['video-game', 'sports']
                });
                newAd.ad.load();
                this.ads.push(newAd);
            });
        }

        if (adsRaw.hasOwnProperty('interstitial')) {
            const interstitial = adsRaw['interstitial'];
            Object.keys(interstitial).forEach(/** @param {AdNames} name */ name => {
                const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : interstitial[name];
                const newAd = new Ad(name, 'interstitial');
                newAd.ad = InterstitialAd.createForAdRequest(adUnitId, {
                    requestNonPersonalizedAdsOnly: !this.isPersonalized(),
                    keywords: ['video-game', 'sports']
                });
                newAd.ad.load();
                this.ads.push(newAd);
            });
        }
    }

    /**
     * @param {AdTypes} type
     * @param {AdNames} adName
     * @param {(state: AdStates) => void} callback
     * @param {FirebaseAdMobTypes.AdEventListener} callback
     * @returns {FirebaseAdMobTypes.RewardedAd|null}
     */
    Get(type, adName, callback) {
        let rewardedIndex = this.ads
            .filter(ad => ad.type === type)
            .findIndex(ad => ad.name === adName);
        if (rewardedIndex === -1) return null;

        this.ClearEvents(type, adName);

        const ad = this.ads[rewardedIndex];
        const unsubscriber = ad.ad.onAdEvent((type, error, data) => {
            this.EventOx(type, error, data, ad, callback);
        });
        ad.unsubscriber = unsubscriber;

        if (!ad.ad.loaded) {
            ad.ad.load();
        }

        return ad.ad;
    }

    /**
     * @param {'loaded'|'error'|'opened'|'clicked'|'left_application'|'closed'|'rewarded_loaded'|'rewarded_earned_reward'} type
     * @param {Error|null} error
     * @param {any} data
     * @param {Ad} ad
     * @param {AdEvent} callback
     */
    EventOx = async (type, error, data, ad, callback = () => {}) => {
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
                    this.user.informations.ox.Set(parseInt(response['ox']));
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
     * @param {AdTypes} type
     * @param {AdNames} name 
     */
    ClearEvents(type, name) {
        let adIndex = this.ads
            .filter(ad => ad.type === type)
            .filter(ad => ad.unsubscriber !== null)
            .findIndex(ad => ad.name === name);

        if (adIndex === -1) return;

        const ad = this.ads[adIndex];
        ad.unsubscriber();
        ad.unsubscriber = null;
    }

    /**
     * @description Show tracking popup (for iOS only),
     * consent popup (for both iOS and Android) and save choices
     */
    async ShowTrackingPopup() {
        const ConsoleError = (err) => this.user.interface.console.AddLog('error', 'Ad consent popup:', err);

        if (Platform.OS === 'android') {
            await this.__adConsentPopup().catch(ConsoleError);
        }

        else if (Platform.OS === 'ios') {
            await this.__trackingTransparencyPopup().catch(ConsoleError);
        }

        await this.user.LocalSave();
    }

    /**
     * Show non personalized ad consent popup (both iOS and Android)
     * @param {boolean} force Show popup even if user has already accepted
     */
    async __adConsentPopup(force = false) {
        if (!force && this.ad_consent.version === VERSION) {
            return;
        }

        let nonPersonalized = true;
        const keyAppID = Platform.OS === 'ios' ? 'admob_ios_app_id' : 'admob_app_id';
        const ad_consent_id = FIREBASE['react-native'][keyAppID];
        const consentInfo = await AdsConsent.requestInfoUpdate([ad_consent_id]);

        // TODO - Debug on ios (tester les 2 codes)
        this.user.interface.console.AddLog('info', 'ad_consent_id', ad_consent_id);

        // if (consentInfo.status === AdsConsentStatus.UNKNOWN) {
        if (consentInfo && consentInfo.isRequestLocationInEeaOrUnknown) {
            this.user.interface.console.AddLog('info', 'ad_consent: 1');
            this.user.interface.console.AddLog('info', this.GetLinkCGU());
            const formResult = await AdsConsent.showForm({
                privacyPolicy: this.GetLinkCGU(),
                withPersonalizedAds: true,
                withNonPersonalizedAds: true
            });
            this.user.interface.console.AddLog('info', 'ad_consent: 2');

            // The user requested non-personalized or personalized ads
            const status = formResult.status;
            if (status === AdsConsentStatus.PERSONALIZED) {
                this.user.interface.console.AddLog('info', 'ad_consent: 2.5');
                nonPersonalized = false;
            }

            this.user.interface.console.AddLog('info', 'ad_consent: 3');
            this.ad_consent.nonPersonalized = nonPersonalized;
            this.ad_consent.version = VERSION;
        }
    }

    /**
     * Show consent tracking popup for iOS 14+ (android or old iOS are skipped)
     * @param {boolean} force Show popup even if user has already accepted
     */
    async __trackingTransparencyPopup(force = false) {
        if (!force && this.ios_tracking.version === VERSION) {
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

export { OX_AMOUNT };
export default Admob;
