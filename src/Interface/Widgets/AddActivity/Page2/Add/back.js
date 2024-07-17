import React from 'react';

import { Activity } from 'Class/Activities';
import { MinMax } from 'Utils/Functions';
import { GetDate, GetLocalTime } from 'Utils/Time';
import {
    AddActivity,
    EditActivity,
    MAX_TIME_MINUTES,
    MIN_TIME_MINUTES,
    RemoveActivity,
    TIME_STEP_MINUTES
} from 'Utils/Activities';

/**
 * @typedef {import('Interface/Components').Digit} Digit
 * @typedef {import('Interface/Components').InputText} InputText
 *
 * @typedef {Object} BackActivityPage2AddPropsType
 * @prop {Activity} activity
 * @prop {Activity | null} editActivity
 * @prop {(newActivity: Activity) => Promise<void>} changeActivity
 * @prop {() => void} unSelectActivity
 */

/** @type {BackActivityPage2AddPropsType} */
const BackActivityPage2AddProps = {
    activity: new Activity(),
    editActivity: null,
    changeActivity: async () => {},
    unSelectActivity: () => {}
};

class BackActivityPage2Add extends React.Component {
    state = {
        /** @type {number} Index of digits */
        selectedHours: 1,

        /** @type {number} Index of digits */
        selectedMinutes: 0,

        /** @type {'' | 'date' | 'time' | 'datetime'} */
        DTPMode: '',

        /** @type {'startTime' | 'endTime'} */
        DTPType: 'startTime',

        DTPDate: new Date()
    };

    /** @param {BackActivityPage2AddPropsType} props */
    constructor(props) {
        super(props);

        const { activity } = props;
        this.state.selectedHours = Math.floor(activity.duration / 60);
        this.state.selectedMinutes = activity.duration % 60;
    }

    onAddActivity = () => {
        const { activity, editActivity } = this.props;

        if (activity.skillID === 0) {
            return;
        }

        if (editActivity === null) {
            AddActivity(activity);
        } else {
            EditActivity(editActivity, activity);
        }
    };

    onRemoveActivity = () => {
        const { editActivity } = this.props;

        if (editActivity === null) {
            return;
        }

        RemoveActivity(editActivity);
    };

    setDate = () => {
        const { activity } = this.props;
        this.showDTP('date', 'startTime', activity.startTime);
    };
    setStartTime = () => {
        const { activity } = this.props;
        this.showDTP('time', 'startTime', activity.startTime);
    };

    /** @type {Digit['props']['onChangeValue']} */
    setDurationHours = (duration) => {
        const { activity, changeActivity } = this.props;
        const { selectedMinutes } = this.state;

        if (activity.skillID === 0) {
            return;
        }

        const hours = duration;
        const minutes = selectedMinutes;
        const total = hours * 60 + minutes;

        this.setState({ selectedHours: duration }, () => {
            changeActivity({
                ...activity,
                duration: total
            });
        });
    };

    /** @type {Digit['props']['onChangeValue']} */
    setDurationMinutes = (duration) => {
        const { activity, changeActivity } = this.props;
        const { selectedHours } = this.state;

        if (activity.skillID === 0) {
            return;
        }

        const minutes = duration * TIME_STEP_MINUTES;
        const total = selectedHours * 60 + minutes;

        this.setState({ selectedMinutes: minutes }, () => {
            changeActivity({
                ...activity,
                duration: total
            });
        });
    };

    setDurationByTime = () => {
        const { activity } = this.props;

        if (activity.skillID === 0) {
            return;
        }

        const endDate = GetDate(activity.startTime);
        endDate.setHours(endDate.getHours() + Math.floor(activity.duration / 60));
        endDate.setMinutes(endDate.getMinutes() + (activity.duration % 60));
        const endTime = GetLocalTime(endDate);
        this.showDTP('time', 'endTime', endTime);
    };

    /** @type {InputText['props']['onChangeText']} */
    setCommentary = (text) => {
        const { activity, changeActivity } = this.props;

        if (activity.skillID === 0) {
            return;
        }

        changeActivity({
            ...activity,
            comment: text
        });
    };

    /**
     * @param {'date' | 'time'} mode
     * @param {'startTime' | 'endTime'} type
     * @param {number} dateTime
     */
    showDTP = (mode, type, dateTime) => this.setState({ DTPMode: mode, DTPType: type, DTPDate: GetDate(dateTime) });

    hideDTP = () => this.setState({ DTPMode: '' });

    /** @param {Date} date UTC date */
    onChangeDateTimePicker = (date) => {
        const { activity, changeActivity } = this.props;
        const { DTPType } = this.state;

        if (activity.skillID === 0) {
            return;
        }

        if (DTPType === 'startTime') {
            const pickedTime = GetLocalTime(date);
            this.setState(
                {
                    DTPMode: '',
                    DTPDate: date
                },
                () => {
                    changeActivity({
                        ...activity,
                        startTime: pickedTime
                    });
                }
            );
        } else if (DTPType === 'endTime') {
            const pickedHours = date.getHours();
            const pickedMinutes = date.getMinutes();
            const pickedTotalTime = pickedHours * 60 + pickedMinutes;

            const currentDate = GetDate(activity.startTime);
            const currentHours = currentDate.getHours();
            const currentMinutes = currentDate.getMinutes();
            const currentTotalTime = currentHours * 60 + currentMinutes;

            let rawDeltaMinutes = pickedTotalTime - currentTotalTime;
            if (rawDeltaMinutes < 0) {
                rawDeltaMinutes += 24 * 60;
            }
            const deltaMinutes = MinMax(MIN_TIME_MINUTES, rawDeltaMinutes, MAX_TIME_MINUTES);
            const newHoursIndex = Math.floor(deltaMinutes / 60);
            const newMinutesIndex = Math.floor((deltaMinutes % 60) / TIME_STEP_MINUTES);

            changeActivity({
                ...activity,
                duration: deltaMinutes
            }).then(() => {
                this.setState({
                    selectedHours: newHoursIndex,
                    selectedMinutes: newMinutesIndex * TIME_STEP_MINUTES,
                    DTPMode: ''
                });
            });
        }
    };
}

BackActivityPage2Add.defaultProps = BackActivityPage2AddProps;
BackActivityPage2Add.prototype.props = BackActivityPage2AddProps;

export default BackActivityPage2Add;
