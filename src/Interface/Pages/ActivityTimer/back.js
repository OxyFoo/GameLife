import { PageBack } from 'Interface/Components';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import Notifications from 'Utils/Notifications';
import { MinMax, TwoDigit } from 'Utils/Functions';
import { DateToFormatTimeString } from 'Utils/Date';
import { GetDate, GetTime, RoundToQuarter } from 'Utils/Time';

const MAX_TIME_MINUTES = 4 * 60; // Multiple of 15

/**
 * @typedef {import('Class/Activities').AddStatus} AddStatus
 */

class BackActivityTimer extends PageBack {
    state = {
        /** @type {string} Displayed time */
        time: '00:00:00',

        /** @type {number} Multiple of 15 */
        duration: 0
    };

    /** @type {number} Unix timestamp (UTC) */
    currentTime = 0;

    /** @type {boolean} */
    finished = false;

    /** @type {string} */
    displayInitialTime = '00:00';

    constructor (props) {
        super(props);

        if (user.activities.currentActivity === null) {
            user.interface.BackPage();
            return;
        }

        const { startTime } = user.activities.currentActivity;
        this.currentTime = GetTime();
        this.state.time = this.__getCurrentTime();
        this.state.duration = this.__getCurrentDuration();
        this.displayInitialTime = DateToFormatTimeString(GetDate(startTime));

        user.interface.backable = false;
        this.timer_tick = setInterval(this.tick, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer_tick);
        user.interface.backable = true;

        // Clear if activity is finished
        if (this.finished === true) {
            user.activities.currentActivity = null;
            user.LocalSave();
        }
    }

    /**
     * @description Tick function, called every second to update the timer
     *                               and check if the activity is finished
     * @returns {void}
     */
    tick = () => {
        const { startTime } = user.activities.currentActivity;

        // Check if the activity does not exceed on any other
        const _sec_startTime = RoundToQuarter(startTime);
        const _sec_endTime = RoundToQuarter(this.currentTime);
        const _min_duration = (_sec_endTime - _sec_startTime) / 60;
        if (_min_duration >= MAX_TIME_MINUTES ||
            !user.activities.TimeIsFree(_sec_startTime, _min_duration))
        {
            this.addActivity();
        }

        // Update time
        this.currentTime = GetTime();
        this.setState({
            time: this.__getCurrentTime(),
            duration: this.__getCurrentDuration()
        });
    }

    __getCurrentTime = () => {
        const { startTime } = user.activities.currentActivity;

        const time = this.currentTime - startTime;
        const HH = Math.floor(time / 3600);
        const MM = Math.floor((time - (HH * 3600)) / 60);
        const SS = time - (HH * 3600) - (MM * 60);

        return [HH, MM, SS].map(TwoDigit).join(':');
    }

    __getCurrentDuration = () => {
        const { startTime } = user.activities.currentActivity;

        const _sec_startTime = RoundToQuarter(startTime);
        const _sec_endTime = RoundToQuarter(this.currentTime);
        const _min_duration = (_sec_endTime - _sec_startTime) / 60;

        return MinMax(0, _min_duration, MAX_TIME_MINUTES);
    }

    onPressCancel = () => {
        const remove = (button) => {
            if (button === 'yes') {
                this.finished = true;
                user.interface.ChangePage('calendar');
            }
        }
        const title = langManager.curr['activity']['timeralert-cancel-title'];
        const text = langManager.curr['activity']['timeralert-cancel-text'];
        user.interface.popup.Open('yesno', [ title, text ], remove);
    }
    onPressComplete = () => {
        const { startTime } = user.activities.currentActivity;

        const _sec_startTime = RoundToQuarter(startTime);
        const _sec_endTime = RoundToQuarter(this.currentTime);
        const _min_duration = (_sec_endTime - _sec_startTime) / 60;

        if (_min_duration < 10) {
            const lang = langManager.curr['activity'];
            const title = lang['timeralert-tooshort-title'];
            const text = lang['timeralert-tooshort-text'];

            user.interface.popup.Open('ok', [ title, text ]);
            return;
        }

        this.addActivity();
    }

    addActivity = () => {
        const { skillID, startTime } = user.activities.currentActivity;

        const _sec_startTime = RoundToQuarter(startTime);
        const _sec_endTime = RoundToQuarter(this.currentTime);
        const _min_duration = (_sec_endTime - _sec_startTime) / 60;
        let _duration = MinMax(15, _min_duration, MAX_TIME_MINUTES);

        /** @type {AddStatus|null} */
        let status = null;
        while (status !== 'added') {
            if (_duration === 0) {
                user.interface.console.AddLog('error', 'Activity: can\'t be added.');
                user.interface.ChangePage('calendar');
                return;
            }
            status = user.activities.Add(skillID, _sec_startTime, _duration);
            _duration -= 15;
        }

        this.finished = true;
        Notifications.Evening.RemoveToday();

        const text = langManager.curr['activity']['display-activity-text'];
        const button = langManager.curr['activity']['display-activity-button'];
        user.interface.ChangePage('display', {
            'icon': 'success',
            'text': text,
            'button': button,
            'callback': () => user.interface.ChangePage('calendar')
        }, true);

        user.GlobalSave();
        user.RefreshStats();
    }
}

export default BackActivityTimer;