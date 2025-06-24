import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import { createSeparatorText } from './utils';
import langManager from 'Managers/LangManager';

import { Button, Text } from 'Interface/Components';
import { GetDate, GetGlobalTime, GetMidnightTime } from 'Utils/Time';

/**
 * @typedef {import('../back').default} BackCalendar
 * @typedef {import('../back').ActivityDataType} ActivityDataType
 */

function Separator({ text = '', onPress = () => {} }) {
    const lang = langManager.curr['calendar'];

    return (
        <View style={styles.separator}>
            {!!text && (
                <Text style={styles.separatorText} color='light'>
                    {text}
                </Text>
            )}

            <Button
                style={styles.separatorButton}
                appearance='uniform'
                color='transparent'
                icon='add-outline'
                fontColor='gradient'
                onPress={onPress}
            />
        </View>
    );
}

/**
 * @this BackCalendar
 */
function CardHeader() {
    const { selectedDay, activities } = this.state;

    if (selectedDay === null || activities.length === 0) {
        return null;
    }

    const date = new Date(selectedDay.year, selectedDay.month, selectedDay.day);
    const time = GetMidnightTime(GetGlobalTime(date));

    const firstActivity = activities[0].activity;
    const firstActivityMidnight = GetMidnightTime(firstActivity.startTime + firstActivity.timezone * 60 * 60);
    const addButtonAdd = firstActivity.startTime > time;

    if (!addButtonAdd) {
        return null;
    }

    const timeFromMidnight = firstActivity.startTime - firstActivityMidnight;
    const text = createSeparatorText(timeFromMidnight);
    const onPress = () => this.onAddActivityFromTime(time);

    return <Separator text={text} onPress={onPress} />;
}

/**
 * @this BackCalendar
 */
function CardFooter() {
    const { activities, selectedDay } = this.state;

    if (activities.length === 0 || selectedDay === null) {
        return null;
    }

    const prevActivity = activities[activities.length - 1].activity;
    const prevEnd = prevActivity.startTime + prevActivity.duration * 60;
    const startDate = GetDate(prevActivity.startTime);
    const sameDay = startDate.getUTCDate() === selectedDay.day;
    const notAddButtonAdd = !sameDay && (startDate.getUTCHours() > 0 || startDate.getUTCMinutes() > 0);

    if (notAddButtonAdd) {
        return null;
    }

    const midnight = GetMidnightTime(prevActivity.startTime + prevActivity.timezone * 60 * 60);
    const nextMidnight = midnight + 86400 * (!sameDay ? 2 : 1);
    const text = createSeparatorText(nextMidnight - prevEnd);
    const onPress = () => this.onAddActivityFromTime(prevActivity.startTime + prevActivity.duration * 60);

    return <Separator text={text} onPress={onPress} />;
}

/**
 * @this BackCalendar
 * @param {{ leadingItem: ActivityDataType }} props
 */
function CardSeparator({ leadingItem }) {
    const { activities } = this.state;

    const activity = leadingItem.activity;
    const index = activities.findIndex((a) => a !== null && a.activity.startTime === activity.startTime);

    const prevActivity = activities[index].activity;
    const nextActivity = activities[index + 1].activity;
    if (!prevActivity || !nextActivity) {
        return <View style={styles.separatorEmptyView} />;
    }

    const prevEnd = prevActivity.startTime + prevActivity.duration * 60;
    const nextStart = nextActivity.startTime;
    const addButtonAdd = nextStart !== prevEnd;
    if (!addButtonAdd) {
        return <View style={styles.separatorEmptyView} />;
    }

    const text = createSeparatorText(nextStart - prevEnd);
    const onPress = () => this.onAddActivityFromTime(activity.startTime + activity.duration * 60);

    return <Separator text={text} onPress={onPress} />;
}

export { CardHeader, CardSeparator, CardFooter };
