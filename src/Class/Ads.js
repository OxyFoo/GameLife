import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';
import { AdEventType, RewardedAd, RewardedAdEventType, InterstitialAd } from 'react-native-google-mobile-ads';

import { IUserClass } from '@oxyfoo/gamelife-types/Interface/IUserClass';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Ads').Ad} Ad
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

    /** @type {AdEventFunction | null} Current callback from Get() */
    callback = null;
}

class Ads extends IUserClass {
    /** @type {AdEvent[]} */
    adEvents = [];

    /** @param {UserManager} user */
    constructor(user) {
        super('ads');

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

                // Single listener for all events
                newAd.unsubscriber = ad.addAdEventsListener(({ type, payload }) => {
                    this.HandleAdEvent(newAd, type, payload);
                });

                newAd.ad.load();
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

                // Single listener for all events
                newAd.unsubscriber = ad.addAdEventsListener(({ type, payload }) => {
                    this.HandleAdEvent(newAd, type, payload);
                });

                newAd.ad.load();
                this.adEvents.push(newAd);
            }
        }
    };

    /**
     * Centralized event handler for all ad events
     * @param {AdEvent} adEvent
     * @param {AdEventType | RewardedAdEventType} type
     * @param {Error | import('react-native-google-mobile-ads').RewardedAdReward | undefined} payload
     */
    HandleAdEvent = (adEvent, type, payload) => {
        // Handle ERROR
        if (type === AdEventType.ERROR) {
            const errorMsg = payload instanceof Error ? payload.message : JSON.stringify(payload);
            this.user.interface.console?.AddLog('error', `Ads: "${adEvent.meta.Name}" error: ${errorMsg}`);
            if (adEvent.callback) {
                adEvent.callback(adEvent.meta, 'error');
            }
            return;
        }

        // Handle LOADED - notify callback if set
        if (type === AdEventType.LOADED || type === RewardedAdEventType.LOADED) {
            if (adEvent.callback) {
                adEvent.callback(adEvent.meta, 'ready');
            }
            return;
        }

        // Handle other events only if callback is set (from Get())
        if (adEvent.callback) {
            this.EventOx(type, adEvent, adEvent.callback);
        }
    };

    /**
     * @param {Ad['Name']} adName
     * @param {AdEventFunction} callback
     * @returns {AdEvent | null}
     */
    Get = (adName, callback) => {
        // Get ad
        const adEvent = this.adEvents.find((a) => a.meta.Name === adName);
        if (adEvent === undefined) {
            this.user.interface.console?.AddLog('error', `Ad error: Ad not found (${adName})`);
            return null;
        }

        // Store callback for event handling
        adEvent.callback = callback;

        // Callback with current state
        if (adEvent.ad.loaded) {
            callback(adEvent.meta, 'ready');
        } else {
            callback(adEvent.meta, 'wait');
            adEvent.ad.load();
        }

        return adEvent;
    };

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

        let response;

        switch (type) {
            case AdEventType.LOADED:
            case RewardedAdEventType.LOADED:
                callback(ad.meta, 'ready');
                break;
            case RewardedAdEventType.EARNED_REWARD:
                response = await this.user.server2.tcp.SendAndWait({
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
                if (typeof response.adRemaining === 'number') {
                    this.user.informations.adRemaining = response.adRemaining;
                } else {
                    this.user.informations.DecrementAdRemaining();
                }
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
        ad.callback = null;
    }
}

export { AdEvent };
export default Ads;
