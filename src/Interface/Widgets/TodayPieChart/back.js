import * as React from 'react';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { AddActivity } from 'Interface/Widgets';
import { GetLocalTime } from 'Utils/Time';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {import('Interface/Components/PieChart/back').FocusedActivity} FocusedActivity
 *
 * @typedef {object} UpdatingData
 * @property {number} id
 * @property {number} value
 * @property {string} name
 * @property {number} valueMinutes
 * @property {string} color
 * @property {string} gradientCenterColor
 *
 * @typedef {object} InputPropsType
 * @property {StyleProp} style
 */

const InputProps = {
    /** @type {StyleProp} */
    style: {}
};

class TodayPieChartBack extends React.Component {
    state = {
        /** @type {UpdatingData[]} */
        dataToDisplay: [],

        /** @type {UpdatingData[]} */
        dataToDisplayFullDay: [],

        /** @type {FocusedActivity | null} */
        focusedActivity: null,

        /** @type {FocusedActivity | null} */
        focusedActivityFullDay: null,

        layoutWidth: 0
    };

    /** @type {Symbol | null} */
    activitiesListener = null;

    /** @param {InputPropsType} props */
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            ...this.computeData(false)
        };
    }

    componentDidMount() {
        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.computeData();
        });
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    /**
     * @param {boolean} [setState=true] If true, call setState to update the component
     */
    computeData = (setState = true) => {
        const updatingData = this.initCategoriesArray();
        this.computeTimeEachCategory(updatingData);

        const totalTime = this.computeTotalTime(updatingData);
        this.convertTimeToPercent(updatingData, totalTime);

        // updatingDataFullDay
        const lang = langManager.curr['home'];
        const updatingDataFullDay = [...updatingData];

        const pourcent = this.convertTimeToPercent(updatingDataFullDay, 24 * 60);
        updatingDataFullDay.push({
            id: 0,
            value: 100 - pourcent,
            valueMinutes: updatingData.reduce((acc, cur) => acc + cur.valueMinutes, 0),
            name: lang['chart-total-text'],
            color: '#130f40',
            gradientCenterColor: '#130f40'
        });

        // Find the biggest activity
        const focusedActivity = this.findBiggestActivity(updatingData);
        const focusedActivityFullDay = this.findBiggestActivity(updatingDataFullDay);

        // Update the state and return the new state
        const newState = {
            dataToDisplay: updatingData,
            dataToDisplayFullDay: updatingDataFullDay,
            focusedActivity: focusedActivity,
            focusedActivityFullDay: focusedActivityFullDay
        };

        if (setState) {
            this.setState(newState);
        }

        return newState;
    };

    /**
     * Create and return the init object needed because fuckin reference WON'T WORK
     * @returns {UpdatingData[]}
     */
    initCategoriesArray = () => {
        const allCategories = dataManager.skills.categories;
        /** @type {UpdatingData[]} */
        let baseData = [];

        for (let i = 1; i < allCategories.length; i++) {
            /** @type {UpdatingData} */
            const newData = {
                id: allCategories[i].ID,
                value: 0,
                valueMinutes: 0,
                name: '',
                color: '#000000',
                gradientCenterColor: '#000000'
            };

            const category = dataManager.skills.GetCategoryByID(allCategories[i].ID);
            if (category === null) {
                user.interface.console?.AddLog('error', 'Error in PieChartHome: category not found');
            } else if (category.Name) {
                newData.name = langManager.GetText(category.Name);
                newData.color = category.Color;
                newData.gradientCenterColor = themeManager.ShadeColor(category.Color, -30);
            }

            baseData.push(newData);
        }

        return baseData;
    };

    /**
     * Compute the time spent in each category and update the state
     * @param {UpdatingData[]} updatingData
     */
    computeTimeEachCategory = (updatingData) => {
        const allActivitiesOfToday = user.activities.GetByTime(GetLocalTime());
        for (const activity of allActivitiesOfToday) {
            const category = dataManager.skills.GetByID(activity.skillID);
            if (category === null) {
                user.interface.console?.AddLog(
                    'error',
                    'Error in PieChartHome: category not found in dataManager.skills'
                );
                continue;
            }

            const index = updatingData.findIndex((item) => item.id === category.CategoryID);
            if (index === -1) {
                user.interface.console?.AddLog(
                    'error',
                    'Error in PieChartHome: categoryID not found in state.updatingData'
                );
                continue;
            }

            updatingData[index].valueMinutes += activity.duration;
        }
    };

    /**
     * Find the biggest activity and update the state
     * @param {UpdatingData[]} updatingData
     * @return {FocusedActivity | null}
     */
    findBiggestActivity = (updatingData) => {
        let maxValue = 0;

        /** @type {FocusedActivity | null} */
        let selected = null;

        for (const data of updatingData) {
            if (data.value > maxValue) {
                maxValue = data.value;
                selected = {
                    id: data.id,
                    name: data.name,
                    value: data.value
                };
            }
        }

        return selected;
    };

    /**
     * Compute the time in minutes spent in total in the day
     * @param {UpdatingData[]} updatingData
     * @return {number} In minutes
     */
    computeTotalTime = (updatingData) => {
        return updatingData.map((item) => item.valueMinutes).reduce((acc, cur) => acc + cur, 0);
    };

    /**
     * Convert the time in minutes to a percent of the day
     * @param {UpdatingData[]} updatingData
     * @param {number} totalMinutes
     * @return {number}
     */
    convertTimeToPercent = (updatingData, totalMinutes) => {
        if (totalMinutes === 0) {
            return 0;
        }

        let totalPercent = 0;
        for (const item of updatingData) {
            if (item.id > 0 && item.id < 6) {
                item.value = Math.round((item.valueMinutes / totalMinutes) * 100);
                totalPercent += item.value;
            }
        }

        return totalPercent;
    };

    onAddActivityPress = () => {
        user.interface.bottomPanel?.Open({
            content: <AddActivity />
        });
    };

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        this.setState({ layoutWidth: event.nativeEvent.layout.width });
    };
}

TodayPieChartBack.prototype.props = InputProps;
TodayPieChartBack.defaultProps = InputProps;

export default TodayPieChartBack;
