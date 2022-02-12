import langManager from "../Managers/LangManager";
import themeManager from "../Managers/ThemeManager";

import DataStorage, { STORAGE } from "../Utils/DataStorage";

class Settings {
    constructor(user) {
        /**
         * @typedef {import('../Managers/UserManager').default} UserManager
         * @type {UserManager}
         */
        this.user = user;

        this.email = '';
        this.connected = false;
        this.onboardingWatched = false;

        this.startAudio = true;
        this.morningNotifications = true;
    }

    Clear() {
        this.email = '';
        this.connected = false;
        this.startAudio = true;
        this.morningNotifications = true;
    }

    async Load() {
        const settings = await DataStorage.Load(STORAGE.LOGIN);
        const contains = (key) => settings.hasOwnProperty(key);
        if (settings !== null) {
            if (contains('lang')) langManager.SetLangage(settings['lang']);
            if (contains('theme')) themeManager.SetTheme(settings['theme']);
            if (contains('email')) this.email = settings['email'];
            if (contains('connected')) this.connected = settings['connected'];
            if (contains('onboardingWatched')) this.onboardingWatched = settings['onboardingWatched'];
            if (contains('startAudio')) this.startAudio = settings['startAudio'];
            if (contains('morningNotifications')) this.morningNotifications = settings['morningNotifications'];
        }
    }
    Save() {
        const settings = {
            lang: langManager.currentLangageKey,
            theme: themeManager.selectedTheme,
            email: this.email,
            connected: this.connected,
            onboardingWatched: this.onboardingWatched,
            startAudio: this.startAudio,
            morningNotifications: this.morningNotifications
        };
        return DataStorage.Save(STORAGE.LOGIN, settings);
    }
}

export default Settings;