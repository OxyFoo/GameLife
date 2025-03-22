import { Animated, Linking } from 'react-native';
import Config from 'react-native-config';
// import RNRestart from 'react-native-restart';
import RNExitApp from 'react-native-exit-app';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Initialisation } from 'App/Loading';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {import('Ressources/Icons').IconsName} IconsName
 * @typedef {keyof import('Managers/LangManager').Lang['app']['loading-error-message']} ErrorMessages
 */

class BackLoading extends PageBase {
    state = {
        icon: 0,

        showTestMessage: false,
        animTestButton: new Animated.Value(1),

        displayedSentence: this.getRandomSentence()
    };

    startY = 0;
    /** @type {NodeJS.Timeout | null} */
    intervalId = null;

    componentDidMount() {
        this.intervalId = setInterval(this.setRandomSentence, 3 * 1000);
        Initialisation(this.fe, this.nextStep, this.nextPage, this.handleError);
    }

    componentWillUnmount() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
        }
    }

    getRandomSentence() {
        const sentences = langManager.curr['loading'];
        const randomIndex = Math.floor(Math.random() * sentences.length);
        return sentences[randomIndex];
    }
    setRandomSentence = () => {
        this.setState({
            displayedSentence: this.getRandomSentence()
        });
    };

    /** @param {GestureResponderEvent} event */
    onToucheStart = (event) => {
        this.startY = event.nativeEvent.pageY;
    };

    /** @param {GestureResponderEvent} event */
    onToucheEnd = (event) => {
        // Check if the user is offline and if he has scrolled up to open the console
        if (event.nativeEvent.pageY - this.startY < -200 && !user.server2.IsConnected()) {
            user.interface.console?.Enable();
        }
    };

    handleDiscordRedirection = () => {
        Linking.openURL('https://discord.com/invite/FfJRxjNAwS');
    };

    /** @param {ErrorMessages} message */
    handleError = (message) => {
        const lang = langManager.curr['app'];
        this.fe.ChangePage('display', {
            args: {
                icon: 'close-filled',
                text: lang['loading-error-message'][message],
                button: lang['loading-error-button'],
                //action: RNRestart.restart
                action: RNExitApp.exitApp // TODO: Redémarrer l'app
            },
            storeInHistory: false
        });
    };

    nextStep = () => {
        this.setState({ icon: this.state.icon + 1 });
    };

    nextPage = async () => {
        // If test release, go to test page
        const { showTestMessage } = this.state;
        const isTestMode = Config.ENV === 'test' && !__DEV__;

        // Loading finished & test mode (release) => go to "test message"
        if (isTestMode && !showTestMessage) {
            this.setState({ showTestMessage: true });
            setTimeout(
                () => {
                    SpringAnimation(this.state.animTestButton, 0).start();
                },
                user.settings.testMessageReaded ? 0 : 5000
            );
            return;
        }

        // Start tutorial & valid test message
        let tuto = 0;
        if (!user.settings.tutoFinished || !user.settings.testMessageReaded) {
            if (!user.settings.tutoFinished) {
                tuto = 1;
                user.settings.tutoFinished = true;
            }
            if (!user.settings.testMessageReaded) {
                user.settings.testMessageReaded = true;
            }
            await user.settings.IndependentSave();
        }

        // Go to home or activity timer
        if (user.activities.currentActivity.Get() === null) {
            this.fe.ChangePage('home', { args: { tuto } });
        } else {
            this.fe.ChangePage('activitytimer', { storeInHistory: false });
        }
    };
}

export default BackLoading;
