import * as React from 'react';

import user from '../../Managers/UserManager';

import { GetTime, RoundToQuarter } from '../../Functions/Time';
import { minmax, twoDigit } from '../../Functions/Functions';
import langManager from '../../Managers/LangManager';

const MAX_TIME = 4 * 60; // Minutes

// TODO - Vérifier lors du tick et de l'ajout que le temps max fonctionne (> 4h ou ne pas mordre sur les actis suivantes)

class BackActivityTimer extends React.Component {
    constructor (props) {
        super(props);

        const activitySet = user.activities.currentActivity !== null;
        if (!activitySet) {
            user.interface.backPage();
            return;
        }

        const [ skillID, startTime ] = user.activities.currentActivity;
        this.state = {
            skillID: skillID,
            startTime: startTime,
            currentTime: GetTime()
        }

        this.finished = false;
        user.interface.backable = false;
        this.timer = setInterval(this.tick, 1000);
    }

    tick = () => {
        this.setState({ currentTime: GetTime() });
        // TODO - Temps max
        // TODO - End in other activity

        const { startTime, currentTime } = this.state;

        const _startTime = RoundToQuarter(startTime);
        const _endTime = RoundToQuarter(currentTime);
        const _duration = (_endTime - _startTime) / 60;
        if (_duration > MAX_TIME || !user.activities.timeIsFree(_startTime, _duration)) {
            this.addActivity();
        }
    }
    componentWillUnmount() {
        clearInterval(this.timer);
        user.interface.backable = true;
        if (this.finished === true) {
            user.activities.currentActivity = null;
            user.localSave();
        }
    }

    getTimer = () => {
        const { startTime, currentTime } = this.state;
        const time = currentTime - startTime;
        const HH = Math.floor(time / 3600);
        const MM = Math.floor((time - (HH * 3600)) / 60);
        const SS = time - (HH * 3600) - (MM * 60);
        return [HH, MM, SS].map(twoDigit).join(':');
    }

    onPressCancel = () => {
        const remove = (button) => {
            if (button === 'yes') {
                this.finished = true;
                user.interface.changePage('calendar');
            }
        }
        const title = langManager.curr['activity']['timeralert-cancel-title'];
        const text = langManager.curr['activity']['timeralert-cancel-text'];
        user.interface.popup.Open('yesno', [ title, text ], remove);
    }
    onPressComplete = () => {
        this.addActivity();
    }

    addActivity = () => {
        const { skillID, startTime, currentTime } = this.state;

        const _startTime = RoundToQuarter(startTime);
        const _endTime = RoundToQuarter(currentTime);
        let _duration = minmax(15, (_endTime - _startTime) / 60, MAX_TIME);

        while (this.finished === false) {
            if (_duration === 0) {
                console.error('Activity can\'t be added.');
                return;
            }
            this.finished = user.activities.Add(skillID, _startTime, _duration);
            _duration -= 15;
        }

        const text = langManager.curr['activity']['display-activity-text'];
        const button = langManager.curr['activity']['display-activity-button'];
        user.interface.changePage('display', { 'icon': 'success', 'text': text, 'button': button }, true);
    }
}

export default BackActivityTimer;