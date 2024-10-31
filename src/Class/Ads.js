import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';
import { AdEventType, RewardedAd, RewardedAdEventType, InterstitialAd } from 'react-native-google-mobile-ads';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/Data/App/Ads').Ad} Ad
 *
 * @typedef {'shop' | 'todo'} RewardedAds
 * @typedef {'none'} InterstitialAds
 * @typedef {RewardedAds | InterstitialAds} AdNames
 *
 * @typedef {'watched' | 'ready' | 'notAvailable' | 'wait' | 'closed' | 'error'} AdStates
 * @typedef {(ad: Ad, state: AdStates) => void} AdEventFunction
 */

const AD_KEYWORDS = ['video-game', 'sports'];

class AdEvent {
    /**
     * @param {Ad} meta
     * @param {RewardedAd | InterstitialAd} ad
     */
    constructor(meta, ad) {
        this.meta = meta;
        this.ad = ad;
    }

    /** @type {(() => void) | null} */
    unsubscriber = null;
}

class Ads {
    /** @type {AdEvent[]} */
    adEvents = [];

    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;
    }

    /**
     * @param {Ad[]} ads
     * @returns {void}
     */
    LoadAds = (ads) => {
        if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
            this.user.interface.console?.AddLog('error', `Ad error: Device unknown (${Platform.OS})`);
            return;
        }

        if (ads.length === 0) {
            this.user.interface.console?.AddLog('error', 'Ad error: No ads found');
            return;
        }

        // Load new ads
        for (const adMeta of ads) {
            // Rewarded ad
            if (adMeta.Type === 'rewarded') {
                const adUnitId = __DEV__ ? TestIds.REWARDED : adMeta.Codes['android'];
                const ad = RewardedAd.createForAdRequest(adUnitId, {
                    requestNonPersonalizedAdsOnly: !this.user.consent.isPersonalized(),
                    keywords: AD_KEYWORDS
                });
                const newAd = new AdEvent(adMeta, ad);
                // newAd.ad.load();
                this.adEvents.push(newAd);
            }

            // Interstitial ad
            else if (adMeta.Type === 'interstitial') {
                const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : adMeta.Codes['android'];
                const ad = InterstitialAd.createForAdRequest(adUnitId, {
                    requestNonPersonalizedAdsOnly: !this.user.consent.isPersonalized(),
                    keywords: AD_KEYWORDS
                });
                const newAd = new AdEvent(adMeta, ad);
                newAd.ad.load();
                this.adEvents.push(newAd);
            }
        }
    };

    /**
     * @param {Ad['Name']} adName
     * @param {AdEventFunction} callback
     * @returns {AdEvent | null}
     */
    Get(adName, callback) {
        // Get ad index
        const adEvent = this.adEvents.find((a) => a.meta.Name === adName);
        if (adEvent === undefined) {
            this.user.interface.console?.AddLog('error', `Ad error: Ad not found (${adName})`);
            return null;
        }

        // Clear events
        this.ClearEvents(adEvent);

        // Set events
        if (adEvent.ad instanceof RewardedAd) {
            const unsubscriber = adEvent.ad.addAdEventsListener(({ type, payload: _payload }) => {
                callback(adEvent.meta, adEvent.ad.loaded ? 'ready' : 'wait');
                this.EventOx(type, adEvent, callback);
            });
            adEvent.unsubscriber = unsubscriber;
        } else if (adEvent.ad instanceof InterstitialAd) {
            const unsubscriber = adEvent.ad.addAdEventsListener(() => {
                callback(adEvent.meta, adEvent.ad.loaded ? 'ready' : 'wait');
            });
            adEvent.unsubscriber = unsubscriber;
        } else {
            this.user.interface.console?.AddLog('error', `Ad error: Ad type unknown (${adName})`);
            return null;
        }

        // Load ad if not loaded
        if (!adEvent.ad.loaded) {
            // TODO: Fix ads loading
            // adEvent.ad.load();
        }

        return adEvent;
    }

    /**
     * @param {AdEventType | RewardedAdEventType} type
     * @param {AdEvent} ad
     * @param {AdEventFunction} callback
     */
    EventOx = async (type, ad, callback = () => {}) => {
        if (this.user.informations.adRemaining <= 0 || !this.user.server2.IsAuthenticated()) {
            callback(ad.meta, 'notAvailable');
            return;
        }

        switch (type) {
            case AdEventType.LOADED:
            case RewardedAdEventType.LOADED:
                callback(ad.meta, 'ready');
                break;
            case RewardedAdEventType.EARNED_REWARD:
                const response = await this.user.server2.tcp.SendAndWait({
                    action: 'watch-ad',
                    adName: ad.meta.Name
                });

                if (
                    response === 'interrupted' ||
                    response === 'not-sent' ||
                    response === 'timeout' ||
                    response.status !== 'watch-ad' ||
                    response.result !== 'ok' ||
                    typeof response.ox === 'undefined'
                ) {
                    callback(ad.meta, 'error');
                    break;
                }

                this.user.informations.ox.Set(response.ox);
                this.user.informations.DecrementAdRemaining();
                callback(ad.meta, 'watched');

                break;
            case AdEventType.OPENED:
                callback(ad.meta, 'wait');
                break;
            case AdEventType.CLOSED:
                this.user.informations.ox.Set();
                callback(ad.meta, 'closed');
                ad.ad.load();
                break;
            default:
                callback(ad.meta, 'error');
                break;
        }
    };

    /** @param {AdEvent} ad */
    ClearEvents(ad) {
        if (ad.unsubscriber !== null) {
            ad.unsubscriber();
            ad.unsubscriber = null;
        }
    }
}

export { AdEvent };
export default Ads;
