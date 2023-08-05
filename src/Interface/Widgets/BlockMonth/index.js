import * as React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import themeManager from 'Managers/ThemeManager';

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

const dynamicStyles = {
    bgMain1: { backgroundColor: themeManager.GetColor('main1') },
    bgMain2: { backgroundColor: themeManager.GetColor('main2') },
    bgBorder: { backgroundColor: themeManager.GetColor('border') }
};

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

/**
 * @param {Object} props
 * @param {DayType} props.item
 * @param {() => Void} props.onPress
 * @returns {React.JSX.Element}
 */
function Day(props) {
    const { item, onPress } = props;
    if (item === null) return <View style={styles.day} />;

    const { day, isToday, isSelected, isActivity, isActivityXP } = item;

    /** @type {Array<StyleProp>} */
    let style = [styles.day];
    if (isSelected)   style = [...style, styles.circle, dynamicStyles.bgMain1];
    else if (isToday) style = [...style, styles.circle, dynamicStyles.bgMain2];


    const renderDot = () => {
        if (!isActivity && !isActivityXP) return null;

        let dotColor = dynamicStyles.bgBorder;
        if (isActivityXP) dotColor = dynamicStyles.bgMain2;

        return (
            <View style={styles.dotContainer}>
                <View style={[styles.dot, dotColor]} />
            </View>
        );
    }

    return (
        <View style={style}>

            {day !== 0 && (
                <Text
                    containerStyle={{ width: '100%' }}
                    onPress={onPress}
                >
                    {day.toString()}
                </Text>
            )}
            {renderDot()}

        </View>
    );
}

class BlockMonth extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        const data = nextProps.monthData?.data[0] ?? nextProps.weekData ?? [];
        const currData = this.props.monthData?.data[0] ?? this.props.weekData ?? [];
        if (data.length !== data.length) return true;
        return !data.every((v, i) => v === currData[i]);
    }

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
                <Day
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
                />
            </View>
        );
    }
}

BlockMonth.prototype.props = BlockMonthProps;
BlockMonth.defaultProps = BlockMonthProps;

export default BlockMonth;