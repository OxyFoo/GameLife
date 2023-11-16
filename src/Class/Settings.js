import langManager from "Managers/LangManager";
import themeManager from "Managers/ThemeManager";

import DataStorage, { STORAGE } from "Utils/DataStorage";

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 */

class Settings {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;

        this.email = '';
        this.connected = false;
        this.onboardingWatched = false;
        this.tutoFinished = false;
        this.homePieChart = false; 

        this.morningNotifications = true;
        this.eveningNotifications = true;
    }

    Clear() {
        this.email = '';
        this.connected = false;
        this.homePieChart = false;
        this.morningNotifications = true;
        this.eveningNotifications = true;
    }
    async Load() {
        const { AddLog, EditLog } = this.user.interface.console;
        const debugIndex = AddLog('info', 'Settings data: local loading...');

        const settings = await DataStorage.Load(STORAGE.LOGIN);
        const contains = (key) => settings.hasOwnProperty(key);
        if (settings !== null) {
            if (contains('lang')) langManager.SetLangage(settings['lang']);
            if (contains('theme')) themeManager.SetTheme(settings['theme']);
            if (contains('email')) this.email = settings['email'];
            if (contains('connected')) this.connected = settings['connected'];
            if (contains('onboardingWatched')) this.onboardingWatched = settings['onboardingWatched'];
            if (contains('tutoFinished')) this.tutoFinished = settings['tutoFinished'];
            if (contains('homePieChart')) this.homePieChart = settings['homePieChart'];
            if (contains('morningNotifications')) this.morningNotifications = settings['morningNotifications'];
            if (contains('eveningNotifications')) this.eveningNotifications = settings['eveningNotifications'];

            EditLog(debugIndex, 'same', 'Settings data: local load success');
        } else {
            EditLog(debugIndex, 'warn', 'Settings data: local load failed');
        }
    }
    Save() {
        const { AddLog, EditLog } = this.user.interface.console;
        const settings = {
            lang: langManager.currentLangageKey,
            theme: themeManager.selectedTheme,
            email: this.email,
            connected: this.connected,
            onboardingWatched: this.onboardingWatched,
            tutoFinished: this.tutoFinished,
            homePieChart: this.homePieChart,
            morningNotifications: this.morningNotifications,
            eveningNotifications: this.eveningNotifications,
        };

        const debugIndex = AddLog('info', 'Settings data: local saving...');

        const status = DataStorage.Save(STORAGE.LOGIN, settings);

        const statusText = status ? 'success' : 'failed';
        const statusType = status ? 'same' : 'error';
        EditLog(debugIndex, statusType, 'Settings data: local save ' + statusText);

        return status;
    }
}

export default Settings;