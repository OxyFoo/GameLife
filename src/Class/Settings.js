import { UserManager } from "../Managers/UserManager";
import langManager from "../Managers/LangManager";
import themeManager from "../Managers/ThemeManager";

import DataStorage, { STORAGE } from "../Functions/DataStorage";

class Settings {
    constructor(user) {
        /**
         * @type {UserManager}
         */
        this.user = user;

        this.onboardingWatched = false;
        this.email = '';
        this.connected = false;
        this.morningNotifications = true;
    }

    Clear() {
        this.email = '';
        this.connected = false;
        this.morningNotifications = true;
    }

    async Save() {
        const data_settings = {
            'lang': langManager.currentLangageKey,
            'theme': themeManager.selectedTheme,
            'email': this.email,
            'connected': this.connected,
            'morningNotifications': this.morningNotifications
        };
        await DataStorage.Save(STORAGE.SETTINGS, data_settings, false);
    }

    async Load() {
        const data_settings = await DataStorage.Load(STORAGE.SETTINGS, false);
        if (data_settings !== null) {
            langManager.SetLangage(data_settings['lang']);
            themeManager.SetTheme(data_settings['theme']);
            this.email = data_settings['email'];
            this.connected = data_settings['connected'];
            this.morningNotifications = data_settings['morningNotifications'];
        }
    }
}

export default Settings;