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
};

class YearHeatMapBack extends React.Component {
    state = {
        /** @type {boolean} */
        switchValue: false,

        dataToDisplay: [],

        /** @type {number} */
        gridSize: 5
    }

    WEEKS = 52;
    DAYS_PER_WEEK = 7;
    LEVELS = 7;

    saveTimeout = null;

    componentDidMount() {
        this.compute(user.settings.questHeatMap);

        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.compute(user.settings.questHeatMap);
        });
    }

    componentWillUnmount() {
        clearTimeout
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    /**
     * Compute and prepare the data for the heat map 
     * @param {boolean} value 
     */
    compute = (value) => {

        let dataToDisplay = [];
        let gridSize = 10;

        if (value) {
            // Data with 52 cells, one for each week
            dataToDisplay = new Array(this.WEEKS).fill(null).map(() => Math.floor(Math.random() * this.LEVELS));
        }
        else {
            // Data with 52 * 7 cells, one for each day of the year (assuming 7 days per week)
            dataToDisplay = new Array(this.WEEKS * this.DAYS_PER_WEEK).fill(null).map(() => Math.floor(Math.random() * this.LEVELS));
            gridSize = 5; 
        }

        this.setState({ dataToDisplay, gridSize });
    }

    /** @param {boolean} value */
    changeSwitchValue = (value) => {
        // Save the settings (avoid spamming the save)
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            user.settings.Save();
        }, 3 * 1000);

        user.settings.questHeatMap = value;
        this.setState({ switchValue: value });
        this.compute(value);
    }

}

YearHeatMapBack.prototype.props = InputProps;
YearHeatMapBack.defaultProps = InputProps;

export default YearHeatMapBack;
