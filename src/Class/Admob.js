import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';
import { AdEventType, RewardedAd, RewardedAdEventType, InterstitialAd } from 'react-native-google-mobile-ads';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * 
 * @typedef {'rewarded'|'interstitial'} AdTypesName
 * @typedef {Ad<RewardedAd>|Ad<InterstitialAd>} AdTypes
 * 
 * @typedef {'shop'|'todo'} RewardedAds
 * @typedef {'none'} InterstitialAds
 * @typedef {RewardedAds|InterstitialAds} AdNames
 * 
 * @typedef {'watched'|'ready'|'notAvailable'|'wait'|'closed'|'error'} AdStates
 * @typedef {(state: AdStates) => void} AdEvent
 */

const FIREBASE_DEFAULT = {"react-native-google-mobile-ads": {
    "admob_app_id": "","admob_android_app_id": "","admob_ios_app_id": "",
    "ios": {"rewarded": {"shop": ""}},
    "android": {"rewarded": {"shop": ""}}
}};
const AD_KEYWORDS = [
    'video-game',
    'sports'
];

const OX_AMOUNT = 10;
const FIREBASE = __DEV__ ? FIREBASE_DEFAULT : require('../../app.json');

/**
 * @template {RewardedAd|InterstitialAd} T
 */
class Ad {
    /** @type {AdNames} */
    name = 'none';

    /** @type {AdTypesName} */
    type = 'interstitial';

    /** @type {T|null} */
    ad = null;

    /** @type {() => void|null} */
    unsubscriber = null;

    /**
     * @param {AdNames} name
     * @param {AdTypesName} type
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
    }

    /** @type {Array<Ad<RewardedAd>>} */
    rewardedAds = [];

    /** @type {Array<Ad<InterstitialAd>>} */
    interstitialAds = [];

    LoadAds = () => {
        if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
            this.user.interface.console.AddLog('error', `Ad error: Device unknown (${Platform.OS})`);
            return;
        }

        const adsRaw = FIREBASE['react-native-google-mobile-ads'][Platform.OS];

        if (adsRaw.hasOwnProperty('rewarded')) {
            const rewarded = adsRaw['rewarded'];
            Object.keys(rewarded).forEach(/** @param {AdNames} name */ name => {
                const adUnitId = __DEV__ ? TestIds.REWARDED : rewarded[name];

                /** @type {Ad<RewardedAd>} */
                const newAd = new Ad(name, 'rewarded');
                newAd.ad = RewardedAd.createForAdRequest(adUnitId, {
                    requestNonPersonalizedAdsOnly: !this.user.consent.isPersonalized(),
                    keywords: AD_KEYWORDS
                });
                newAd.ad.load();
                this.rewardedAds.push(newAd);
            });
        }

        if (adsRaw.hasOwnProperty('interstitial')) {
            const interstitial = adsRaw['interstitial'];
            Object.keys(interstitial).forEach(/** @param {AdNames} name */ name => {
                const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : interstitial[name];

                /** @type {Ad<InterstitialAd>} */
                const newAd = new Ad(name, 'interstitial');
                newAd.ad = InterstitialAd.createForAdRequest(adUnitId, {
                    requestNonPersonalizedAdsOnly: !this.user.consent.isPersonalized(),
                    keywords: AD_KEYWORDS
                });
                newAd.ad.load();
                this.interstitialAds.push(newAd);
            });
        }
    }

    /**
     * @param {AdTypesName} type
     * @param {AdNames} adName
     * @param {AdEvent} callback
     * @returns {AdTypes|null}
     */
    Get(type, adName, callback) {
        // Get ads by type
        let ads = [];
        switch (type) {
            case 'rewarded':
                ads = this.rewardedAds;
                break;
            case 'interstitial':
                ads = this.interstitialAds;
                break;
            default:
                return null;
        }

        // Get ad index
        let rewardedIndex = ads.findIndex(ad => ad.name === adName);
        if (rewardedIndex === -1) return null;

        // Get ad & clear events
        const ad = ads[rewardedIndex];
        this.ClearEvents(ad);

        // Set events
        const unsubscriber = ad.ad.addAdEventsListener(({ type, payload }) => {
            callback(ad.ad.loaded ? 'ready' : 'wait');
            this.EventOx(type, ad, callback);
        });
        ad.unsubscriber = unsubscriber;

        // Load ad if not loaded
        if (!ad.ad.loaded) {
            ad.ad.load();
        }

        return ad;
    }

    /**
     * @param {AdEventType|RewardedAdEventType} type
     * @param {AdTypes} ad
     * @param {AdEvent} callback
     */
    EventOx = async (type, ad, callback = () => {}) => {
        if (this.user.informations.adRemaining <= 0 || !this.user.server.online) {
            callback('notAvailable');
            return;
        }

        switch (type) {
            case AdEventType.LOADED:
            case RewardedAdEventType.LOADED:
                callback('ready');
                break;
            case RewardedAdEventType.EARNED_REWARD:
                const response = await this.user.server.Request('adWatched');
                if (response === null) break;

                this.user.interface.console.AddLog('info', 'Ad watched', response);
                if (response['status'] === 'ok') {
                    this.user.informations.ox.Set(parseInt(response['ox']));
                    this.user.informations.DecrementAdRemaining();
                    callback('watched');
                }
                break;
            case AdEventType.OPENED:
                callback('wait');
                break;
            case AdEventType.CLOSED:
                this.user.informations.ox.Set();
                callback('closed');
                ad.ad.load();
                break;
            default:
                callback('error');
                break;
        }
    }

    /** @param {AdTypes|null} ad */
    ClearEvents(ad) {
        if (ad === null) return;

        if (ad.unsubscriber !== null) {
            ad.unsubscriber();
            ad.unsubscriber = null;
        }
    }
}

export { OX_AMOUNT };
export default Admob;
