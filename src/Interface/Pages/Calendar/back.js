import React from 'react';
import { Dimensions } from 'react-native';
import PageBase from 'Interface/FlowEngine/PageBase';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @typedef {import('react-native').FlatList<DayDataType>} FlatListDay
 *
 * @typedef {import('Class/Activities').Activity} Activity
 *
 * @typedef {object} DayDataType
 * @property {number} day
 * @property {number} month
 * @property {number} year
 * @property {(day: DayDataType) => void} onPress
 *
 * @typedef {object} ActivityDataType
 * @property {Activity} activity
 * @property {(activity: ActivityDataType) => void} onPress
 */

const TOTAL_DAYS_COUNT = 100;
const BATCH_DAYS = 30;
const ITEM_WIDTH = 65 + 6; // width of each item plus separator

const INITIAL_DATE = new Date();
INITIAL_DATE.setDate(INITIAL_DATE.getDate() - TOTAL_DAYS_COUNT / 2);

class BackCalendar extends PageBase {
    state = {
        /** @type {ActivityDataType[]} */
        activities: user.activities.Get().map((activity) => ({
            activity,
            onPress: this.onActivityPress
        })),

        /** @type {string} */
        selectedMonth: 'MONTH YEAR',

        /** @type {DayDataType[]} */
        days: Array(TOTAL_DAYS_COUNT)
            .fill(0)
            .map((_, index) => {
                const date = new Date(INITIAL_DATE);
                date.setDate(date.getDate() + index);
                return {
                    day: date.getDate(),
                    month: date.getMonth(),
                    year: date.getFullYear(),
                    onPress: this.onDayPress
                };
            })
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

    componentDidMount() {
        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.setState({
                activities: user.activities.Get().map((activity) => ({
                    activity,
                    onPress: this.onActivityPress
                }))
            });
        });
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    refreshing = false;

    /** @param {ActivityDataType} activity */
    onActivityPress = (activity) => {
        console.log('Activity pressed:', activity);
    };

    /** @param {DayDataType} day */
    onDayPress = (day) => {
        console.log('Day pressed:', day);
    };

    /** @type {FlatListDay['props']['onScroll']} */
    handleDayScroll = (event) => {
        this.dayListPosX = event.nativeEvent.contentOffset.x;

        // Define the current month
        const { days } = this.state;
        const { width: screen_width } = Dimensions.get('window');
        const index = this.dayListPosX / ITEM_WIDTH + screen_width / ITEM_WIDTH / 2;
        const { month, year } = days[Math.floor(index)];
        const monthText = langManager.curr['dates']['month'][month];
        const yearText = year === new Date().getFullYear() ? '' : ` ${year}`;
        this.setState({ selectedMonth: monthText + yearText });
    };

    /** @type {FlatListDay['props']['onStartReached']} */
    onDayStartReached = async () => {
        if (this.refreshing) return;
        this.refreshing = true;

        const { days } = this.state;
        const firstDay = days[0];

        /** @type {DayDataType[]} */
        const newDays = Array(BATCH_DAYS)
            .fill(0)
            .map((_, index) => {
                const date = new Date(firstDay.year, firstDay.month, firstDay.day);
                date.setDate(date.getDate() - index - 1);
                return {
                    day: date.getDate(),
                    month: date.getMonth(),
                    year: date.getFullYear(),
                    onPress: this.onDayPress
                };
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

        /** @type {DayDataType[]} */
        const newDays = Array(BATCH_DAYS)
            .fill(0)
            .map((_, index) => {
                const date = new Date(lastDay.year, lastDay.month, lastDay.day);
                date.setDate(date.getDate() + index + 1);
                return {
                    day: date.getDate(),
                    month: date.getMonth(),
                    year: date.getFullYear(),
                    onPress: this.onDayPress
                };
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
