import * as React from 'react';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';

import { GetTime } from 'Utils/Time';

/** 
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Interface/Components/PieChart').Item} Item
 * @typedef {import('Interface/Components/PieChart').FocusedActivity} FocusedActivity
 * 
 * @typedef {object} UpdatingData
 * @property {number} id
 * @property {string} name
 * @property {number} value
 * @property {number} valueMin
 * @property {string} color
 * @property {string} gradientCenterColor
 * @property {boolean} focused
 */

const InputProps = {
    /** @type {StyleProp} */
    style: {}
}

class TodayPieChartBack extends React.Component {
    state = {
        /** @type {boolean} */
        switchValue: user.settings.homePieChart,

        dataToDisplay: [],

        /** @type {FocusedActivity|null} */
        focusedActivity: null,

        /** @type {number} */
        totalTime: 0
    }

    /** @type {UpdatingData[]} */
    updatingData = [];

    saveTimeout = null; 
    hasStateChanged = false ;

    /** @param {boolean} value */
    changeSwitchValue = (value) => {
        this.setState({ switchValue: value });
        this.compute(value);
    }

    /**
     * Compute and prepare the data for the pie chart
     * @param {boolean} value 
     */
    compute = (value) => {
        // Compute the data depending on the switch value
        this.updatingData = this.initCategoriesArray();
        this.addCategoriesName();
        this.computeTimeEachCategory();
        let totalTime = 0;
        if (value) {
            const totalPercent = this.convertTimeToPercent(1440);
            this.addUndefinedActivity(totalPercent);
        }
        else {
            totalTime = this.computeTotalTime();
            this.convertTimeToPercent(totalTime);
        }
        const focusedActivity = this.findBiggestActivity();

        if (focusedActivity && focusedActivity.id !== 0) {
            this.updatingData.find(item => item.id === focusedActivity.id).focused = true;
        }
        this.computeGradientShadow();

        // Focused and display handler
        this.setState({
            dataToDisplay: this.updatingData,
            focusedActivity: focusedActivity,
            switchValue: value,
            totalTime: (totalTime / 60.0).toFixed(1),
        });
    }

    componentDidMount() {
        this.compute(user.settings.homePieChart);

        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.compute(user.settings.homePieChart);
        });
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
        if (this.saveTimeout) clearTimeout(this.saveTimeout);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.switchValue !== this.state.switchValue) {
            if (this.saveTimeout) clearTimeout(this.saveTimeout);

            this.hasStateChanged = true ;

            this.saveTimeout = setTimeout(this.checkForChangesAndSave, 3 * 1000); // X seconds, change 10000 to your desired time in milliseconds
        }
    }

    /**
     * Check if the state has changed and save it if it has
     */
    checkForChangesAndSave = () => {
        if (this.hasStateChanged) {
            this.hasStateChanged = false ;

            user.settings.homePieChart = this.state.switchValue;
            user.settings.Save();
        }
    };

    /**
     * Create and return the init object needed because fuckin reference WON'T WORK 
     * @returns {UpdatingData[]}
     */
    initCategoriesArray = () => {
        const allCategories = dataManager.skills.categories;
        /** @type {UpdatingData[]} */
        let baseData = []

        for (let i = 1; i < allCategories.length; i++) {
            baseData.push({
                id: allCategories[i].ID,
                value: 0,
                valueMin: 0,
                name: '',
                color: '#000000',
                gradientCenterColor: '#000000',
                focused: false
            });
        }

        return baseData;
    }

    /**
     * Add the name of the categories to the updatingData in the good language
     * @return {void}
     */
    addCategoriesName = () => {
        for (const element of this.updatingData) {
            const category = dataManager.skills.GetCategoryByID(element.id);
            if (category === null) {
                user.interface.console.AddLog('error', 'Error in PieChartHome: category not found');
                continue;
            }

            const categoryName = category.Name;
            if (categoryName) {
                element.name = dataManager.GetText(categoryName);
                element.color = category.Color;
            } else {
                element.name = '';
                element.color = 'black';
            }
        }
    }

    /**
     * Compute the time spent in each category and update the state
     * @return {void}
     */
    computeTimeEachCategory = () => {
        const allActivitiesOfToday = user.activities.GetByTime(GetTime(undefined, 'local'));
        for (const activity of allActivitiesOfToday) {
            const category = dataManager.skills.GetByID(activity.skillID);
            if (category === null) {
                user.interface.console.AddLog('error', 'Error in PieChartHome: category not found in dataManager.skills');
                continue;
            }

            const index = this.updatingData.findIndex(item => item.id === category.CategoryID);
            if (index === -1) {
                user.interface.console.AddLog('error', 'Error in PieChartHome: categoryID not found in state.updatingData');
                continue;
            }

            this.updatingData[index].valueMin += activity.duration;
        }
    };

    /**
     * Compute the time in minutes spent in total in the day 
     * @return {number}
     */
    computeTotalTime = () => {
        let totalMin = 0;
        for (const element of this.updatingData) {
            let item = element;
            totalMin += item.valueMin;
        }
        return totalMin;
    }

    /**
     * Convert the time in minutes to a percent of the day
     * @param {number} totalMin
     * @return {number}
     */
    convertTimeToPercent = (totalMin) => {
        let totalPercent = 0;
        for (const element of this.updatingData) {
            let item = element;
            if (item.id > 0 && item.id < 6) {
                item.value = Math.round(item.valueMin / totalMin * 100) || 0;
                totalPercent += item.value;
            }
        }
        return totalPercent;
    }

    /**
     * Either actualize the value of the "undefined" activity or create it
     * @param {number} totalPercent
     * @return {void}
     */
    addUndefinedActivity = (totalPercent) => {
        if (totalPercent < 100) {
            const index = this.updatingData.findIndex(item => item.id === 6);
            if (index !== -1) {
                this.updatingData[index].value = 100 - totalPercent;
            }
            else {
                this.updatingData.push({
                    id: 6,
                    name: 'Non défini',
                    value: 100 - totalPercent,
                    valueMin: 0,
                    color: '#B0B0B0',
                    gradientCenterColor: '#000000',
                    focused: false
                });
            }
        }
    }

    /**
     * Find the biggest activity and update the state
     * @return {{id: number, value: number, name: string} | null} 
     */
    findBiggestActivity = () => {
        let maxValue = 0;
        let maxIndex = null;
        for (const i in this.updatingData) {
            const itemValue = this.updatingData[i].value;
            if (itemValue > maxValue) {
                maxValue = itemValue;
                maxIndex = i;
            }
        }
        return maxIndex === null ? null : this.updatingData[maxIndex];
    }

    /**
     * Gradient shadow chelou qui marchent pas de ouf sont calculés ici
     */
    computeGradientShadow = () => {
        for (const element of this.updatingData) {
            let item = element;
            item.value = !isNaN(item.value) && typeof item.value === 'number' ? item.value : 0;
            item.gradientCenterColor = this.shadeColor(item.color, -20);
        }
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