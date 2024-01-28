import { Animated, Linking } from 'react-native';

import { PageBase } from 'Interface/Components';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { AddActivityNow, TIME_STEP_MINUTES } from 'Utils/Activities';
import { GetTime, RoundTimeTo } from 'Utils/Time';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Class/Settings').MusicLinks} MusicLinks
 * @typedef {import('Interface/Components/Icon').Icons} Icons
 */

class BackActivityTimer extends PageBase {
    /** @type {boolean} */
    finished = false;

    constructor (props) {
        super(props);

        if (user.activities.currentActivity === null) {
            user.interface.BackHandle();
            return;
        }

        user.interface.SetCustomBackHandler(this.onPressCancel);
        this.timer_tick = window.setInterval(this.tick, 1000);

        const transformedLinksArray = Object.keys(user.settings.musicLinks).map((key, index) => {
            const animation = new Animated.Value(1);
            setTimeout(() => {
                SpringAnimation(animation, 0).start();
            }, 200 * index);
            return { [key]: animation };
        });

        /** @type {Record<keyof MusicLinks, Animated.Value>} */
        this.animations = Object.assign({}, ...transformedLinksArray);
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
        const duration = this.__getDuration();

        // Check if time plage is free
        if (duration > 0 && !user.activities.TimeIsFree(startTime, duration)) {
            this.onPressComplete();
        }
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

    /** @param {keyof MusicLinks} musicKey */
    openURL = (musicKey) => {
        const url = user.settings.musicLinks[musicKey];
        Linking.openURL(url).catch(err =>
            user.interface.console.AddLog('error', "Couldn't load page", err)
        );
    };
}

export default BackActivityTimer;
