import * as React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { Text } from '../Components';
import themeManager from '../../Managers/ThemeManager';
import { GetMonthAndYear } from '../../Functions/Date';

const BlockMonthProps = {
    style: {},
    data: [],
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    startDay: undefined,
    onBack: undefined,
    showTitle: true,
    onLayout: () => {},
    onPressDay: (day, month, year) => {},
    today: new Date(),
    selectedDay: null
}

function isSameDay(date, day, month, year) {
    const dateDay = date.getDate();
    const dateMonth = date.getMonth();
    const dateYear = date.getFullYear();
    return dateDay === day && dateMonth === month && dateYear === year;
}

function Day(props) {
    const { today, selectedDay, day, month, year, onPressDay } = props;

    const isToday = isSameDay(today, day, month, year);
    const isSelectedDay = selectedDay === null ? false : isSameDay(selectedDay, day, month, year);

    const onPress = () => { onPressDay(day, month, year); };

    let style = [styles.day];
    if (isSelectedDay) {
        style.push(styles.circle, { backgroundColor: themeManager.getColor('main1') });
    } else if (isToday) {
        style.push(styles.circle, { backgroundColor: themeManager.getColor('main2') });
    }

    return (
        <View style={style}>
            {day !== 0 &&
                <Text containerStyle={{ width: '100%' }} onPress={onPress}>{day}</Text>
            }
        </View>
    );
}
const ItemDay = React.memo(Day, (a, b) => a == b);

function BlockMonth(props) {
    const { month, year, data, today, selectedDay, onPressDay } = props;

    const renderDay = ({ item: day }) => (
        <ItemDay day={day} month={month} year={year} today={today} selectedDay={selectedDay} onPressDay={onPressDay} />
    )

    const days = data.flat();
    const title = GetMonthAndYear(month, year);

    return (
        <View style={[styles.container, props.style]} onLayout={props.onLayout}>
            {props.showTitle && <Text style={styles.title} color='main1' fontSize={22}>{title}</Text>}
            <View style={styles.content}>
                <FlatList
                    data={days}
                    numColumns={7}
                    columnWrapperStyle={styles.rowContainer}
                    renderItem={renderDay}
                    keyExtractor={(item, index) => 'm-' + index}
                />
            </View>
        </View>
    );
}

const areEqual = (prevProps, nextProps) => {
    const { data, selectedDay } = nextProps;
    const { data: prevData, selectedDay: prevSelectedDay } = prevProps;
    return data === prevData && selectedDay === prevSelectedDay;
};

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
    content: {
        width: '100%'
    },
    rowContainer: {
        justifyContent: 'space-evenly'
    },
    day: {
        width: '10%',
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    circle: {
        borderRadius: 50
    }
});

export default React.memo(BlockMonth, areEqual);