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
 * @property {boolean} selected
 * @property {(dayIndex: number) => void} onPress
 */

/**
 * One day of the histogram: a gradient bar with a soft halo, the day of month and the month when it changes
 * @extends {React.PureComponent<HistogramBarProps>}
 */
class HistogramBar extends React.PureComponent {
    onPress = () => this.props.onPress(this.props.day.dayIndex);

    render() {
        const { day, slotWidth, niceMax, selected } = this.props;
        const langDates = langManager.curr['dates'];

        const barWidth = Math.max(4, slotWidth - BAR_GAP * 2);
        const barRadius = barWidth / 2;
        const barHeight =
            day.minutes > 0 ? Math.max(MIN_BAR_HEIGHT, Math.round((day.minutes / niceMax) * PLOT_HEIGHT)) : 0;

        const glowColor = themeManager.GetColor(selected ? 'main2' : 'main1', { opacity: selected ? 0.35 : 0.16 });
        const barColors = selected
            ? [themeManager.GetColor('main2'), themeManager.GetColor('main1')]
            : [themeManager.GetColor('main3'), themeManager.GetColor('main1')];
        const emptyColor = themeManager.GetColor('border', { opacity: 0.3 });

        return (
            <Pressable style={[styles.slot, { width: slotWidth }]} onPress={day.minutes > 0 ? this.onPress : undefined}>
                <View style={styles.plotSlot}>
                    {barHeight > 0 ? (
                        <>
                            <View
                                style={[
                                    styles.glow,
                                    {
                                        width: barWidth + 6,
                                        height: barHeight + 3,
                                        borderRadius: barRadius + 3,
                                        backgroundColor: glowColor
                                    }
                                ]}
                            />
                            <LinearGradient
                                style={{
                                    width: barWidth,
                                    height: barHeight,
                                    borderTopLeftRadius: barRadius,
                                    borderTopRightRadius: barRadius
                                }}
                                colors={barColors}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                            />
                        </>
                    ) : (
                        <View style={[styles.emptyDot, { backgroundColor: emptyColor }]} />
                    )}
                </View>
                <Text style={styles.dayLabel} fontSize={10} color={selected ? 'main3' : 'secondary'}>
                    {`${day.day}`}
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
