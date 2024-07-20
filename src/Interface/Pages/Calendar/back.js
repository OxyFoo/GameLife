import React from 'react';
import { Animated } from 'react-native';
import PageBase from 'Interface/FlowEngine/PageBase';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { AddActivity } from 'Interface/Widgets';
import { SpringAnimation } from 'Utils/Animations';
import { GetGlobalTime, GetLocalTime } from 'Utils/Time';

/**
 * @typedef {import('react-native').FlatList<DayDataType>} FlatListDay
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {import('Class/Activities').Skill} Skill
 * @typedef {import('Class/Activities').Activity} Activity
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

        animSummaryY: new Animated.Value(0)
    };

    /** @type {Symbol | null} */
    activitiesListener = null;

    static feKeepMounted = true;
    static feShowUserHeader = true;
    static feShowNavBar = true;
    static feScrollEnabled = false;

    /** @type {React.RefObject<FlatListDay>} */
    refDayList = React.createRef();
    dayListPosX = 0;
    dayListWidth = 0;

    componentDidMount() {
        this.activitiesListener = user.activities.allActivities.AddListener((activities) => {
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
                    onPress: this.onActivityPress.bind(this)
                })),
                days: this.state.days.map((day) => ({
                    ...day,
                    containsActivity: this.batchContainsActivity(GetGlobalTime(new Date(day.year, day.month, day.day)))
                }))
            });
        });

        const { days } = this.state;
        this.onDayPress(days[days.length / 2], false);
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    refreshActivitiesInBatch() {
        this.activitiesInBatch = user.activities
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
            content: <AddActivity />,
            movable: false
        });
    };

    /** @param {ActivityDataType} activityData */
    onActivityPress(activityData) {
        const { activity } = activityData;

        this.fe.bottomPanel?.Open({
            content: <AddActivity editActivity={activity} />,
            movable: false
        });
    }

    /** @param {number} startTime */
    onAddActivityFromTime(startTime) {
        this.fe.bottomPanel?.Open({
            content: <AddActivity time={startTime} />,
            movable: false
        });
    }

    /**
     * @param {DayDataType} day
     */
    onDayPress(day, scrollToSelection = true) {
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
            return;
        }

        // Update activities
        const selectedDate = new Date(selectedDay.year, selectedDay.month, selectedDay.day);
        const activities = user.activities.GetByTime(GetLocalTime(selectedDate), undefined, true).map(
            /** @type {ActivityDataType} */ (activity) => ({
                day: selectedDay,
                skill: dataManager.skills.GetByID(activity.skillID),
                activity,
                onPress: this.onActivityPress.bind(this)
            })
        );

        this.setState({ days, selectedDay, activities });

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

        if (!this.hideSummary && y > 300) {
            this.hideSummary = true;
            SpringAnimation(this.state.animSummaryY, -this.summaryHeight, false).start();
        } else if (this.hideSummary && y <= 150) {
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
