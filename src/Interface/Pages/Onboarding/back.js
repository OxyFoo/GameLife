import RNExitApp from 'react-native-exit-app';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import PageBase from 'Interface/FlowEngine/PageBase';

/**
 * @typedef {import('Managers/LangManager').LangKey} LangKey
 */

class BackOnboarding extends PageBase {
    state = {
        selectedLangKey: langManager.currentLangageKey
    };

    /** @param {LangKey} key */
    selectLanguage = (key) => {
        this.setState({ selectedLangKey: key }, () => {
            user.settings.SetLang(key);
        });
    };

    Next = async () => {
        //const lang = langManager.curr['onboarding'];
        //lang['page1']    lang['page2']    lang['page3']
        //lang['page4']    lang['page5']    lang['page6']

        user.settings.onboardingWatched = true;

        const saved = await user.settings.IndependentSave();
        if (!saved) {
            const lang = langManager.curr['app'];
            user.interface.ChangePage('display', {
                args: {
                    icon: 'close-filled',
                    text: lang['loading-error-message']['userdata-not-saved'],
                    button: lang['loading-error-button'],
                    action: RNExitApp.exitApp
                },
                storeInHistory: false
            });
            return;
        }

        user.interface.ChangePage('loading', { storeInHistory: false });
    };
}

export default BackOnboarding;
