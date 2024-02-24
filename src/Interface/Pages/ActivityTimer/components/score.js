import * as React from 'react';

import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { GetLocalTime } from 'Utils/Time';
import { ActivityExperience } from 'Interface/Widgets';

/**
 * @typedef {import('Types/UserOnline').CurrentActivity} CurrentActivity
 */

const ActivityTimerScoreProps = {
    /** @type {CurrentActivity | null} */
    currentActivity: null
};

class ActivityTimerScore extends React.Component {
    state = {
        /** @type {number} Used to show estimated stats */
        duration: 0
    }

    /** @param {ActivityTimerScoreProps} props */
    constructor(props) {
        super(props);

        const currentActivity = this.props.currentActivity;
        const skill = dataManager.skills.GetByID(currentActivity?.skillID);
        if (skill === null) {
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
        const { currentActivity } = this.props;
        if (currentActivity === null) {
            return 0;
        }

        const { startTime } = currentActivity;
        const now = GetLocalTime();
        const currentMillis = new Date().getMilliseconds() / 1000;
        const duration = (now + currentMillis - startTime) / 60;
        return duration;
    }

    render() {
        const lang = langManager.curr['activity'];
        const { duration } = this.state;
        const { currentActivity } = this.props;

        if (currentActivity === null) {
            return null;
        }

        return (
            <ActivityExperience
                title={lang['timer-gain']}
                skillID={currentActivity.skillID}
                duration={duration}
                compact
            />
        );
    }
}

ActivityTimerScore.prototype.props = ActivityTimerScoreProps;
ActivityTimerScore.defaultProps = ActivityTimerScoreProps;

export default ActivityTimerScore;
