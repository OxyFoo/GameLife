import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import { IUserData } from '@oxyfoo/gamelife-types/Interface/IUserData';

import DynamicVar from 'Utils/DynamicVar';
import { GetAge, GetDaysUntil, GetGlobalTime, GetLocalTime } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('@oxyfoo/gamelife-types/Class/ZapGPT').ZapGPTState} ZapGPTState
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Informations').SaveObject_UserInformations} SaveObject_UserInformations
 * @typedef {import('@oxyfoo/gamelife-types/TCP/GameLife/Request_ServerToClient').ServerRequestSetUsername} ServerRequestSetUsername
 * @typedef {import('@oxyfoo/gamelife-types/Class/NotificationsInApp').NotificationInApp<'optional-update'>} NotificationInAppOptionalUpdate
 */

const DAYS_USERNAME_CHANGE = 30;
const DAYS_BIRTHTIME_CHANGE = 365;

/** @extends {IUserData<SaveObject_UserInformations>} */
class Informations extends IUserData {
    /** @param {UserManager} user */
    constructor(user) {
        super('informations');

        this.user = user;
    }

    username = new DynamicVar('');

    /** @type {number | null} Null if disabled or unix timestamp (global UTC) */
    usernameTime = null;

    title = new DynamicVar(0);

    /** @type {number | null} Null if disabled or title ID */
    UNSAVED_title = null;

    /** @type {number | null} Null if disabled or unix timestamp (global UTC) */
    birthTime = null;

    /** @type {number | null} Null if disabled or unix timestamp (global UTC) */
    lastBirthTime = null;

    /** @type {number | null} Null if disabled or unix timestamp (global UTC) */
    UNSAVED_birthTime = null;

    xp = 0;
    ox = new DynamicVar(0);
    adRemaining = 0;
    adTotalWatched = 0;

    /** @type {ZapGPTState} */
    zapGPT = { remaining: 0, total: 0 };
    achievementSelfFriend = false;
    purchasedCount = 0;

    Clear = () => {
        this.username.Set('');
        this.usernameTime = null;
        this.title.Set(0);
        this.UNSAVED_title = null;
        this.birthTime = null;
        this.lastBirthTime = null;
        this.UNSAVED_birthTime = null;
        this.xp = 0;
        this.ox.Set(0);
        this.adRemaining = 0;
        this.adTotalWatched = 0;
        this.zapGPT = { remaining: 0, total: 0 };
        this.achievementSelfFriend = false;
        this.purchasedCount = 0;
    };

    /** @param {Partial<SaveObject_UserInformations>} data */
    Load = (data) => {
        if (typeof data.username !== 'undefined') this.username.Set(data.username);
        if (typeof data.usernameTime !== 'undefined') this.usernameTime = data.usernameTime;
        if (typeof data.titleID !== 'undefined') this.title.Set(data.titleID);
        if (typeof data.UNSAVED_title !== 'undefined') this.UNSAVED_title = data.UNSAVED_title;
        if (typeof data.birthTime !== 'undefined') this.birthTime = data.birthTime;
        if (typeof data.lastBirthTime !== 'undefined') this.lastBirthTime = data.lastBirthTime;
        if (typeof data.UNSAVED_birthTime !== 'undefined') this.UNSAVED_birthTime = data.UNSAVED_birthTime;
        if (typeof data.xp !== 'undefined') this.xp = data.xp;
        if (typeof data.ox !== 'undefined') this.ox.Set(data.ox);
        if (typeof data.adRemaining !== 'undefined') this.adRemaining = data.adRemaining;
        if (typeof data.adTotalWatched !== 'undefined') this.adTotalWatched = data.adTotalWatched;
        if (typeof data.achievementSelfFriend !== 'undefined') this.achievementSelfFriend = data.achievementSelfFriend;
        if (typeof data.purchasedCount !== 'undefined') this.purchasedCount = data.purchasedCount;
    };

    /** @returns {SaveObject_UserInformations} */
    Save = () => {
        return {
            username: this.username.Get(),
            usernameTime: this.usernameTime,
            titleID: this.title.Get(),
            UNSAVED_title: this.UNSAVED_title,
            birthTime: this.birthTime,
            lastBirthTime: this.lastBirthTime,
            UNSAVED_birthTime: this.UNSAVED_birthTime,
            xp: this.xp,
            ox: this.ox.Get(),
            adRemaining: this.adRemaining,
            adTotalWatched: this.adTotalWatched,
            achievementSelfFriend: this.achievementSelfFriend,
            purchasedCount: this.purchasedCount
        };
    };

    LoadOnline = async () => {
        const response = await this.user.server2.tcp.SendAndWait({ action: 'get-user-data' });

        // Check if response is valid
        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'get-user-data' ||
            response.result !== 'ok' ||
            response.data === null
        ) {
            return false;
        }

        // Load data
        const { Username, Lang, LastChangeUsername, Title, Ox, Birthtime, LastChangeBirth } = response.data;

        this.username.Set(Username);
        this.usernameTime = LastChangeUsername;
        await this.user.settings.SetLang(Lang);
        this.title.Set(Title);
        this.ox.Set(Ox);
        this.birthTime = Birthtime;
        this.lastBirthTime = LastChangeBirth;

        return true;
    };

    SaveOnline = async () => {
        if (!this.#isUnsaved()) {
            return true;
        }

        const unsaved = this.#getUnsaved();
        const response = await this.user.server2.tcp.SendAndWait({ action: 'set-user-data', ...unsaved });

        // Check if response is valid
        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'set-user-data' ||
            response.result === 'error'
        ) {
            this.user.interface.console?.AddLog('error', '[Informations] Failed to save user data online:', response);
            return false;
        }

        this.#purge();

        return true;
    };

    #isUnsaved = () => {
        return this.UNSAVED_title !== null || this.UNSAVED_birthTime !== null;
    };

    #getUnsaved = () => {
        return {
            titleID: this.UNSAVED_title,
            birthtime: this.UNSAVED_birthTime
        };
    };

    #purge = () => {
        this.UNSAVED_title = null;
        this.UNSAVED_birthTime = null;
    };

    /**
     * Online request to change username
     * @param {string} username
     * @param {boolean} confirmed
     * @returns {Promise<ServerRequestSetUsername['result'] | null>}
     */
    SetUsername = async (username, confirmed = false) => {
        const response = await this.user.server2.tcp.SendAndWait({
            action: 'set-username',
            confirmed,
            username
        });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'set-username'
        ) {
            return null;
        }

        if (response.result === 'ok') {
            this.username.Set(username);
            this.usernameTime = GetGlobalTime();
            this.user.SaveLocal();
        }

        return response.result;
    };

    GetTitleText = () => {
        const title = dataManager.titles.GetByID(this.title.Get());
        return title === null ? '' : langManager.GetText(title.Name);
    };

    /** @param {number} ID */
    SetTitle = (ID) => {
        this.title.Set(ID);
        this.UNSAVED_title = ID;
        this.user.SaveLocal();
    };

    /**
     * Consume ad remaining, increment ad total watched and show alert if ad remaining is 0
     */
    DecrementAdRemaining = () => {
        this.adRemaining--;
        this.adTotalWatched++;
        this.user.interface.console?.AddLog('info', 'Remaining ad:', this.adRemaining);
        this.user.SaveLocal();

        if (this.adRemaining <= 0) {
            const title = langManager.curr['server']['alert-adempty-title'];
            const message = langManager.curr['server']['alert-adempty-message'];
            this.user.interface.popup?.OpenT({
                type: 'ok',
                data: { title, message }
            });
        }
    };

    /**
     * Return age in years
     * @returns {number | null}
     */
    GetAge = () => (this.birthTime === null ? null : GetAge(this.birthTime));

    /** @param {number} birthTime Unix timestamp in seconds (global UTC) */
    SetBirthTime = (birthTime) => {
        this.birthTime = birthTime;
        this.UNSAVED_birthTime = birthTime;
        this.lastBirthTime = GetGlobalTime();
        this.user.SaveLocal();
    };

    GetInfoToChangeUsername() {
        const delta = this.usernameTime === null ? null : GetDaysUntil(this.usernameTime);
        const remain = delta === null ? 0 : DAYS_USERNAME_CHANGE - Math.round(delta);

        return {
            remain: remain,
            total: DAYS_USERNAME_CHANGE
        };
    }

    GetInfoToChangeBirthtime() {
        const delta = this.lastBirthTime === null ? null : GetDaysUntil(this.lastBirthTime);
        const remain = delta === null ? 0 : DAYS_BIRTHTIME_CHANGE - Math.round(delta);

        return {
            remain: remain,
            total: DAYS_BIRTHTIME_CHANGE
        };
    }

    /** @returns {NotificationInAppOptionalUpdate | null} */
    GetOptionalUpdateNotifications = () => {
        if (this.user.server2.optionalUpdateAvailable === null) {
            return null;
        }

        return {
            type: 'optional-update',
            data: {
                version: this.user.server2.optionalUpdateAvailable
            },
            timestamp: GetLocalTime()
        };
    };
}

export default Informations;
