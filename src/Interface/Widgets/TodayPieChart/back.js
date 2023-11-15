import * as React from 'react';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';

import { GetTime } from 'Utils/Time';

/** 
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Interface/Components/PieChart').ItemBase} ItemBase
 * @typedef {import('Interface/Components/PieChart').Item} Item
 */

const InputProps = {
    /** @type {StyleProp} */
    style: {},
}

class TodayPieChartBack extends React.Component {

    state = {
        switchValue: user.settings.homePieChart,

        dataToDisplay: [],
        focusedActivity: {},
        totalTime: 0,
    }

    updatingData = [];

    changeSwitchValue = (value) => {
        this.setState({ switchValue: value });
        user.settings.homePieChart = value;
        user.settings.Save();
        this.compute(value);
    }

    /**
     * Compute and prepare the data for the pie chart
     * 
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

        if (focusedActivity.id !== 0) {
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

        //console.log("this.updatingData", this.updatingData);
    }

    /**
     * Prepare the datas for the pie chart before it's mounted 
     */
    componentDidMount() {
        this.compute(user.settings.homePieChart);

        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.compute(user.settings.homePieChart);
        });
    }

    /**
     * Delete the listener when the component is unmounted
     */
    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    /**
     * Create and return the init object needed because fuckin reference WON'T WORK 
     * 
     * @returns {{ id: number; valueMin: number; }[]}
     */
    initCategoriesArray = () => {
        const allCategories = dataManager.skills.categories
        let baseData = []
        for (let i = 1; i < allCategories.length; i++) {
            baseData.push({ id: allCategories[i].ID, valueMin: 0 })
        }
        return baseData;
    }


    /**
     * Add the name of the categories to the updatingData in the good language
     * 
     * @return {void} BUUUUT update the state
     */
    addCategoriesName = () => {
        for (const element of this.updatingData) {
            const categoryID = dataManager.skills.GetCategoryByID(element.id);
            const categoryName = categoryID.Name;
            if (categoryName) {
                element.name = dataManager.GetText(categoryName);
                element.color = categoryID.Color;
            }
            else {
                element.name = "";
                element.color = "black";
            }
        }
    }

    /**
     * Compute the time spent in each category and update the state
     * 
     * @return {void} BUUUUT update the state
     */
    computeTimeEachCategory = () => {
        const allActivitiesOfToday = user.activities.GetByTime(GetTime(undefined, 'local'));
        for (const element of allActivitiesOfToday) {
            const acti = element;
            const categoryID = dataManager.skills.GetByID(acti.skillID).CategoryID;
            const index = this.updatingData.findIndex(item => item.id === categoryID);
            if (index !== -1) {
                this.updatingData[index].valueMin += acti.duration;
            }
            else {
                console.log("Error in PieChartHome: categoryID not found in state.updatingData");
                console.log("Details: acti =", acti, "categoryID =", categoryID);
            }
        }
    };

    /**
     * Compute the time in minutes spent in total in the day 
     * 
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
     * 
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
     * 
     * @param {number} totalPercent
     * @return {void} BUUUUT update the state
     */
    addUndefinedActivity = (totalPercent) => {
        if (totalPercent < 100) {
            const index = this.updatingData.findIndex(item => item.id === 6);
            if (index !== -1) {
                this.updatingData[index].value = 100 - totalPercent;
            }
            else {
                this.updatingData.push({
                    valueMin: 0,
                    color: '#B0B0B0',
                    name: "Non défini",
                    id: 6,
                    value: 100 - totalPercent,
                });
            }
        }
    }

    /**
     * Find the biggest activity and update the state
     * 
     * @return {{id: number, value: number, name: string} | null} 
     */
    findBiggestActivity = () => {
        let maxValue = -1;
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