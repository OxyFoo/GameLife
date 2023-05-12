import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';

import Text from '../Text';
import Icon from '../Icon';

/**
 * @typedef {import('./Button').default} Button
 * @typedef {import('../../../Class/Admob').AdStates} AdStates
 * @typedef {import('../../../Class/Admob').AdTypes['add30Ox']} AdEvent
 * @typedef {import('../../../Class/Admob').RewardedAds} RewardedAds
 * @typedef {import('../../../Class/Admob').InterstitialAds} InterstitialAds
 * @typedef {import('../../../Class/Admob').AdNames} AdNames
 */

const ButtonAdProps = {
    /** @type {AdNames} [Required] id */
    id: null,

    /** @type {number} Amount of Ox reward */
    oxAmount: 30,

    /** @type {Button|null} */
    button: null
}

class ButtonAd extends React.PureComponent {
    state = {
        /** @type {AdStates} */
        adState: 'wait'
    }

    rewardedShop = null;

    componentDidMount() {
        const { id } = this.props;
        // TODO - Setup amount (& edit "add30Ox" to "addXOx")
        if (id === null) {
            user.interface.console.AddLog('warn', 'ButtonAd: id prop is null');
            return;
        }
        this.rewardedShop = user.admob.GetRewardedAd(id, 'add30Ox', this.onAdStateChange);
    }
    componentWillUnmount() {
        const { id } = this.props;
        user.admob.ClearEvents(id);
    }

    watchAd = () => this.rewardedShop?.show();

    /** @type {AdEvent} */
    onAdStateChange = (state) => {
        const { oxAmount } = this.props;
        this.setState({ adState: state });

        if (state === 'closed') {
            const title = langManager.curr['server']['alert-adsuccess-title'];
            const text = langManager.curr['server']['alert-adsuccess-text'].replace('{}', oxAmount);
            user.interface.popup.Open('ok', [ title, text ], undefined, true);
        }
    }

    render() {
        const Button = this.props.button;
        if (Button === null) {
            user.interface.console.AddLog('warn', 'ButtonAd: button prop is null');
            return null;
        }

        const { oxAmount } = this.props;
        const { adState } = this.state;
        const { adRemaining } = user.informations;
        const state = adRemaining <= 0 ? 'notAvailable' : adState;

        const lang = langManager.curr['other']['ad-button-states'];
        const text = lang.hasOwnProperty(state) ? lang[state] : '???';
        const style = [styles.adButton, this.props.style];
        const enabled = state === 'ready';

        return (
            <Button
                color='main2'
                {...this.props}
                onPress={this.watchAd}
                style={style}
                enabled={enabled}
                
            >
                <Text>{text}</Text>
                {enabled && (
                    <View style={styles.adIcon}>
                        <Text style={styles.adText}>+{oxAmount}</Text>
                        <Icon icon='ox' color='white' size={24} />
                    </View>
                )}
            </Button>
        );
    }
}

ButtonAd.prototype.props = ButtonAdProps;
ButtonAd.defaultProps = ButtonAdProps;

const styles = StyleSheet.create({
    adButton: { justifyContent: 'space-between', borderRadius: 14 },
    adText: { marginRight: 6 },
    adIcon: { flexDirection: 'row' }
});

export { ButtonAdProps };
export default ButtonAd;
