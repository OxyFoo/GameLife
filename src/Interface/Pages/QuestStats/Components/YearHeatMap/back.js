import * as React from 'react';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

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

const DAYS_TO_DISPLAY = 364;

/**
 * @typedef {Object} MonthLabel
 * @property {string} name
 * @property {number} position Column position (0-based)
 */

class YearHeatMapBack extends React.Component {
    state = {
        /** @type {Array<HeatMapDataType>} */
        dataToDisplay: [],
        /** @type {Array<MonthLabel>} */
        monthLabels: []
    };

    /** @type {Symbol | null} */
    activitiesListener = null;

    scrollViewRef = React.createRef();

    /** @param {YearHeatMapPropsType} props */
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            ...this.GetHeatMapData()
        };
    }

    componentDidMount() {
        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.setState(this.GetHeatMapData());
        });
    }

    /** Scroll to the end when the content is rendered */
    handleContentSizeChange = () => {
        this.scrollViewRef.current?.scrollToEnd({ animated: false });
    };

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

        // Last 364 days: Fixed amount displayed on 4 rows with horizontal scroll (91 cells per row)
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

        // Calculate month labels positions
        /** @type {Array<MonthLabel>} */
        const monthLabels = [];
        const monthNames = langManager.curr['dates']['months-min'];

        let lastMonth = -1;

        for (let i = 0; i < DAYS_TO_DISPLAY; i++) {
            const timeDay = timeGlobalStart + i * DAY_TIME;
            const date = new Date(timeDay * 1000);
            const month = date.getMonth();

            if (month !== lastMonth) {
                // With 4 rows, each column contains 4 days
                // So column position = day index / 4
                const columnPosition = Math.floor(i / 4);

                // Skip the very first partial month (only if at position 0)
                if (columnPosition >= 1) {
                    monthLabels.push({
                        name: monthNames[month],
                        position: columnPosition
                    });
                }

                lastMonth = month;
            }
        }

        // Add year to the last month label
        if (monthLabels.length > 0) {
            const lastLabel = monthLabels[monthLabels.length - 1];
            const lastDayDate = new Date(timeGlobalEnd * 1000);
            lastLabel.name = `${lastLabel.name} ${lastDayDate.getFullYear()}`;
        }

        return { dataToDisplay, monthLabels };
    };
}

YearHeatMapBack.prototype.props = YearHeatMapProps;
YearHeatMapBack.defaultProps = YearHeatMapProps;

export default YearHeatMapBack;
