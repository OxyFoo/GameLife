import * as React from 'react';
import { Animated } from 'react-native';
import { FlatList } from 'react-native';

import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';

import { Sleep } from '../../../Utils/Functions';
import { GetBlockMonth } from '../../../Utils/Date';
import { SpringAnimation } from '../../../Utils/Animations';
import { GetTime, RoundToQuarter } from '../../../Utils/Time';

class BackCalendar extends React.Component {
    constructor(props) {
        super(props);

        // Infinite scroll vars
        this.ratioY = 0;
        this.offsetY = 0;
        this.isReached = false;

        /** @type {FlatList} */
        this.flatlist = null;

        const today = new Date();
        const date = today.getDate();
        const month = today.getMonth();
        const year = today.getFullYear();
        this.before = [ month, year ];
        this.after = [ month, year ];

        let months = [{ month: month, year: year, data: GetBlockMonth(month, year) }];
        months = this.addMonthToTop(months, 4, false);
        months = this.addMonthToBottom(months, 4, false);

        this.state = {
            months: months,
            monthsMounted: false,

            opened: false,
            animating: false,
            animation: new Animated.Value(0),
            selectedDate: date,
            selectedMonth: month,
            selectedYear: year,
            currWeek: [],
            currActivities: [],
        };
    }

    componentDidMount() {
        const today = new Date();
        const Day = today.getDate();
        const Month = today.getMonth();
        const FullYear = today.getFullYear();
        this.daySelect(Day, Month, FullYear);

        // TODO - Doesn't works on iOS
        this.flatlist.scrollToIndex({ index: 4, animated: false });
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
                    this.setState({ months: newMonths }, resolve);
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
            const addMonths = { month: month, year: year, data: GetBlockMonth(month, year) };
            newMonths.splice(0, 0, addMonths);
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
            const addMonths = { month: month, year: year, data: GetBlockMonth(month, year) };
            newMonths.push(addMonths);
        }

        return newMonths;
    }

    daySelect = async (day = null, month = null, year = null) => {
        if (day !== null) {
            // Select day
            const block = GetBlockMonth(month, year);
            const week = block.find(w => w.includes(day));
            const date = new Date(year, month, day);
            const activities = user.activities.GetByTime(GetTime(date, true)).reverse();

            this.setState({
                currActivities: activities,
                selectedDate: day,
                selectedMonth: month,
                selectedYear: year,
                currWeek: week
            });
            if (!this.state.opened) await this.showPanel();
            date.setHours(new Date().getHours(), new Date().getMinutes(), 0, 0);
            user.tempSelectedTime = RoundToQuarter(GetTime(date));
        } else {
            // Unselect day (calendar mode)
            if (!this.state.monthsMounted) {
                this.setState({ monthsMounted: true });
            }
            if (this.state.opened) {
                await this.hidePanel();
            }
            this.setState({
                selectedDate: null,
                selectedMonth: null,
                selectedYear: null,
                currWeek: [],
            });
        }
    }

    showPanel = () => this.animPanel(0);
    hidePanel = () => this.animPanel(1);
    animPanel = (value) => {
        const { animating, animation } = this.state;

        const animFunc = (resolve, reject) => {
            this.setState({ animating: true });
            SpringAnimation(animation, value).start(() => {
                this.setState({ animating: false, opened: value === 0 });
                resolve();
            });
        }

        return !animating ? new Promise(animFunc) : null;
    }

    /**
     * Move one week before or later
     * @param {-1|1} move 
     */
    weekSelect = (move) => {
        const { selectedDate, selectedMonth, selectedYear } = this.state;

        const date = new Date(selectedYear, selectedMonth, selectedDate);
        const block = GetBlockMonth(selectedMonth, selectedYear);
        const currWeek = block.find(w => w.includes(selectedDate));
        let nextWeek = currWeek;

        do {
            date.setDate(date.getDate() + move);
            nextWeek = block.find(w => w.includes(date.getDate()))
        } while (currWeek === nextWeek);

        const newDay = date.getDate();
        const newMonth = date.getMonth();
        const newYear = date.getFullYear();
        this.daySelect(newDay, newMonth, newYear);
    }

    /* OLD */
    skill_remove = (activity) => {
        const remove = (button) => {
            if (button === 'yes') {
                user.activities.Remove(activity);
            }
        }
        const title = langManager.curr['calendar']['alert-remove-title'];
        const text = langManager.curr['calendar']['alert-remove-text'];
        user.interface.popup.Open('yesno', [ title, text ], remove);
    }
}

export default BackCalendar;