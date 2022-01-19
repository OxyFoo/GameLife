//import { UserManager } from "../Managers/UserManager";
import langManager from "../Managers/LangManager";
import themeManager from "../Managers/ThemeManager";

import DataStorage, { STORAGE } from "../Functions/DataStorage";

class Settings {
    constructor(user) {
        /**
         * @type {UserManager}
         */
        this.user = user;

        this.email = '';
        this.connected = false;
        this.onboardingWatched = false;
        this.morningNotifications = true;
    }

    Clear() {
        this.email = '';
        this.connected = false;
        this.morningNotifications = true;
    }

    async Load() {
        const settings = await DataStorage.Load(STORAGE.LOGIN);
        if (settings !== null) {
            langManager.SetLangage(settings['lang']);
            themeManager.SetTheme(settings['theme']);
            this.email = settings['email'];
            this.connected = settings['connected'];
            this.onboardingWatched = settings['onboardingWatched'];
            this.morningNotifications = settings['morningNotifications'];
        }
    }
    Save() {
        const settings = {
            lang: langManager.currentLangageKey,
            theme: themeManager.selectedTheme,
            email: this.email,
            connected: this.connected,
            onboardingWatched: this.onboardingWatched,
            morningNotifications: this.morningNotifications
        };
        return DataStorage.Save(STORAGE.LOGIN, settings);
    }
}

export default Settings;