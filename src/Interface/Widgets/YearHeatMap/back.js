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

const WEEKS = 52;
const DAYS_PER_WEEK = 7;
const LEVELS = 7;

class YearHeatMapBack extends React.Component {
    state = {
        /** @type {boolean} */
        switchValue: false,

        /** @type TO DEFINE WITH @GEREM */
        dataToDisplay: [],

        /** @type {number} */
        gridSize: 5
    }

    saveTimeout = null;

    componentDidMount() {
        this.compute();

        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.compute();
        });
    }

    componentWillUnmount() {
        clearTimeout(this.saveTimeout)
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    /**
     * Compute and prepare the data for the heat map 
     */
    compute = () => {

        let value = user.settings.questHeatMap;
        let dataToDisplay = [];
        const gridSize = value ? 10 : 5;

        if (value) {
            // Data with 52 cells, one for each week
            dataToDisplay = new Array(WEEKS).fill(null).map(() => Math.floor(Math.random() * LEVELS));
        }
        else {
            // Data with 52 * 7 cells, one for each day of the year (assuming 7 days per week)
            dataToDisplay = new Array(WEEKS * DAYS_PER_WEEK).fill(null).map(() => Math.floor(Math.random() * LEVELS));
        }

        this.setState({
            dataToDisplay,
            gridSize,
            switchValue: value,
        });
    }

    /** @param {boolean} value */
    changeSwitchValue = (value) => {
        // Save the settings (avoid spamming the save)
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            user.settings.Save();
        }, 3 * 1000);

        user.settings.questHeatMap = value;
        this.compute();
    }

}

YearHeatMapBack.prototype.props = InputProps;
YearHeatMapBack.defaultProps = InputProps;

export default YearHeatMapBack;
