import { Animated, Linking } from 'react-native';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { GetLocalTime, RoundTimeTo } from 'Utils/Time';
import { SpringAnimation } from 'Utils/Animations';
import { AddActivityNow, TIME_STEP_MINUTES, MAX_TIME_MINUTES, MIN_TIME_MINUTES } from 'Utils/Activities';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Global/Links').MusicLinksKeys} MusicLinksKeys
 */

class BackActivityTimer extends PageBase {
    state = {
        currentActivity: user.activities.currentActivity.Get(),
        loading: false
    };

    /** @type {Symbol | null} */
    currentActivityEvent = null;

    /** @type {boolean} */
    #loading = false;

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
    }

    componentWillUnmount() {
        clearInterval(this.timer_tick);
        user.interface.RemoveCustomBackHandler(this.onPressCancel);
        user.activities.currentActivity.RemoveListener(this.currentActivityEvent);
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
                    this.Back();
                }
            }
        });
        return false;
    };

    onPressComplete = async () => {
        const { currentActivity } = this.state;

        if (this.#loading) {
            return;
        }

        if (currentActivity === null) {
            this.Back();
            return;
        }

        const { skillID, startTime, friendsIDs } = currentActivity;
        const now = GetLocalTime();

        const startTimeRounded = RoundTimeTo(TIME_STEP_MINUTES, startTime, 'near');
        const endTimeRounded = RoundTimeTo(TIME_STEP_MINUTES, now, 'near');

        // Too short
        const deltaTime = (endTimeRounded - startTimeRounded) / 60;
        if (deltaTime <= MIN_TIME_MINUTES / 2) {
            const lang = langManager.curr['activity'];
            const title = lang['timeralert-tooshort-title'];
            const message = lang['timeralert-tooshort-message'];

            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title, message }
            });
            return;
        }

        this.#loading = true;
        this.setState({ loading: true });

        const activityAdded = await AddActivityNow(skillID, startTime, now, friendsIDs);

        if (activityAdded) {
            this.Back();
        }

        this.setState({ loading: false }, () => {
            this.#loading = false;
        });
    };

    Back = () => {
        clearInterval(this.timer_tick);

        user.activities.currentActivity.Set(null);
        user.SaveLocal();

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
