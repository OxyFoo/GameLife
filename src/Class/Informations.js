import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import DynamicVar from 'Utils/DynamicVar';
import { GetAge, GetDaysUntil, GetGlobalTime } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/TCP').ZapGPTState} ZapGPTState
 */

const DAYS_USERNAME_CHANGE = 30;
const DAYS_BIRTHTIME_CHANGE = 365;

class Informations {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;
    }

    username = new DynamicVar('');
    usernameTime = null;

    title = new DynamicVar(0);
    UNSAVED_title = null;

    /** @type {number} Null if disabled or unix timestamp (global UTC) */
    birthTime = null;
    lastBirthTime = null;
    UNSAVED_birthTime = null;

    xp = 0;
    ox = new DynamicVar(0);
    adRemaining = 0;
    adTotalWatched = 0;

    /** @type {ZapGPTState} */
    zapGPT = { remaining: 0, total: 0 };
    switchHomeTodayPieChart = true;
    achievementSelfFriend = false;

    Clear() {
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
        this.switchHomeTodayPieChart = true;
        this.achievementSelfFriend = false;
    }
    Load(informations) {
        const contains = (key) => informations.hasOwnProperty(key);
        if (contains('username')) this.username.Set(informations['username']);
        if (contains('usernameTime')) this.usernameTime = informations['usernameTime'];
        if (contains('title')) this.title.Set(informations['title']);
        if (contains('UNSAVED_title')) this.UNSAVED_title = informations['UNSAVED_title'];
        if (contains('birthTime')) this.birthTime = informations['birthTime'];
        if (contains('lastBirthTime')) this.lastBirthTime = informations['lastBirthTime'];
        if (contains('UNSAVED_birthTime')) this.UNSAVED_birthTime = informations['UNSAVED_birthTime'];
        if (contains('xp')) this.xp = informations['xp'];
        if (contains('ox')) this.ox.Set(parseInt(informations['ox']));
        if (contains('adRemaining')) this.adRemaining = informations['adRemaining'];
        if (contains('adTotalWatched')) this.adTotalWatched = informations['adTotalWatched'];
        if (contains('switchHomeTodayPieChart')) this.switchHomeTodayPieChart = informations['switchHomeTodayPieChart'];
        if (contains('achievementSelfFriend')) this.achievementSelfFriend = informations['achievementSelfFriend'];
    }
    Save() {
        const informations = {
            username: this.username.Get(),
            usernameTime: this.usernameTime,
            title: this.title.Get(),
            UNSAVED_title: this.UNSAVED_title,
            birthTime: this.birthTime,
            lastBirthTime: this.lastBirthTime,
            UNSAVED_birthTime: this.UNSAVED_birthTime,
            xp: this.xp,
            ox: this.ox.Get(),
            adRemaining: this.adRemaining,
            adTotalWatched: this.adTotalWatched,
            switchHomeTodayPieChart: this.switchHomeTodayPieChart,
            achievementSelfFriend: this.achievementSelfFriend
        };
        return informations;
    }

    IsUnsaved = () => {
        return this.UNSAVED_title !== null || this.UNSAVED_birthTime !== null;
    }
    Purge = () => {
        this.UNSAVED_title = null;
        this.UNSAVED_birthTime = null;
    }

    SetUsername = async (username) => {
        const request = await this.user.server.SaveUsername(username);

        if (request === 'ok') {
            this.username.Set(username);
            this.usernameTime = GetGlobalTime();
            this.user.LocalSave();

            // Refresh front
            this.user.interface.forceUpdate();
            if (this.user.interface.popup.state.opened) {
                this.user.interface.popup.forceUpdate();
            }
        }

        return request;
    }

    GetTitleText = () => {
        const title = dataManager.titles.GetByID(this.title.Get());
        return title === null ? '' : langManager.GetText(title.Name);
    }
    SetTitle = (ID) => {
        if (typeof(ID) !== 'number') return;

        this.title.Set(ID);
        this.UNSAVED_title = ID;
        this.user.interface.forceUpdate();
        if (this.user.interface.popup.state.opened)
            this.user.interface.popup.forceUpdate();
        this.user.LocalSave();
    }

    DecrementAdRemaining = () => {
        this.adRemaining--;
        this.adTotalWatched++;
        this.user.interface.console.AddLog('info', 'Remaining ad:', this.adRemaining);
        this.user.LocalSave();

        if (this.adRemaining <= 0) {
            const title = langManager.curr['server']['alert-adempty-title'];
            const message = langManager.curr['server']['alert-adempty-text'];
            this.user.interface.popup.Open('ok', [ title, message ], undefined, false);
        }
    }

    /**
     * Return age in years
     * @returns {number | null}
     */
    GetAge = () => this.birthTime === null ? null : GetAge(this.birthTime);

    SetBirthTime = (birthTime) => {
        this.birthTime = birthTime;
        this.UNSAVED_birthTime = birthTime;
        this.lastBirthTime = GetGlobalTime();
        this.user.LocalSave();
    }

    GetInfoToChangeUsername() {
        const delta = this.usernameTime === null ? null : GetDaysUntil(this.usernameTime);
        const remain = DAYS_USERNAME_CHANGE - Math.round(delta);
        const output = {
            remain: delta === null ? 0 : remain,
            total: DAYS_USERNAME_CHANGE
        };
        return output;
    }

    GetInfoToChangeBirthtime() {
        const delta = this.lastBirthTime === null ? null : GetDaysUntil(this.lastBirthTime);
        const remain = DAYS_BIRTHTIME_CHANGE - Math.round(delta);
        const output = {
            remain: delta === null ? 0 : remain,
            total: DAYS_BIRTHTIME_CHANGE
        };
        return output;
    }
}

export default Informations;
