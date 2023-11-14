import * as React from 'react';

import { GetDate, GetTime, GetTimeZone } from 'Utils/Time';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';



/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Class/Activities').Activity} Activity
 */

const InputProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Activity[]} */
    activities: [],

    /** @type {null} */
    isScrolled: null,
}

class CalVisualisationBack extends React.Component {

    state = {
        activities: []
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.activities !== prevProps.activities) {

            let tempActivities = [];

            for (const activity of this.props.activities) {
                const CategoryID = dataManager.skills.GetByID(activity.skillID).CategoryID;
                const color = dataManager.skills.GetCategoryByID(CategoryID).Color;

                const startDate = GetDate(activity.startTime + GetTimeZone() * 3600);
                const startUtcTime = startDate.getUTCHours() * 60 + startDate.getUTCMinutes(); 

                tempActivities.push({ color: color, startTime: startUtcTime, duration: activity.duration })
            }

            this.setState({ activities: tempActivities })
        }
    }
}

CalVisualisationBack.prototype.props = InputProps;
CalVisualisationBack.defaultProps = InputProps;

export default CalVisualisationBack;