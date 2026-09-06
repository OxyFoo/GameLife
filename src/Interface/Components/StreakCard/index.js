import * as React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import themeManager from 'Managers/ThemeManager';

import { Text } from '../Text';
import { Icon } from '../Icon';
import { ProgressDonut } from '../ProgressDonut';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {Object} StreakCardPropsType
 * @property {StyleProp} style
 * @property {string} title
 * @property {number} current Current streak, in days
 * @property {number} best Best streak, in days
 * @property {string} bestText Formatted best streak, shown under the counter (e.g. "Max : 12")
 * @property {string} rateText Formatted consistency rate, shown under the donut (e.g. "Régularité : 72 %")
 * @property {number} size Donut size, in pixels
 */

/** @type {StreakCardPropsType} */
const StreakCardProps = {
    style: {},
    title: '',
    current: 0,
    best: 0,
    bestText: '',
    rateText: '',
    size: 110
};

class StreakCard extends React.Component {
    render() {
        const { style, title, current, best, bestText, rateText, size } = this.props;
        const progress = best > 0 ? Math.min(1, current / best) : 0;

        return (
            <LinearGradient
                style={[styles.gradient, style]}
                colors={[
                    themeManager.GetColor('main1', { opacity: 0.2 }),
                    themeManager.GetColor('main1', { opacity: 0.1 })
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View style={styles.header}>
                    <Text style={styles.title} fontSize={16} color='white'>
                        {title}
                    </Text>
                </View>
                <View style={styles.body}>
                    <ProgressDonut value={progress} size={size} strokeWidth={8} delay={0} progressColor='main2'>
                        <View style={styles.center}>
                            <View style={styles.counter}>
                                <Text fontSize={22} bold>
                                    {`${current}`}
                                </Text>
                                <Icon icon='flame' size={20} color='main2' />
                            </View>
                            <Text fontSize={10} color='secondary'>
                                {bestText}
                            </Text>
                        </View>
                    </ProgressDonut>
                    <Text fontSize={11} color='secondary'>
                        {rateText}
                    </Text>
                </View>
            </LinearGradient>
        );
    }
}

StreakCard.defaultProps = StreakCardProps;
StreakCard.prototype.props = StreakCardProps;

export { StreakCard };
