import { PageBack } from 'Interface/Components';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { AddActivityNow } from 'Utils/Activities';
import { MinMax, TwoDigit } from 'Utils/Functions';
import { DateToFormatTimeString } from 'Utils/Date';
import { GetDate, GetTime, RoundToQuarter } from 'Utils/Time';
import dataManager from 'Managers/DataManager';

const MAX_TIME_MINUTES = 4 * 60; // Multiple of 15

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
            user.interface.BackPage();
            return;
        }

        const { localTime } = user.activities.currentActivity;
        const activityName = dataManager.skills.GetByID(user.activities.currentActivity.skillID).Name;

        this.state.displayActivity = dataManager.GetText(activityName);
        this.state.displayInitialTime = DateToFormatTimeString(GetDate(localTime));
        this.state.displayCurrentTime = this.__getCurrentTime();
        this.state.duration = this.__getDuration();

        user.interface.SetCustomBackHandle(this.onPressCancel);
        this.timer_tick = setInterval(this.tick, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer_tick);
        user.interface.ResetCustomBackHandle();

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

        const endTime = RoundToQuarter(GetTime(undefined, 'local'), 'near');
        let duration = Math.max(15, (endTime - startTime) / 60);

        // Check if time plage is free
        if (duration > 0 && !user.activities.TimeIsFree(startTime, duration)) {
            this.onPressComplete();
            return;
        }

        // Update time
        this.setState({
            displayCurrentTime: this.__getCurrentTime(),
            duration: this.__getDuration()
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

    __getDuration = () => {
        const { startTime } = user.activities.currentActivity;
        const currTime = RoundToQuarter(GetTime());
        const duration = (currTime - startTime) / 60;
        return MinMax(0, duration, MAX_TIME_MINUTES);
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
    }
    onPressComplete = () => {
        const { skillID, startTime } = user.activities.currentActivity;

        // Too short
        if (startTime >= RoundToQuarter(GetTime(undefined, 'local'), 'near')) {
            const lang = langManager.curr['activity'];
            const title = lang['timeralert-tooshort-title'];
            const text = lang['timeralert-tooshort-text'];

            user.interface.popup.Open('ok', [ title, text ]);
            return;
        }

        this.finished = true;
        const endTime = RoundToQuarter(GetTime(undefined, 'local'), 'near');
        let duration = Math.max(15, (endTime - startTime) / 60);
        AddActivityNow(skillID, startTime, duration);
    }

    Back = () => {
        clearInterval(this.timer_tick);
        if (user.interface.path.length > 1) {
            user.interface.BackPage();
        } else {
            user.interface.ChangePage('calendar');
        }
    }
}

export default BackActivityTimer;