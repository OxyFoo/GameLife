import * as React from 'react';

import user from 'Managers/UserManager';

import { MinMax } from 'Utils/Functions';
import { DAY_TIME, GetGlobalTime } from 'Utils/Time';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Quests').Quest} Quest
 * @typedef {import('Interface/Components/HeatMap').HeatMapDataType} HeatMapDataType
 *
 * @typedef {Object} YearHeatMapPropsType
 * @property {StyleProp} style
 * @property {Quest | null} quest
 */

/** @type {YearHeatMapPropsType} */
const YearHeatMapProps = {
    style: {},
    quest: null
};

const DAYS_TO_DISPLAY = 152;

class YearHeatMapBack extends React.Component {
    state = {
        /** @type {Array<HeatMapDataType>} */
        dataToDisplay: []
    };

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
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    GetHeatMapData = () => {
        const { quest } = this.props;
        if (!quest) return {};

        /** @type {Array<HeatMapDataType>} */
        const dataToDisplay = [];

        const timeGlobalEnd = GetGlobalTime();
        const timeGlobalStart = timeGlobalEnd - DAYS_TO_DISPLAY * DAY_TIME;

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

        // Last 152 days: Fixed amount displayed on 4 rows with horizontal scroll (38 cells per row)
        for (let i = 0; i < DAYS_TO_DISPLAY; i++) {
            const timeDay = timeGlobalStart + i * DAY_TIME;
            const timeDayEnd = timeDay + DAY_TIME;

            const totalDuration = allActivitiesTime
                .filter((activity) => activity.start >= timeDay && activity.start < timeDayEnd)
                .reduce((acc, activity) => acc + activity.duration, 0);

            const levelPourcentage = MinMax(0, totalDuration / quest.schedule.duration, 1);
            dataToDisplay.push({
                level: levelPourcentage,
                backgroundColor: 'main3'
            });
        }

        return { dataToDisplay };
    };
}

YearHeatMapBack.prototype.props = YearHeatMapProps;
YearHeatMapBack.defaultProps = YearHeatMapProps;

export default YearHeatMapBack;
