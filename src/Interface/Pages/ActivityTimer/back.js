import { Animated, Linking } from 'react-native';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { GetLocalTime, RoundTimeTo } from 'Utils/Time';
import { SpringAnimation } from 'Utils/Animations';
import { AddActivityNow, TIME_STEP_MINUTES, MAX_TIME_MINUTES, MIN_TIME_MINUTES } from 'Utils/Activities';

/**
 * @typedef {import('Types/Global/Links').MusicLinksKeys} MusicLinksKeys
 */

class BackActivityTimer extends PageBase {
    state = {
        currentActivity: user.activities.currentActivity.Get()
    };

    /** @type {Symbol | null} */
    currentActivityEvent = null;

    /** @type {boolean} */
    finished = false;

    /** @param {any} props */
    constructor(props) {
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

        /** @type {Record<MusicLinksKeys, Animated.Value>} */
        this.animations = Object.assign({}, ...transformedLinksArray);
    }

    componentDidMount() {
        this.timer_tick = setInterval(this.tick, 1000);
        user.interface.AddCustomBackHandler(this.onPressCancel);
        this.currentActivityEvent = user.activities.currentActivity.AddListener((currentActivity) => {
            this.setState({ currentActivity });
        });

        if (user.server2.IsAuthenticated() && this.state.currentActivity !== null) {
            user.server2.tcp.Send({
                action: 'start-activity',
                activity: this.state.currentActivity
            });
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer_tick);
        user.interface.RemoveCustomBackHandler(this.onPressCancel);
        user.activities.currentActivity.RemoveListener(this.currentActivityEvent);

        // Clear if activity is finished
        if (this.finished === true) {
            if (user.server2.IsAuthenticated()) {
                user.server2.tcp.Send({ action: 'stop-activity' });
            }

            user.activities.currentActivity.Set(null);
            user.SaveLocal();
        }
    }

    /**
     * @description Tick function, called every second to update the timer
     *                               and check if the activity is finished
     * @returns {void}
     */
    tick = () => {
        const { currentActivity } = this.state;

        if (currentActivity === null) {
            this.Back();
            return;
        }

        const { skillID, startTime } = currentActivity;
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
    };

    __getDuration = () => {
        const { currentActivity } = this.state;

        if (currentActivity === null) {
            return 0;
        }

        const { startTime } = currentActivity;
        const now = GetLocalTime();
        const currentMillis = new Date().getMilliseconds() / 1000;
        const duration = (now + currentMillis - startTime) / 60;
        return duration;
    };

    onPressCancel = () => {
        const title = langManager.curr['activity']['timeralert-cancel-title'];
        const message = langManager.curr['activity']['timeralert-cancel-message'];
        user.interface.popup?.OpenT({
            type: 'yesno',
            data: { title, message },
            callback: (button) => {
                if (button === 'yes') {
                    this.finished = true;
                    this.Back();
                }
            }
        });
        return false;
    };

    onPressComplete = () => {
        const { currentActivity } = this.state;

        if (currentActivity === null) {
            this.Back();
            return;
        }

        const { skillID, startTime, friendsIDs } = currentActivity;
        const now = GetLocalTime();

        const startTimeRounded = RoundTimeTo(TIME_STEP_MINUTES, startTime, 'near');
        const endTimeRounded = RoundTimeTo(TIME_STEP_MINUTES, now, 'near');

        // Too short
        if (endTimeRounded - startTimeRounded <= (MIN_TIME_MINUTES * 60) / 2) {
            const lang = langManager.curr['activity'];
            const title = lang['timeralert-tooshort-title'];
            const message = lang['timeralert-tooshort-message'];

            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title, message }
            });
            return;
        }

        this.finished = true;

        AddActivityNow(skillID, startTime, now, friendsIDs, this.Back);
    };

    Back = () => {
        clearInterval(this.timer_tick);
        if (user.interface.history.length > 1) {
            user.interface.RemoveCustomBackHandler(this.onPressCancel);
            user.interface.BackHandle();
        } else {
            user.interface.ChangePage('calendar');
        }
    };

    /** @param {MusicLinksKeys} musicKey */
    openURL = (musicKey) => {
        const url = user.settings.musicLinks[musicKey];
        Linking.openURL(url).catch((err) => user.interface.console?.AddLog('error', "Couldn't load page", err));
    };
}

export default BackActivityTimer;
