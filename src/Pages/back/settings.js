import * as React from 'react';
import { BackHandler } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';
import { disableMorningNotifications, enableMorningNotifications } from '../../Functions/Notifications';

class BackSettings extends React.Component {
    constructor(props) {
        super(props);
        this.initLang = langManager.currentLangageKey;

        this.currentTheme = themeManager.selectedTheme;
        this.selectableThemes = [];
        for (const T in themeManager.THEMES) {
            const value = themeManager.THEMES[T];
            this.selectableThemes.push({ key: value, value: langManager.curr['themes'][value] });
        }

        // Notifications
        this.enabledOrNot = [
            { key: false, value: langManager.curr['settings']['disabled-morningnotifications']},
            { key: true, value: langManager.curr['settings']['enabled-morningnotifications']}
        ];
    }
    back = () => {
        if (this.initLang !== langManager.currentLangageKey) {
            // TODO - Reload internal data (dataManager)
            //user.loadInternalData();
        }
        user.saveData();
        user.backPage();
    }
    reset = () => {
        const event = (button) => {
            if (button === 'yes') {
                user.activities.setAll([]);
                user.saveData();
            }
        }
        const title = langManager.curr['settings']['alert-reset-title'];
        const text = langManager.curr['settings']['alert-reset-text'];
        user.openPopup('yesno', [ title, text ], event);
    }
    deconnect = () => {
        const event = (button) => {
            if (button === 'yes') {
                user.disconnect();
            }
        }
        const title = langManager.curr['settings']['alert-disconnect-title'];
        const text = langManager.curr['settings']['alert-disconnect-text'];
        user.openPopup('yesno', [ title, text ], event);
    }
    clear = () => {
        const event = (button) => {
            if (button === 'yes') {
                user.clear();
                setTimeout(BackHandler.exitApp, 200);
            }
        }
        const title = langManager.curr['settings']['alert-clear-title'];
        const text = langManager.curr['settings']['alert-clear-text'];
        user.openPopup('yesno', [ title, text ], event);
    }
    changeLang = (lang) => {
        langManager.setLangage(lang);
        user.changePage();
        user.saveData(false);
    }
    changeTheme = (theme) => {
        if (themeManager.setTheme(theme)) {
            this.currentTheme = theme;
            user.changePage();
        }
    }
    changeMorningNotifications = (enabled) => {
        if (enabled) enableMorningNotifications();
        else disableMorningNotifications();
        user.settings.morningNotifications = enabled;
        user.settings.Save();
        user.changePage();
    }
}

export default BackSettings;