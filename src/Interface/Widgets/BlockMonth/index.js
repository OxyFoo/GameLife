import * as React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import BlockDay from './blockday';

import { Text } from 'Interface/Components';
import { GetMonthAndYear } from 'Utils/Date';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * 
 * @typedef {import('./script').DayType} DayType
 * @typedef {import('./script').MonthType} MonthType
 */

const BlockMonthProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {MonthType|null} */
    monthData: null,

    /**
     * @type {Array<DayType|null>|null} Show only one week, without title
     *                                      (priority over monthData)
     */
    weekData: null,

    /** @type {boolean} */
    hideTitle: false,

    /** @param {LayoutChangeEvent} event */
    onLayout: (event) => {},

    /**
     * Called when a day is pressed
     * @param {number} day
     * @param {number|null} month Null if weekData is not null
     * @param {number|null} year Null if weekData is not null
     */
    onPressDay: (day, month, year) => {}
}

class BlockMonth extends React.Component {
    render() {
        const {
            monthData,
            weekData,
            style,
            hideTitle,
            onLayout,
            onPressDay
        } = this.props;

        /** @param {{ item: DayType|null }} param0 */
        const renderDay = ({ item }) => {
            const onPess = () => { onPressDay(item.day, monthData?.month, monthData?.year); };
            return (
                <BlockDay
                    item={item}
                    onPress={onPess}
                />
            );
        }

        let days = [];
        let title = null;
        let height = {};

        if (monthData !== null) {
            days = monthData.data.flat();
            title = GetMonthAndYear(monthData.month, monthData.year);
            height = { height: 260 };
        }
        else if (weekData !== null) {
            days = weekData;
            height = { height: 'auto' };
        }

        return (
            <View style={[styles.container, height, style]} onLayout={onLayout}>
                {!hideTitle && title !== null && (
                    <Text style={styles.title} color='main1' fontSize={22}>{title}</Text>
                )}

                <FlatList
                    data={days}
                    numColumns={7}
                    columnWrapperStyle={styles.rowContainer}
                    renderItem={renderDay}
                    keyExtractor={(item, index) => 'm-' + index}
                    scrollEnabled={false}
                />
            </View>
        );
    }
}

BlockMonth.prototype.props = BlockMonthProps;
BlockMonth.defaultProps = BlockMonthProps;

export default BlockMonth;