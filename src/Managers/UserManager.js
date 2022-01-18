//import PageManager from "./PageManager";
//import dataManager from './DataManager';

import langManager from "./LangManager";

import Achievements from '../Class/Achievements';
import Activities from '../Class/Activities';
import Experience from "../Class/Experience";
import Quests from '../Class/Quests';
import Server from "../Class/Server";
import Settings from '../Class/Settings';

import { GetDaysUntil } from '../Functions/Time';
import DataStorage, { STORAGE } from '../Functions/DataStorage';

const DAYS_PSEUDO_CHANGE = 7;
const DEFAULT_STATS = {
    'int': 0,
    'soc': 0,
    'for': 0,
    'end': 0,
    'agi': 0,
    'dex': 0
};

class UserManager {
    achievements = new Achievements(this);
    activities = new Activities(this);
    experience = new Experience(this);
    quests = new Quests(this);
    server = new Server(this);
    settings = new Settings(this);
    /**
     * Function loaded in componentDidMount of PageManager (in App.js)
     * I've do that to skip cycles warns
     * (Not imported (for JSDoc) for the same reason)
     * @type {PageManager}
     */
    interface;

    /**
     * @type {DataManager}
     */
    dataManager;

    constructor() {
        this.username = '';
        this.usernameTime = null;
        this.title = 0;
        this.birthTime = null;
        this.xp = 0;
        this.stats = DEFAULT_STATS;
        this.tempSelectedTime = null;
    }

    async Clear() {
        this.username = '';
        this.usernameTime = null;
        this.title = 0;
        this.birthTime = null;
        this.xp = 0;

        this.stats = DEFAULT_STATS;
        this.tempSelectedTime = null;

        this.achievements.Clear();
        this.activities.Clear();
        this.quests.Clear();
        this.server.Clear();
        this.settings.Clear();

        await DataStorage.clearAll();
        await this.LocalSave();
    }

    async disconnect() {
        await this.OnlineSave();

        this.Clear();
        await this.LocalSave();
        await this.settings.Save();
        this.interface.ChangePage('login');
    }
    async unmount() {
        await this.LocalSave();
        await this.OnlineSave();
        this.server.Clear();
    }

    async refreshStats() {
        this.activities.RemoveDeletedSkillsActivities();
        this.experience.GetExperience();
        this.interface.ChangePage();
    }

    GetTitle() {
        const title = this.dataManager.titles.GetTitleByID(user.title);
        return title === null ? '' : this.dataManager.GetText(title.Name);
    }

    async EventNewAchievement(achievement) {
    }

    DaysBeforeChangePseudo = () => {
        const delta = GetDaysUntil(this.usernameTime);
        const remain = DAYS_PSEUDO_CHANGE - Math.round(delta);
        return [ remain, DAYS_PSEUDO_CHANGE ];
    }

    // TODO - Move
    /*pseudoCallback = (status) => {
        async function loadData(button) {
            await this.loadData();
            this.interface.ChangePage();
        };
        if (status === "wrongtimingpseudo") {
            const title = langManager.curr['identity']['alert-wrongtimingpseudo-title'];
            const text = langManager.curr['identity']['alert-wrongtimingpseudo-text'];
            this.interface.popup.Open('ok', [ title, text ], loadData.bind(this));
        } else if (status === "wrongpseudo") {
            const title = langManager.curr['identity']['alert-wrongpseudo-title'];
            const text = langManager.curr['identity']['alert-wrongpseudo-text'];
            this.interface.popup.Open('ok', [ title, text ], loadData.bind(this));
        } else if (status === "ok") {
            this.usernameTime = new Date();
            this.LocalSave();
        }
    }*/

    // TODO - Replace by inventory system
    //        "title.AchievementsCondition" Removed
    /* TITRES */
    GetUnlockTitles = () => {
        let unlockTitles = [
            { key: 0, value: langManager.curr['identity']['empty-title'] }
        ];
        for (let t = 0; t < this.dataManager.titles.titles.length; t++) {
            const title = this.dataManager.titles.titles[t];
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

    async SaveUnsavedData() {
        return true;
    }

    /**
     * Load local user data
     * @returns {Promise<Boolean>}
     */
    LocalSave = async () => {
        const data = {
            'username': this.username,
            'usernameTime': this.usernameTime,
            'title': this.title,
            'birth': this.birthTime,
            'xp': this.xp,

            'achievements': this.achievements.Save(),
            'activities': this.activities.Save(),
            'quests': this.quests.Save()
        };

        const saved = await DataStorage.Save(STORAGE.USER, data);
        if   (saved)  this.AddLog('info', 'User data: local save');
        else          this.AddLog('error', 'User data: local save failed');
        return saved;
    }

    // TODO - Finir ça
    OnlineSave = async () => {
        let data = {};

        if (this.activities.IsUnsaved()) {
            data['activities'] = this.activities.UNSAVED_activities;
        }

        if (this.achievements.IsUnsaved()) {
            data['achievements'] = this.achievements.UNSAVED_solved;
        }

        if (Object.keys(data).length) {
            const saved = await this.server.SaveData(data);
            if (saved) {
                this.activities.Purge();
                this.achievements.Purge();
                this.AddLog('info', 'User data: online save');
            } else {
                this.AddLog('error', 'User data: online save failed');
            }
        }
    };

    async LocalLoad() {
        let data = await DataStorage.Load(STORAGE.USER);
        const contains = (key) => data.hasOwnProperty(key);

        if (data !== null) {
            if (contains('username')) this.username = data['username'];
            if (contains('usernameTime')) this.usernameTime = data['usernameTime'];
            if (contains('title')) this.title = data['title'];
            if (contains('birthTime')) this.birthTime = data['birthTime'];
            if (contains('xp')) this.xp = data['xp'];

            if (contains('achievements')) this.achievements.Load(data['achievements']);
            if (contains('activities')) this.activities.Load(data['activities']);
            if (contains('quests')) this.quests.Load(data['quests']);

            this.AddLog('info', 'User data: local load');
        } else {
            this.AddLog('warn', 'User data: local load failed');
        }

        this.refreshStats();
        return data !== null;
    }

    // TODO - Finir ça
    async OnlineLoad() {
        let data = await this.server.LoadUserData();
        const contains = (key) => data.hasOwnProperty(key);

        if (data !== null) {
            if (contains('username')) this.username = data['username'];
            if (contains('usernameTime')) this.usernameTime = data['usernameTime'];
            if (contains('title')) this.title = data['title'];
            //this.activities.SetAll(data['activities']);
            //this.birth = data['birth'];
            //this.xp = data['xp'];
            //this.achievements.solved = data['solvedAchievements'];
            //this.quests.daily = data['daily'];
            //this.quests.todoList = data['tasks'];
            if (contains('currentActivity')) this.activities.currentActivity = data['currentActivity'];

            this.AddLog('info', 'User data: online load');
        } else {
            this.AddLog('info', 'User data: online load failed');
        }

        this.refreshStats();
        return data !== null;
    }

    IsConnected = this.server.IsConnected;

    /**
     * Show message in app console
     * @param {'info'|'warn'|'error'} type
     * @param {String} text
     */
    AddLog = (type, text) => this.interface.console.AddDebug(type, text);
}

const user = new UserManager();

export default user;
export { UserManager, DEFAULT_STATS };