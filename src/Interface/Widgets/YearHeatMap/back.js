import * as React from 'react';

import user from 'Managers/UserManager';
import { DAY_TIME, GetTime, YEAR_TIME } from 'Utils/Time';

/** 
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 */

const YearHeatMapProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {MyQuest | null} */
    quest: null
};

const WEEKS = 52;
const DAYS_PER_WEEK = 7;
const LEVELS = 7;

class YearHeatMapBack extends React.Component {
    state = {
        /** @type {boolean} */
        switchWeekValue: true,

        /** @type {Array<number>} */
        dataToDisplay: [],

        /** @type {number} */
        gridSize: 5
    }

    saveTimeout = null;

    componentDidMount() {
        this.compute();
        this.activitiesListener = user.activities.allActivities.AddListener(this.compute);
    }

    componentWillUnmount() {
        clearTimeout(this.saveTimeout)
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    /**
     * Compute and prepare the data for the heat map
     * Call setState to update the component
     */
    compute = () => {
        const { quest } = this.props;

        if (!quest) {
            return;
        }

        let isWeekMode = user.settings.questHeatMap;
        let dataToDisplay = [];
        const gridSize = isWeekMode ? 5 : 10;

        const timeNow = GetTime();
        const timeYear = timeNow - timeNow % YEAR_TIME;
        const allActivitiesTime = user.activities.Get()
            .filter(activity => quest.skills.includes(activity.skillID))
            .filter(activity => user.activities.GetExperienceStatus(activity) === 'grant')
            .map(activity => ({
                start: activity.startTime + activity.timezone * 60 * 60,
                duration: activity.duration
            }));

        // Year by days: Data with 52 * 7 cells, one for each day of the year (assuming 7 days per week)
        if (isWeekMode) {
            for (let i = 0; i < WEEKS * DAYS_PER_WEEK; i++) {
                const timeDay = timeYear + i * DAY_TIME;
                const timeDayEnd = timeDay + DAY_TIME;

                const activities = allActivitiesTime.filter(activity => {
                    return activity.start >= timeDay && activity.start < timeDayEnd;
                });

                const totalDuration = activities.reduce((acc, activity) => {
                    return acc + activity.duration;
                }, 0);

                const level = totalDuration / quest.schedule.duration;
                dataToDisplay.push(Math.min(LEVELS, level * LEVELS));
            }
            dataToDisplay = dataToDisplay.reverse();
        }

        // Year by weeks: Data with 52 cells, one for each week
        else {
            for (let i = 0; i < WEEKS; i++) {
                const timeWeek = timeYear + i * DAY_TIME * DAYS_PER_WEEK;
                const timeWeekEnd = timeWeek + DAY_TIME * DAYS_PER_WEEK;

                const activities = allActivitiesTime.filter(activity => {
                    return activity.start >= timeWeek && activity.start < timeWeekEnd;
                });

                const totalDuration = activities.reduce((acc, activity) => {
                    return acc + activity.duration;
                }, 0);

                const level = totalDuration / (quest.schedule.duration * DAYS_PER_WEEK);
                dataToDisplay.push(Math.min(LEVELS, level * LEVELS));
            }
            dataToDisplay = dataToDisplay.reverse();
        }

        this.setState({
            dataToDisplay,
            gridSize,
            switchWeekValue: isWeekMode
        });
    }

    /** @param {boolean} isWeekMode */
    changeSwitchValue = (isWeekMode) => {
        // Save the settings (avoid spamming the save)
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            user.settings.Save();
        }, 3 * 1000);

        user.settings.questHeatMap = isWeekMode;
        this.compute();
    }
}

YearHeatMapBack.prototype.props = YearHeatMapProps;
YearHeatMapBack.defaultProps = YearHeatMapProps;

export default YearHeatMapBack;
