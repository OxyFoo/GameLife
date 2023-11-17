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
 * @property {number} skillLogoID
 * @property {string} color
 * @property {number} width
 * @property {number} marginLeft
 * @property {string} logo
 * @property {string} logoColor
 */

const ActivityTimelineProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Activity[]} */
    activities: []
}

class ActivityTimelineBack extends React.Component {
    state = {
        activities: [],
        isScrolled: false
    }

    componentDidMount() {
        this.compute();
    }

    componentDidUpdate(prevProps) {
        if (this.props.activities !== prevProps.activities) {
            this.compute();
        }
    }

    compute() {
        let activities = this.prepareActivities();
        activities = this.prepareUIActivities(activities);

        this.setState({ activities });
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
                skillLogoID: skill.LogoID,
                color: category.Color,

                // Defined later
                width: 0,
                marginLeft: 0,
                logo: '',
                logoColor: ''
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

            activity.logo = dataManager.skills.GetXmlByLogoID(activity.skillLogoID);
            activity.logoColor = this.getComplementaryColor(activity.color);

            tempActivities.push(activity);
        }

        return tempActivities;
    }

    /**
     * To open or close the timeline
     * @param {boolean} thinMode
     */
    SetThinMode(thinMode) {
        if (thinMode && !this.state.isScrolled) {
            this.setState({ isScrolled: true });
        }
        else if (!thinMode && this.state.isScrolled) {
            this.setState({ isScrolled: false });
        }
    }

    /**
     * Returns the complementary color of the given hex color
     * @param {string} hex 
     * @returns {string} hex color
     */
    getComplementaryColor(hex) {
        // Remove the '#' if it's there
        hex = hex.replace('#', '');

        // Convert hex to RGB
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        // Find the complementary colors by subtracting each RGB component from 255
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;

        // Convert the RGB values back to hex
        let rHex = r.toString(16).padStart(2, '0');
        let gHex = g.toString(16).padStart(2, '0');
        let bHex = b.toString(16).padStart(2, '0');

        // Return the formatted hex color
        return `#${rHex}${gHex}${bHex}`;
    }
}

ActivityTimelineBack.prototype.props = ActivityTimelineProps;
ActivityTimelineBack.defaultProps = ActivityTimelineProps;

export default ActivityTimelineBack;