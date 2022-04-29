import dataManager from '../Managers/DataManager';
import langManager from '../Managers/LangManager';

import DynamicVar from '../Utils/DynamicVar';
import { GetAge, GetDaysUntil, GetTime } from '../Utils/Time';

const DAYS_USERNAME_CHANGE = 30;
const DAYS_BIRTHTIME_CHANGE = 365;

class Informations {
    constructor(user) {
        /**
         * @typedef {import('../Managers/UserManager').default} UserManager
         * @type {UserManager}
         */
        this.user = user;

        this.username = new DynamicVar('');
        this.usernameTime = null;
        this.title = new DynamicVar(0);
        this.birthTime = null;
        this.lastBirthTime = null;
        this.xp = 0;
        this.ox = 0;
        this.adRemaining = 0;
        this.adTotalWatched = 0;

        this.UNSAVED_title = null;
        this.UNSAVED_birthTime = null;
    }

    Clear() {
        this.username = new DynamicVar('');
        this.usernameTime = null;
        this.title = new DynamicVar(0);
        this.birthTime = null;
        this.lastBirthTime = null;
        this.xp = 0;
        this.ox = 0;
        this.adRemaining = 0;
        this.UNSAVED_title = null;
        this.UNSAVED_birthTime = null;
    }
    Load(informations) {
        const contains = (key) => informations.hasOwnProperty(key);
        if (contains('username')) this.username.Set(informations['username']);
        if (contains('usernameTime')) this.usernameTime = informations['usernameTime'];
        if (contains('title')) this.title.Set(informations['title']);
        if (contains('birthTime')) this.birthTime = informations['birthTime'];
        if (contains('lastBirthTime')) this.lastBirthTime = informations['lastBirthTime'];
        if (contains('xp')) this.xp = informations['xp'];
        if (contains('ox')) this.ox = informations['ox'];
        if (contains('adRemaining')) this.adRemaining = informations['adRemaining'];
        if (contains('adTotalWatched')) this.adTotalWatched = informations['adTotalWatched'];
        if (contains('UNSAVED_title')) this.UNSAVED_title = informations['UNSAVED_title'];
        if (contains('UNSAVED_birthTime')) this.UNSAVED_birthTime = informations['UNSAVED_birthTime'];
    }
    Save() {
        const informations = {
            username: this.username.Get(),
            usernameTime: this.usernameTime,
            title: this.title.Get(),
            birthTime: this.birthTime,
            lastBirthTime: this.lastBirthTime,
            xp: this.xp,
            ox: this.ox,
            adRemaining: this.adRemaining,
            adTotalWatched: this.adTotalWatched,
            UNSAVED_title: this.UNSAVED_title,
            UNSAVED_birthTime: this.UNSAVED_birthTime
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
            this.usernameTime = GetTime();
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
        return title === null ? '' : dataManager.GetText(title.Name);
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
     * @returns {Number}
     */
    GetAge = () => GetAge(this.birthTime);

    SetBirthTime = (birthTime) => {
        this.birthTime = birthTime;
        this.UNSAVED_birthTime = birthTime;
        this.lastBirthTime = GetTime();
        this.user.LocalSave();
    }

    GetInfoToChangeUsername() {
        const delta = GetDaysUntil(this.usernameTime);
        const remain = DAYS_USERNAME_CHANGE - Math.round(delta);
        const output = {
            remain: delta === null ? 0 : remain,
            total: DAYS_USERNAME_CHANGE
        };
        return output;
    }

    GetInfoToChangeBirthtime() {
        const delta = GetDaysUntil(this.lastBirthTime);
        const remain = DAYS_BIRTHTIME_CHANGE - Math.round(delta);
        const output = {
            remain: delta === null ? 0 : remain,
            total: DAYS_BIRTHTIME_CHANGE
        };
        return output;
    }
}

export default Informations;