import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import { IUserData } from 'Types/Interface/IUserData';

import DynamicVar from 'Utils/DynamicVar';
import { GetAge, GetDaysUntil, GetGlobalTime } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/Class/ZapGPT').ZapGPTState} ZapGPTState
 * @typedef {import('Types/Class/Informations').SaveObject_Local_Informations} SaveObject_Local_Informations
 */

const DAYS_USERNAME_CHANGE = 30;
const DAYS_BIRTHTIME_CHANGE = 365;

/** @extends {IUserData<SaveObject_Local_Informations>} */
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

    /** @param {SaveObject_Local_Informations} data */
    Load = (data) => {
        if (data.username) {
            this.username.Set(data.username);
        }
        if (data.usernameTime) {
            this.usernameTime = data.usernameTime;
        }
        if (data.titleID) {
            this.title.Set(data.titleID);
        }
        if (data.UNSAVED_title) {
            this.UNSAVED_title = data.UNSAVED_title;
        }
        if (data.birthTime) {
            this.birthTime = data.birthTime;
        }
        if (data.lastBirthTime) {
            this.lastBirthTime = data.lastBirthTime;
        }
        if (data.UNSAVED_birthTime) {
            this.UNSAVED_birthTime = data.UNSAVED_birthTime;
        }
        if (data.xp) {
            this.xp = data.xp;
        }
        if (data.ox) {
            this.ox.Set(data.ox);
        }
        if (data.adRemaining) {
            this.adRemaining = data.adRemaining;
        }
        if (data.adTotalWatched) {
            this.adTotalWatched = data.adTotalWatched;
        }
        if (data.achievementSelfFriend) {
            this.achievementSelfFriend = data.achievementSelfFriend;
        }
        if (data.purchasedCount) {
            this.purchasedCount = data.purchasedCount;
        }
    };

    /** @returns {SaveObject_Local_Informations} */
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

    IsUnsaved = () => {
        return this.UNSAVED_title !== null || this.UNSAVED_birthTime !== null;
    };
    Purge = () => {
        this.UNSAVED_title = null;
        this.UNSAVED_birthTime = null;
    };

    /** @param {string} username */
    SetUsername = async (username) => {
        const request = await this.user.server.SaveUsername(username);

        if (request === 'ok') {
            this.username.Set(username);
            this.usernameTime = GetGlobalTime();
            this.user.LocalSave();
        }

        return request;
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
