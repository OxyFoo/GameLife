import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

import Text from './Text';
import Icon from './Icon';

const ButtonAdProps = {
    button: null,
    oxAmount: 10,

    /** @type {Boolean?} True if ad is free */
    free: false
}

class ButtonAd extends React.PureComponent {
    render() {
        const Button = this.props.button;
        if (Button === null) {
            user.interface.console.AddLog('warn', 'ButtonAd: button prop is null');
            return null;
        }

        const { oxAmount, free } = this.props;
        const lang = langManager.curr['other'];
        const enabled = free && user.informations.adRemaining > 0;
        const style = [styles.adButton, this.props.style];
        const text = lang['ad-button-text'];

        let error = null;
        if (free === false) error = lang['ad-button-empty'];
        else if (free === null) error = lang['ad-button-error'];

        return (
            <Button color='main2' {...this.props} style={style} enabled={enabled}>
                <Text>{error || text}</Text>
                {!error && (
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