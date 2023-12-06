import * as React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import Day from './day';
import { DidUpdateBlockMonth, GetBlockMonth } from './script';

import { Text } from 'Interface/Components';
import { GetMonthAndYear } from 'Utils/Date';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * 
 * @typedef {import('./script').DayType} DayType
 * @typedef {import('./script').MonthType} MonthType
 * 
 * @typedef {{ day?: number, week?: number, month: number, year: number }} MonthData
 */

const BlockMonthProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {'auto'|number} */
    height: 'auto',

    /** @type {MonthData | null} */
    data: null,

    /** @type {boolean} */
    hideTitle: false,

    /** @param {LayoutChangeEvent} event */
    onLayout: (event) => {},

    /**
     * Called when a day is pressed
     * @param {number} day
     * @param {number | null} month
     * @param {number | null} year
     */
    onPressDay: (day, month, year) => {}
};

class BlockMonth extends React.Component {
    state = {
        loaded: false
    }

    /** @type {MonthType | null} */
    lastBlockMonth = null;

    componentDidMount() {
        setTimeout(() => {
            this.setState({ loaded: true });
        }, 100);
    }

    /** @param {BlockMonthProps} nextProps */
    shouldComponentUpdate(nextProps, nextState) {
        const { data: nextData } = nextProps;
        const { data: currData } = this.props;

        // Month data changed
        if (nextData?.day !== currData?.day ||
            nextData?.week !== currData?.week ||
            nextData?.month !== currData?.month ||
            nextData?.year !== currData?.year) {
                return true;
        }

        // Days data changed
        if (this.lastBlockMonth !== null && DidUpdateBlockMonth(this.lastBlockMonth)) {
            return true;
        }

        if (nextState.loaded !== this.state.loaded) {
            return true;
        }

        return false;
    }

    /** @param {DayType | null} item */
    onPress = (item) => {
        const { data, onPressDay } = this.props;
        onPressDay(item.day, data.month, data.year);
    }

    /** @param {{ item: DayType | null }} param0 */
    renderDay = ({ item }) => (
        <Day
            item={item}
            onPress={this.onPress}
        />
    )

    render() {
        const { data, style, height, hideTitle, onLayout } = this.props;

        if (data === null) {
            return null;
        }

        const title = GetMonthAndYear(data.month, data.year);
        let days;
        if (this.state.loaded) {
            const blockMonth = GetBlockMonth(data.month, data.year, undefined, data.day || -1);
            if (data.week !== undefined) {
                days = blockMonth.data[data.week];
            } else {
                days = blockMonth.data.flat();
            }
            this.lastBlockMonth = blockMonth;
        }

        return (
            <View style={[styles.container, { height }, style]} onLayout={onLayout}>
                {hideTitle === false && title !== null && (
                    <Text style={styles.title} color='main1' fontSize={22}>{title}</Text>
                )}

                {this.state.loaded && (
                    <FlatList
                        data={days}
                        numColumns={7}
                        columnWrapperStyle={styles.rowContainer}
                        renderItem={this.renderDay}
                        keyExtractor={(item, index) => 'm-' + index}
                        scrollEnabled={false}
                    />
                )}
            </View>
        );
    }
}

BlockMonth.prototype.props = BlockMonthProps;
BlockMonth.defaultProps = BlockMonthProps;

export default BlockMonth;
