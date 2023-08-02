import * as React from 'react';

import { ActivityCard } from 'Interface/Widgets';
import { GetDate } from 'Utils/Time';

/**
 * @typedef {import('./back').default} BackCalendar
 * @typedef {import('Class/Activities').Activity} Activity
 */

/**
 * @this BackCalendar
 */
function cardHeader() {
    const { currActivities } = this.state;

    let addButtonAdd = true;

    if (currActivities.length > 1) {
        const prevActivity = currActivities[0];
        const nextActivity = currActivities[1];
        if (!!prevActivity && !!nextActivity) {
            const prevEnd = prevActivity.startTime + prevActivity.duration * 60;
            const nextStart = nextActivity.startTime;
            addButtonAdd = nextStart !== prevEnd;
        }
    }

    return (
        <>
            <ActivityCard
                type={'start'}
                index={0}
            />
            <ActivityCard.Separator
                addButton={addButtonAdd}
                onPress={this.onAddActivity}
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

    let addButtonAdd = false;
    const prevActivity = currActivities[currActivities.length - 1]
    if (currActivities.length > 0) {
        const prevEnd = prevActivity.startTime + prevActivity.duration * 60;
        addButtonAdd = GetDate(prevEnd).getHours() !== 0;
    }
    return (
        <>
            {currActivities.length > 0 && (
                <ActivityCard.Separator
                    addButton={addButtonAdd}
                    onPress={this.onAddActivity}
                />
            )}
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
            onPress={this.onAddActivity}
        />
    );
}

export {
    cardHeader,
    cardItem,
    cardFooter,
    cardSeparator
};