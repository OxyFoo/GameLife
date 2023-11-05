import * as React from 'react';
import { Animated } from 'react-native';

import { SpringAnimation } from 'Utils/Animations';
import { TIME_STEP_MINUTES } from 'Utils/Activities';
import { GetTime, GetTimeZone } from 'Utils/Time';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Interface/Components/Digit/back').DigitCallback} DigitCallback
 */

const ActivityScheduleProps = {
    /** @type {ColorTheme} */
    mainColor: 'main1',

    /** @type {boolean} If false, disable user edition */
    editable: true,

    /** @type {number} UTC unix timestamp */
    selectedDate: GetTime(),

    /** @type {number} Duration in minutes */
    selectedDuration: 60,

    /**
     * @param {number} startTime Unix timestamp of the start of the activity
     * @param {number} durationTime Duration of the activity in minutes
     */
    onChange: (startTime, durationTime) => {},

    /**
     * Called when component is opened or closed
     * @param {boolean} opened 
     */
    onChangeState: (opened) => {}
}

class ActivityScheduleBack extends React.Component {
    state = {
        /** @type {Animated.Value} */
        anim: new Animated.Value(0),

        /** @type {boolean} Open or closed */
        selectionMode: false,

        /** @type {LayoutChangeEvent['nativeEvent']['layout']} */
        parent: { width: 0, height: 0, x: 0, y: 0 },

        /** @type {''|'date'|'time'|'datetime'} */
        DTPMode: ''
    }

    componentDidMount() {
        this.resetSelectionMode(true); // TODO: Need ?
    }

    /** @param {LayoutChangeEvent} ev */
    onLayout = (ev) => this.setState({ parent: ev.nativeEvent.layout });

    changeSelectionMode = () => {
        const newMode = !this.state.selectionMode;

        // If panel is already open, or it's closed and editable
        if (!newMode || this.props.editable) {
            const callback = () => this.props.onChangeState(newMode);
            SpringAnimation(this.state.anim, newMode ? 1 : 0).start();
            this.setState({ selectionMode: newMode }, callback);
        }
    }

    resetSelectionMode = (init = false) => {
        if (this.props.editable || init === true) {
            const today = GetTime();
            // Get start time at last TIME_STEP_MINUTES (e.g. 8h33 -> 8h30)
            const startTime = today - (today % (TIME_STEP_MINUTES * 60));
            const duration = 60;
            this.props.onChange(startTime, duration);
        }
    }

    /** @param {'date'|'time'} mode */
    showDTP = (mode) => this.setState({ DTPMode: mode });
    hideDTP = () => this.setState({ DTPMode: '' });

    /** @param {Date} date UTC date */
    onChangeDateTimePicker = (date) => {
        this.hideDTP();

        const pickedTime = GetTime(date, 'global');
        let newStartTime = this.props.selectedDate;

        newStartTime = pickedTime - GetTimeZone() * 3600;
        this.props.onChange(newStartTime, this.props.selectedDuration);
    }

    /** @type {DigitCallback} */
    onChangeDuration = (name, index) => {
        // Get current durations (hour / minute)
        let durationHours = Math.floor(this.props.selectedDuration / 60);
        let durationMinutes = this.props.selectedDuration % 60;

        // Update duration
        if (name === 'duration_hour')
            durationHours = index;
        else if (name === 'duration_minute')
            durationMinutes = index * TIME_STEP_MINUTES;

        // Update state
        const durationTotal = durationHours * 60 + durationMinutes;
        this.props.onChange(this.props.selectedDate, durationTotal);
    }
}

ActivityScheduleBack.prototype.props = ActivityScheduleProps;
ActivityScheduleBack.defaultProps = ActivityScheduleProps;

export default ActivityScheduleBack;