import { Animated } from 'react-native';
import { FlatList } from 'react-native';

import { PageBack } from 'Interface/Components';
import user from 'Managers/UserManager';

import StartTutorial from './tuto';
import { Sleep } from 'Utils/Functions';
import { SpringAnimation } from 'Utils/Animations';
import { GetTime, GetTimeZone, RoundToQuarter } from 'Utils/Time';
import { GetBlockMonth, MonthType, UpdateBlockMonth } from 'Interface/Widgets/BlockMonth/script';

/**
 * @typedef {import('Class/Activities').Activity} Activity
 * @typedef {import('Interface/Widgets').ActivityPanel} ActivityPanel
 * @typedef {import('Interface/Widgets/BlockMonth/script').DayType} DayType
 */

class BackCalendar extends PageBack {
    /** @type {ActivityPanel|null} */
    refActivityPanel = null;

    refTuto1 = null;
    refTuto2 = null;
    refTuto3 = null;

    constructor(props) {
        super(props);

        // Infinite scroll vars
        this.ratioY = 0;
        this.offsetY = 0;
        this.isReached = false;

        /** @type {FlatList} */
        this.flatlist = null;

        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        this.before = [ month, year ];
        this.after = [ month, year ];

        /** @type {Array<MonthType>} */
        let months = [ GetBlockMonth(month, year) ];
        months = this.addMonthToTop(months, 4, false);
        months = this.addMonthToBottom(months, 4, false);

        // Internal state
        this.animating = false;
        this.opened = false;

        this.state = {
            months: months,

            animation: new Animated.Value(0),
            selectedDate: 0,
            selectedMonth: 0,
            selectedYear: 0,

            /** @type {Array<DayType|null>} */
            currWeek: [],

            /** @type {Array<Activity>} */
            currActivities: []
        };

        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            // Update activities
            const { selectedDate, selectedMonth, selectedYear } = this.state;
            this.daySelect(selectedDate, selectedMonth, selectedYear, true);

            // Update calendar
            const { months } = this.state;
            UpdateBlockMonth(months);
            this.setState({ months });
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
            this.flatlist.scrollToIndex({ index: 4, animated: false });
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

    editMonth = (dates, add) => {
        let [ month, year ] = dates;
        month += add;
        if (month < 0) { month = 11; year-- };
        if (month > 11) { month = 0; year++ };
        return [ month, year ];
    }

    addMonthToTop = (currMonths, number = 1, autoRemove = true) => {
        if (autoRemove) {
            this.after = this.editMonth(this.after, -number);
            currMonths.length -= number;
        }

        let newMonths = [ ...currMonths ];
        for (let i = 0; i < number; i++) {
            this.before = this.editMonth(this.before, -1);
            const [ month, year ] = this.before;
            newMonths.splice(0, 0, GetBlockMonth(month, year));
        }

        return newMonths;
    }

    addMonthToBottom = (currMonths, number = 1, autoRemove = true) => {
        if (autoRemove) {
            this.before = this.editMonth(this.before, number);
            currMonths.splice(0, number);
        }

        let newMonths = [ ...currMonths ];
        for (let i = 0; i < number; i++) {
            this.after = this.editMonth(this.after, 1);
            const [ month, year ] = this.after;
            newMonths.push(GetBlockMonth(month, year));
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
        month = this.state.selectedMonth,
        year = this.state.selectedYear,
        force = false
    ) => {
        if (!force &&
            this.state.selectedDate === day &&
            this.state.selectedMonth === month &&
            this.state.selectedYear === year) {
                // Already selected
                return;
        }

        if (day !== null) {
            // Select day
            const weeks = GetBlockMonth(month, year, undefined, day).data;
            const week = weeks.find(w => w.filter(d => d?.day === day).length > 0);
            const date = new Date(year, month, day);
            const now = new Date();
            const activities = user.activities.GetByTime(GetTime(date));

            this.setState({
                currActivities: activities,
                selectedDate: day,
                selectedMonth: month,
                selectedYear: year,
                currWeek: week
            });

            if (!this.opened) {
                await this.showPanel();
            }
            date.setHours(now.getHours(), now.getMinutes(), 0, 0);
            user.tempSelectedTime = RoundToQuarter(GetTime(date, 'local') + GetTimeZone() * 60);
        } else {
            // Unselect day (calendar mode)
            if (this.opened) {
                await this.hidePanel();
            }
            this.setState({
                selectedDate: null,
                selectedMonth: null,
                selectedYear: null,
                currWeek: []
            });
            user.tempSelectedTime = null;
        }
    }

    showPanel = () => this.animPanel(0);
    hidePanel = () => this.animPanel(1);
    animPanel = (value) => {
        if (this.animating) return null;

        const { animation } = this.state;

        const animFunc = (resolve, reject) => {
            this.animating = true;
            SpringAnimation(animation, value).start();
            setTimeout(() => {
                this.animating = false;
                this.opened = value === 0;
                resolve();
            }, 300);
        }

        return new Promise(animFunc);
    }

    /**
     * Move one week before or later
     * @param {-1|1} move 
     */
    weekSelect = (move) => {
        const { selectedDate, selectedMonth, selectedYear } = this.state;

        const date = new Date(selectedYear, selectedMonth, selectedDate);
        const weeks = GetBlockMonth(selectedMonth, selectedYear).data;
        const currWeek = weeks.find(w => w.find(d => d?.day === selectedDate));
        let nextWeek = currWeek;

        do {
            date.setDate(date.getDate() + move);
            nextWeek = weeks.find(w => w.find(d => d?.day === date.getDate()))
        } while (currWeek === nextWeek);

        const newDay = date.getDate();
        const newMonth = date.getMonth();
        const newYear = date.getFullYear();
        this.daySelect(newDay, newMonth, newYear);
    }

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
}

export default BackCalendar;