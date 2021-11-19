import deviceInfoModule from 'react-native-device-info';

import langManager from "./LangManager";
import dataManager from './DataManager';
import { getDaysUntil } from '../Functions/Time';
import DataStorage, { STORAGE } from '../Functions/DataStorage';

import Achievements from '../Class/Achievements';
import Activities from '../Class/Activities';
import Experience from "../Class/Experience";
import Quests from '../Class/Quests';
import Server from "../Class/Server";
import Settings from '../Class/Settings';

const DAYS_PSEUDO_CHANGE = 7;
const DEFAULT_PSEUDO = 'Player';
const DEFAULT_STATS = {
    'sag': 0,
    'int': 0,
    'con': 0,
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
     * this.changePage(pageName, argument);
     * Change page with animation and arg
     * Function loaded in componentDidMount of PageManager (in App.js)
     * I've do that to skip cycles warns
     */
    /**
     * @param {String} newpage
     * @param {Object} args
     * @param {Boolean} ignorePath - Default: false
     * @param {Boolean} forceUpdate - Default: false
     */
    changePage;
    backPage;
    openPopup;
    closePopup;
    openLeftPanel;

    constructor() {
        // User informations
        this.pseudo = DEFAULT_PSEUDO;
        this.pseudoDate = null;
        this.title = 0;
        this.birth = '';
        this.xp = 0;
        this.stats = DEFAULT_STATS;
    }

    async clear() {
        this.pseudo = DEFAULT_PSEUDO;
        this.pseudoDate = null;
        this.title = 0;
        this.birth = '';
        this.xp = 0;
        this.stats = DEFAULT_STATS;
        this.quests.daily = [];
        this.quests.todoList = [];

        this.settings.morningNotifications = true;

        this.server.status = 'offline';
        this.server.destructor();
        await DataStorage.clearAll();
        await this.saveData(false);
    }

    async disconnect() {
        this.server.disconnect();
        this.settings.email = '';
        await this.settings.Save();
        await this.saveData();
        this.changePage('login');
    }
    async unmount() {
        this.saveData();
        this.server.destructor();
    }

    async refreshStats(save = true) {
        this.activities.removeDeletedSkillsActivities();
        this.experience.getExperience();
        if (save) await this.saveData();
        this.changePage();
    }

    async eventNewAchievement(achievement) {
    }

    daysBeforeChangePseudo = () => {
        const delta = getDaysUntil(this.pseudoDate);
        const remain = DAYS_PSEUDO_CHANGE - Math.round(delta);
        return [ remain, DAYS_PSEUDO_CHANGE ];
    }

    // TODO - Move
    pseudoCallback = (status) => {
        async function loadData(button) {
            await this.loadData();
            this.changePage();
        };
        if (status === "wrongtimingpseudo") {
            const title = langManager.curr['identity']['alert-wrongtimingpseudo-title'];
            const text = langManager.curr['identity']['alert-wrongtimingpseudo-text'];
            this.openPopup('ok', [ title, text ], loadData.bind(this));
        } else if (status === "wrongpseudo") {
            const title = langManager.curr['identity']['alert-wrongpseudo-title'];
            const text = langManager.curr['identity']['alert-wrongpseudo-text'];
            this.openPopup('ok', [ title, text ], loadData.bind(this));
        } else if (status === "ok") {
            this.pseudoDate = new Date();
            this.saveData(false);
        }
    }

    // TODO - Replace by inventory system
    /* TITRES */
    getUnlockTitles = () => {
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

    async saveUnsavedData() {
        return true;
    }
    async saveData(online) {
        const _online = typeof(online) === 'boolean' ? online : this.isConnected();
        const data = {
            'pseudo': this.pseudo,
            'pseudoDate': this.pseudoDate,
            'title': this.title,
            'birth': this.birth,
            'xp': this.xp,
            'activities': this.activities.getAll(),
            'solvedAchievements': this.achievements.solved,
            'daily': this.quests.daily,
            'tasks': this.quests.todoList
        };

        // TODO - this.pseudoCallback, le mettre ailleurs
        await DataStorage.Save(STORAGE.USER, data, _online, this.server.token);
    }
    async loadData(online) {
        const get = (data, index, defaultValue, oneBlock = false) => {
            let output = defaultValue;
            if (data.hasOwnProperty(index) && data[index] !== null) {
                if (oneBlock) {
                    output = data[index];
                } else
                if (typeof(data[index]) !== 'object' || data[index].length > 0) {
                    output = data[index];
                }
            }
            return output;
        }

        const _online = typeof(online) !== 'undefined' ? online : this.isConnected();
        const data = await DataStorage.Load(STORAGE.USER, _online, this.server.token);
        if (data !== null) {
            this.pseudo = get(data, 'pseudo', this.pseudo);
            this.pseudoDate = get(data, 'pseudoDate', null);
            this.title = get(data, 'title', 0);
            this.birth = get(data, 'birth', '');
            this.xp = get(data, 'xp', 0);
            this.quests.daily = get(data, 'daily', []);
            this.quests.todoList = get(data, 'tasks', []);
            this.achievements.solved = get(data, 'solvedAchievements', []);
            if (data.hasOwnProperty('activities') && data['activities'].length > 0) {
                if (this.activities.getAll().length === 0) {
                    this.activities.setAll(data['activities']);
                } else {
                    for (let a in data['activities']) {
                        const activity = data['activities'][a];
                        this.activities.Add(activity.skillID, activity.startDate, activity.duration, false);
                    }
                }
            }
        }

        this.refreshStats(false);
    }

    isConnected = this.server.isConnected;
}

const user = new UserManager();

export default user;
export { UserManager };