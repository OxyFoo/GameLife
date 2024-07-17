import * as React from 'react';
import { Dimensions } from 'react-native';

import dataManager from 'Managers/DataManager';

import { GetDate, GetTimeZone } from 'Utils/Time';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Class/Activities').Activity} Activity
 *
 * @typedef {object} ActivityTimelineItem
 * @property {number} startTime
 * @property {number} duration
 * @property {string} color
 * @property {number} width
 * @property {number} marginLeft
 *
 * @typedef {object} ActivityTimelinePropsType
 * @property {StyleProp} style
 * @property {Activity[]} activities
 */

/** @type {ActivityTimelinePropsType} */
const ActivityTimelineProps = {
    style: {},
    activities: []
};

class ActivityTimelineBack extends React.Component {
    state = {
        activities: this.prepareUIActivities(this.prepareActivities())
    };

    isScrolled = false;

    /** @param {ActivityTimelinePropsType} prevProps */
    componentDidUpdate(prevProps) {
        if (this.props.activities !== prevProps.activities) {
            const preparedActivities = this.prepareActivities();
            this.setState({ activities: this.prepareUIActivities(preparedActivities) });
        }
    }

    /**
     * Prepare the activities array to be used with non UI data
     * @returns {ActivityTimelineItem[]}
     */
    prepareActivities() {
        /** @type {ActivityTimelineItem[]} */
        let tempActivities = [];

        for (const activity of this.props.activities) {
            const skill = dataManager.skills.GetByID(activity.skillID);
            if (skill === null) continue;

            const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
            if (category === null) continue;

            const startDate = GetDate(activity.startTime + GetTimeZone() * 3600);
            const startUtcTime = startDate.getUTCHours() * 60 + startDate.getUTCMinutes();

            tempActivities.push({
                startTime: startUtcTime,
                duration: activity.duration,
                color: category.Color,

                // Defined later
                width: 0,
                marginLeft: 0
            });
        }

        return tempActivities;
    }

    /**
     * Prepare the activities array to be used with UI data
     * @param {ActivityTimelineItem[]} activities
     * @returns {ActivityTimelineItem[]}
     */
    prepareUIActivities(activities) {
        // Assuming full screen width - 32 cause border radius is 16 both side and 2 gray borders are 1 each
        const screenWidth = Dimensions.get('window').width - 34;
        const totalMinutesInDay = 24 * 60;

        let lastWidth = 0;
        let tempActivities = [];
        for (const activity of activities) {
            const activityWidth = (activity.duration / totalMinutesInDay) * screenWidth;
            activity.width = activityWidth;

            const marginLeftScreen = (activity.startTime / totalMinutesInDay) * screenWidth;
            activity.marginLeft = marginLeftScreen - lastWidth;
            lastWidth = marginLeftScreen + activityWidth;

            tempActivities.push(activity);
        }

        return tempActivities;
    }
}

ActivityTimelineBack.prototype.props = ActivityTimelineProps;
ActivityTimelineBack.defaultProps = ActivityTimelineProps;

export default ActivityTimelineBack;
