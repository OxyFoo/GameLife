import * as React from 'react';
import { View, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles, { PLOT_HEIGHT, MIN_BAR_HEIGHT, BAR_GAP } from './style';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text } from 'Interface/Components';

/**
 * @typedef {import('./back').HistogramDay} HistogramDay
 *
 * @typedef {object} HistogramBarProps
 * @property {HistogramDay} day
 * @property {number} slotWidth Width of the day column, in pixels
 * @property {number} niceMax Scale maximum, in minutes
 * @property {number} labelStep Days between two day labels (the 1st of a month is always labelled)
 * @property {boolean} selected
 * @property {(dayIndex: number) => void} onPress
 */

/**
 * One day of the histogram: a single-color bar fading out toward the baseline,
 * the day of month and the month when it changes
 * @extends {React.PureComponent<HistogramBarProps>}
 */
class HistogramBar extends React.PureComponent {
    onPress = () => this.props.onPress(this.props.day.dayIndex);

    render() {
        const { day, slotWidth, niceMax, labelStep, selected } = this.props;
        const langDates = langManager.curr['dates'];

        const gap = Math.min(BAR_GAP, Math.floor(slotWidth / 4));
        const barWidth = Math.max(2, slotWidth - gap * 2);
        const showDayLabel = day.day === 1 || day.day % labelStep === 0;
        const barHeight =
            day.minutes > 0 ? Math.max(MIN_BAR_HEIGHT, Math.round((day.minutes / niceMax) * PLOT_HEIGHT)) : 0;

        const barColor = selected ? 'main2' : 'main3';
        const barColors = [themeManager.GetColor(barColor), themeManager.GetColor(barColor, { opacity: 0.04 })];
        const emptyColor = themeManager.GetColor('border', { opacity: 0.25 });

        return (
            <Pressable style={[styles.slot, { width: slotWidth }]} onPress={day.minutes > 0 ? this.onPress : undefined}>
                <View style={styles.plotSlot}>
                    {barHeight > 0 ? (
                        <LinearGradient
                            style={[styles.bar, { width: barWidth, height: barHeight }]}
                            colors={barColors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                        />
                    ) : (
                        <View style={[styles.emptyDot, { backgroundColor: emptyColor }]} />
                    )}
                </View>
                <Text style={styles.dayLabel} fontSize={10} color={selected ? 'main3' : 'secondary'}>
                    {showDayLabel ? `${day.day}` : ''}
                </Text>
                {day.showMonth && (
                    <Text style={styles.monthLabel} fontSize={9} color='light'>
                        {langDates['months-min'][day.month]}
                    </Text>
                )}
            </Pressable>
        );
    }
}

export default HistogramBar;
