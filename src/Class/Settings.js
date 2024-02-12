import langManager from "Managers/LangManager";
import themeManager from "Managers/ThemeManager";

import DataStorage, { STORAGE } from "Utils/DataStorage";

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {DEFAULT_MUSIC_LINKS} MusicLinks
 */

const DEFAULT_MUSIC_LINKS = {
    'spotify': 'https://open.spotify.com/playlist/2qMPv8Re0IW2FzBGjS7HCG',
    'applemusic': 'https://music.apple.com/fr/playlist/zapnmusic-for-work/pl.u-JPAZEomsDXLGvEb',
    'youtubemusic': 'https://music.youtube.com/playlist?list=PLBo5aRk85uWnkkflI9Of9ecRn8e3SsclZ&si=6szeIToboXpBVot7',
    'deezer': 'https://deezer.page.link/huyVFejy9ce3m7YY8'
};

class Settings {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;
    }

    email = '';
    connected = false;
    onboardingWatched = false;
    testMessageReaded = false;
    tutoFinished = false;
    questHeatMap = false;

    morningNotifications = true;
    eveningNotifications = true;

    musicLinks = DEFAULT_MUSIC_LINKS;

    Clear() {
        this.email = '';
        this.connected = false;
        this.questHeatMap = false;
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
            if (contains('testMessageReaded')) this.testMessageReaded = settings['testMessageReaded'];
            if (contains('tutoFinished')) this.tutoFinished = settings['tutoFinished'];
            if (contains('questHeatMap')) this.questHeatMap = settings['questHeatMap'];
            if (contains('morningNotifications')) this.morningNotifications = settings['morningNotifications'];
            if (contains('eveningNotifications')) this.eveningNotifications = settings['eveningNotifications'];
            if (contains('musicLinks')) this.musicLinks = settings['musicLinks'];

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
            testMessageReaded: this.testMessageReaded,
            tutoFinished: this.tutoFinished,
            questHeatMap: this.questHeatMap,
            morningNotifications: this.morningNotifications,
            eveningNotifications: this.eveningNotifications,
            musicLinks: this.musicLinks
        };

        const debugIndex = AddLog('info', 'Settings data: local saving...');

        const status = DataStorage.Save(STORAGE.LOGIN, settings);

        const statusText = status ? 'success' : 'failed';
        const statusType = status ? 'same' : 'error';
        EditLog(debugIndex, statusType, 'Settings data: local save ' + statusText);

        return status;
    }

    /** @param {object} newLinks */
    LoadMusicLinks(newLinks) {
        for (const key in newLinks) {
            if (this.musicLinks.hasOwnProperty(key)) {
                this.musicLinks[key] = newLinks[key];
            }
        }
    }
}

export default Settings;
