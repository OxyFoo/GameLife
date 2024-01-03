import { Animated } from 'react-native';
import RNExitApp from 'react-native-exit-app';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { PageBase, Swiper } from 'Interface/Components';

class BackOnboarding extends PageBase {
    state = {
        animButtonNext: new Animated.Value(1),
        animButtonStart: new Animated.Value(0),
        tutoLaunch: 0,
    }

    last = false;
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

        this.setState({ tutoLaunch: 1 });

        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                showSkip: false,
                text: lang['page1']
            },
            {
                component: null,
                showSkip: false,
                text: lang['page2']
            },
            {
                component: null,
                showSkip: false,
                text: lang['page3']
            },
            {
                component: this.refInfo,
                showSkip: false,
                text: lang['page4']
            },
            {
                component: null,
                showSkip: false,
                text: lang['page5'],
                execAfter: () => {
                    this.endOnboarding();
                    return true;
                }
            }
        ]);

    }

    endOnboarding = async () => {
        user.settings.onboardingWatched = true;

        const saved = await user.settings.Save();

        if (!saved) RNExitApp.exitApp();
        else user.interface.ChangePage('loading', undefined, true);
        return;
    }
}

export default BackOnboarding;
