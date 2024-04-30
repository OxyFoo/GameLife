import { Animated, Linking } from 'react-native';
import Config from 'react-native-config';
import RNExitApp from 'react-native-exit-app';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Initialisation } from 'App/Loading';
import { Sleep } from 'Utils/Functions';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Interface/OldComponents/Icon').Icons} Icons
 * @typedef {keyof import('Managers/LangManager').Lang['app']['loading-error-message']} ErrorMessages
 */

class BackLoading extends PageBase {
    state = {
        icon: 0,
        animTestButton: new Animated.Value(1),
        displayedSentence: ''
    }

    startY = 0;
    intervalId = null;

    componentDidMount() {
        super.componentDidMount();
        Initialisation(this.nextStep, this.nextPage, this.handleError);

        this.pickRandomSentence();
        this.intervalId = setInterval(this.pickRandomSentence, 3 * 1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    pickRandomSentence = () => {
        const sentences = langManager.curr['loading'];
        const randomIndex = Math.floor(Math.random() * sentences.length);
        this.setState({ displayedSentence: sentences[randomIndex] });
    }

    onToucheStart = (event) => {
        this.startY = event.nativeEvent.pageY;
    }
    onToucheEnd = (event) => {
        // Check if the user is offline and if he has scrolled up to open the console
        if (event.nativeEvent.pageY - this.startY < -200 && !user.server.online) {
            user.interface.console.Enable();
        }
    }

    handleDiscordRedirection = () => {
        Linking.openURL('https://discord.com/invite/FfJRxjNAwS');
    }

    /** @param {ErrorMessages} message */
    handleError = (message) => {
        const lang = langManager.curr['app'];
        user.interface.ChangePage('display', {
            /** @type {Icons} */
            'icon': 'error',
            'iconRatio': .4,
            'text': lang['loading-error-message'][message],
            'button': lang['loading-error-button'],
            'action': RNExitApp.exitApp
        }, true);
    }

    nextStep = () => {
        this.setState({ icon: this.state.icon + 1 });
    }

    nextPage = async () => {
        // If test release, go to test page
        const { icon } = this.state;
        const isTestMode = Config.ENV === 'test' && !__DEV__;

        // Loading finished & test mode (release) => go to "test message"
        if (isTestMode && icon === 3) {
            this.setState({ icon: icon + 1 });
            setTimeout(() => {
                SpringAnimation(this.state.animTestButton, 0).start();
            }, user.settings.testMessageReaded ? 0 : 5000);
            return;
        }

        // Start tutorial & valid test message
        const homeProps = {};
        if (!user.settings.tutoFinished || !user.settings.testMessageReaded) {
            if (!user.settings.tutoFinished) {
                homeProps.tuto = 1;
                user.settings.tutoFinished = true;
            }
            if (!user.settings.testMessageReaded) {
                user.settings.testMessageReaded = true;
            }
            await user.settings.Save();
        }

        // Go to home or activity timer
        if (user.activities.currentActivity.Get() === null) {
            while (!user.interface.ChangePage('home', homeProps))
                await Sleep(100);
        } else {
            while (!user.interface.ChangePage('activitytimer', undefined, true))
                await Sleep(100);
        }
    }
}

export default BackLoading;
