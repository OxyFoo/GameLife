import Achievements from 'Class/Achievements';
import Activities from 'Class/Activities';
import Admob from 'Class/Admob';
import Consent from 'Class/Consent';
import Experience from 'Class/Experience';
import Informations from 'Class/Informations';
import Inventory from 'Class/Inventory';
import Missions from 'Class/Missions';
import Multiplayer from 'Class/Multiplayer';
import Quests from 'Class/Quests';
import Server from 'Class/Server';
import Settings from 'Class/Settings';
import Shop from 'Class/Shop';
import Todoes from 'Class/Todoes';

import DataStorage, { STORAGE } from 'Utils/DataStorage';
import TCP from 'Class/TCP';

/**
 * @typedef {import('Interface/Components').Character} Character
 * @typedef {import('Managers/PageManager').default} PageManager
 * @typedef {import('Interface/FlowEngine/back').default['_public']} FlowEngine
 * @typedef {import('Class/Experience').XPInfo} XPInfo
 *
 * @typedef {object} Stats
 * @property {XPInfo} int
 * @property {XPInfo} soc
 * @property {XPInfo} for
 * @property {XPInfo} sta
 * @property {XPInfo} agi
 * @property {XPInfo} dex
 */

const DEBUG_DATA = false;

class UserManager {
    constructor() {
        /**
         * @readonly
         * @type {Array<keyof Stats>}
         */
        this.statsKey = ['int', 'soc', 'for', 'sta', 'agi', 'dex'];

        this.achievements = new Achievements(this);
        this.activities = new Activities(this);
        this.admob = new Admob(this);
        this.consent = new Consent(this);
        this.experience = new Experience(this);
        this.informations = new Informations(this);
        this.inventory = new Inventory(this);
        this.missions = new Missions(this);
        this.multiplayer = new Multiplayer(this);
        this.quests = new Quests(this);
        this.server = new Server(this);
        this.settings = new Settings(this);
        this.shop = new Shop(this);
        this.tcp = new TCP(this);
        this.todoes = new Todoes(this);

        /** @type {Stats} */
        this.stats = this.experience.GetEmptyExperience();
    }

    /**
     * @description Ref loaded here from render of App.js to skip cyclic dependency
     * @type {FlowEngine}
     */
    // @ts-ignore Because "interface" is necessarily defined, without it nothing works in all cases
    interface = null;

    /** @type {Character | null} */
    character = null;

    xp = 0;

    appIsLoaded = false;

    /** @type {boolean} */
    globalSaving = false;

    /** @type {number | null} To avoid spamming mail (UTC) */
    tempMailSent = null;

    StartTimers() {
        // Save all data every 5 minutes
        const save = this.server.IsConnected() ? this.OnlineSave : this.LocalSave;
        this.intervalSave = setInterval(save, 5 * 60 * 1000);

        // Check achievements every 20 seconds
        this.intervalAchievements = setInterval(this.achievements.CheckAchievements, 20 * 1000);

        // Refresh activities at each 5 minutes if needed
        const timeUntilNext5MinutesInSeconds = 5 * 60 - ((Date.now() / 1000) % (5 * 60));
        this.timeoutActivities = setTimeout(
            () => {
                this.activities.RefreshActivities();
                this.intervalActivities = setInterval(this.activities.RefreshActivities, 5 * 60 * 1000);
            },
            (timeUntilNext5MinutesInSeconds + 1) * 1000
        );
    }

    CleanTimers() {
        clearInterval(this.intervalSave);
        clearInterval(this.intervalAchievements);
        clearTimeout(this.timeoutActivities);
        clearInterval(this.intervalActivities);
    }

    async Clear(keepOnboardingState = true) {
        const onboarding = this.settings.onboardingWatched;
        this.xp = 0;
        this.stats = this.experience.GetEmptyExperience();
        this.tempMailSent = null;

        this.achievements.Clear();
        this.activities.Clear();
        this.informations.Clear();
        this.inventory.Clear();
        this.missions.Clear();
        this.quests.Clear();
        this.server.Clear();
        this.settings.Clear();
        this.shop.Clear();
        this.todoes.Clear();
        await this.settings.Save();
        this.tcp.Disconnect();

        await DataStorage.ClearAll();
        await this.LocalSave();

        if (keepOnboardingState) {
            this.settings.onboardingWatched = onboarding;
            this.settings.Save();
        }
    }

    /** @returns {Promise<Array<string> | null>} */
    async GetDevices() {
        const result = await this.server.Request('getDevices');
        if (result === null || result['status'] !== 'ok') {
            return null;
        }
        return result['devices'];
    }

    /**
     * @param {boolean} [forceClear=false] Clear data even if disconnect failed
     * @param {boolean} [allDevices=false] Disconnect all devices
     * @returns {Promise<boolean>}
     */
    async Disconnect(forceClear = false, allDevices = false) {
        const result = await this.server.Request('disconnect', { allDevices });
        const success = result !== null && result['status'] === 'ok';

        if (success || forceClear) {
            await this.Clear();
            this.interface.ChangePage('login');
        }

        this.CleanTimers();

        return result['status'] === 'ok';
    }
    async Unmount() {
        this.CleanTimers();
        this.tcp.Disconnect();
        await this.settings.Save();
        await this.LocalSave();
        await this.OnlineSave();
        this.server.Clear();
    }

    async RefreshStats(onlineSave = true) {
        if (this.server.IsConnected() && onlineSave) {
            this.activities.RemoveDeletedSkillsActivities();
            await this.OnlineSave();
        }

        const { stats, xpInfo } = this.experience.GetExperience();
        this.stats = stats;
        this.xp = xpInfo.totalXP;

        // TODO: needed ?
        //this.interface.forceUpdate();
    }

    /**
     * Save online data or local data if online save failed
     * @returns {Promise<boolean>} True if saved online or locally
     */
    GlobalSave = async () => {
        if (this.globalSaving) return false;
        this.globalSaving = true;

        let success = true;

        const localSaved = await this.LocalSave();
        if (!localSaved) success = false;

        const onlineSaved = localSaved && (await this.OnlineSave());
        if (!onlineSaved) success = false;

        this.globalSaving = false;
        return success;
    };

    /**
     * Load local user data
     * @returns {Promise<boolean>}
     */
    LocalSave = async () => {
        const data = {
            xp: this.xp,

            dataToken: this.server.dataToken,
            achievements: this.achievements.Save(),
            activities: this.activities.Save(),
            consent: this.consent.Save(),
            informations: this.informations.Save(),
            inventory: this.inventory.Save(),
            missions: this.missions.Save(),
            quests: this.quests.Save(),
            shop: this.shop.Save(),
            todoes: this.todoes.Save()
        };

        const debugIndex = this.interface.console.AddLog('info', 'User data: local saving...');
        const saved = await DataStorage.Save(STORAGE.USER, data);
        if (saved) this.interface.console.EditLog(debugIndex, 'same', 'User data: local save');
        else this.interface.console.EditLog(debugIndex, 'error', 'User data: local save failed');
        return saved;
    };

    async LocalLoad() {
        const debugIndex = this.interface.console.AddLog('info', 'User data: local loading...');
        let data = await DataStorage.Load(STORAGE.USER);

        if (data !== null) {
            /** @param {string} key */
            const contains = (key) => data.hasOwnProperty(key);

            if (contains('xp')) this.xp = data['xp'];
            if (contains('dataToken')) this.server.dataToken = data['dataToken'];
            if (contains('achievements')) this.achievements.Load(data['achievements']);
            if (contains('activities')) this.activities.Load(data['activities']);
            if (contains('consent')) this.consent.Load(data['consent']);
            if (contains('informations')) this.informations.Load(data['informations']);
            if (contains('inventory')) this.inventory.Load(data['inventory']);
            if (contains('missions')) this.missions.Load(data['missions']);
            if (contains('quests')) this.quests.Load(data['quests']);
            if (contains('shop')) this.shop.Load(data['shop']);
            if (contains('todoes')) this.todoes.Load(data['todoes']);

            this.interface.console.EditLog(debugIndex, 'same', 'User data: local load success');
        } else {
            this.interface.console.EditLog(debugIndex, 'warn', 'User data: local load failed');
        }

        this.RefreshStats(true);
        return data !== null;
    }

    /** @returns {Promise<boolean>} True if data is saved */
    OnlineSave = async () => {
        if (!this.server.IsConnected()) return false;

        let data = {};
        let saved = false;

        if (this.activities.IsUnsaved()) {
            data['activities'] = this.activities.GetUnsaved();
            data['xp'] = this.xp;
            data['stats'] = Object.fromEntries(Object.entries(this.stats).map(([key, value]) => [key, value.totalXP]));
        }

        if (this.quests.IsUnsaved()) {
            data['quests'] = this.quests.GetUnsaved();
        }

        if (this.todoes.IsUnsaved()) {
            data['todoes'] = this.todoes.GetUnsaved();
        }

        if (this.inventory.IsUnsaved()) {
            data['avatar'] = this.inventory.GetUnsaved();
        }

        if (this.missions.IsUnsaved()) {
            data['missions'] = this.missions.GetUnsaved();
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
                this.informations.Purge();
                this.quests.Purge();
                this.todoes.Purge();
                this.inventory.Purge();
                this.missions.Purge();
                this.interface.console.EditLog(debugIndex, 'same', 'User data: online save success');
                await this.LocalSave();
            } else {
                this.interface.console.EditLog(debugIndex, 'error', 'User data: online save failed');
            }
            if (DEBUG_DATA) console.log('User data online save:', data);
        }

        return saved;
    };

    /** @param {'normal' | 'force' | 'inventories'} [type] */
    async OnlineLoad(type = 'normal') {
        if (!this.server.IsConnected()) return false;
        const debugIndex = this.interface.console.AddLog('info', 'User data: online loading...');

        let data = null;
        if (type === 'normal' || type === 'force') {
            data = await this.server.LoadUserData(type === 'force');
        } else if (type === 'inventories') {
            data = await this.server.LoadUserInventories();
        }

        if (DEBUG_DATA) console.log('User data online load:', data);

        if (data !== null) {
            const contains = (/** @type {string} */ key) => data.hasOwnProperty(key);
            if (contains('username')) this.informations.username.Set(data['username']);
            if (contains('usernameTime')) this.informations.usernameTime = data['usernameTime'];
            if (contains('title')) this.informations.title.Set(data['title']);
            if (contains('birthtime')) this.informations.birthTime = data['birthtime'];
            if (contains('lastbirthtime')) this.informations.lastBirthTime = data['lastbirthtime'];
            if (contains('ox')) this.informations.ox.Set(parseInt(data['ox']));
            if (contains('adRemaining')) this.informations.adRemaining = data['adRemaining'];
            if (contains('adTotalWatched')) this.informations.adTotalWatched = data['adTotalWatched'];
            if (contains('purchasedCount')) this.informations.purchasedCount = data['purchasedCount'];
            if (contains('inventory')) this.inventory.LoadOnline(data['inventory']);
            if (contains('missions')) this.missions.LoadOnline(data['missions']);
            if (contains('achievements')) this.achievements.LoadOnline(data['achievements']);
            if (contains('activities')) this.activities.LoadOnline(data['activities']);
            if (contains('quests')) this.quests.LoadOnline(data['quests']);
            if (contains('shop')) this.shop.LoadOnline(data['shop']);
            if (contains('todoes')) this.todoes.LoadOnline(data['todoes']);
            if (contains('dataToken')) {
                this.server.dataToken = data['dataToken'];
                this.interface.console.AddLog('info', 'User data: new data token (' + this.server.dataToken + ')');
            }

            this.interface.console.EditLog(debugIndex, 'same', 'User data: online load success');
        } else {
            this.interface.console.EditLog(debugIndex, 'error', 'User data: online load failed');
        }

        this.RefreshStats(true);
        return data !== null;
    }
}

const user = new UserManager();

export default user;
export { UserManager };
