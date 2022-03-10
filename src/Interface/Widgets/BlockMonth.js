import * as React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { StyleProp, ViewStyle, LayoutChangeEvent } from 'react-native';

import user from '../../Managers/UserManager';
import themeManager from '../../Managers/ThemeManager';

import { Text } from '../Components';
import { GetMonthAndYear } from '../../Utils/Date';

const BlockMonthProps = {
    /** @type {StyleProp<ViewStyle>} */
    style: {},

    data: [],
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    startDay: undefined,
    onBack: undefined,
    showTitle: true,

    /** @param {LayoutChangeEvent} event */
    onLayout: (event) => {},

    onPressDay: (day, month, year) => {},
    today: new Date(),
    selectedDay: null,
    mounted: true
}

function isSameDay(date, day, month, year) {
    const dateDay = date.getDate();
    const dateMonth = date.getMonth();
    const dateYear = date.getFullYear();
    return dateDay === day && dateMonth === month && dateYear === year;
}

function Day(props) {
    const { today, selectedDay, day, month, year, onPressDay } = props;

    const onPress = () => { onPressDay(day, month, year); };
    const isToday = isSameDay(today, day, month, year);
    const isSelectedDay = selectedDay === null ? false : isSameDay(selectedDay, day, month, year);

    const actDate = new Date(year, month, day);
    /**
     * 0 : No activity this day
     * 1 : Activity this day (no XP)
     * 2 : Activity this day (with XP) - Priority
     */
    let ContainActivity = user.activities.ContainActivity(actDate) ? 2 : 0;
    if (ContainActivity === 0) {
        ContainActivity = user.activities.ContainActivity(actDate, true) ? 1 : 0;
    }

    const bgMain1 = { backgroundColor: themeManager.GetColor('main1') };
    const bgMain2 = { backgroundColor: themeManager.GetColor('main2') };
    const bgBorder = { backgroundColor: themeManager.GetColor('border') };

    let style = [styles.day];
    if (isSelectedDay) style.push(styles.circle, bgMain1);
    else if (isToday) style.push(styles.circle, bgMain2);

    let dot = null;
    if (ContainActivity === 1) dot = <View style={[styles.dot, bgBorder]} />;
    else if (ContainActivity === 2) dot = <View style={[styles.dot, bgMain2]} />;

    return (
        <View style={style}>
            {day !== 0 && <Text containerStyle={{ width: '100%' }} onPress={onPress}>{day}</Text>}
            {dot !== null && <View style={styles.dotContainer}>{dot}</View>}
        </View>
    );
}
const ItemDay = React.memo(Day, (a, b) => false);

class BlockMonth extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        const { data, selectedDay, mounted } = nextProps;
        const { data: currData, selectedDay: currSelectedDay, mounted: currMounted } = this.props;
        return data !== currData || selectedDay !== currSelectedDay || mounted !== currMounted;
    }

    render() {
        const { month, year, data, today, selectedDay, onPressDay } = this.props;

        const renderDay = ({ item: day }) => (
            <ItemDay day={day} month={month} year={year} today={today} selectedDay={selectedDay} onPressDay={onPressDay} />
        );

        const days = data.flat();
        const title = GetMonthAndYear(month, year);
        const height = { height: this.props.showTitle ? 260 : 'auto' };

        return (
            <View style={[styles.container, height, this.props.style]} onLayout={this.props.onLayout}>
                {this.props.showTitle && <Text style={styles.title} color='main1' fontSize={22}>{title}</Text>}
                {this.props.mounted && (
                    <FlatList
                        data={days}
                        numColumns={7}
                        columnWrapperStyle={styles.rowContainer}
                        renderItem={renderDay}
                        keyExtractor={(item, index) => 'm-' + index}
                    />
                )}
            </View>
        );
    }
}

BlockMonth.prototype.props = BlockMonthProps;
BlockMonth.defaultProps = BlockMonthProps;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 24
    },
    title: {
        marginBottom: 12,
        fontWeight: 'bold'
    },
    loading: {
        width: '100%',
        height: '100%',
        backgroundColor: 'red'
    },
    rowContainer: {
        justifyContent: 'space-evenly'
    },
    day: {
        width: '10%',
        aspectRatio: 1,
        //paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    circle: {
        borderRadius: 50
    },

    dotContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center'
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2
    }
});

export default BlockMonth;