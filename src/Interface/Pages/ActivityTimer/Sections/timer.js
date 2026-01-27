import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import langManager from 'Managers/LangManager';

import { Text } from 'Interface/Components';
import { DateFormat } from 'Utils/Date';
import { GetDate, GetLocalTime } from 'Utils/Time';
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
        displayCurrentTime: '00:00:00'
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
        this.setState({ displayCurrentTime: this.__getCurrentTime() });
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
        const { displayInitialTime, displayCurrentTime } = this.state;

        return (
            <View>
                <Text style={styles.startText}>{lang['timer-launch'] + ' ' + displayInitialTime}</Text>
                <Text style={styles.durationText}>{displayCurrentTime}</Text>
            </View>
        );
    }
}

ActivityTimerTimer.prototype.props = ActivityTimerTimerProps;
ActivityTimerTimer.defaultProps = ActivityTimerTimerProps;

export default ActivityTimerTimer;
