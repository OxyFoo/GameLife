import React from 'react';
import { Animated } from 'react-native';
import PageBase from 'Interface/FlowEngine/PageBase';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { AddActivity } from 'Interface/Widgets';
import { SpringAnimation, EasingAnimation } from 'Utils/Animations';
import { GetGlobalTime, GetLocalTime } from 'Utils/Time';

/**
 * @typedef {import('react-native').FlatList<DayDataType>} FlatListDay
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {import('Data/User/Activities/index').Skill} Skill
 * @typedef {import('Data/User/Activities/index').Activity} Activity
 * @typedef {import('Data/User/Activities/index').ActivitySaved} ActivitySaved
 *
 * @typedef {object} DayDataType
 * @property {number} day
 * @property {number} month
 * @property {number} year
 * @property {boolean} selected
 * @property {boolean} containsActivity
 * @property {(day: DayDataType) => void} onPress
 *
 * @typedef {object} ActivityDataType
 * @property {DayDataType} day
 * @property {Skill | null} skill
 * @property {Activity} activity
 * @property {(activity: ActivityDataType) => void} onPress
 * @property {(activity: ActivityDataType) => void} onLongPress
 */

const TOTAL_DAYS_COUNT = 100;
const BATCH_DAYS = 30;
const ITEM_WIDTH = 65 + 6; // width of each item plus separator

const INITIAL_DATE = new Date();
INITIAL_DATE.setDate(INITIAL_DATE.getDate() - TOTAL_DAYS_COUNT / 2);

class BackCalendar extends PageBase {
    _timeBatchStart = GetLocalTime(INITIAL_DATE);
    _timeBatchEnd = GetLocalTime(INITIAL_DATE) + TOTAL_DAYS_COUNT * 24 * 60 * 60;

    activitiesInBatch = user.activities
        .Get()
        .filter((activity) => activity.startTime >= this._timeBatchStart && activity.startTime <= this._timeBatchEnd);

    state = {
        /** @type {ActivityDataType[]} */
        activities: [],

        /** @type {string} */
        selectedMonth: langManager.curr['dates']['month'][new Date().getMonth()],

        /** @type {DayDataType | null} */
        selectedDay: null,

        todayStrDate: '',

        /** @type {DayDataType[]} */
        days: Array(TOTAL_DAYS_COUNT)
            .fill(0)
            .map((_, index) => {
                const date = new Date(INITIAL_DATE);
                date.setDate(date.getDate() + index);
                date.setHours(0, 0, 0, 0);
                return {
                    day: date.getDate(),
                    month: date.getMonth(),
                    year: date.getFullYear(),
                    selected: false,
                    containsActivity: this.batchContainsActivity(GetGlobalTime(date)),
                    onPress: this.onDayPress.bind(this)
                };
            }),

        animSummaryY: new Animated.Value(0),
        animTodayButton: new Animated.Value(0)
    };

    /** @type {Symbol | null} */
    activitiesListener = null;

    static feKeepMounted = true;
    static feShowUserHeader = true;
    static feShowNavBar = true;

    /** @type {React.RefObject<FlatListDay | null>} */
    refDayList = React.createRef();
    dayListPosX = 0;
    dayListWidth = 0;

    componentDidMount() {
        this.activitiesListener = user.activities.allActivities.AddListener(this.updateActivities);

        const { days } = this.state;
        this.onDayPress(days[days.length / 2], false);
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    /** @param {(Activity | ActivitySaved)[]} activities */
    updateActivities = (activities = user.activities.allActivities.Get()) => {
        this.refreshActivitiesInBatch();

        const { selectedDay } = this.state;
        if (!selectedDay) return;

        const selectedDate = new Date(selectedDay.year, selectedDay.month, selectedDay.day);

        this.setState({
            /** @type {ActivityDataType[]} */
            activities: user.activities.GetByTime(GetLocalTime(selectedDate), activities, true).map((activity) => ({
                day: selectedDay,
                skill: dataManager.skills.GetByID(activity.skillID),
                activity,
                onPress: this.onActivityPress.bind(this),
                onLongPress: this.onActivityLongPress.bind(this)
            })),
            days: this.state.days.map((day) => ({
                ...day,
                containsActivity: this.batchContainsActivity(GetGlobalTime(new Date(day.year, day.month, day.day)))
            }))
        });
    };

    openCalendar = () => {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: 'Pas terminé',
                message: "Cette feature n'est pas encore implémentée, un peu de patience 👀"
            }
        });
    };

    openToday = () => {
        const { days } = this.state;

        const today = new Date();
        const date = today.getDate();
        const month = today.getMonth();
        const year = today.getFullYear();

        const todayDay = days.findIndex((day) => day.day === date && day.month === month && day.year === year);
        if (todayDay !== -1) {
            if (!days[todayDay].selected) {
                this.onDayPress(days[todayDay], true);
            }
        } else {
            // Reset days to the current date
            const newDays = Array(TOTAL_DAYS_COUNT)
                .fill(0)
                .map((_, index) => {
                    const tempDate = new Date(INITIAL_DATE);
                    tempDate.setDate(tempDate.getDate() + index);
                    tempDate.setHours(0, 0, 0, 0);
                    return {
                        day: tempDate.getDate(),
                        month: tempDate.getMonth(),
                        year: tempDate.getFullYear(),
                        selected: false,
                        containsActivity: this.batchContainsActivity(GetGlobalTime(tempDate)),
                        onPress: this.onDayPress.bind(this)
                    };
                });
            this.setState({ days: newDays }, () => {
                this.onDayPress(newDays[newDays.length / 2], true);
            });
        }
    };

    refreshActivitiesInBatch() {
        this.activitiesInBatch = user.activities.allActivities
            .Get()
            .filter(
                (activity) => activity.startTime >= this._timeBatchStart && activity.startTime <= this._timeBatchEnd
            );
    }

    /** @param {number} startTime */
    batchContainsActivity(startTime) {
        return this.activitiesInBatch.some(
            (activity) =>
                (activity.startTime + activity.timezone * 3600 >= startTime ||
                    activity.startTime + activity.timezone * 3600 + activity.duration * 60 > startTime) &&
                activity.startTime + activity.timezone * 3600 < startTime + 24 * 60 * 60
        );
    }

    hideSummary = false;
    summaryHeight = 0;

    refreshing = false;

    addActivity = () => {
        this.fe.bottomPanel?.Open({
            content: <AddActivity />
        });
    };

    /** @param {ActivityDataType} activityData */
    onActivityPress(activityData) {
        const { activity } = activityData;

        this.fe.bottomPanel?.Open({
            content: <AddActivity editActivity={activity} />
        });
    }

    /** @param {ActivityDataType} activityData */
    onActivityLongPress(activityData) {
        const { activity } = activityData;

        this.fe.ChangePage('skill', { args: { skillID: activity.skillID } });
    }

    /** @param {number} startTime */
    onAddActivityFromTime(startTime) {
        this.fe.bottomPanel?.Open({
            content: <AddActivity time={startTime} />
        });
    }

    /**
     * @param {DayDataType} day
     */
    async onDayPress(day, scrollToSelection = true) {
        // Update the selected day
        const { days } = this.state;

        /** @type {DayDataType | null} */
        let selectedDay = null;
        for (const d in days) {
            if (days[d] === day) {
                days[d].selected = true;
                selectedDay = days[d];
            } else if (days[d].selected) {
                days[d].selected = false;
            }
        }

        if (selectedDay === null) {
            user.interface.console?.AddLog('warn', 'Selected day not found', day);
            return;
        }

        const today = new Date();
        const selectedIsToday =
            selectedDay.day === today.getDate() &&
            selectedDay.month === today.getMonth() &&
            selectedDay.year === today.getFullYear();
        if (selectedIsToday) {
            EasingAnimation(this.state.animTodayButton, 0, 200).start();
        } else {
            EasingAnimation(this.state.animTodayButton, 1, 200).start();
        }

        let strDay = selectedDay?.day.toString();
        let strMonth = langManager.curr['dates']['month'][selectedDay?.month || 0];
        let strYear = selectedDay?.year.toString();

        if (langManager.currentLangageKey === 'en') {
            function getOrdinalSuffix(d = 0) {
                if (d > 3 && d < 21) return 'th';
                switch (d % 10) {
                    case 1:
                        return 'st';
                    case 2:
                        return 'nd';
                    case 3:
                        return 'rd';
                    default:
                        return 'th';
                }
            }

            strDay = strMonth;
            strMonth = selectedDay?.day + getOrdinalSuffix(selectedDay?.day);
        }

        const todayStrDate = `${strDay} ${strMonth} ${strYear}`;

        this.setState({ selectedDay, todayStrDate }, this.updateActivities);

        // Scroll to the selected day
        if (scrollToSelection) {
            const index = days.indexOf(selectedDay);
            const newItemsWidth = index * ITEM_WIDTH - this.dayListWidth / 2 + ITEM_WIDTH / 2;
            this.refDayList.current?.scrollToOffset({
                offset: newItemsWidth,
                animated: true
            });
        }
    }

    /** @param {LayoutChangeEvent} event */
    onLayoutSummary = (event) => {
        this.summaryHeight = event.nativeEvent.layout.height;
    };

    /** @param {LayoutChangeEvent} event */
    onLayoutDayList = (event) => {
        this.dayListWidth = event.nativeEvent.layout.width;
    };

    /** @type {FlatListDay['props']['onScroll']} */
    handleActivityScroll = (event) => {
        const { y } = event.nativeEvent.contentOffset;

        if (!this.hideSummary && y > 150) {
            this.hideSummary = true;
            SpringAnimation(this.state.animSummaryY, -this.summaryHeight, false).start();
        } else if (this.hideSummary && y <= 40) {
            this.hideSummary = false;
            SpringAnimation(this.state.animSummaryY, 0, false).start();
        }
    };

    /** @type {FlatListDay['props']['onScroll']} */
    handleDayScroll = (event) => {
        this.dayListPosX = event.nativeEvent.contentOffset.x;

        // Define the current month
        const { days } = this.state;
        const index = this.dayListPosX / ITEM_WIDTH + this.dayListWidth / ITEM_WIDTH / 2;
        const { month, year } = days[Math.floor(index)];
        const monthText = langManager.curr['dates']['month'][month];
        const yearText = year === new Date().getFullYear() ? '' : ` ${year}`;
        if (this.state.selectedMonth !== monthText + yearText) {
            this.setState({ selectedMonth: monthText + yearText });
        }
    };

    /** @type {FlatListDay['props']['onStartReached']} */
    onDayStartReached = async () => {
        if (this.refreshing) return;
        this.refreshing = true;

        const { days } = this.state;
        const firstDay = days[0];

        // Update the activities in batch
        this._timeBatchStart -= BATCH_DAYS * 24 * 60 * 60;
        this._timeBatchEnd -= BATCH_DAYS * 24 * 60 * 60;
        this.refreshActivitiesInBatch();

        const newDays = Array(BATCH_DAYS)
            .fill(0)
            .map((_, index) => {
                const { selectedDay } = this.state;
                const date = new Date(firstDay.year, firstDay.month, firstDay.day);
                date.setDate(date.getDate() - index - 1);

                /** @type {DayDataType} */
                const day = {
                    day: date.getDate(),
                    month: date.getMonth(),
                    year: date.getFullYear(),
                    selected:
                        selectedDay?.year === date.getFullYear() &&
                        selectedDay?.month === date.getMonth() &&
                        selectedDay?.day === date.getDate(),
                    containsActivity: this.batchContainsActivity(GetGlobalTime(date)),
                    onPress: this.onDayPress.bind(this)
                };

                return day;
            })
            .reverse();

        this.setState(
            /** @param {this['state']} prevState */
            (prevState) => ({
                days: [...newDays, ...prevState.days.slice(0, -BATCH_DAYS)]
            }),
            () => {
                const newItemsWidth = this.dayListPosX + newDays.length * ITEM_WIDTH;
                this.refDayList.current?.scrollToOffset({
                    offset: newItemsWidth,
                    animated: false
                });
                this.refreshing = false;
            }
        );
    };

    /** @type {FlatListDay['props']['onEndReached']} */
    onDayEndReached = async () => {
        if (this.refreshing) return;
        this.refreshing = true;

        const { days } = this.state;
        const lastDay = days[days.length - 1];

        // Update the activities in batch
        this._timeBatchStart += BATCH_DAYS * 24 * 60 * 60;
        this._timeBatchEnd += BATCH_DAYS * 24 * 60 * 60;
        this.refreshActivitiesInBatch();

        const newDays = Array(BATCH_DAYS)
            .fill(0)
            .map((_, index) => {
                const { selectedDay } = this.state;
                const date = new Date(lastDay.year, lastDay.month, lastDay.day);
                date.setDate(date.getDate() + index + 1);

                /** @type {DayDataType} */
                const day = {
                    day: date.getDate(),
                    month: date.getMonth(),
                    year: date.getFullYear(),
                    selected:
                        selectedDay?.year === date.getFullYear() &&
                        selectedDay?.month === date.getMonth() &&
                        selectedDay?.day === date.getDate(),
                    containsActivity: this.batchContainsActivity(GetGlobalTime(date)),
                    onPress: this.onDayPress.bind(this)
                };

                return day;
            });

        this.setState(
            /** @param {this['state']} prevState */
            (prevState) => ({
                days: [...prevState.days.slice(BATCH_DAYS), ...newDays]
            }),
            () => {
                const newItemsWidth = this.dayListPosX - newDays.length * ITEM_WIDTH;
                this.refDayList.current?.scrollToOffset({
                    offset: newItemsWidth,
                    animated: false
                });
                this.refreshing = false;
            }
        );
    };
}

export { TOTAL_DAYS_COUNT };
export default BackCalendar;
