import Achievements from '../Class/Achievements';
import Activities from '../Class/Activities';
import Experience from '../Class/Experience';
import Informations from '../Class/Informations';
import Quests from '../Class/Quests';
import Server from '../Class/Server';
import Settings from '../Class/Settings';

import DataStorage, { STORAGE } from '../Functions/DataStorage';

const DEFAULT_STATS = {
    'int': 0,
    'soc': 0,
    'for': 0,
    'end': 0,
    'agi': 0,
    'dex': 0
};

class UserManager {
    constructor() {
        this.achievements = new Achievements(this);
        this.activities = new Activities(this);
        this.experience = new Experience(this);
        this.informations = new Informations(this);
        this.quests = new Quests(this);
        this.server = new Server(this);
        this.settings = new Settings(this);

        /**
         * @description Function loaded in render of App.js to access UserManager
         * @typedef {import('./PageManager').default} PageManager
         * @type {PageManager}
         */
        this.interface;

        this.xp = 0;
        this.stats = DEFAULT_STATS;
        this.tempSelectedTime = null;
    }

    async Clear() {
        this.xp = 0;
        this.stats = DEFAULT_STATS;
        this.tempSelectedTime = null;

        this.achievements.Clear();
        this.activities.Clear();
        this.informations.Clear();
        this.quests.Clear();
        this.server.Clear();
        this.settings.Clear();
        await this.settings.Save();

        await DataStorage.clearAll();
        await this.LocalSave();
    }

    async Disconnect() {
        await this.Clear();
        this.interface.ChangePage('login');
    }
    async Unmount() {
        await this.LocalSave();
        await this.OnlineSave();
        this.server.Clear();
    }

    async RefreshStats() {
        this.activities.RemoveDeletedSkillsActivities();
        this.experience.GetExperience();
        this.interface.forceUpdate();
    }

    async EventNewAchievement(achievement) {
    }

    /**
     * Load local user data
     * @returns {Promise<Boolean>}
     */
    LocalSave = async () => {
        const data = {
            'xp': this.xp,

            'dataToken': this.server.dataToken,
            'achievements': this.achievements.Save(),
            'activities': this.activities.Save(),
            'informations': this.informations.Save(),
            'quests': this.quests.Save()
        };

        const saved = await DataStorage.Save(STORAGE.USER, data);
        if   (saved)  this.interface.console.AddLog('info', 'User data: local save');
        else          this.interface.console.AddLog('error', 'User data: local save failed');
        return saved;
    }

    async LocalLoad() {
        let data = await DataStorage.Load(STORAGE.USER);
        const contains = (key) => data.hasOwnProperty(key);

        if (data !== null) {
            if (contains('xp')) this.xp = data['xp'];

            if (contains('dataToken')) this.server.dataToken = data['dataToken'];
            if (contains('achievements')) this.achievements.Load(data['achievements']);
            if (contains('activities')) this.activities.Load(data['activities']);
            if (contains('informations')) this.informations.Load(data['informations']);
            if (contains('quests')) this.quests.Load(data['quests']);

            this.interface.console.AddLog('info', 'User data: local load');
        } else {
            this.interface.console.AddLog('warn', 'User data: local load failed');
        }

        this.RefreshStats();
        return data !== null;
    }

    OnlineSave = async () => {
        let data = {};

        if (this.activities.IsUnsaved()) {
            data['activities'] = this.activities.UNSAVED_activities;
        }

        if (this.achievements.IsUnsaved()) {
            data['achievements'] = this.achievements.UNSAVED_solved;
        }

        if (this.informations.IsUnsaved()) {
            if (this.informations.UNSAVED_title !== null) {
                data['titleID'] = this.informations.UNSAVED_title;
            }
            if (this.informations.UNSAVED_birthTime !== null) {
                data['birthTime'] = this.informations.UNSAVED_birthTime;
            }
        }

        if (Object.keys(data).length) {
            const saved = await this.server.SaveUserData(data);
            console.log('online saveeeee', saved);
            if (saved) {
                this.activities.Purge();
                this.achievements.Purge();
                this.informations.Purge();
                await this.LocalSave();
                this.interface.console.AddLog('info', 'User data: online save');
            } else {
                this.interface.console.AddLog('error', 'User data: online save failed');
            }
            console.log(data);
        }
    }

    async OnlineLoad() {
        const data = await this.server.LoadUserData();
        const contains = (key) => data.hasOwnProperty(key);
        console.log('Online load', data);

        if (data !== null) {
            if (contains('username')) this.informations.username = data['username'];
            if (contains('usernameTime')) this.informations.usernameTime = data['usernameTime'];
            if (contains('title')) this.informations.title = data['title'];
            if (contains('birthtime')) this.informations.birthTime = data['birthtime'];
            if (contains('lastbirthtime')) this.informations.lastBirthTime = data['lastbirthtime'];

            if (contains('dataToken')) this.server.dataToken = data['dataToken'];
            if (contains('achievements')) {
                console.log('Data achievements', typeof(data['achievements']), data['achievements']);
                this.achievements.solved = data['achievements'];
            }
            if (contains('activities')) {
                console.log('Data activities', typeof(data['activities']), data['activities']);
                this.activities.LoadOnline(data['activities']);
            }

            console.log(data);
            this.interface.console.AddLog('info', 'User data: online load');
        } else {
            this.interface.console.AddLog('info', 'User data: online load failed');
        }

        this.RefreshStats();
        return data !== null;
    }
}

const user = new UserManager();

export default user;
export { UserManager, DEFAULT_STATS };