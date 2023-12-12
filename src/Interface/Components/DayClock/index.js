import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackDayClock from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import Text from '../Text';
import FilledCircle from './filledCircle';

/**
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 */

class DayClock extends BackDayClock {
    render() {
        const { day, state } = this.props;
        const langDays = langManager.curr['dates']['days'];

        const fistLetterUpper = langDays[(day+1)%7].charAt(0).toUpperCase();

        /** @type {ThemeColor | ThemeText} */
        let textColor = 'main2';
        const borderColor = { borderColor: themeManager.GetColor('main2') };
        const styleOblicLine = { backgroundColor: themeManager.GetColor('disabled') };

        if (state === 'disabled') {
            textColor = 'disabled';
            borderColor.borderColor = themeManager.GetColor('disabled');
        }

        else if (state === 'full') {
            textColor = 'primary';
            borderColor.borderColor = themeManager.GetColor('main1');
            borderColor.backgroundColor = themeManager.GetColor('main1');
        }

        else if (state === 'filling') {
            textColor = 'primary';
            borderColor.borderColor = themeManager.GetColor('disabled');
        }

        return (
            <View style={[styles.parent, borderColor]}>
                {/** Disable oblic line */}
                {state === 'disabled' && (
                    <View style={[styles.oblicLine, styleOblicLine]} />
                )}

                {state === 'filling' && (
                    <View style={{ position: 'absolute' }}>
                        <FilledCircle
                            percentage={Math.random() * 100}
                            size={32}
                            margin={0}
                        />
                    </View>
                )}

                <Text style={{ fontSize: 12 }} color={textColor}>
                    {fistLetterUpper}
                </Text>

            </View>
        );
    }
}

export default DayClock;
