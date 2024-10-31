import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import { IUserData } from 'Types/Interface/IUserData';

import DynamicVar from 'Utils/DynamicVar';
import { GetAge, GetDaysUntil, GetGlobalTime } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/Class/ZapGPT').ZapGPTState} ZapGPTState
 * @typedef {import('Types/Data/User/Informations').SaveObject_UserInformations} SaveObject_UserInformations
 * @typedef {import('Types/TCP/GameLife/Request_ServerToClient').ServerRequestSetUsername} ServerRequestSetUsername
 */

const DAYS_USERNAME_CHANGE = 30;
const DAYS_BIRTHTIME_CHANGE = 365;

/** @extends {IUserData<SaveObject_UserInformations>} */
class Informations extends IUserData {
    /** @param {UserManager} user */
    constructor(user) {
        super();

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
        this.username = new DynamicVar('');
        this.usernameTime = null;
        this.title = new DynamicVar(0);
        this.UNSAVED_title = null;
        this.birthTime = null;
        this.lastBirthTime = null;
        this.UNSAVED_birthTime = null;
        this.xp = 0;
        this.ox = new DynamicVar(0);
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
        const response = await this.user.server2.tcp.SendAndWait({
            action: 'get-user-data',
            tokenData: this.user.settings.dataToken
        });

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
        const { Username, LastChangeUsername, Title, Ox, Birthtime, LastChangeBirth, DataToken } = response.data;

        this.username.Set(Username);
        this.usernameTime = LastChangeUsername;
        this.title.Set(Title);
        this.ox.Set(Ox);
        this.birthTime = Birthtime;
        this.lastBirthTime = LastChangeBirth;
        this.user.settings.dataToken = DataToken; // TODO: Remove ?

        return true;
    };

    IsUnsaved = () => {
        return this.UNSAVED_title !== null || this.UNSAVED_birthTime !== null;
    };
    Purge = () => {
        this.UNSAVED_title = null;
        this.UNSAVED_birthTime = null;
    };

    /**
     * @param {string} username
     * @returns {Promise<ServerRequestSetUsername['result'] | null>}
     */
    SetUsername = async (username) => {
        const response = await this.user.server2.tcp.SendAndWait({
            action: 'set-username',
            username: username
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
            this.user.LocalSave();
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
        this.user.LocalSave();
    };

    /**
     * Consume ad remaining, increment ad total watched and show alert if ad remaining is 0
     */
    DecrementAdRemaining = () => {
        this.adRemaining--;
        this.adTotalWatched++;
        this.user.interface.console?.AddLog('info', 'Remaining ad:', this.adRemaining);
        this.user.LocalSave();

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
        this.user.LocalSave();
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
}

export default Informations;
