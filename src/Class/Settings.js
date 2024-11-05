import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { IUserClass } from 'Types/Interface/IUserClass';
import DataStorage, { STORAGE } from 'Utils/DataStorage';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/Global/Links').MusicLinksType} MusicLinksType
 * @typedef {import('Types/Class/Settings').SaveObject_Settings} SaveObject_Settings
 */

/** @type {SaveObject_Settings['musicLinks']} */
const DEFAULT_MUSIC_LINKS = {
    spotify: 'https://open.spotify.com/playlist/2qMPv8Re0IW2FzBGjS7HCG',
    applemusic: 'https://music.apple.com/fr/playlist/zapnmusic-for-work/pl.u-JPAZEomsDXLGvEb',
    youtubemusic: 'https://music.youtube.com/playlist?list=PLBo5aRk85uWnkkflI9Of9ecRn8e3SsclZ&si=6szeIToboXpBVot7',
    deezer: 'https://deezer.page.link/huyVFejy9ce3m7YY8'
};

/** @extends {IUserClass<SaveObject_Settings>} */
class Settings extends IUserClass {
    /** @param {UserManager} user */
    constructor(user) {
        super('settings');

        this.user = user;
    }

    email = '';
    token = '';
    dataToken = '';
    onboardingWatched = false;
    testMessageReaded = false;
    tutoFinished = false;
    questHeatMapIndex = 0;

    morningNotifications = true;
    eveningNotifications = true;

    musicLinks = DEFAULT_MUSIC_LINKS;

    Clear = () => {
        this.email = '';
        this.token = '';
        this.dataToken = '';
        this.testMessageReaded = false;
        this.questHeatMapIndex = 0;

        this.morningNotifications = true;
        this.eveningNotifications = true;
    };

    IndependentLoad = async () => {
        const debugIndex = this.user.interface.console?.AddLog('info', 'Settings data: local loading...');

        /** @type {SaveObject_Settings | null} */
        const settings = await DataStorage.Load(STORAGE.LOGIN);
        if (settings === null) {
            if (debugIndex) {
                this.user.interface.console?.EditLog(debugIndex, 'warn', 'Settings data: local load failed');
            }
            return;
        }

        if (typeof settings.lang !== 'undefined') langManager.SetLangage(settings['lang']);
        if (typeof settings.theme !== 'undefined') themeManager.SetTheme(settings['theme']);
        if (typeof settings.email !== 'undefined') this.email = settings['email'];
        if (typeof settings.token !== 'undefined') this.token = settings['token'];
        if (typeof settings.dataToken !== 'undefined') this.dataToken = settings['dataToken'];
        if (typeof settings.onboardingWatched !== 'undefined') this.onboardingWatched = settings['onboardingWatched'];
        if (typeof settings.testMessageReaded !== 'undefined') this.testMessageReaded = settings['testMessageReaded'];
        if (typeof settings.tutoFinished !== 'undefined') this.tutoFinished = settings['tutoFinished'];
        if (typeof settings.questHeatMapIndex !== 'undefined') this.questHeatMapIndex = settings['questHeatMapIndex'];
        if (typeof settings.morningNotifications !== 'undefined') {
            this.morningNotifications = settings['morningNotifications'];
        }
        if (typeof settings.eveningNotifications !== 'undefined') {
            this.eveningNotifications = settings['eveningNotifications'];
        }
        if (typeof settings.musicLinks !== 'undefined') this.musicLinks = settings['musicLinks'];

        if (debugIndex) {
            this.user.interface.console?.EditLog(debugIndex, 'same', 'Settings data: local load success');
        }
    };

    async IndependentSave() {
        /** @type {Required<SaveObject_Settings>} */
        const settings = {
            lang: langManager.currentLangageKey,
            theme: themeManager.selectedTheme,
            email: this.email,
            token: this.token,
            dataToken: this.dataToken,
            onboardingWatched: this.onboardingWatched,
            testMessageReaded: this.testMessageReaded,
            tutoFinished: this.tutoFinished,
            questHeatMapIndex: this.questHeatMapIndex,
            morningNotifications: this.morningNotifications,
            eveningNotifications: this.eveningNotifications,
            musicLinks: this.musicLinks
        };

        const debugIndex = this.user.interface.console?.AddLog('info', 'Settings data: local saving...');

        const status = await DataStorage.Save(STORAGE.LOGIN, settings);

        const statusText = status ? 'success' : 'failed';
        const statusType = status ? 'same' : 'error';
        if (debugIndex) {
            this.user.interface.console?.EditLog(debugIndex, statusType, 'Settings data: local save ' + statusText);
        }

        return status;
    }

    /** @param {MusicLinksType} newLinks */
    LoadMusicLinks(newLinks) {
        for (const K in newLinks) {
            // eslint-disable-next-line prettier/prettier
            const key = /** @type {keyof MusicLinksType} */ (K);
            if (this.musicLinks.hasOwnProperty(key)) {
                this.musicLinks[key] = newLinks[key];
            }
        }
    }
}

export default Settings;
