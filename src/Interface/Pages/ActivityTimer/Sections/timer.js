import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import { DEFAULT_ACTIVITY } from 'Data/User/Activities';

import { Text, Icon } from 'Interface/Components';
import { DateFormat } from 'Utils/Date';
import { TIME_STEP_MINUTES } from 'Utils/Activities';
import { GetDate, GetLocalTime, RoundTimeTo } from 'Utils/Time';
import { TwoDigit } from 'Utils/Functions';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').CurrentActivity} CurrentActivity
 */

const ActivityTimerTimerProps = {
    /** @type {CurrentActivity | null} */
    currentActivity: null
};

class ActivityTimerTimer extends React.Component {
    state = {
        displayInitialTime: '00:00',
        displayCurrentTime: '00:00:00',
        /** Ox the activity would grant if completed now */
        displayOx: 0
    };

    /** @param {ActivityTimerTimerProps} props */
    constructor(props) {
        super(props);

        const { currentActivity } = this.props;
        if (currentActivity === null) {
            return;
        }

        const { startTime } = currentActivity;
        this.state.displayInitialTime = DateFormat(GetDate(startTime), 'HH:mm');
        this.state.displayCurrentTime = this.__getCurrentTime();
        this.state.displayOx = this.__getOx();
    }

    componentDidMount() {
        this.timer_tick = setInterval(this.tick, 500);
    }
    componentWillUnmount() {
        clearInterval(this.timer_tick);
    }

    /**
     * @description Tick function, called every second to update the timer
     * @returns {void}
     */
    tick = () => {
        this.setState({ displayCurrentTime: this.__getCurrentTime(), displayOx: this.__getOx() });
    };

    /**
     * Ox the activity would grant if completed now (1/min, 12h/day limit),
     * with the same 5 minutes rounding as the completion (see BackActivityTimer.onPressComplete)
     * @returns {number}
     */
    __getOx = () => {
        const { currentActivity } = this.props;
        if (currentActivity === null) {
            return 0;
        }

        const { skillID, startTime, timezone } = currentActivity;
        const now = GetLocalTime();

        const startTimeRounded = RoundTimeTo(TIME_STEP_MINUTES, startTime, 'near');
        const endTimeRounded = RoundTimeTo(TIME_STEP_MINUTES, now, 'near');
        const duration = Math.max(0, (endTimeRounded - startTimeRounded) / 60);

        return user.activities.GetOxReward({
            ...DEFAULT_ACTIVITY,
            skillID,
            startTime,
            duration,
            timezone,
            addedTime: now
        });
    };

    __getCurrentTime = () => {
        const { currentActivity } = this.props;
        if (currentActivity === null) {
            return '00:00:00';
        }

        const { startTime } = currentActivity;

        const time = GetLocalTime() - startTime;
        const HH = Math.floor(time / 3600);
        const MM = Math.floor((time - HH * 3600) / 60);
        const SS = time - HH * 3600 - MM * 60;

        return [HH, MM, SS].map(TwoDigit).join(':');
    };

    render() {
        const lang = langManager.curr['activity'];
        const { displayInitialTime, displayCurrentTime, displayOx } = this.state;

        return (
            <View>
                <Text style={styles.startText}>{lang['timer-launch'] + ' ' + displayInitialTime}</Text>
                <Text style={styles.durationText}>{displayCurrentTime}</Text>
                <View style={styles.oxContainer}>
                    <Icon icon='ox' size={20} />
                    <Text style={styles.oxText}>{lang['title-ox'].replace('{}', displayOx.toString())}</Text>
                </View>
            </View>
        );
    }
}

ActivityTimerTimer.prototype.props = ActivityTimerTimerProps;
ActivityTimerTimer.defaultProps = ActivityTimerTimerProps;

export default ActivityTimerTimer;
