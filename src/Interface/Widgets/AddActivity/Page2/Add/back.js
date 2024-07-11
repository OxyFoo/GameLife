import React from 'react';

import { AddActivity, MAX_TIME_MINUTES, MIN_TIME_MINUTES, TIME_STEP_MINUTES } from 'Utils/Activities';
import { MinMax } from 'Utils/Functions';
import { GetDate, GetGlobalTime, GetLocalTime, GetTimeZone, RoundTimeTo } from 'Utils/Time';

/**
 * @typedef {import('Data/Skills').Skill} Skill
 *
 * @typedef {import('Interface/Components').Digit} Digit
 * @typedef {import('Interface/Components').InputText} InputText
 *
 * @typedef {Object} BackActivityPage2AddPropsType
 * @prop {number | null} skillID
 */

/** @type {BackActivityPage2AddPropsType} */
const BackActivityPage2AddProps = {
    skillID: null
};

class BackActivityPage2Add extends React.Component {
    state = {
        /** @type {number} UTC unix timestamp in seconds */
        selectedDateTime: 0,

        /** @type {number} Index of digits */
        selectedHours: 1,
        /** @type {number} Index of digits */
        selectedMinutes: 0,
        /** @type {number} Total duration in minutes */
        selectedDuration: 60,

        comment: '',

        /** @type {'' | 'date' | 'time' | 'datetime'} */
        DTPMode: '',

        /** @type {'startTime' | 'endTime'} */
        DTPType: 'startTime',

        DTPDate: new Date()
    };

    /** @param {BackActivityPage2AddPropsType} props */
    constructor(props) {
        super(props);

        const dateTime = RoundTimeTo(TIME_STEP_MINUTES, GetLocalTime(), 'near');
        this.state.selectedDateTime = dateTime;
    }

    onAddActivity = () => {
        const { skillID } = this.props;
        const { comment, selectedDateTime, selectedDuration } = this.state;

        if (!skillID) {
            return;
        }

        AddActivity({
            skillID,
            comment,
            addedType: 'normal',
            startTime: selectedDateTime + GetTimeZone() * 3600,
            duration: selectedDuration,
            friends: [],
            timezone: GetTimeZone(),
            addedTime: 0
        });
    };

    setDate = () => {
        const { selectedDateTime } = this.state;
        this.showDTP('date', 'startTime', selectedDateTime);
    };
    setStartTime = () => {
        const { selectedDateTime } = this.state;
        this.showDTP('time', 'startTime', selectedDateTime);
    };

    /** @type {Digit['props']['onChangeValue']} */
    setDurationHours = (duration) => {
        const { selectedMinutes } = this.state;

        const hours = duration;
        const minutes = selectedMinutes;
        const total = hours * 60 + minutes;

        this.setState({
            selectedDuration: total,
            selectedHours: duration
        });
    };

    /** @type {Digit['props']['onChangeValue']} */
    setDurationMinutes = (duration) => {
        const { selectedHours } = this.state;

        const minutes = duration * TIME_STEP_MINUTES;
        const total = selectedHours * 60 + minutes;

        this.setState({
            selectedDuration: total,
            selectedMinutes: minutes
        });
    };

    setDurationByTime = () => {
        const { selectedDateTime, selectedDuration } = this.state;
        const endDate = GetDate(selectedDateTime - GetTimeZone() * 3600);
        endDate.setHours(endDate.getHours() + Math.floor(selectedDuration / 60));
        endDate.setMinutes(endDate.getMinutes() + (selectedDuration % 60));
        const endTime = GetGlobalTime(endDate);
        this.showDTP('time', 'endTime', endTime);
    };

    /** @type {InputText['props']['onChangeText']} */
    setCommentary = (text) => {
        this.setState({ comment: text });
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
        const { DTPType, selectedDateTime } = this.state;

        if (DTPType === 'startTime') {
            const pickedTime = GetGlobalTime(date);
            this.setState({
                selectedDateTime: pickedTime - GetTimeZone() * 3600,
                DTPMode: '',
                DTPDate: date
            });
        } else if (DTPType === 'endTime') {
            const pickedHours = date.getHours();
            const pickedMinutes = date.getMinutes();
            const pickedTotalTime = pickedHours * 60 + pickedMinutes;

            const currentDate = GetDate(selectedDateTime);
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

            this.setState({
                selectedDuration: deltaMinutes,
                selectedHours: newHoursIndex,
                selectedMinutes: newMinutesIndex * TIME_STEP_MINUTES,
                DTPMode: ''
            });
        }
    };
}

BackActivityPage2Add.defaultProps = BackActivityPage2AddProps;
BackActivityPage2Add.prototype.props = BackActivityPage2AddProps;

export default BackActivityPage2Add;
