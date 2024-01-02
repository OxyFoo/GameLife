import { Animated } from 'react-native';
import RNExitApp from 'react-native-exit-app';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { PageBase, Swiper } from 'Interface/Components';

class BackOnboarding extends PageBase {
    state = {
        animButtonNext: new Animated.Value(1),
        animButtonStart: new Animated.Value(0)
    }

    last = false;
    tutoLaunch = 0;
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

        // je sais pas si c'est mieux de force update ou d'utiliser un state pour tutoLaunch
        this.tutoLaunch = 1;
        this.forceUpdate();

        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                text: lang['page1']
            },
            {
                component: null,
                text: lang['page2']
            },
            {
                component: null,
                text: lang['page3']
            },
            {
                component: this.refInfo,
                text: lang['page4']
            },
            {
                component: null,
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
        user.settings.tutoFinished = false; // lui c'est pour être sur qu'on lance le tuto 

        const saved = await user.settings.Save();

        if (!saved) RNExitApp.exitApp();
        else user.interface.ChangePage('loading', undefined, true);
        return;
    }
}

export default BackOnboarding;
