import * as React from 'react';
import { StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';

import { GetTime } from 'Utils/Time';
import { ActivityExperience } from 'Interface/Widgets';

class ActivityTimerScore extends React.Component {
    state = {
        /** @type {number} Used to show estimated stats */
        duration: 0
    }

    constructor(props) {
        super(props);

        const skill = dataManager.skills.GetByID(user.activities.currentActivity.skillID);
        if (skill === null) {
            user.interface.BackHandle();
            return;
        }

        this.state.duration = this.__getDuration();
    }

    componentDidMount() {
        this.timer_tick = window.setInterval(this.tick, 200);
    }
    componentWillUnmount() {
        clearInterval(this.timer_tick);
    }

    /**
     * @description Tick function, called every second to update the timer
     * @returns {void}
     */
    tick = () => {
        const duration = this.__getDuration();
        this.setState({ duration });
    }

    __getDuration = () => {
        const { localTime } = user.activities.currentActivity;
        const now = GetTime(undefined, 'local');
        const currentMillis = new Date().getMilliseconds() / 1000;
        const duration = (now + currentMillis - localTime) / 60;
        return duration;
    }

    render() {
        const { duration } = this.state;

        return (
            <ActivityExperience
                style={styles.experience}
                skillID={user.activities.currentActivity.skillID}
                duration={duration}
            />
        );
    }
}

const styles = StyleSheet.create({
    experience: {
        marginBottom: 24
    }
});

export default ActivityTimerScore;
