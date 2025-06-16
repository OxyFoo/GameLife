import React from 'react';
import AppControl from 'react-native-app-control';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import PageBase from 'Interface/FlowEngine/PageBase';

/**
 * @typedef {import('Interface/Components').Swiper} Swiper
 * @typedef {import('Managers/LangManager').LangKey} LangKey
 */

class BackOnboarding extends PageBase {
    state = {
        selectedLangKey: langManager.currentLangageKey
    };

    /** @type {React.RefObject<Swiper | null>} */
    refSwiper = React.createRef();

    componentDidMount() {
        // Update animations in swiper's pages
        setImmediate(this.forceUpdate.bind(this));
    }

    /** @param {LangKey} key */
    selectLanguage = (key) => {
        user.settings.SetLang(key);
        this.setState({ selectedLangKey: key }, this.Next);
    };

    Next = async () => {
        if (!this.refSwiper.current) return;

        const index = this.refSwiper.current.posX;

        // If the user is not on the last page, go to the next one
        if (index < 2) {
            this.refSwiper.current.Next();
            return;
        }

        // If the user is on the last page, save the settings and go to the loading page
        user.settings.onboardingWatched = true;

        const saved = await user.settings.IndependentSave();

        // If the settings are not saved, display an error message and close the app
        if (!saved) {
            const lang = langManager.curr['app'];
            user.interface.ChangePage('display', {
                args: {
                    icon: 'close-filled',
                    text: lang['loading-error-message']['userdata-not-saved'],
                    button: lang['loading-error-button'],
                    action: AppControl.Exit
                },
                storeInHistory: false
            });
            return;
        }

        user.interface.ChangePage('loading', { storeInHistory: false });
    };
}

export default BackOnboarding;
