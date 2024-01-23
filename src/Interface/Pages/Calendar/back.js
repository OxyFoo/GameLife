import React from 'react';
import { Animated, FlatList } from 'react-native';

import { PageBase } from 'Interface/Components';
import user from 'Managers/UserManager';

import StartTutorial from './tuto';
import { Sleep } from 'Utils/Functions';
import { SpringAnimation } from 'Utils/Animations';
import { GetTime, GetTimeZone, RoundTimeTo } from 'Utils/Time';
import { GetBlockMonth } from 'Interface/Widgets/BlockMonth/script';
import { TIME_STEP_MINUTES } from 'Utils/Activities';

/**
 * @typedef {import('react-native').NativeScrollEvent} NativeScrollEvent
 * @typedef {import('react-native').NativeSyntheticEvent<NativeScrollEvent>} ScrollEvent
 * 
 * @typedef {import('Class/Activities').Activity} Activity
 * @typedef {import('Interface/Components').ActivityTimeline} ActivityTimeline
 * @typedef {import('Interface/Widgets').ActivityPanel} ActivityPanel
 * @typedef {import('Interface/Widgets/BlockMonth/index').MonthData} MonthData
 */

class BackCalendar extends PageBase {
    /** @type {ActivityPanel | null} */
    refActivityPanel = null;

    /** @type {boolean} Used for ActivityTimeline */
    isScrolling = false;

    state = {
        /** @type {Array<MonthData>} */
        months: [],

        animation: new Animated.Value(0),
        selectedALL: {
            day: null,
            week: null,
            month: null,
            year: null
        },

        /** @type {Array<Activity>} */
        currActivities: []
    }

    constructor(props) {
        super(props);

        /** @type {React.RefObject<ActivityTimeline>} */
        this.refActivityTimeline = React.createRef();

        // Infinite scroll vars
        this.ratioY = 0;
        this.offsetY = 0;
        this.isReached = false;

        /** @type {FlatList} */
        this.flatlist = null;

        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();

        /** @type {Array<MonthData>} */
        let months = [{ month, year }];
        months = this.addMonthToTop(months, 2, false);
        months = this.addMonthToBottom(months, 2, false);
        this.state.months = months;

        // Internal state
        this.animating = false;
        this.opened = false;

        this.activitiesListener = user.activities.allActivities.AddListener(async () => {
            const time_start = new Date().getTime();
            // Update activities
            if (this.state.selectedALL === null) return;

            const { day, month, year } = this.state.selectedALL;
            await this.daySelect(day, month, year, true);
            const time_end = new Date().getTime();
            console.log('Calendar update activities', time_end - time_start);
            user.interface.console.AddLog('info', `Calendar update activities in ${time_end - time_start} ms`);
        });
    }

    componentDidMount() {
        super.componentDidMount();

        const today = new Date();
        const Day = today.getDate();
        const Month = today.getMonth();
        const FullYear = today.getFullYear();
        this.daySelect(Day, Month, FullYear);

        // Timeout to fix iOS compatibility
        setTimeout(() => {
            this.flatlist?.scrollToIndex({ index: 2, animated: false });
        }, 100);
    }

    componentDidFocused = (args) => {
        StartTutorial.call(this, args?.tuto);
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    onScroll = (e) => {
        const offsetY = e.nativeEvent.contentOffset.y;
        const layoutY = e.nativeEvent.layoutMeasurement.height;
        const contentY = e.nativeEvent.contentSize.height;
        const maxOffsetY = contentY - layoutY;

        this.offsetY = offsetY;
        this.ratioY = offsetY / maxOffsetY;

        // TODO - Update infinite scroll
        //console.log('Scroll', this.isReached, offsetY, this.ratioY);
        //return;

        const offsetLimit = 0;
        if (!this.isReached && (this.ratioY <= offsetLimit || this.ratioY >= 1 - offsetLimit)) {
            (async () => {
                this.isReached = true;
                let delta = 0;
                await new Promise((resolve) => {
                    let newMonths = [];
                    if (this.ratioY <= offsetLimit) newMonths = this.addMonthToTop(this.state.months, 2);
                    if (this.ratioY >= 1 - offsetLimit) newMonths = this.addMonthToBottom(this.state.months, 2);
                    delta = Math.abs(newMonths.length - this.state.months.length);
                    this.setState({ months: newMonths }, () => resolve());
                });
                const newOffsetY = this.offsetY + delta * (this.ratioY <= offsetLimit ? 284 : -284);
                this.flatlist.scrollToOffset({ offset: newOffsetY, animated: false });
                await Sleep(10);
                this.isReached = false;
            })();
        }
    }

    /** @param {MonthData} date */
    editMonth = (date, add) => {
        let { month, year } = date;
        month += add;
        while (month < 0) { month += 12; year-- };
        while (month > 11) { month -= 12; year++ };
        return { month, year };
    }

    /**
     * @param {Array<MonthData>} currMonths
     * @param {number} [number=1]
     * @param {boolean} [autoRemove=true]
     */
    addMonthToTop = (currMonths, number = 1, autoRemove = true) => {
        if (autoRemove) {
            currMonths.length -= number;
        }

        let newMonths = [ ...currMonths ];
        for (let i = 0; i < number; i++) {
            const monthBefore = this.editMonth(newMonths.at(0), -1);
            newMonths.splice(0, 0, monthBefore);
        }

        return newMonths;
    }

    /**
     * @param {Array<MonthData>} currMonths
     * @param {number} [number=1]
     * @param {boolean} [autoRemove=true]
     */
    addMonthToBottom = (currMonths, number = 1, autoRemove = true) => {
        if (autoRemove) {
            currMonths.splice(0, number);
        }

        let newMonths = [ ...currMonths ];
        for (let i = 0; i < number; i++) {
            const monthAfter = this.editMonth(newMonths.at(-1), 1);
            newMonths.push(monthAfter);
        }

        return newMonths;
    }

    /**
     * @param {number} day
     * @param {number} month
     * @param {number} year
     * @param {boolean} [force=false]
     * @returns {Promise<void>}
     */
    daySelect = async (
        day = null,
        month = this.state.selectedALL?.month,
        year = this.state.selectedALL?.year,
        force = false
    ) => {
        if (!force &&
            this.state.selectedALL?.day === day &&
            this.state.selectedALL?.month === month &&
            this.state.selectedALL.year === year) {
                // Already selected
                return;
        }

        const date = new Date(year, month, day);

        // Select day
        if (day !== null) {
            const now = new Date();
            date.setHours(now.getHours(), now.getMinutes(), 0, 0);
            const nowLocalTime = GetTime(date, 'local') + GetTimeZone() * 60;
            user.tempSelectedTime = RoundTimeTo(TIME_STEP_MINUTES, nowLocalTime);

            if (!this.opened) {
                this.showPanel();
            }
        }

        // Unselect day (calendar mode)
        else {
            user.tempSelectedTime = null;
            if (this.opened) {
                this.hidePanel();
            }
        }

        return new Promise((resolve, reject) => {
            if (day !== null) {
                const weeks = GetBlockMonth(month, year, undefined, day).data;
                const week = weeks.findIndex(w => w.filter(d => d?.day === day).length > 0);
                const activities = user.activities.GetByTime(GetTime(date));

                this.setState({
                    currActivities: activities,
                    selectedALL: { day, week, month, year }
                }, resolve);
            } else {
                this.setState({ selectedALL: null }, resolve);
            }
        });
    }
    dayRefresh = () => this.daySelect();

    showPanel = () => this.animPanel(0);
    hidePanel = () => this.animPanel(1);
    animPanel = (value) => {
        const { animation } = this.state;

        if (this.animating) return null;

        return new Promise((resolve, reject) => {
            this.animating = true;
            SpringAnimation(animation, value).start();
            setTimeout(() => {
                this.animating = false;
                this.opened = value === 0;
                resolve();
            }, 300);
        });
    }

    /**
     * Move one week before or later
     * @param {-1 | 1} move 
     */
    weekSelect = (move) => {
        const { day, month, year } = this.state.selectedALL;

        const date = new Date(year, month, day);
        const weeks = GetBlockMonth(month, year).data;
        const selectedWeek = weeks.findIndex(w => w.find(d => d?.day === day));
        let nextWeek = selectedWeek;

        do {
            date.setDate(date.getDate() + move);
            nextWeek = weeks.findIndex(w => w.find(d => d?.day === date.getDate()))
        } while (selectedWeek === nextWeek);

        const newDay = date.getDate();
        const newMonth = date.getMonth();
        const newYear = date.getFullYear();
        this.daySelect(newDay, newMonth, newYear);
    }
    selectNextWeek = () => this.weekSelect(1);
    selectPrevWeek = () => this.weekSelect(-1);

    /**
     * @param {Activity} activity 
     */
    onActivityPress = (activity) => {
        this.refActivityPanel?.SelectActivity(activity, undefined, () => {
            // Show bottom bar
            const newBarState = { bottomBarShow: true, bottomBarIndex: 1 };
            user.interface.setState(newBarState);
        });

        // Hide bottom bar
        const newBarState = { bottomBarShow: false, bottomBarIndex: 2 };
        user.interface.setState(newBarState);
    }

    /** @param {Activity} activity */
    onAddActivityFromActivity = (activity) => {
        const time = activity.startTime + activity.duration * 60;
        user.interface.ChangePage('activity', { time }, true);
    }

    /** @param {number} time */
    onAddActivityFromTime = (time) => {
        user.interface.ChangePage('activity', { time }, true);
    }

    /**
     * Called when the user scroll the page 
     * @param {ScrollEvent} event
     */
    handleScroll = (event) => {
        const scrollY = event.nativeEvent.contentOffset.y;

        if (this.isScrolling && scrollY <= 0) {
            this.isScrolling = false;
        } else if (!this.isScrolling && scrollY > 20) {
            this.isScrolling = true;
        }

        this.refActivityTimeline.current?.SetThinMode(this.isScrolling);
    }
}

export default BackCalendar;
