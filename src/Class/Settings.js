import langManager from "Managers/LangManager";
import themeManager from "Managers/ThemeManager";

import DataStorage, { STORAGE } from "Utils/DataStorage";

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 */

class Settings {
    constructor(user) {
        /** @type {UserManager} */
        this.user = user;

        this.email = '';
        this.connected = false;
        this.onboardingWatched = false;

        this.morningNotifications = true;
        this.eveningNotifications = true;
    }

    Clear() {
        this.email = '';
        this.connected = false;
        this.morningNotifications = true;
        this.eveningNotifications = true;
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
            if (contains('morningNotifications')) this.morningNotifications = settings['morningNotifications'];
            if (contains('eveningNotifications')) this.eveningNotifications = settings['eveningNotifications'];
        }
    }
    Save() {
        const settings = {
            lang: langManager.currentLangageKey,
            theme: themeManager.selectedTheme,
            email: this.email,
            connected: this.connected,
            onboardingWatched: this.onboardingWatched,
            morningNotifications: this.morningNotifications,
            eveningNotifications: this.eveningNotifications,
        };
        return DataStorage.Save(STORAGE.LOGIN, settings);
    }
}

export default Settings;