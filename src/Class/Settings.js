import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { IUserClass } from '@oxyfoo/gamelife-types/Interface/IUserClass';
import Storage from 'Utils/Storage';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('@oxyfoo/gamelife-types/Global/Langs').LangKeys} LangKey
 * @typedef {import('@oxyfoo/gamelife-types/Global/Links').MusicLinksType} MusicLinksType
 * @typedef {import('@oxyfoo/gamelife-types/Class/Settings').SaveObject_Settings} SaveObject_Settings
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

    onboardingWatched = false;
    testMessageReaded = false;
    waitingEmail = '';
    tutoFinished = false;
    questHeatMapIndex = 0;

    regularNotificationsLastRefresh = 0;
    morningNotifications = true;
    eveningNotifications = true;

    /**
     * @type {import('Managers/ThemeManager').ThemeVariantAllKeys}
     */
    themeVariant = 'gameLife';

    musicLinks = DEFAULT_MUSIC_LINKS;

    Clear = () => {
        this.testMessageReaded = false;
        this.waitingEmail = '';
        this.questHeatMapIndex = 0;

        this.regularNotificationsLastRefresh = 0;
        this.morningNotifications = true;
        this.eveningNotifications = true;

        this.themeVariant = 'gameLife';
    };

    IndependentLoad = async () => {
        const debugIndex = this.user.interface.console?.AddLog('info', 'Settings data: local loading...');

        /** @type {SaveObject_Settings | null} */
        const settings = await Storage.Load('LOGIN');
        if (settings === null) {
            if (debugIndex) {
                this.user.interface.console?.EditLog(debugIndex, 'warn', 'Settings data: local load failed');
            }

            return;
        }

        if (typeof settings.lang !== 'undefined') this.SetLang(settings.lang, true);
        if (typeof settings.theme !== 'undefined') themeManager.setTheme(settings.theme);
        if (typeof settings.regularNotificationsLastRefresh !== 'undefined') {
            this.regularNotificationsLastRefresh = settings.regularNotificationsLastRefresh;
        }
        if (typeof settings.onboardingWatched !== 'undefined') this.onboardingWatched = settings.onboardingWatched;
        if (typeof settings.testMessageReaded !== 'undefined') this.testMessageReaded = settings.testMessageReaded;
        if (typeof settings.waitingEmail !== 'undefined') this.waitingEmail = settings.waitingEmail;
        if (typeof settings.tutoFinished !== 'undefined') this.tutoFinished = settings.tutoFinished;
        if (typeof settings.questHeatMapIndex !== 'undefined') this.questHeatMapIndex = settings.questHeatMapIndex;
        if (typeof settings.morningNotifications !== 'undefined') {
            this.morningNotifications = settings.morningNotifications;
        }
        if (typeof settings.eveningNotifications !== 'undefined') {
            this.eveningNotifications = settings.eveningNotifications;
        }
        if (typeof settings.musicLinks !== 'undefined') this.musicLinks = settings.musicLinks;
        if (typeof settings.themeVariant !== 'undefined') this.themeVariant = settings.themeVariant;

        if (debugIndex) {
            this.user.interface.console?.EditLog(debugIndex, 'same', 'Settings data: local load success');
        }
    };

    async IndependentSave() {
        /** @type {Required<SaveObject_Settings>} */
        const settings = {
            lang: langManager.currentLangageKey,
            theme: themeManager.selectedTheme,
            themeVariant: this.themeVariant,
            onboardingWatched: this.onboardingWatched,
            testMessageReaded: this.testMessageReaded,
            tutoFinished: this.tutoFinished,
            waitingEmail: this.waitingEmail,
            questHeatMapIndex: this.questHeatMapIndex,
            regularNotificationsLastRefresh: this.regularNotificationsLastRefresh,
            morningNotifications: this.morningNotifications,
            eveningNotifications: this.eveningNotifications,
            musicLinks: this.musicLinks
        };

        const debugIndex = this.user.interface.console?.AddLog('info', 'Settings data: local saving...');

        const status = await Storage.Save('LOGIN', settings);

        if (debugIndex) {
            const statusText = status ? 'success' : 'failed';
            const statusType = status ? 'same' : 'error';
            this.user.interface.console?.EditLog(debugIndex, statusType, 'Settings data: local save ' + statusText);
        }

        return status;
    }

    /**
     * @description Save the language locally and online if possible
     * @param {LangKey} lang
     * @param {boolean} bypassSave
     */
    SetLang = async (lang, bypassSave = false) => {
        // Already set
        if (lang === langManager.currentLangageKey) {
            return true;
        }

        // Update language locally
        langManager.SetLangage(lang);

        if (bypassSave) {
            return;
        }

        if (!this.user.server2.IsAuthenticated()) {
            return await this.IndependentSave();
        }

        // Update language online
        const debugIndex = this.user.interface.console?.AddLog('info', 'Settings data: online saving...');

        const response = await this.user.server2.tcp.SendAndWait({ action: 'set-lang', lang });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'set-lang' ||
            response.result !== 'error'
        ) {
            if (debugIndex) {
                this.user.interface.console?.EditLog(
                    debugIndex,
                    'error',
                    `Settings data: online save failed (${response})`
                );
            }
            return false;
        }

        if (debugIndex) {
            this.user.interface.console?.EditLog(debugIndex, 'same', 'Settings data: online save success');
        }

        return await this.IndependentSave();
    };

    /** @param {MusicLinksType} newLinks */
    LoadMusicLinks(newLinks) {
        for (const K in newLinks) {
            const key = /** @type {keyof MusicLinksType} */ (K);
            if (this.musicLinks.hasOwnProperty(key)) {
                this.musicLinks[key] = newLinks[key];
            }
        }
    }
}

export default Settings;
