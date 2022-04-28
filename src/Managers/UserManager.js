import Achievements from '../Class/Achievements';
import Activities from '../Class/Activities';
import Admob from '../Class/Admob';
import Experience from '../Class/Experience';
import Informations from '../Class/Informations';
import Inventory from '../Class/Inventory';
import Multiplayer from '../Class/Multiplayer';
import Quests from '../Class/Quests';
import Server from '../Class/Server';
import Settings from '../Class/Settings';
import Tasks from '../Class/Tasks';

import DataStorage, { STORAGE } from '../Utils/DataStorage';

const DEBUG_DATA = false;

/**
 * @typedef {import('../Interface/Components').Character} Character
 * @typedef {import('../Class/Experience').XPInfo} XPInfo
 * @typedef {Object} Stats
 * @property {XPInfo} int
 * @property {XPInfo} soc
 * @property {XPInfo} for
 * @property {XPInfo} end
 * @property {XPInfo} agi
 * @property {XPInfo} dex
 */

class UserManager {
    constructor() {
        this.statsKey = [ 'int', 'soc', 'for', 'end', 'agi', 'dex' ];

        this.achievements = new Achievements(this);
        this.activities = new Activities(this);
        this.admob = new Admob(this);
        this.experience = new Experience(this);
        this.informations = new Informations(this);
        this.inventory = new Inventory(this);
        this.multiplayer = new Multiplayer(this);
        this.quests = new Quests(this);
        this.server = new Server(this);
        this.settings = new Settings(this);
        this.tasks = new Tasks(this);

        /**
         * @description Function loaded in render of App.js to access UserManager
         * @typedef {import('./PageManager').default} PageManager
         * @type {PageManager}
         */
        this.interface;

        /**
         * @description User's character, loaded at start of app
         * @type {Character}
         */
        this.character = null;

        this.xp = 0;
        /**
         * @type {Stats}
         */
        this.stats = this.experience.GetEmptyExperience();
        this.tempSelectedTime = null;
        this.tempMailSent = null;
    }
    
    StartTimers() {
        const saveTime = 5 * 60 * 1000; // 5 minutes
        const save = this.server.online ? this.OnlineSave : this.LocalSave;
        this.intervalSave = setInterval(save, saveTime);

        const achievementsTime = 1 * 60 * 1000; // 1 minute
        this.intervalAchievements = setInterval(this.achievements.CheckAchievements, achievementsTime);
    }

    async Clear(keepOnboardingState = true) {
        const onboarding = this.settings.onboardingWatched;
        this.xp = 0;
        this.stats = this.experience.GetEmptyExperience();
        this.tempSelectedTime = null;

        this.achievements.Clear();
        this.activities.Clear();
        this.informations.Clear();
        this.inventory.Clear();
        this.quests.Clear();
        this.server.Clear();
        this.settings.Clear();
        this.tasks.Clear();
        await this.settings.Save();

        await DataStorage.ClearAll();
        await this.LocalSave();

        if (keepOnboardingState) {
            this.settings.onboardingWatched = onboarding;
            this.settings.Save();
        }
    }

    async Disconnect(request = true) {
        let output = false;
        if (!request || await this.server.Disconnect()) {
            await this.Clear();
            this.interface.ChangePage('login');
            output = true;
        }
        return output;
    }
    async Unmount() {
        clearInterval(this.intervalSave);
        clearInterval(this.intervalAchievements);
        await this.LocalSave();
        await this.OnlineSave();
        this.server.Clear();
    }

    async RefreshStats() {
        this.activities.RemoveDeletedSkillsActivities();

        const { stats, xpInfo } = this.experience.GetExperience();
        this.stats = stats;
        this.xp = xpInfo.totalXP;

        this.interface.forceUpdate();
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
            'admob': this.admob.Save(),
            'informations': this.informations.Save(),
            'inventory': this.inventory.Save(),
            'quests': this.quests.Save(),
            'tasks': this.tasks.Save()
        };

        const debugIndex = this.interface.console.AddLog('info', 'User data: local saving...');
        const saved = await DataStorage.Save(STORAGE.USER, data);
        if   (saved)  this.interface.console.EditLog(debugIndex, 'User data: local save');
        else          this.interface.console.AddLog('error', 'User data: local save failed');
        return saved;
    }

    async LocalLoad() {
        const debugIndex = this.interface.console.AddLog('info', 'User data: local loading...');
        let data = await DataStorage.Load(STORAGE.USER);
        const contains = (key) => data.hasOwnProperty(key);

        if (data !== null) {
            if (contains('xp')) this.xp = data['xp'];

            if (contains('dataToken')) this.server.dataToken = data['dataToken'];
            if (contains('achievements')) this.achievements.Load(data['achievements']);
            if (contains('activities')) this.activities.Load(data['activities']);
            if (contains('admob')) this.admob.Load(data['admob']);
            if (contains('informations')) this.informations.Load(data['informations']);
            if (contains('inventory')) this.inventory.Load(data['inventory']);
            if (contains('quests')) this.quests.Load(data['quests']);
            if (contains('tasks')) this.tasks.Load(data['tasks']);

            this.interface.console.EditLog(debugIndex, 'User data: local load success');
        } else {
            this.interface.console.AddLog('warn', 'User data: local load failed');
        }

        this.RefreshStats();
        return data !== null;
    }

    /** @returns {Promise<Boolean>} True if data is saved */
    OnlineSave = async () => {
        if (!this.server.online) return false;

        let data = {};
        let saved = false;

        if (this.activities.IsUnsaved()) {
            data['activities'] = this.activities.GetUnsaved();
            data['xp'] = this.xp;
        }

        if (this.tasks.IsUnsaved()) {
            data['tasks'] = this.tasks.GetUnsaved();
        }

        if (this.inventory.IsUnsaved()) {
            data['equipments'] = this.inventory.GetUnsaved();
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
            const debugIndex = this.interface.console.AddLog('info', 'User data: online saving...');
            saved = await this.server.SaveUserData(data);
            if (saved) {
                this.activities.Purge();
                this.achievements.Purge();
                this.informations.Purge();
                this.tasks.Purge();
                this.interface.console.EditLog(debugIndex, 'User data: online save success');
                console.log(data);
                await this.LocalSave();
            } else {
                this.interface.console.AddLog('error', 'User data: online save failed');
            }
            if (DEBUG_DATA) console.log('User data online save:', data);
        }

        return saved;
    }

    async OnlineLoad(force = false) {
        if (!this.server.online) return false;
        const debugIndex = this.interface.console.AddLog('info', 'User data: online loading...');
        const data = await this.server.LoadUserData(force);
        const contains = (key) => data.hasOwnProperty(key);
        if (DEBUG_DATA) console.log('User data online load:', data);

        if (data !== null) {
            if (contains('username')) this.informations.username.Set(data['username']);
            if (contains('usernameTime')) this.informations.usernameTime = data['usernameTime'];
            if (contains('title')) this.informations.title.Set(data['title']);
            if (contains('birthtime')) this.informations.birthTime = data['birthtime'];
            if (contains('lastbirthtime')) this.informations.lastBirthTime = data['lastbirthtime'];
            if (contains('ox')) this.informations.ox = data['ox'];
            if (contains('adRemaining')) this.informations.adRemaining = data['adRemaining'];
            if (contains('inventory')) this.inventory.LoadOnline(data['inventory']);
            if (contains('achievements')) this.achievements.LoadOnline(data['achievements']);
            if (contains('activities')) this.activities.LoadOnline(data['activities']);
            if (contains('tasks')) this.tasks.LoadOnline(data['tasks']);
            if (contains('dataToken')) {
                this.server.dataToken = data['dataToken'];
                this.interface.console.AddLog('info', 'User data: new data token (' + this.server.dataToken + ')');
            }

            this.interface.console.EditLog(debugIndex, 'User data: online load success');
        } else {
            this.interface.console.AddLog('info', 'User data: online load failed');
        }

        this.RefreshStats();
        return data !== null;
    }
}

const user = new UserManager();

export default user;
export { UserManager };