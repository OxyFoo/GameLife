import * as React from 'react';
import { Animated } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

import { GetBlockMonth } from '../../Functions/Date';
import { SpringAnimation } from '../../Functions/Animations';
import { GetTime, RoundToQuarter } from '../../Functions/Time';

class BackCalendar extends React.Component {
    constructor(props) {
        super(props);

        // Infinite scroll vars
        this.ratioY = 0;
        this.offsetY = 0;

        const today = new Date();
        const date = today.getDate();
        const month = today.getMonth();
        const year = today.getFullYear();
        this.before = [ month, year ];
        this.after = [ month, year ];
        this.flatlist = null;

        let months = [{ month: month, year: year, data: GetBlockMonth(month, year) }];
        for (let i = 0; i < 2; i++) {
            months = this.addMonthToTop(months, false);
            months = this.addMonthToBottom(months, false);
        }

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
            isReached: false
        };
    }

    componentDidMount() {
        const selectedDate = user.tempSelectedTime === null ? new Date() : new Date(user.tempSelectedTime * 1000);
        const Day = selectedDate.getDate();
        const Month = selectedDate.getMonth();
        const FullYear = selectedDate.getFullYear();
        this.daySelect(Day, Month, FullYear);

        // TODO - Doesn't works on iOS
        this.flatlist.scrollToIndex({ index: 2, animated: false });
    }

    componentWillUnmount() {
        if (user.interface.GetCurrentPage() !== 'activity') {
            user.tempSelectedTime = null;
        }
    }

    onScroll = (e) => {
        const offsetY = e.nativeEvent.contentOffset.y;
        const layoutY = e.nativeEvent.layoutMeasurement.height;
        const contentY = e.nativeEvent.contentSize.height;
        const maxOffsetY = contentY - layoutY;

        this.offsetY = offsetY;
        this.ratioY = offsetY / maxOffsetY;

        
        // TODO - Finish infinite scroll
        //console.log('Scroll', this.state.isReached, offsetY);
        return;

        if (this.state.isReached) return false;

        if (this.ratioY < 0.25 || this.ratioY > 0.75) {
            new Promise((resolve) => {
                this.setState({ isReached: true }, () => {
                    //console.log('adding');
                    let newMonths = [];
                    if (this.ratioY < 0.25) newMonths = this.addMonthToTop();
                    if (this.ratioY > 0.75) newMonths = this.addMonthToBottom();
                    this.setState({ months: newMonths, isReached: false }, () => {
                        //console.log('added');
                        resolve();
                    });
                });
            });
        }
    }

    editMonth = (dates, add) => {
        let [ month, year ] = dates;
        month += add;
        if (month < 0) { month = 11; year-- };
        if (month > 11) { month = 0; year++ };
        return [ month, year ];
    }

    addMonthToTop = (currMonths = null, autoRemove = true) => {
        this.before = this.editMonth(this.before, -1);
        if (autoRemove) this.after = this.editMonth(this.after, -1);

        const [ month, year ] = this.before;

        if (currMonths === null) currMonths = this.state.months;
        if (autoRemove) currMonths.splice(-1, 1);
        const addMonths = { month: month, year: year, data: GetBlockMonth(month, year) };
        const newMonths = [ addMonths, ...currMonths ];

        return newMonths;
        return new Promise((resolve, reject) => {
            if (!autoRemove) {
            } else {
                this.flatlist.scrollToOffset({ offset: this.offsetY + 284, animated: false });
                this.setState({ months: newMonths });
            }
        });
    }

    addMonthToBottom = (currMonths = null, autoRemove = true) => {
        this.after = this.editMonth(this.after, 1);
        if (autoRemove) this.before = this.editMonth(this.before, 1);

        const [ month, year ] = this.after;

        if (currMonths === null) currMonths = this.state.months;
        if (autoRemove) currMonths.splice(0, 1);
        const addMonths = { month: month, year: year, data: GetBlockMonth(month, year) };
        const newMonths = [ ...currMonths, addMonths ];

        return newMonths;
        return new Promise((resolve, reject) => {
            if (!autoRemove) {
            } else {
                this.flatlist.scrollToOffset({ offset: this.offsetY - 284, animated: false });
                this.setState({ months: newMonths });
            }
        });
    }

    daySelect = async (day = null, month = null, year = null) => {
        if (day !== null) {
            // Select day
            const block = GetBlockMonth(month, year);
            const week = block.find(w => w.includes(day));
            const date = new Date(year, month, day);
            const activities = user.activities.GetByTime(GetTime(date)).reverse();

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