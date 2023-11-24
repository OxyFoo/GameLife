import * as React from 'react';

import { ActivityCard } from 'Interface/Widgets';
import { GetDate, GetMidnightTime, GetTime } from 'Utils/Time';

/**
 * @typedef {import('./back').default} BackCalendar
 * @typedef {import('Class/Activities').Activity} Activity
 */

/**
 * @this BackCalendar
 */
function cardHeader() {
    const { selectedALL, currActivities } = this.state;

    let addButtonAdd = true;
    let time = GetMidnightTime(GetTime(new Date(selectedALL?.year, selectedALL?.month, selectedALL?.day)));

    if (currActivities.length > 0) {
        const firstActivity = currActivities[0];
        const firstActivityMidnight = GetMidnightTime(firstActivity.startTime + firstActivity.timezone * 60 * 60 * 24);
        addButtonAdd = firstActivity.startTime !== firstActivityMidnight;
    }

    return (
        <>
            <ActivityCard
                type={'start'}
                index={0}
            />
            <ActivityCard.Separator
                addButton={addButtonAdd}
                onPress={() => this.onAddActivityFromTime(time)}
            />
        </>
    );
}

/**
 * @this BackCalendar
 * @param {{ item: Activity, index: number }} props
 */
function cardItem({ item, index }) {
    return (
        <ActivityCard
            activity={item}
            index={index + 1}
            onPress={() => this.onActivityPress(item)}
        />
    );
}

/**
 * @this BackCalendar
 */
function cardFooter() {
    const { currActivities } = this.state;

    // No activity = no separator
    if (currActivities.length === 0) {
        return (
            <ActivityCard
                type={'end'}
                index={currActivities.length + 1}
            />
        );
    }

    // Add separator if last activity ends before midnight
    let addButtonAdd = false;
    let prevActivity = null;
    prevActivity = currActivities[currActivities.length - 1];
    const prevEnd = prevActivity.startTime + prevActivity.duration * 60;
    addButtonAdd = GetDate(prevActivity.startTime).getDate() === GetDate(prevEnd).getDate();

    return (
        <>
            <ActivityCard.Separator
                addButton={addButtonAdd}
                onPress={() => this.onAddActivityFromActivity(prevActivity)}
            />
            <ActivityCard
                type={'end'}
                index={currActivities.length + 1}
            />
        </>
    );
}

/**
 * @this BackCalendar
 * @param {{ leadingItem: Activity }} props
 */
function cardSeparator(props) {
    const { leadingItem } = props;
    const { currActivities } = this.state;

    let addButtonAdd = false;

    const finder = x => x !== null && x.startTime === leadingItem.startTime;
    const index = currActivities.findIndex(finder);

    const prevActivity = currActivities[index];
    const nextActivity = currActivities[index + 1];
    if (!!prevActivity && !!nextActivity) {
        const prevEnd = prevActivity.startTime + prevActivity.duration * 60;
        const nextStart = nextActivity.startTime;
        addButtonAdd = nextStart !== prevEnd;
    }

    return (
        <ActivityCard.Separator
            addButton={addButtonAdd}
            onPress={() => this.onAddActivityFromActivity(leadingItem)}
        />
    );
}

export {
    cardHeader,
    cardItem,
    cardFooter,
    cardSeparator
};
