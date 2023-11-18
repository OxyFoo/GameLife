import { PageBack } from 'Interface/Components';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { AddActivityNow, TIME_STEP_MINUTES } from 'Utils/Activities';
import { TwoDigit } from 'Utils/Functions';
import { DateToFormatTimeString } from 'Utils/Date';
import { GetDate, GetTime, RoundTimeTo } from 'Utils/Time';

/**
 * @typedef {import('Interface/Components/Icon').Icons} Icons
 */

class BackActivityTimer extends PageBack {
    state = {
        displayActivity: '',
        displayInitialTime: '00:00',
        displayCurrentTime: '00:00:00',

        /** @type {number} Used to show estimated stats */
        duration: 0
    };

    /** @type {boolean} */
    finished = false;

    constructor (props) {
        super(props);

        if (user.activities.currentActivity === null) {
            user.interface.BackHandle();
            return;
        }

        const { localTime } = user.activities.currentActivity;
        const skill = dataManager.skills.GetByID(user.activities.currentActivity.skillID);
        if (skill === null) {
            user.interface.BackHandle();
            return;
        }

        this.state.displayActivity = dataManager.GetText(skill.Name);
        this.state.displayInitialTime = DateToFormatTimeString(GetDate(localTime));
        this.state.displayCurrentTime = this.__getCurrentTime();
        this.state.duration = this.__getDuration();

        user.interface.SetCustomBackHandler(this.onPressCancel);
        this.timer_tick = window.setInterval(this.tick, 100);
    }

    componentWillUnmount() {
        clearInterval(this.timer_tick);
        user.interface.ResetCustomBackHandler();

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

        const displayCurrentTime = this.__getCurrentTime();
        const duration = this.__getDuration();

        // Check if time plage is free
        if (duration > 0 && !user.activities.TimeIsFree(startTime, duration)) {
            this.onPressComplete();
            return;
        }

        // Update time
        this.setState({ duration, displayCurrentTime });
    }

    __getCurrentTime = () => {
        const { localTime } = user.activities.currentActivity;

        const time = GetTime(undefined, 'local') - localTime;
        const HH = Math.floor(time / 3600);
        const MM = Math.floor((time - (HH * 3600)) / 60);
        const SS = time - (HH * 3600) - (MM * 60);

        return [HH, MM, SS].map(TwoDigit).join(':');
    }

    __getDuration = () => {
        const { localTime } = user.activities.currentActivity;
        const now = GetTime(undefined, 'local');
        const currentMillis = new Date().getMilliseconds() / 1000;
        const duration = (now + currentMillis - localTime) / 60;
        return duration;
    }

    onPressCancel = () => {
        const remove = (button) => {
            if (button === 'yes') {
                this.finished = true;
                this.Back();
            }
        }
        const title = langManager.curr['activity']['timeralert-cancel-title'];
        const text = langManager.curr['activity']['timeralert-cancel-text'];
        user.interface.popup.Open('yesno', [ title, text ], remove);
        return false;
    }
    onPressComplete = () => {
        const { skillID, startTime } = user.activities.currentActivity;

        // Too short
        const now = GetTime(undefined, 'local');
        const endTime = RoundTimeTo(TIME_STEP_MINUTES, now, 'near');
        if (startTime >= endTime) {
            const lang = langManager.curr['activity'];
            const title = lang['timeralert-tooshort-title'];
            const text = lang['timeralert-tooshort-text'];

            user.interface.popup.Open('ok', [ title, text ]);
            return;
        }

        this.finished = true;

        // Get categoryID & duration
        let duration = (endTime - startTime) / 60;
        duration = Math.max(TIME_STEP_MINUTES, duration);

        AddActivityNow(skillID, startTime, duration, this.Back);
    }

    Back = () => {
        clearInterval(this.timer_tick);
        if (user.interface.path.length > 1) {
            user.interface.ResetCustomBackHandler();
            user.interface.BackHandle();
        } else {
            user.interface.ChangePage('calendar');
        }
    }
}

export default BackActivityTimer;