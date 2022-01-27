import * as React from 'react';
import { BackHandler } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';

import { DisableMorningNotifications, EnableMorningNotifications } from '../../Functions/Notifications';

class BackSettings extends React.Component {
    constructor(props) {
        super(props);
        this.initLang = langManager.currentLangageKey;

        const langs = Object.keys(langManager.langages);
        const dataLangs = langs.map(lang => new Object({ key: lang, value: langManager.langages[lang]['name'] }));
        const current = dataLangs.find(lang => lang.key === langManager.currentLangageKey);

        this.state = {
            selectedLang: current,
            dataLangs: dataLangs,
            switchStartAudio: false
        }
    }

    openAbout = () => user.interface.ChangePage('about', undefined, true);
    openReport = () => user.interface.ChangePage('report', undefined, true);

    onChangeLang = (lang) => {
        this.setState({ selectedLang: lang });
        langManager.SetLangage(lang.key);
        user.settings.Save();
    }

    disconnect = () => {
        const event = (button) => { if (button === 'yes') user.Disconnect(); };
        const title = langManager.curr['settings']['alert-disconnect-title'];
        const text = langManager.curr['settings']['alert-disconnect-text'];
        user.interface.popup.Open('yesno', [ title, text ], event);
    }

    resetActivities = () => {
        const event = (button) => {
            if (button === 'yes') {
                //user.activities.Clear(); // Check / save (local) ?
                //user.LocalSave();
                // TODO - Save online ?
            }
        }
        const title = langManager.curr['settings']['alert-reset-title'];
        const text = langManager.curr['settings']['alert-reset-text'];
        user.interface.popup.Open('yesno', [ title, text ], event);
    }

    // TODO - OLD, Remove

    clear = () => {
        const event = (button) => {
            if (button === 'yes') {
                user.Clear();
                setTimeout(BackHandler.exitApp, 200);
            }
        }
        const title = langManager.curr['settings']['alert-clear-title'];
        const text = langManager.curr['settings']['alert-clear-text'];
        user.interface.popup.Open('yesno', [ title, text ], event);
    }
    changeLang = (lang) => {
        langManager.SetLangage(lang);
        user.interface.forceUpdate();
        // TODO - Save user data
        //user.saveData(false);
    }
    changeTheme = (theme) => {
        //this.currentTheme = themeManager.selectedTheme; // Init
        if (themeManager.SetTheme(theme)) {
            this.currentTheme = theme;
            user.interface.forceUpdate();
        }
    }
    changeMorningNotifications = (enabled) => {
        if (enabled) EnableMorningNotifications();
        else DisableMorningNotifications();
        user.settings.morningNotifications = enabled;
        user.settings.Save();
        user.interface.forceUpdate();
    }
}

export default BackSettings;