import * as React from 'react';

import user from 'Managers/UserManager';
import { GetTime } from 'Utils/Time';
import dataManager from 'Managers/DataManager';

class PieChartBack extends React.Component {

    state = {
        readyData: [],
        focusedActivity: {},
        displayChart: false,
    }

    updatingData = [];

    compute() {
        console.log("COMPUTEEEEEEEEE")

        this.updatingData = this.initCategoriesArray();

        this.addCategoriesName();
        this.computeTimeEachCategory();
        const totalPercent = this.convertTimeToPercent();
        this.addUndefinedActivity(totalPercent);
        const biggestActivity = this.findBiggestActivity();
        this.computeGradientShadow();

        // find the item in this.updatingData with the same id as biggestActivity.id and create an item.focused to true
        this.updatingData.find(item => item.id === biggestActivity.id).focused = true;

        // a little check : 
        const focused = this.updatingData.find(item => item.focused === true);

        if (focused) {
            this.setState({ readyData: this.updatingData, displayChart: true, focusedActivity: biggestActivity })
        }
        else {
            console.log("It seems there is an issue with the creation of the pie chart")
        }

    }

    componentDidMount() {
        this.compute();

        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.compute();
        });
    }


    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }


    /**
     * Create and return the init object needed because fuckin reference WON'T WORK 
     * 
     * @returns {Object} 
     */
    initCategoriesArray = () => {
        const baseData = [
            { id: 1, valueMin: 0, color: '#7578D4' },
            { id: 2, valueMin: 0, color: '#FFB37A' },
            { id: 3, valueMin: 0, color: '#2690ff' },
            { id: 4, valueMin: 0, color: '#5bebc5' },
            { id: 5, valueMin: 0, color: '#FFD633' },
        ];
        return baseData;
    }


    /**
     * Add the name of the categories to the updatingData in the good language
     * 
     * @return {void} BUUUUT update the state
     */
    addCategoriesName = () => {
        for (let i = 0; i < this.updatingData.length; i++) {
            const prout = this.updatingData[i].id;
            const caca = dataManager.skills.GetCategoryByID(prout);
            const pipi = caca.Name;
            this.updatingData[i].name = dataManager.GetText(pipi)
        }
    }

    /**
     * Compute the time spent in each category and update the state
     * 
     * @return {void} BUUUUT update the state
     */
    computeTimeEachCategory = () => {
        const allActivitiesOfToday = user.activities.GetByTime(GetTime(undefined, 'local'));
        for (let i = 0; i < allActivitiesOfToday.length; i++) {
            const acti = allActivitiesOfToday[i];
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
     * Convert the time in minutes to a percent of the day
     * 
     * @return {number}
     */
    convertTimeToPercent = () => {
        let totalPercent = 0;
        for (let i = 0; i < this.updatingData.length; i++) {
            let item = this.updatingData[i];
            if (item.id > 0 && item.id < 6) {
                item.value = Math.round(item.valueMin / 1440 * 100) || 0;
                totalPercent += item.value;
            }
        }
    
        return totalPercent;
    }
    

    /**
     * Either actualize the value of the "undefined" activity or create it
     * 
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
     * @return {Object} 
     */
    findBiggestActivity = () => {
        let maxActi = { id: 0, value: 0 };
        for (let i = 0; i < this.updatingData.length; i++) {
            let item = this.updatingData[i];
            if (item.value > maxActi.value) {
                maxActi.id = item.id;
                maxActi.value = item.value;
                maxActi.name = item.name;
            }
        }
        return maxActi;
    }

    /**
     * Gradient shadow chelou qui marchent pas de ouf sont calculés ici
     */
    computeGradientShadow = () => {
        for (let i = 0; i < this.updatingData.length; i++) {
            let item = this.updatingData[i];
            item.value = !isNaN(item.value) && typeof item.value === 'number' ? item.value : 0;
            item.gradientCenterColor = shadeColor(item.color, -20);
        }
    }


}

export default PieChartBack;


// Je vais peut etre bouger ces functions autre part ? 
// mais la plupart servent seulement pour ce composant la 
// Marche pas trop mais y'a de l'idée 
function shadeColor(color, percent) {
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