import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

import Text from './Text';
import Icon from './Icon';

/**
 * @typedef {import('../../Class/Admob').AdStates} AdStates
 */

const ButtonAdProps = {
    button: null,
    oxAmount: 10,

    /** @type {AdStates} */
    state: 'wait'
}

class ButtonAd extends React.PureComponent {
    render() {
        const Button = this.props.button;
        if (Button === null) {
            user.interface.console.AddLog('warn', 'ButtonAd: button prop is null');
            return null;
        }

        const { oxAmount, state } = this.props;
        const lang = langManager.curr['other']['ad-button-states'];
        const text = lang.hasOwnProperty(state) ? lang[state] : '???';
        const style = [styles.adButton, this.props.style];
        const enabled = state === 'ready';

        return (
            <Button color='main2' {...this.props} style={style} enabled={enabled}>
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