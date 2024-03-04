import * as React from 'react';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { GetLocalTime } from 'Utils/Time';
import { SpringAnimation } from 'Utils/Animations';

/** 
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Interface/Components/PieChart/back').FocusedActivity} FocusedActivity
 * 
 * @typedef {object} UpdatingData
 * @property {number} id
 * @property {string} name
 * @property {number} value
 * @property {number} valueMinutes
 * @property {string} color
 * @property {string} gradientCenterColor
 * @property {boolean} focused
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

        switched: user.informations.switchHomeTodayPieChart,
        layoutWidth: 0
    }

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
        const updatingDataFullDay = [ ...updatingData ];
        const pourcent = this.convertTimeToPercent(updatingDataFullDay, 24 * 60);
        updatingDataFullDay.push({
            id: 0,
            value: 100 - pourcent,
            valueMinutes: 0,
            name: 'Total',
            color: '#130f40',
            gradientCenterColor: '#130f40',
            focused: false
        });


        // Find the biggest activity
        const focusedActivity = this.findBiggestActivity(updatingData);
        if (focusedActivity && focusedActivity.id !== 0) {
            updatingData.find(item => item.id === focusedActivity.id).focused = true;
        }

        // Compute Gradient Shadow
        for (const element of updatingData) {
            element.gradientCenterColor = this.shadeColor(element.color, -20);
        }
        for (const element of updatingDataFullDay) {
            element.gradientCenterColor = this.shadeColor(element.color, -20);
        }

        // Update the state and return the new state
        const newState = {
            dataToDisplay: updatingData,
            dataToDisplayFullDay: updatingDataFullDay,
            focusedActivity: focusedActivity
        };

        if (setState) {
            this.setState(newState);
        }

        return newState;
    }

    /**
     * Create and return the init object needed because fuckin reference WON'T WORK 
     * @returns {UpdatingData[]}
     */
    initCategoriesArray = () => {
        const allCategories = dataManager.skills.categories;
        /** @type {UpdatingData[]} */
        let baseData = []

        for (let i = 1; i < allCategories.length; i++) {
            /** @type {UpdatingData} */
            const newData = {
                id: allCategories[i].ID,
                value: 0,
                valueMinutes: 0,
                name: '',
                color: '#000000',
                gradientCenterColor: '#000000',
                focused: false
            };

            const category = dataManager.skills.GetCategoryByID(allCategories[i].ID);
            if (category === null) {
                user.interface.console.AddLog('error', 'Error in PieChartHome: category not found');
            } else if (category.Name) {
                newData.name = langManager.GetText(category.Name);
                newData.color = category.Color;
            }

            baseData.push(newData);
        }

        return baseData;
    }

    /**
     * Compute the time spent in each category and update the state
     * @param {UpdatingData[]} updatingData
     */
    computeTimeEachCategory = (updatingData) => {
        const allActivitiesOfToday = user.activities.GetByTime(GetLocalTime());
        for (const activity of allActivitiesOfToday) {
            const category = dataManager.skills.GetByID(activity.skillID);
            if (category === null) {
                user.interface.console.AddLog('error', 'Error in PieChartHome: category not found in dataManager.skills');
                continue;
            }

            const index = updatingData.findIndex(item => item.id === category.CategoryID);
            if (index === -1) {
                user.interface.console.AddLog('error', 'Error in PieChartHome: categoryID not found in state.updatingData');
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
    }

    /**
     * Compute the time in minutes spent in total in the day 
     * @param {UpdatingData[]} updatingData
     * @return {number} In minutes
     */
    computeTotalTime = (updatingData) => {
        let totalMin = 0;
        for (const element of updatingData) {
            let item = element;
            totalMin += item.valueMinutes;
        }
        return totalMin;
    }

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
                item.value = Math.round(item.valueMinutes / totalMinutes * 100);
                totalPercent += item.value;
            }
        }

        return totalPercent;
    }

    onPress = () => {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            user.informations.switchHomeTodayPieChart = this.state.switched;
            user.LocalSave();
        }, 3000);

        SpringAnimation(this.state.animSwitch, this.state.switched ? 0 : 1);
        this.setState({ switched: !this.state.switched });
    }

    onLayout = (event) => {
        this.setState({ layoutWidth: event.nativeEvent.layout.width });
    }

    // Je vais peut etre bouger cette function autre part ? 
    // Marche pas trop mais y'a de l'idée 
    shadeColor(color, percent) {
        let R = parseInt(color.substring(1, 3), 16);
        let G = parseInt(color.substring(3, 5), 16);
        let B = parseInt(color.substring(5, 7), 16);

        R = Math.round(R * (1 + percent / 100));
        G = Math.round(G * (1 + percent / 100));
        B = Math.round(B * (1 + percent / 100));

        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;

        const RR = (R.toString(16).length === 1) ? `0${R.toString(16)}` : R.toString(16);
        const GG = (G.toString(16).length === 1) ? `0${G.toString(16)}` : G.toString(16);
        const BB = (B.toString(16).length === 1) ? `0${B.toString(16)}` : B.toString(16);

        return `#${RR}${GG}${BB}`;
    }
}

TodayPieChartBack.prototype.props = InputProps;
TodayPieChartBack.defaultProps = InputProps;

export default TodayPieChartBack;
