import * as React from 'react';

import user from 'Managers/UserManager';

import { MinMax } from 'Utils/Functions';
import { DAY_TIME, GetGlobalTime, GetYearTime } from 'Utils/Time';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 * @typedef {import('Interface/Components/HeatMap').HeatMapDataType} HeatMapDataType
 *
 * @typedef {Object} YearHeatMapPropsType
 * @property {StyleProp} style
 * @property {MyQuest | null} quest
 */

/** @type {YearHeatMapPropsType} */
const YearHeatMapProps = {
    style: {},
    quest: null
};

const WEEKS = 52;
const DAYS_PER_WEEK = 7;

class YearHeatMapBack extends React.Component {
    state = {
        switchMode: 0,

        /** @type {Array<HeatMapDataType>} */
        dataToDisplay: []
    };

    /** @type {NodeJS.Timeout | null} */
    saveTimeout = null;

    /** @type {Symbol | null} */
    activitiesListener = null;

    /** @param {YearHeatMapPropsType} props */
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            ...this.GetHeatMapData()
        };
    }

    componentDidMount() {
        this.GetHeatMapData();
        this.activitiesListener = user.activities.allActivities.AddListener(this.GetHeatMapData);
    }

    componentWillUnmount() {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    GetHeatMapData = () => {
        const { quest } = this.props;
        if (!quest) return {};

        const switchMode = user.settings.questHeatMapIndex;
        /** @type {Array<HeatMapDataType>} */
        const dataToDisplay = [];

        const timeGlobalStart = GetYearTime();
        const timeGlobalEnd = GetGlobalTime();

        const allActivitiesTime = user.activities
            .Get()
            .filter(
                (activity) =>
                    activity.startTime >= timeGlobalStart &&
                    activity.startTime < timeGlobalEnd &&
                    quest.skills.includes(activity.skillID) &&
                    user.activities.GetExperienceStatus(activity) === 'grant'
            )
            .map((activity) => ({
                start: activity.startTime,
                duration: activity.duration
            }));

        // Year by days: Data with 52 * 7 cells, one for each day of the year
        if (switchMode === 0) {
            for (let i = 0; i < WEEKS * DAYS_PER_WEEK; i++) {
                const timeDay = timeGlobalStart + i * DAY_TIME;
                const timeDayEnd = timeDay + DAY_TIME;

                // If after today, push -1
                if (timeDay > timeGlobalEnd) {
                    dataToDisplay.push({
                        level: -1,
                        backgroundColor: 'transparent'
                    });
                    continue;
                }

                const totalDuration = allActivitiesTime
                    .filter((activity) => activity.start >= timeDay && activity.start < timeDayEnd)
                    .reduce((acc, activity) => acc + activity.duration, 0);

                const levelPourcentage = MinMax(0, totalDuration / quest.schedule.duration, 1);
                dataToDisplay.push({
                    level: levelPourcentage,
                    backgroundColor: 'main2'
                });
            }
        }

        // Year by weeks: Data with 52 cells, one for each week
        else if (switchMode === 1) {
            for (let i = 0; i < WEEKS; i++) {
                const timeWeek = timeGlobalStart + i * DAY_TIME * DAYS_PER_WEEK;
                const timeWeekEnd = timeWeek + DAY_TIME * DAYS_PER_WEEK;

                // If after today, push -1
                if (timeWeek > timeGlobalEnd) {
                    dataToDisplay.push({
                        level: -1,
                        backgroundColor: 'transparent'
                    });
                    continue;
                }

                const totalDuration = allActivitiesTime
                    .filter((activity) => activity.start >= timeWeek && activity.start < timeWeekEnd)
                    .reduce((acc, activity) => acc + activity.duration, 0);

                const level = MinMax(0, totalDuration / (quest.schedule.duration * DAYS_PER_WEEK), 1);
                dataToDisplay.push({
                    level,
                    backgroundColor: 'main2'
                });
            }
        }

        return { switchMode, dataToDisplay };
    };

    /** @param {number} index */
    changeSwitchValue = (index) => {
        // Save the settings (avoid spamming the save)
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }
        this.saveTimeout = setTimeout(() => {
            user.settings.Save();
        }, 3 * 1000);

        user.settings.questHeatMapIndex = index;
        this.setState(this.GetHeatMapData());
    };
}

YearHeatMapBack.prototype.props = YearHeatMapProps;
YearHeatMapBack.defaultProps = YearHeatMapProps;

export default YearHeatMapBack;
