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
    const {
        selectedDate, selectedMonth, selectedYear,
        currActivities
    } = this.state;

    let addButtonAdd = true;
    let time = GetMidnightTime(GetTime(new Date(selectedYear, selectedMonth, selectedDate)));
    let timeDiffFromMidnight = 0;
    let hourDiff = 0;
    let minuteDiff = 0;

    if (currActivities.length > 0) {
        const firstActivity = currActivities[0];
        const firstActivityMidnight = GetMidnightTime(firstActivity.startTime + firstActivity.timezone * 60 * 60);
        addButtonAdd = firstActivity.startTime !== firstActivityMidnight;
        timeDiffFromMidnight = (firstActivity.startTime - firstActivityMidnight) / 60;
        hourDiff = Math.floor(timeDiffFromMidnight / 60);
        minuteDiff = timeDiffFromMidnight % 60;
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
                hourDiff={hourDiff}
                minuteDiff={minuteDiff}
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
                index={this.state.currActivities.length + 1}
            />
        );
    }

    // Add separator if last activity ends before midnight
    let addButtonAdd = false;
    let prevActivity = null;
    prevActivity = currActivities[currActivities.length - 1];
    const prevEnd = prevActivity.startTime + prevActivity.duration * 60;
    addButtonAdd = GetDate(prevActivity.startTime).getDate() === GetDate(prevEnd).getDate();
    let prevMidnight = GetMidnightTime(prevActivity.startTime + prevActivity.timezone * 60 * 60); // Tout ca à l'air de marcher avec notre timezone, inch ca marche pour tout le monde 
    let nextMidnight = prevMidnight + 24 * 60 * 60;
    let timeDiffUntilMidnight = (nextMidnight - prevEnd) / 60;
    let hourDiff = Math.floor(timeDiffUntilMidnight / 60);
    let minuteDiff = timeDiffUntilMidnight % 60;
    
    console.log("TODO : soir, need to get the unix timecode for midnight", prevActivity.startTime, prevActivity.duration, prevEnd, GetDate(prevActivity.startTime).getDate(), addButtonAdd);

    return (
        <>
            <ActivityCard.Separator
                addButton={addButtonAdd}
                onPress={() => this.onAddActivityFromActivity(prevActivity)}
                hourDiff={hourDiff}
                minuteDiff={minuteDiff}
            />
            <ActivityCard
                type={'end'}
                index={this.state.currActivities.length + 1}
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
    let timeDiffBetweenActivities = 0;
    let hourDiff = 0;
    let minuteDiff = 0;

    const finder = x => x !== null && x.startTime === leadingItem.startTime;
    const index = currActivities.findIndex(finder);

    const prevActivity = currActivities[index];
    const nextActivity = currActivities[index + 1];
    if (!!prevActivity && !!nextActivity) {
        const prevEnd = prevActivity.startTime + prevActivity.duration * 60;
        const nextStart = nextActivity.startTime;
        addButtonAdd = nextStart !== prevEnd;
        timeDiffBetweenActivities = (nextStart - prevEnd) / 60;
        hourDiff = Math.floor(timeDiffBetweenActivities / 60);
        minuteDiff = timeDiffBetweenActivities % 60;
    }

    return (
        <ActivityCard.Separator
            addButton={addButtonAdd}
            onPress={() => this.onAddActivityFromActivity(leadingItem)}
            hourDiff={hourDiff}
            minuteDiff={minuteDiff}
        />
    );
}

export {
    cardHeader,
    cardItem,
    cardFooter,
    cardSeparator
};