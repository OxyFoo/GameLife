import dataManager from '../Managers/DataManager';
import langManager from '../Managers/LangManager';

import { GetAge, GetDaysUntil, GetTime } from '../Functions/Time';

const DAYS_USERNAME_CHANGE = 30;
const DAYS_BIRTHTIME_CHANGE = 365;

class Informations {
    constructor(user) {
        /**
         * @typedef {import('../Managers/UserManager').default} UserManager
         * @type {UserManager}
         */
        this.user = user;

        this.username = '';
        this.usernameTime = null;
        this.title = 0;
        this.birthTime = null;
        this.lastBirthTime = null;
        this.xp = 0;

        this.UNSAVED_title = null;
        this.UNSAVED_birthTime = null;
    }

    Clear() {
        this.username = '';
        this.usernameTime = null;
        this.title = 0;
        this.birthTime = null;
        this.lastBirthTime = null;
        this.xp = 0;
        this.UNSAVED_title = null;
        this.UNSAVED_birthTime = null;
    }
    Load(informations) {
        this.username = informations['username'];
        this.usernameTime = informations['usernameTime'];
        this.title = informations['title'];
        this.birthTime = informations['birthTime'];
        this.lastBirthTime = informations['lastBirthTime'];
        this.xp = informations['xp'];
        this.UNSAVED_title = informations['UNSAVED_title'];
        this.UNSAVED_birthTime = informations['UNSAVED_birthTime'];
    }
    Save() {
        const informations = {
            username: this.username,
            usernameTime: this.usernameTime,
            title: this.title,
            birthTime: this.birthTime,
            lastBirthTime: this.lastBirthTime,
            xp: this.xp,
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
        const lang = langManager.curr['identity'];
        const request = await this.user.server.SaveUsername(username);

        if (request === 'ok') {
            this.username = username;
            this.usernameTime = GetTime();
            this.user.LocalSave();

            // Refresh front
            this.user.interface.forceUpdate();
            if (this.user.interface.popup.state.opened) {
                this.user.interface.popup.forceUpdate();
            }
        } else if (request === 'alreadyUsed') {
            const title = lang['alert-alreadyUsed-title'];
            const text = lang['alert-alreadyUsed-text'];
            this.user.interface.popup.ForceOpen('ok', [ title, text ]);
        } else if (request === 'alreadyChanged') {
            const info = this.GetInfoToChangeUsername();
            const title = lang['alert-alreadyChanged-title'];
            const text = lang['alert-alreadyChanged-text'].replace('{}', info.remain).replace('{}', info.remain);
            this.user.interface.popup.ForceOpen('ok', [ title, text ]);
        } else if (request === 'error') {
            const title = lang['alert-error-title'];
            const text = lang['alert-error-text'];
            this.user.interface.popup.ForceOpen('ok', [ title, text ]);
        }
    }

    GetTitle = () => {
        const title = dataManager.titles.GetTitleByID(this.title);
        return title === null ? '' : dataManager.GetText(title.Name);
    }
    SetTitle = (ID) => {
        if (typeof(ID) !== 'number') return;

        this.title = ID;
        this.UNSAVED_title = ID;
        this.user.interface.forceUpdate();
        if (this.user.interface.popup.state.opened)
            this.user.interface.popup.forceUpdate();
        this.user.LocalSave();
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

    // TODO - Replace by inventory system
    //        "title.AchievementsCondition" Removed
    GetUnlockTitles = () => {
        let availableTitles = dataManager.titles.titles.map(title => ({ id: title.ID, value: dataManager.GetText(title.Name) }));
        availableTitles.splice(0, 0, { id: 0, value: langManager.curr['identity']['input-title-none'] });
        return availableTitles;

        let unlockTitles = [
            { key: 0, value: langManager.curr['identity']['empty-title'] }
        ];
        for (let t = 0; t < dataManager.titles.titles.length; t++) {
            const title = dataManager.titles.titles[t];
            const cond = parseInt(title.AchievementsCondition);
            if (isNaN(cond)) {
                continue;
            }
            if (cond === 0 || this.achievements.solved.includes(cond)) {
                const newTitle = { key: title.ID, value: title.Title };
                unlockTitles.push(newTitle);
            }
        }
        return unlockTitles;
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