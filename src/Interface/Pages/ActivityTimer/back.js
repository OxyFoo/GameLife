import { Animated, Linking } from 'react-native';

import { PageBase } from 'Interface/Components';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { GetLocalTime } from 'Utils/Time';
import { SpringAnimation } from 'Utils/Animations';
import { AddActivityNow, MAX_TIME_MINUTES, MIN_TIME_MINUTES } from 'Utils/Activities';

/**
 * @typedef {import('Class/Settings').MusicLinks} MusicLinks
 * @typedef {import('Interface/Components/Icon').Icons} Icons
 * @typedef {import('Types/UserOnline').CurrentActivity} CurrentActivity
 */

class BackActivityTimer extends PageBase {
    state = {
        /** @type {CurrentActivity | null} */
        currentActivity: user.activities.currentActivity.Get()
    }

    /** @type {boolean} */
    finished = false;

    constructor (props) {
        super(props);

        if (user.activities.currentActivity.Get() === null) {
            user.interface.BackHandle();
            return;
        }

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

    componentDidMount() {
        this.timer_tick = window.setInterval(this.tick, 1000);
        user.interface.SetCustomBackHandler(this.onPressCancel);
        this.currentActivityEvent = user.activities.currentActivity.AddListener(this.onCurrentActivityChange);

        if (user.tcp.IsConnected()) {
            user.tcp.Send({
                action: 'start-activity',
                activity: this.state.currentActivity
            });
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer_tick);
        user.interface.ResetCustomBackHandler();
        user.activities.currentActivity.RemoveListener(this.currentActivityEvent);

        // Clear if activity is finished
        if (this.finished === true) {
            if (user.tcp.IsConnected()) {
                user.tcp.Send({ action: 'stop-activity' });
            }

            user.activities.currentActivity.Set(null);
            user.LocalSave();
        }
    }

    /**
     * @description Tick function, called every second to update the timer
     *                               and check if the activity is finished
     * @returns {void}
     */
    tick = () => {
        const { skillID, startTime } = this.state.currentActivity;
        const duration = this.__getDuration();

        // Check if time plage is free
        if (duration > 0 && !user.activities.TimeIsFree(startTime, duration)) {
            this.onPressComplete();
        }

        // Check if activity exceeds max time
        const maxDuration = skillID === 168 ? 12 * 60 : MAX_TIME_MINUTES;
        if (duration >= maxDuration) {
            this.onPressComplete();
        }
    }

    __getDuration = () => {
        const { startTime } = this.state.currentActivity;
        const now = GetLocalTime();
        const currentMillis = new Date().getMilliseconds() / 1000;
        const duration = (now + currentMillis - startTime) / 60;
        return duration;
    }

    /** @param {CurrentActivity} currentActivity */
    onCurrentActivityChange = (currentActivity) => {
        this.setState({ currentActivity });
        user.LocalSave();
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
        const { skillID, startTime, friendsIDs } = this.state.currentActivity;

        // Too short
        const now = GetLocalTime();
        if (now - startTime < MIN_TIME_MINUTES * 60 / 2) {
            const lang = langManager.curr['activity'];
            const title = lang['timeralert-tooshort-title'];
            const text = lang['timeralert-tooshort-text'];

            user.interface.popup.Open('ok', [ title, text ]);
            return;
        }

        this.finished = true;

        AddActivityNow(skillID, startTime, now, friendsIDs, this.Back);
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
