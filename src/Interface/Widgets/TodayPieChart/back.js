import * as React from 'react';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';

import { GetTime } from 'Utils/Time';

/** 
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
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
};

class TodayPieChartBack extends React.Component {
    state = {
        dataToDisplay: [],

        /** @type {FocusedActivity | null} */
        focusedActivity: null
    }

    /** @type {UpdatingData[]} */
    updatingData = [];

    constructor(props) {
        super(props);
        this.state = { ...this.state, ...this.computeData(false) };
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
        this.updatingData = this.initCategoriesArray();
        this.addCategoriesName();
        this.computeTimeEachCategory();

        const focusedActivity = this.findBiggestActivity();

        if (focusedActivity && focusedActivity.id !== 0) {
            this.updatingData.find(item => item.id === focusedActivity.id).focused = true;
        }
        this.computeGradientShadow();

        const newState = {
            dataToDisplay: this.updatingData,
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
