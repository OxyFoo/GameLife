import * as React from 'react';

import langManager from 'Managers/LangManager';

import { ActivityCard } from 'Interface/Widgets';
import { GetDate, GetMidnightTime, GetTime } from 'Utils/Time';
import { ParsePlural } from 'Utils/String';

/**
 * @typedef {import('./back').default} BackCalendar
 * @typedef {import('Class/Activities').Activity} Activity
 */

/**
 * @this BackCalendar
 */
function cardHeader() {
    const { selectedALL, currActivities } = this.state;

    const date = new Date(selectedALL?.year, selectedALL?.month, selectedALL?.day);
    const time = GetMidnightTime(GetTime(date));

    let addButtonAdd = true;
    let additonalText = createSeparatorText(0);

    if (currActivities.length > 0) {
        const firstActivity = currActivities[0];
        const firstActivityMidnight = GetMidnightTime(firstActivity.startTime + firstActivity.timezone * 60 * 60);
        addButtonAdd = firstActivity.startTime !== firstActivityMidnight;
        if (addButtonAdd) {
            const timeFromMidnight = firstActivity.startTime - firstActivityMidnight;
            additonalText = createSeparatorText(timeFromMidnight);
        }
    }

    const time = GetMidnightTime(GetTime(new Date(selectedALL.year, selectedALL.month, selectedALL.day)));

    return (
        <>
            <ActivityCard
                type={'start'}
                index={0}
            />
            <ActivityCard.Separator
                addButton={addButtonAdd}
                onPress={() => this.onAddActivityFromTime(time)}
                additionalText={additonalText}
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
    let additonalText = '';

    let prevActivity = null;
    prevActivity = currActivities[currActivities.length - 1];
    const prevEnd = prevActivity.startTime + prevActivity.duration * 60;
    addButtonAdd = GetDate(prevActivity.startTime).getDate() === GetDate(prevEnd).getDate();

    if (addButtonAdd) {
        const midnight = GetMidnightTime(prevActivity.startTime + prevActivity.timezone * 60 * 60);
        const nextMidnight = midnight + 86400;
        additonalText = createSeparatorText(nextMidnight - prevEnd);
    }

    if (addButtonAdd) {
        const midnight = GetMidnightTime(prevActivity.startTime + prevActivity.timezone * 60 * 60);
        const nextMidnight = midnight + 86400;
        additonalText = createSeparatorText(nextMidnight - prevEnd);
    }

    return (
        <>
            <ActivityCard.Separator
                addButton={addButtonAdd}
                onPress={() => this.onAddActivityFromActivity(prevActivity)}
                additionalText={additonalText}
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
    let additonalText = '';

    const finder = x => x !== null && x.startTime === leadingItem.startTime;
    const index = currActivities.findIndex(finder);

    const prevActivity = currActivities[index];
    const nextActivity = currActivities[index + 1];
    if (!!prevActivity && !!nextActivity) {
        const prevEnd = prevActivity.startTime + prevActivity.duration * 60;
        const nextStart = nextActivity.startTime;
        addButtonAdd = nextStart !== prevEnd;
        if (addButtonAdd) {
            additonalText = createSeparatorText(nextStart - prevEnd);
        }
    }

    return (
        <ActivityCard.Separator
            addButton={addButtonAdd}
            onPress={() => this.onAddActivityFromActivity(leadingItem)}
            additionalText={additonalText}
        />
    );
}

/**
 * Prepare the string to dislpay in the separator from a hour and min number 
 * @param {number} deltaTime In seconds
 * @returns {string}
 */
function createSeparatorText(deltaTime) {
    const lang = langManager.curr['calendar'];

    const deltaTimeMinutes = deltaTime / 60;
    const hourDiff = Math.floor(deltaTimeMinutes / 60);
    const minuteDiff = deltaTimeMinutes % 60;

    let separatorText = '';
    if (hourDiff === 0 && minuteDiff === 0) {
        separatorText = lang['between-activity-hour'].replace('{}', '24');
        separatorText = ParsePlural(separatorText, true);
    }
    else if (hourDiff === 0) {
        const text = lang['between-activity-min'].replace('{}', minuteDiff.toString());
        separatorText = ParsePlural(text, minuteDiff > 1);
    }
    else if (minuteDiff === 0) {
        const text = lang['between-activity-hour'].replace('{}', hourDiff.toString());
        separatorText = ParsePlural(text, hourDiff > 1);
    }
    else {
        separatorText = lang['between-activity'];
        separatorText = separatorText.replace('{}', hourDiff.toString());
        separatorText = separatorText.replace('{}', minuteDiff.toString());
    }

    return separatorText;
}

export {
    cardHeader,
    cardItem,
    cardFooter,
    cardSeparator
};
