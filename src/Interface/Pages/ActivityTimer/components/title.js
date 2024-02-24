import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { Text } from 'Interface/Components';
import { DateToFormatTimeString } from 'Utils/Date';
import { GetDate, GetLocalTime } from 'Utils/Time';
import { TwoDigit } from 'Utils/Functions';

/**
 * @typedef {import('Types/UserOnline').CurrentActivity} CurrentActivity
 */

const ActivityTimerTitleProps = {
    /** @type {CurrentActivity | null} */
    currentActivity: null
};

class ActivityTimerTitle extends React.Component {
    state = {
        displayActivity: '',
        displayInitialTime: '00:00',
        displayCurrentTime: '00:00:00'
    }

    /** @param {ActivityTimerTitleProps} props */
    constructor(props) {
        super(props);

        const currentActivity = this.props.currentActivity;
        const skill = dataManager.skills.GetByID(currentActivity?.skillID);
        if (skill === null) {
            return;
        }

        const { startTime } = currentActivity;
        this.state.displayActivity = langManager.GetText(skill.Name);
        this.state.displayInitialTime = DateToFormatTimeString(GetDate(startTime));
        this.state.displayCurrentTime = this.__getCurrentTime();
    }

    componentDidMount() {
        this.timer_tick = window.setInterval(this.tick, 500);
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
    }

    __getCurrentTime = () => {
        const { currentActivity } = this.props;
        if (currentActivity === null) {
            return '00:00:00';
        }

        const { startTime } = currentActivity;

        const time = GetLocalTime() - startTime;
        const HH = Math.floor(time / 3600);
        const MM = Math.floor((time - (HH * 3600)) / 60);
        const SS = time - (HH * 3600) - (MM * 60);

        return [HH, MM, SS].map(TwoDigit).join(':');
    }

    render() {
        const lang = langManager.curr['activity'];
        const { displayActivity, displayInitialTime, displayCurrentTime } = this.state;
        const { currentActivity } = this.props;
        if (currentActivity === null) {
            return null;
        }

        const textLaunch = lang['timer-launch'] + ' ' + displayInitialTime;

        return (
            <View>
                <Text style={styles.headActivityText}>{displayActivity}</Text>
                <Text style={styles.headText}>{textLaunch}</Text>
                <Text fontSize={48}>{displayCurrentTime}</Text>
            </View>
        );
    }
}

ActivityTimerTitle.prototype.props = ActivityTimerTitleProps;
ActivityTimerTitle.defaultProps = ActivityTimerTitleProps;

const styles = StyleSheet.create({
    headActivityText: {
        fontSize: 36
    },
    headText: {
        fontSize: 20
    }
});

export default ActivityTimerTitle;
