import * as React from 'react';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';

import { sleep } from '../../Functions/Functions';
import { GetBlockMonth } from '../../Functions/Date';
import { Animated } from 'react-native';
import { SpringAnimation } from '../../Functions/Animations';

class BackCalendar extends React.Component {
    constructor(props) {
        super(props);

        // Infinite scroll vars
        this.ratioY = 0;
        this.offsetY = 0;

        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        this.before = [ month, year ];
        this.after = [ month, year ];
        this.flatlist = null;
    }

    state = {
        months: [],

        opened: false,
        animating: false,
        animation: new Animated.Value(0),
        selectedDate: null,
        selectedMonth: null,
        selectedYear: null,
        currWeek: [],
        currActivities: []
    };

    componentDidMount() {
        const today = new Date();
        const Day = today.getDate();
        const Month = today.getMonth();
        const FullYear = today.getFullYear();
        this.daySelect(Day, Month, FullYear);

        let months = [{ month: Month, year: FullYear, data: GetBlockMonth(Month, FullYear) }];
        for (let i = 0; i < 2; i++) {
            months = this.addMonthToTop(months, false);
            months = this.addMonthToBottom(months, false);
        }

        this.setState({ months: months }, async () => {
            this.flatlist.scrollToIndex({ index: 2, animated: false });
            this.tick();
        });
    }
    
    tick = async () => {
        await sleep(500);
        if (this.ratioY < 0.25) await this.addMonthToTop();
        if (this.ratioY > 0.75) await this.addMonthToBottom();
        setTimeout(this.tick, 10);
    }

    onScroll = (e) => {
        const offsetY = e.nativeEvent.contentOffset.y;
        const maxOffsetY = e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height;
        this.offsetY = offsetY;
        this.ratioY = offsetY / maxOffsetY;
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
        if (autoRemove) {
            this.after = this.editMonth(this.after, -1);
        }
        const [ month, year ] = this.before;

        if (currMonths === null) currMonths = this.state.months;
        if (autoRemove) currMonths.splice(-1, 1);
        const addMonths = { month: month, year: year, data: GetBlockMonth(month, year) };
        const newMonths = [ addMonths, ...currMonths ];

        if (!autoRemove) return newMonths;
        return new Promise((resolve, reject) => {
            this.setState({ months: newMonths }, () => {
                this.flatlist.scrollToOffset({ offset: this.offsetY + 284, animated: false });
                resolve();
            });
        });
    }

    addMonthToBottom = (currMonths = null, autoRemove = true) => {
        this.after = this.editMonth(this.after, 1);
        if (autoRemove) {
            this.before = this.editMonth(this.before, 1);
        }
        const [ month, year ] = this.after;

        if (currMonths === null) currMonths = this.state.months;
        if (autoRemove) currMonths.splice(0, 1);
        const addMonths = { month: month, year: year, data: GetBlockMonth(month, year) };
        const newMonths = [ ...currMonths, addMonths ];

        if (!autoRemove) return newMonths;
        return new Promise((resolve, reject) => {
            this.setState({ months: newMonths }, () => {
                this.flatlist.scrollToOffset({ offset: this.offsetY - 284, animated: false });
                resolve();
            });
        });
    }

    daySelect = async (day = null, month = null, year = null) => {
        if (day !== null) {
            const block = GetBlockMonth(month, year);
            const week = block.find(w => w.includes(day));
            this.setState({
                selectedDate: day,
                selectedMonth: month,
                selectedYear: year,
                currWeek: week
            });
            if (!this.state.opened) {
                await this.showPanel();
            }
        } else {
            if (this.state.opened) {
                await this.hidePanel();
            }
            this.setState({
                selectedDate: null,
                selectedMonth: null,
                selectedYear: null,
                currWeek: []
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
        date.setDate(date.getDate() + move);

        const newDay = date.getDate();
        const newMonth = date.getMonth();
        const newYear = date.getFullYear();
        this.daySelect(newDay, newMonth, newYear);
    }

    /* OLD */

    addSkill = () => {
        if (dataManager.skills.getAll().length <= 1) {
            console.warn("Aucun skill !");
            return;
        }
        user.changePage('activity');
    }
    skill_click = (activity) => {
        user.changePage('activity', {'activity': activity});
    }
    skill_remove = (activity) => {
        const remove = (button) => {
            if (button === 'yes') {
                user.activities.Remove(activity);
            }
        }
        const title = langManager.curr['calendar']['alert-remove-title'];
        const text = langManager.curr['calendar']['alert-remove-text'];
        user.openPopup('yesno', [ title, text ], remove);
    }

    onChangeDateTimePicker = (date) => {
        const activities = user.activities.getByDate(date).reverse();
        //this.hideDTP();
        this.setState({ activities: activities });
    }

}

export default BackCalendar;