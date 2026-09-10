import * as React from 'react';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import { STOP_CARD_PRESS } from './cardPress';

import { Button, Icon, Text } from 'Interface/Components';

/**
 * @typedef {import('Class/Ads').AdEvent} AdEvent
 * @typedef {import('Class/Ads').AdStates} AdStates
 * @typedef {import('Class/Ads').AdEventFunction} AdEventFunction
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Ads').Ad} Ad
 */

const AD_NAME = 'raid-heal';

/**
 * Halves the remaining heal against a rewarded ad. Same life cycle as `BonusOxAdButton`: the ad
 * events and the server claim race each other, the outcome is announced once both are known.
 */
class HealAdButton extends React.Component {
    state = {
        /** @type {AdStates} */
        adState: 'wait'
    };

    /** @type {AdEvent | null} */
    rewarded = null;

    /** @type {'ok' | 'failed' | null} */
    claimOutcome = null;

    closed = false;

    /**
     * The reward has been earned: one ad per heal phase, so whatever the SDK says next this button
     * is done. The ad reloads right after CLOSED and that reload announces 'ready', which would
     * otherwise re-offer a heal the server refuses with 'already-used'.
     * @type {boolean}
     */
    consumed = false;

    announced = false;

    componentDidMount() {
        this.rewarded = user.ads.Get(AD_NAME, this.onAdStateChange, this.claim);
        if (this.rewarded === null) {
            this.setState({ adState: 'error' });
        }
    }

    componentWillUnmount() {
        if (this.rewarded) {
            user.ads.ClearEvents(this.rewarded);
        }
    }

    /** @type {(ad: Ad) => Promise<boolean>} */
    claim = async () => {
        // Set before the round-trip: the reload may announce 'ready' while the claim is still flying
        this.consumed = true;

        const response = await user.server2.tcp.SendAndWait({ action: 'raid-heal-ad' });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'raid-heal-ad' ||
            response.result !== 'ok' ||
            typeof response.simulation === 'undefined'
        ) {
            // The skip may have been registered before the answer was lost: refresh the state
            user.raids.LoadOnline();
            this.claimOutcome = 'failed';
            return false;
        }

        user.raids.ApplyHeal(response.simulation, response.skips ?? null, response.remaining ?? null);
        user.informations.adTotalWatched++;
        user.SaveLocal();
        this.claimOutcome = 'ok';
        return true;
    };

    openAd = () => {
        const lang = langManager.curr['raids'];
        const langServer = langManager.curr['server'];
        const availability = user.raids.GetHealAdAvailability();

        if (availability === 'limit-reached') {
            const maxPerDay = user.raids.GetHealAdMaxPerDay();
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-heal-ad-limit']['title'],
                    message: lang['alert-heal-ad-limit']['message'].replace('{}', Math.max(1, maxPerDay).toString())
                }
            });
        } else if (availability === 'already-used') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title: lang['alert-heal-ad-used']['title'], message: lang['alert-heal-ad-used']['message'] }
            });
        } else if (availability === 'not-healing') {
            user.raids.LoadOnline();
        } else if (this.state.adState === 'wait') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: langServer['alert-aderror-loading-title'],
                    message: langServer['alert-aderror-loading-message']
                }
            });
        } else if (!user.server2.IsAuthenticated() || !this.rewarded || !this.rewarded.ad?.loaded) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title: langServer['alert-aderror-title'], message: langServer['alert-aderror-message'] }
            });
        } else {
            this.rewarded.ad.show();
        }
    };

    announce = () => {
        if (this.announced || !this.closed || this.claimOutcome === null) {
            return;
        }
        this.announced = true;

        const lang = langManager.curr['raids'];
        const langServer = langManager.curr['server'];
        if (this.claimOutcome === 'ok') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-heal-ad-success']['title'],
                    message: lang['alert-heal-ad-success']['message']
                }
            });
            return;
        }
        user.interface.popup?.OpenT({
            type: 'ok',
            data: { title: langServer['alert-aderror-title'], message: langServer['alert-aderror-message'] }
        });
    };

    /** @type {AdEventFunction} */
    onAdStateChange = (_ad, state) => {
        // The reload that follows a watched ad must not re-offer the heal
        if (this.consumed && (state === 'ready' || state === 'wait')) {
            return;
        }

        if (state === 'ready') {
            this.setState({ adState: 'ready' });
            return;
        }
        if (state === 'watched') {
            this.setState({ adState: 'watched' });
            this.announce();
            return;
        }
        if (state === 'closed') {
            this.closed = true;
            // Closed without earning the reward: offer it again. With the claim still in flight,
            // keep the spinner until it answers.
            if (this.claimOutcome === null && !this.consumed) {
                this.setState({ adState: 'wait' });
                return;
            }
            this.announce();
            return;
        }
        if (state === 'error') {
            if (this.claimOutcome === 'failed') {
                this.setState({ adState: 'watched' });
                this.announce();
                return;
            }
            this.setState({ adState: this.closed ? 'watched' : 'error' });
            return;
        }
        this.setState({ adState: state });
    };

    render() {
        const lang = langManager.curr['raids'];
        const { adState } = this.state;

        if (adState === 'error' || adState === 'notAvailable' || adState === 'watched') {
            return null;
        }

        return (
            <Button
                {...STOP_CARD_PRESS}
                style={styles.healButton}
                styleContent={styles.healButtonContent}
                appearance='outline'
                borderColor='success'
                fontColor='success'
                loading={adState === 'wait'}
                onPress={this.openAd}
            >
                <Text fontSize={12} color='success' bold>
                    {lang['heal-ad']}
                </Text>
                <Icon icon='play' size={14} color='success' />
            </Button>
        );
    }
}

export { HealAdButton };
