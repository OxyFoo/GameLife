import * as React from 'react';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @typedef {import('Class/Ads').AdEvent} AdEvent
 * @typedef {import('Class/Ads').AdStates} AdStates
 * @typedef {import('Class/Ads').AdEventFunction} AdEventFunction
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Ads').Ad} Ad
 */

const AD_NAME = 'activity-bonus';

const BonusOxAdButtonProps = {
    /** @type {number} Server ID of the activity to boost */
    activityID: 0,

    /** @type {number} Ox the bonus would grant, as previewed by the app */
    oxBonusPreview: 0,

    /**
     * Ox actually granted, published for the mention above the buttons to follow
     * @type {import('Utils/DynamicVar').default<number> | null}
     */
    bonusOx: null
};

/**
 * Watch a rewarded ad to boost the ox of the activity that has just been added: it pays 1.5x.
 *
 * It carries its own state on purpose: the `args` of the `display` page are captured once by
 * `ChangePage`, so a button rendered from them could never follow the three visual states of an ad.
 *
 * The amount is never sent to the server: it recomputes it and answers with what it granted, which
 * may differ from `oxPreview` (another device, a day that filled up in between).
 */
class BackBonusOxAdButton extends React.Component {
    state = {
        /** @type {AdStates} */
        adState: 'wait'
    };

    /** @type {AdEvent | null} */
    rewarded = null;

    /**
     * Outcome of the server claim, held outside the state: the ad events race each other, and
     * `EventOx` is started without being awaited, so an async setState is not readable in time.
     * @type {'ok' | 'failed' | null}
     */
    claimOutcome = null;

    /** @type {number} Ox granted by the server */
    oxBonus = 0;

    /** @type {boolean} The ad has been closed and the screen is ours again */
    closed = false;

    /**
     * The reward has been earned: this button has done its job for this activity, whatever the SDK
     * says next. The ad reloads right after CLOSED, and that reload announces 'ready' — which used
     * to bring the button back and let the user burn a second ad for a boost the server refuses.
     * @type {boolean}
     */
    consumed = false;

    /** @type {boolean} The outcome has been announced: only ever once */
    announced = false;

    componentDidMount() {
        this.rewarded = user.ads.Get(AD_NAME, this.onAdStateChange, this.claim);

        // If the ad is not found, hide the button
        if (this.rewarded === null) {
            this.setState({ adState: 'error' });
        }
    }

    componentWillUnmount() {
        if (this.rewarded) {
            user.ads.ClearEvents(this.rewarded);
        }
    }

    /**
     * Ask the server for the bonus. The reward is variable, so it cannot go through the flat
     * `watch-ad` route.
     * @type {(ad: Ad) => Promise<boolean>}
     */
    claim = async () => {
        // Set before the round-trip: the reload may announce 'ready' while the claim is still flying
        this.consumed = true;

        const response = await user.server2.tcp.SendAndWait({
            action: 'bonus-activity-ox',
            activityID: this.props.activityID
        });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'bonus-activity-ox'
        ) {
            // The reward may have been granted before the answer was lost: refresh the balance
            user.informations.ox.Set();
            this.claimOutcome = 'failed';
            return false;
        }

        if (response.result !== 'ok' || typeof response.ox === 'undefined') {
            if (response.result === 'limit-reached') {
                user.informations.activityBonusRemaining = 0;
            }
            user.informations.ox.Set();
            this.claimOutcome = 'failed';
            return false;
        }

        user.informations.ox.Set(response.ox);
        user.informations.activityBonusRemaining =
            response.remaining ?? Math.max(0, user.informations.activityBonusRemaining - 1);

        // The "watch N ads" achievement counts every ad, whichever quota paid for it
        user.informations.adTotalWatched++;
        user.SaveLocal();

        this.oxBonus = response.oxBonus ?? 0;
        this.claimOutcome = 'ok';

        // The mention above the buttons shows the activity total: it must include the bonus
        this.props.bonusOx?.Set(this.oxBonus);

        return true;
    };

    openAd = () => {
        const lang = langManager.curr['server'];

        // Check if the user can still double today
        if (user.informations.activityBonusRemaining <= 0) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-aderror-title'],
                    message: lang['alert-aderror-nomore-message']
                }
            });
        }

        // Check if ads are loading
        else if (this.state.adState === 'wait') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-aderror-loading-title'],
                    message: lang['alert-aderror-loading-message']
                }
            });
        }

        // Check if the user is connected to the server and if the ad is loaded
        else if (!user.server2.IsAuthenticated() || !this.rewarded || !this.rewarded.ad?.loaded) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-aderror-title'],
                    message: lang['alert-aderror-message']
                }
            });
        }

        // Show the ad
        else {
            this.rewarded.ad.show();
        }
    };

    /**
     * Announce the outcome once the ad is closed AND the claim has answered, whichever happens
     * first: `EventOx` is started without being awaited, so 'closed' usually wins the race against
     * the network round-trip.
     */
    announce = () => {
        if (this.announced || !this.closed || this.claimOutcome === null) {
            return;
        }
        this.announced = true;

        if (this.claimOutcome === 'ok') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: langManager.curr['server']['alert-adsuccess-title'],
                    message: langManager.curr['activity']['display-activity-bonus-success'].replace(
                        '{}',
                        this.oxBonus.toString()
                    )
                }
            });
            return;
        }

        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: langManager.curr['server']['alert-aderror-title'],
                message: langManager.curr['server']['alert-aderror-message']
            }
        });
    };

    /**
     * States of a watched ad: 'wait' (opened), 'watched' or 'error' (claim answered), 'closed'.
     * The last two race each other, hence `announce`.
     * @type {AdEventFunction}
     */
    onAdStateChange = (_ad, state) => {
        // The reload that follows a watched ad must not re-offer the boost
        if (this.consumed && (state === 'ready' || state === 'wait')) {
            return;
        }

        if (state === 'ready') {
            this.setState({ adState: user.informations.activityBonusRemaining > 0 ? 'ready' : 'notAvailable' });
            return;
        }

        if (state === 'watched') {
            this.setState({ adState: 'watched' });
            this.announce();
            return;
        }

        if (state === 'closed') {
            this.closed = true;

            // Closed without ever earning the reward: the ad reloads, offer it again. Closed with
            // the claim still in flight keeps the spinner until it answers.
            if (this.claimOutcome === null && !this.consumed) {
                this.setState({ adState: 'wait' });
                return;
            }

            this.announce();
            return;
        }

        if (state === 'error') {
            // Only the claim's own failure concerns the user. Every other SDK error lands here
            // too — notably the reload fired right after CLOSED — and must stay silent.
            if (this.claimOutcome === 'failed') {
                this.setState({ adState: 'watched' });
                this.announce();
                return;
            }

            // An ad that failed to load is simply not offered
            this.setState({ adState: this.closed ? 'watched' : 'error' });
            return;
        }

        this.setState({ adState: state });
    };
}

BackBonusOxAdButton.defaultProps = BonusOxAdButtonProps;
BackBonusOxAdButton.prototype.props = BonusOxAdButtonProps;

export default BackBonusOxAdButton;
