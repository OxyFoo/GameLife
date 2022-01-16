import langManager from "./LangManager";
import dataManager from './DataManager';
//import PageManager from "./PageManager";

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

    constructor() {
        // User informations
        this.username = '';
        this.usernameDate = null;
        this.title = 0;
        this.birth = 0;
        this.xp = 0;
        this.stats = DEFAULT_STATS;
        this.tempSelectedTime = null;
    }

    async clear() {
        this.username = '';
        this.usernameDate = null;
        this.title = 0;
        this.birth = 0;
        this.xp = 0;
        this.stats = DEFAULT_STATS;
        this.tempSelectedTime = null;
        this.quests.daily = [];
        this.quests.todoList = [];

        this.settings.Clear();
        this.server.Clear();

        await DataStorage.clearAll();
        await this.LocalSave();
    }

    async disconnect() {
        await this.OnlineSave();

        this.server.Clear();
        this.settings.Clear();
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
        const title = dataManager.titles.GetTitleByID(user.title);
        return title === null ? '' : dataManager.GetText(title);
    }

    async EventNewAchievement(achievement) {
    }

    DaysBeforeChangePseudo = () => {
        const delta = GetDaysUntil(this.usernameDate);
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
            this.usernameDate = new Date();
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

    async SaveUnsavedData() {
        return true;
    }

    /**
     * Load local user data
     * @returns {Promise<Boolean>}
     */
    LocalSave = () => {
        const data = {
            'username': this.username,
            'usernameDate': this.usernameDate,
            'title': this.title,
            'birth': this.birth,
            'xp': this.xp,
            'activities': this.activities.GetAll(),
            'solvedAchievements': this.achievements.solved,
            'daily': this.quests.daily,
            'tasks': this.quests.todoList,
            'currentActivity': this.activities.currentActivity
        };

        return DataStorage.Save(STORAGE.USER, data);
    }
    OnlineSave = async () => {
        let data = {};

        if (this.activities.IsUnsaved()) {
            data['activities'] = this.activities.UNSAVED_activities;
        }

        if (this.achievements.IsUnsaved()) {
            data['achievements'] = this.achievements.UNSAVED_solved;
        }

        const saved = await this.server.SaveData(data);
        if (saved) {
            this.activities.Purge();
            this.achievements.Purge();
        }
    };

    LocalLoad = async () => this.loadData(false);
    OnlineLoad = async () => this.loadData(true);
    async loadData(online) {
        let data;
        if (online) data = await this.server.LoadData();
        else        data = await DataStorage.Load(STORAGE.USER);

        const loadKey = (key, defaultValue) => {
            if (!data.hasOwnProperty(key)) return defaultValue;
            return data[key];
        }

        // TODO - Finir ça
        if (data !== null) {
            this.username = loadKey('username');
            this.usernameDate = loadKey('usernameDate');
            this.title = 1;//data['title'];
            //this.activities.SetAll(data['activities']);
            //this.birth = data['birth'];
            //this.xp = data['xp'];
            //this.achievements.solved = data['solvedAchievements'];
            //this.quests.daily = data['daily'];
            //this.quests.todoList = data['tasks'];
            if (loadKey('currentActivity', null) !== null) {
                this.activities.currentActivity = loadKey('currentActivity');
            }
        }

        this.refreshStats();
        return data !== null;
    }

    IsConnected = this.server.IsConnected;
}

const user = new UserManager();

export default user;
export { UserManager, DEFAULT_STATS };