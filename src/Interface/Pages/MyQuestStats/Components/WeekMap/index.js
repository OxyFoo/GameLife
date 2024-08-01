import React from 'react';
import { Animated, View, FlatList } from 'react-native';

import styles from './style';
import WeekMapBack from './back';
import AnimBorder from './animBorder';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text } from 'Interface/Components';

/**
 * @typedef {import('react-native').Animated.AnimatedInterpolation<string | number>} AnimatedInterpolationStringNumber
 *
 * @typedef {import('./back').DayObject} DayObject
 * @typedef {import('react-native').ListRenderItem<DayObject>} ListRenderItemDayObject
 *
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

class WeekMap extends WeekMapBack {
    render() {
        const { style } = this.props;
        const { days } = this.state;

        return (
            <View style={style}>
                <FlatList
                    columnWrapperStyle={styles.flatListColumnWrapper}
                    data={days}
                    keyExtractor={(item) => item.toString()}
                    renderItem={this.renderDay}
                    numColumns={7}
                    scrollEnabled={false}
                />
            </View>
        );
    }

    /** @type {ListRenderItemDayObject} */
    renderDay = ({ item }) => {
        const langDates = langManager.curr['dates'];
        const { layout } = this.state;
        const { day, animBorder, animBackground } = item;

        const value = day.progress ?? 0;

        /** @type {ThemeText | ThemeColor} */
        let dayColor = 'main1';
        if (day.state === 'today') {
            dayColor = 'main2';
        }

        /** @type {ThemeText | ThemeColor} */
        let dayTextColor = 'primary';

        if (day.state === 'disabled') {
            dayTextColor = 'border';
        } else if (day.state === 'today') {
            dayTextColor = 'main2';
        } else if (day.state === 'past') {
            dayTextColor = 'main1';
        }

        /** @type {AnimatedInterpolationStringNumber | undefined} */
        const animatedColor = animBackground.interpolate({
            inputRange: [0, 1],
            outputRange: [themeManager.GetColor(dayTextColor), themeManager.GetColor('primary')]
        });

        return (
            <View style={styles.day} onLayout={this.onLayout}>
                <Animated.View
                    style={[
                        styles.dayBackground,
                        {
                            opacity: animBackground,
                            backgroundColor: themeManager.GetColor(dayColor)
                        }
                    ]}
                />
                <AnimBorder
                    style={styles.dayBorder}
                    percentage={animBorder}
                    width={layout.width}
                    height={layout.height}
                    color={dayColor}
                />

                {value >= 1 ? (
                    <Text style={[styles.dayText, { color: animatedColor }]} animated>
                        {langDates['days-min'][day.day]}
                    </Text>
                ) : (
                    <Text style={styles.dayText} color={dayTextColor}>
                        {langDates['days-min'][day.day]}
                    </Text>
                )}
            </View>
        );
    };
}

export default WeekMap;
