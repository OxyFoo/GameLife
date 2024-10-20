import * as React from 'react';

import dataManager from 'Managers/DataManager';

import { GetDate } from 'Utils/Time';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {import('Data/User/Activities/index').Activity} Activity
 *
 * @typedef {object} ActivityTimelineItem
 * @property {number} startTime
 * @property {number} duration
 * @property {string} color
 * @property {number} width
 * @property {number} marginLeft
 * @property {boolean} hasPreviousAdjacentActivity
 * @property {boolean} hasNextAdjacentActivity
 *
 * @typedef {object} ActivityTimelinePropsType
 * @property {StyleProp} style
 * @property {number | null} day Day in month of the timeline (default day is startTime of the first activity)
 * @property {Activity[]} activities
 */

const SECONDS_IN_DAY = 24 * 60 * 60;

/** @type {ActivityTimelinePropsType} */
const ActivityTimelineProps = {
    style: {},
    day: null,
    activities: []
};

class ActivityTimelineBack extends React.Component {
    state = {
        activities: [],
        timelineWidth: 0
    };

    /** @param {ActivityTimelinePropsType} prevProps */
    componentDidUpdate(prevProps) {
        // Before the first render
        if (this.state.timelineWidth === 0) {
            return;
        }

        // Activities list has changed
        const oldActivities = JSON.stringify(prevProps.activities);
        const newActivities = JSON.stringify(this.props.activities);
        if (oldActivities !== newActivities) {
            this.setState({ activities: this.prepareActivities() });
        }
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { width } = event.nativeEvent.layout;

        if (this.state.timelineWidth === width) {
            return;
        }

        this.setState({
            activities: this.prepareActivities(width),
            timelineWidth: width
        });
    };

    /** @returns {ActivityTimelineItem[]} */
    prepareActivities(timelineWidth = this.state.timelineWidth) {
        if (timelineWidth === 0 || this.props.activities.length === 0) {
            return [];
        }

        // Select day or use the first activity's day
        const day = this.props.day || GetDate(this.props.activities[0].startTime).getUTCDate();

        /** @type {ActivityTimelineItem[]} */
        const activities = [];
        let lastWidth = 0;

        for (let a = 0; a < this.props.activities.length; a++) {
            const activity = this.props.activities[a];
            const skill = dataManager.skills.GetByID(activity.skillID);
            if (skill === null) continue;

            const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
            if (category === null) continue;

            const startTime = activity.startTime + activity.timezone * 3600;
            const startDate = GetDate(startTime);

            // Define activity start time and duration
            let startUtcTime = startTime % SECONDS_IN_DAY;
            let duration = activity.duration * 60;

            // Adjust activity start and end time to fit the current day
            const endTime = startTime + duration;
            const endDate = GetDate(endTime);
            if (startDate.getUTCDate() !== day && (startDate.getUTCHours() > 0 || startDate.getUTCMinutes() > 0)) {
                const delta = SECONDS_IN_DAY - startUtcTime;
                startUtcTime += delta;
                duration -= delta;
            } else if (endDate.getUTCDate() !== day && (endDate.getUTCHours() > 0 || endDate.getUTCMinutes() > 0)) {
                const delta = endTime % SECONDS_IN_DAY;
                duration -= delta;
            }

            // Calculate activity position on the timeline
            const marginLeftScreen = ((startUtcTime % SECONDS_IN_DAY) / SECONDS_IN_DAY) * timelineWidth;
            const activityWidth = (duration / SECONDS_IN_DAY) * timelineWidth;

            activities.push({
                startTime: startUtcTime,
                duration: activity.duration,
                color: category.Color,
                width: activityWidth,
                marginLeft: marginLeftScreen - lastWidth,
                hasPreviousAdjacentActivity:
                    a > 0 &&
                    this.props.activities[a - 1].startTime + this.props.activities[a - 1].duration * 60 >=
                        activity.startTime,
                hasNextAdjacentActivity:
                    a < this.props.activities.length - 1 &&
                    activity.startTime + activity.duration * 60 >= this.props.activities[a + 1].startTime
            });
            lastWidth = marginLeftScreen + activityWidth;
        }

        return activities;
    }
}

ActivityTimelineBack.prototype.props = ActivityTimelineProps;
ActivityTimelineBack.defaultProps = ActivityTimelineProps;

export default ActivityTimelineBack;
