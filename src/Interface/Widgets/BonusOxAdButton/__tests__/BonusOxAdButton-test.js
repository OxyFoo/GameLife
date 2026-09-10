import 'react-native';
import React from 'react';
import { act, render } from '@testing-library/react-native';

import user from 'Managers/UserManager';
import DynamicVar from 'Utils/DynamicVar';
import { BonusOxAdButton } from '../index';

/**
 * @typedef {import('Class/Ads').AdEventFunction} AdEventFunction
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Ads').Ad} Ad
 */

/* The ad itself is never played here: only what the button shows for each state of the ad. */

const ACTIVITY_ID = 7;
const OX_BONUS_PREVIEW = 15;

/** @type {Ad} */
const adMeta = /** @type {Ad} */ ({ Name: 'activity-bonus', RewardOx: 120 });

/**
 * Last callback handed to user.ads.Get, to drive the button through the ad states
 * @type {AdEventFunction}
 */
let onAdStateChange = () => {};

/** Loosely typed on purpose: the fake stands in for Ads.Get, whose return type is richer */
const adsGet = /** @type {jest.Mock} */ (jest.fn());
const adsClearEvents = jest.fn();

/** Popup spy, rebuilt for each test @type {jest.Mock} */
let popupOpenT = jest.fn();

const readyAd = () => ({ meta: adMeta, ad: { loaded: true, show: jest.fn() }, claim: null, unsubscriber: null });

beforeEach(() => {
    onAdStateChange = () => {};
    adsGet.mockClear();
    adsClearEvents.mockClear();
    adsGet.mockImplementation((_adName, callback) => {
        onAdStateChange = callback;
        return { ...readyAd(), callback };
    });

    // The shared UserManager mock (jest.setup.js) carries neither of these
    user.informations = /** @type {any} */ ({
        activityBonusRemaining: 3,
        adTotalWatched: 0,
        ox: { Set: jest.fn() }
    });
    user.ads = /** @type {any} */ ({ Get: adsGet, ClearEvents: adsClearEvents });
    popupOpenT = jest.fn();
    user.interface.popup = /** @type {any} */ ({ OpenT: popupOpenT });
});

describe('[Widget] BonusOxAdButton', () => {
    it('subscribes to the bonus ad on mount and releases it on unmount', () => {
        const { unmount } = render(<BonusOxAdButton activityID={ACTIVITY_ID} oxBonusPreview={OX_BONUS_PREVIEW} />);

        expect(adsGet).toHaveBeenCalledTimes(1);
        expect(adsGet.mock.calls[0][0]).toBe('activity-bonus');

        unmount();
        expect(adsClearEvents).toHaveBeenCalledTimes(1);
    });

    it('hands its own claim to the ad: the flat watch-ad route does not fit', () => {
        render(<BonusOxAdButton activityID={ACTIVITY_ID} oxBonusPreview={OX_BONUS_PREVIEW} />);

        expect(typeof adsGet.mock.calls[0][2]).toBe('function');
    });

    it('shows the bonus it would grant once the ad is ready', () => {
        const { getAllByText } = render(<BonusOxAdButton activityID={ACTIVITY_ID} oxBonusPreview={OX_BONUS_PREVIEW} />);

        act(() => onAdStateChange(adMeta, 'ready'));

        // Button renders its content twice: once visible, once inside the gradient mask
        expect(getAllByText(/15/).length).toBeGreaterThan(0);
    });

    it('announces the reward even when the ad closes before the claim answers', async () => {
        // HandleAdEvent starts EventOx without awaiting it, so 'closed' normally wins the race
        // against the network round-trip. Announcing on 'closed' alone lost every success popup.
        const bonusOx = new DynamicVar(0);
        render(<BonusOxAdButton activityID={ACTIVITY_ID} oxBonusPreview={OX_BONUS_PREVIEW} bonusOx={bonusOx} />);
        const popup = popupOpenT;
        const claim = adsGet.mock.calls[0][2];

        user.server2.tcp.SendAndWait = jest.fn(() =>
            Promise.resolve({ status: 'bonus-activity-ox', result: 'ok', ox: 115, oxBonus: 15, remaining: 2 })
        );

        act(() => onAdStateChange(adMeta, 'ready'));
        act(() => onAdStateChange(adMeta, 'closed'));
        expect(popup).not.toHaveBeenCalled();

        // The claim answers after the ad is gone
        await act(async () => {
            await claim(adMeta);
        });
        act(() => onAdStateChange(adMeta, 'watched'));

        expect(popup).toHaveBeenCalledTimes(1);
        expect(popup.mock.calls[0][0].data.message).toContain('15');

        // The mention above the buttons must follow the reward
        expect(bonusOx.Get()).toBe(15);
    });

    it('stays silent on an ad error that is not the claim failing', () => {
        // The reload fired right after CLOSED surfaces as an SDK 'error': it must not tell the
        // user that anything went wrong with their reward.
        render(<BonusOxAdButton activityID={ACTIVITY_ID} oxBonusPreview={OX_BONUS_PREVIEW} />);
        const popup = popupOpenT;

        act(() => onAdStateChange(adMeta, 'ready'));
        act(() => onAdStateChange(adMeta, 'error'));
        expect(popup).not.toHaveBeenCalled();
    });

    it('tells the user when the claim itself failed', async () => {
        render(<BonusOxAdButton activityID={ACTIVITY_ID} oxBonusPreview={OX_BONUS_PREVIEW} />);
        const popup = popupOpenT;
        const claim = adsGet.mock.calls[0][2];

        user.server2.tcp.SendAndWait = jest.fn(() => Promise.resolve('timeout'));

        act(() => onAdStateChange(adMeta, 'ready'));
        await act(async () => {
            await claim(adMeta);
        });
        act(() => onAdStateChange(adMeta, 'closed'));
        act(() => onAdStateChange(adMeta, 'error'));

        expect(popup).toHaveBeenCalledTimes(1);
    });

    it('disappears once the reward is granted', () => {
        const { toJSON } = render(<BonusOxAdButton activityID={ACTIVITY_ID} oxBonusPreview={OX_BONUS_PREVIEW} />);

        act(() => onAdStateChange(adMeta, 'ready'));
        expect(toJSON()).not.toBeNull();

        act(() => onAdStateChange(adMeta, 'watched'));
        expect(toJSON()).toBeNull();
    });

    it('stays gone when the reload announces a fresh ad after the reward', async () => {
        // The SDK reloads the ad right after CLOSED, and that reload fires 'ready'. It used to bring
        // the button back: the user watched a second ad for a boost the server refuses as
        // 'not-eligible' — a real impression burned for nothing.
        const { toJSON } = render(<BonusOxAdButton activityID={ACTIVITY_ID} oxBonusPreview={OX_BONUS_PREVIEW} />);
        const claim = adsGet.mock.calls[0][2];

        user.server2.tcp.SendAndWait = jest.fn(() =>
            Promise.resolve({ status: 'bonus-activity-ox', result: 'ok', ox: 115, oxBonus: 15, remaining: 2 })
        );

        act(() => onAdStateChange(adMeta, 'ready'));
        expect(toJSON()).not.toBeNull();

        // Reward earned, then the ad closes while the claim is still in flight
        const pending = claim(adMeta);
        act(() => onAdStateChange(adMeta, 'closed'));
        await act(async () => {
            await pending;
        });
        act(() => onAdStateChange(adMeta, 'watched'));
        expect(toJSON()).toBeNull();

        // The reload of the consumed ad must not offer it again
        act(() => onAdStateChange(adMeta, 'ready'));
        expect(toJSON()).toBeNull();
    });

    it('comes back when the ad is closed without a reward', () => {
        const { toJSON } = render(<BonusOxAdButton activityID={ACTIVITY_ID} oxBonusPreview={OX_BONUS_PREVIEW} />);

        act(() => onAdStateChange(adMeta, 'ready'));
        act(() => onAdStateChange(adMeta, 'closed'));
        expect(toJSON()).not.toBeNull();
    });

    it('renders nothing when the ad is unavailable', () => {
        const { toJSON } = render(<BonusOxAdButton activityID={ACTIVITY_ID} oxBonusPreview={OX_BONUS_PREVIEW} />);

        act(() => onAdStateChange(adMeta, 'notAvailable'));
        expect(toJSON()).toBeNull();
    });

    it('renders nothing when the ad could not be found', () => {
        adsGet.mockImplementation(() => null);
        const { toJSON } = render(<BonusOxAdButton activityID={ACTIVITY_ID} oxBonusPreview={OX_BONUS_PREVIEW} />);

        expect(toJSON()).toBeNull();
    });
});
