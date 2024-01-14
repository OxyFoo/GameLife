import { Animated } from 'react-native';
import RNExitApp from 'react-native-exit-app';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { PageBase } from 'Interface/Components';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Interface/Components').Button} Button
 */

class BackOnboarding extends PageBase {
    state = {
        helpAnimation: new Animated.Value(-64),
        tutoLaunched: false
    }

    /** @type {Button} */
    refInfo = null;

    selectEnglish = () => {
        langManager.SetLangage('en');
        this.forceUpdate();
    }
    selectFrench = () => {
        langManager.SetLangage('fr');
        this.forceUpdate();
    }

    launchOnboarding = () => {
        const lang = langManager.curr['onboarding'];

        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                showSkipButton: false,
                text: lang['page1']
            },
            {
                component: null,
                showSkipButton: false,
                text: lang['page2']
            },
            {
                component: null,
                showSkipButton: false,
                text: lang['page3']
            },
            {
                component: this.refInfo,
                showSkipButton: false,
                text: lang['page4']
            },
            {
                component: null,
                showSkipButton: false,
                text: lang['page5'],
                execAfter: () => {
                    this.endOnboarding();
                    return true;
                }
            }
        ]);

        SpringAnimation(this.state.helpAnimation, 0).start();
        this.setState({ tutoLaunched: true });
    }

    endOnboarding = async () => {
        user.settings.onboardingWatched = true;

        const saved = await user.settings.Save();
        if (!saved) {
            RNExitApp.exitApp();
            return;
        }

        user.interface.ChangePage('loading', undefined, true);
    }
}

export default BackOnboarding;
