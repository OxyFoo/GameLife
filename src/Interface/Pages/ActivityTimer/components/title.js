import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { Text } from 'Interface/Components';
import { DateToFormatTimeString } from 'Utils/Date';
import { GetDate, GetTime } from 'Utils/Time';
import { TwoDigit } from 'Utils/Functions';

class ActivityTimerTitle extends React.Component {
    state = {
        displayActivity: '',
        displayInitialTime: '00:00',
        displayCurrentTime: '00:00:00'
    }

    constructor(props) {
        super(props);

        const skill = dataManager.skills.GetByID(user.activities.currentActivity.skillID);
        if (skill === null) {
            user.interface.BackHandle();
            return;
        }

        const { localTime } = user.activities.currentActivity;
        this.state.displayActivity = langManager.GetText(skill.Name);
        this.state.displayInitialTime = DateToFormatTimeString(GetDate(localTime));
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
        this.setState({
            displayCurrentTime: this.__getCurrentTime()
        });
    }

    __getCurrentTime = () => {
        const { localTime } = user.activities.currentActivity;

        const time = GetTime(undefined, 'local') - localTime;
        const HH = Math.floor(time / 3600);
        const MM = Math.floor((time - (HH * 3600)) / 60);
        const SS = time - (HH * 3600) - (MM * 60);

        return [HH, MM, SS].map(TwoDigit).join(':');
    }

    render() {
        const lang = langManager.curr['activity'];
        const { displayActivity, displayInitialTime, displayCurrentTime } = this.state;

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

const styles = StyleSheet.create({
    headActivityText: {
        fontSize: 36
    },
    headText: {
        fontSize: 20
    }
});

export default ActivityTimerTitle;
