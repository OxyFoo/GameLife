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
 */

class DayClock extends BackDayClock {
    render() {
        const { day, state, fillingValue } = this.props;
        const langDays = langManager.curr['dates']['days'];

        const fistLetterUpper = langDays[(day+1)%7].charAt(0).toUpperCase();

        /** @type {ThemeColor} */
        let fillingColor = 'main1';

        const styleCircle = {};
        const styleOblicLine = {};

        if (state === 'normal') {
            let color = themeManager.GetColor('main1');
            if (this.props.isToday) {
                color = themeManager.GetColor('main2');
            }
            styleCircle.borderColor = color;
        }

        else if (state === 'disabled') {
            fillingColor = 'main2';
            let color = themeManager.GetColor('unfocused');

            if (this.props.isToday) {
                color = themeManager.GetColor('main2', { opacity: .75 });
            }

            styleCircle.borderColor = color;
            styleOblicLine.backgroundColor = color;
        }

        else if (state === 'full') {
            let color = themeManager.GetColor('main1');
            if (this.props.isToday) {
                color = themeManager.GetColor('main2');
            }
            styleCircle.borderColor = color;
            styleCircle.backgroundColor = color;
        }

        else if (state === 'filling') {
            let color = themeManager.GetColor('disabled');
            if (this.props.isToday) {
                fillingColor = 'main2';
            } else {
                color = themeManager.GetColor('danger');
                fillingColor = 'danger';
            }
            styleCircle.borderColor = color;
        }

        return (
            <View style={[styles.parent, styleCircle]}>
                {/** Disable oblic line */}
                {state === 'disabled' && (
                    <View style={[styles.oblicLine, styleOblicLine]} />
                )}

                {state === 'filling' && (
                    <View style={{ position: 'absolute' }}>
                        <FilledCircle
                            percentage={fillingValue}
                            size={32}
                            margin={0}
                            color={fillingColor}
                        />
                    </View>
                )}

                <Text fontSize={12}>
                    {fistLetterUpper}
                </Text>

            </View>
        );
    }
}

export default DayClock;
