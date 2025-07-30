import * as React from 'react';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { AddActivity } from 'Interface/Widgets';
import { GetLocalTime } from 'Utils/Time';
import { Sum } from 'Utils/Functions';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Interface/Widgets/PieChart/back').UpdatingData} UpdatingData
 * @typedef {import('Interface/Widgets/PieChart/back').FocusedActivity} FocusedActivity
 *
 * @typedef {object} InputPropsType
 * @property {StyleProp} style
 *
 * @typedef {object} InputStateType
 * @property {UpdatingData[]} dataToDisplay
 * @property {FocusedActivity | null} focusedActivity
 * @property {boolean} showDonut - True if the donut chart, false to show legends
 */

/** @type {InputPropsType} */
const InputProps = {
    style: {}
};

/** @extends {React.Component<InputPropsType, InputStateType>} */
class ActivitiesProgressChartBack extends React.Component {
    state = {
        dataToDisplay: /** @type {UpdatingData[]} */ ([]),
        focusedActivity: /** @type {FocusedActivity | null} */ (null),
        showDonut: true
    };

    /** @type {Symbol | null} */
    activitiesListener = null;

    /** @param {InputPropsType} props */
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            ...this.computeData()
        };
    }

    componentDidMount() {
        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            const newState = this.computeData();
            this.setState(newState);
        });
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    /** @returns {Pick<InputStateType, 'dataToDisplay' | 'focusedActivity'>} */
    computeData = () => {
        // Initialize the data array
        const dataToDisplay = this.initCategoriesArray();

        // Find the biggest activity
        const focusedActivity = this.findBiggestActivity(dataToDisplay);

        return {
            dataToDisplay,
            focusedActivity
        };
    };

    /**
     * Create and return the init object needed
     * @returns {UpdatingData[]}
     */
    initCategoriesArray = () => {
        const allCategories = dataManager.skills.categories;
        const allActivitiesOfToday = user.activities.GetByTime(GetLocalTime());
        const totalDurationOfToday = Sum(allActivitiesOfToday.map((a) => a.duration));

        /** @type {UpdatingData[]} */
        let data = [];

        for (let i = 1; i < allCategories.length; i++) {
            const category = allCategories[i];

            // Get activities that have their skill's category ID matching the current iteration index i
            const activities = allActivitiesOfToday.filter((activity) => {
                const skill = dataManager.skills.GetByID(activity.skillID);
                return skill !== null && skill.CategoryID === i;
            });

            const totalDuration = Sum(activities.map((a) => a.duration));

            /** @type {UpdatingData} */
            const newData = {
                id: category.ID,
                value: Math.round((totalDuration / totalDurationOfToday) * 100),
                valueMinutes: totalDuration,
                name: langManager.GetText(category.Name),
                color: category.Color,
                gradientCenterColor: themeManager.ShadeColor(category.Color, -30)
            };

            data.push(newData);
        }

        return data;
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

    onAddActivityPress = () => {
        user.interface.bottomPanel?.Open({
            content: <AddActivity />
        });
    };

    switchDonutLegends = () => {
        const prevState = this.state.showDonut;
        this.setState({ showDonut: !prevState });
    };
}

ActivitiesProgressChartBack.prototype.props = InputProps;
ActivitiesProgressChartBack.defaultProps = InputProps;

export default ActivitiesProgressChartBack;
