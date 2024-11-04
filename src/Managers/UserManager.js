import Ads from 'Class/Ads';
import Consent from 'Class/Consent';
import Experience from 'Class/Experience';
import Multiplayer from 'Class/Multiplayer';
import NotificationsInApp from 'Class/NotificationsInApp';
import Quests from 'Class/Quests';
import Server2 from 'Class/Server2';
import Settings from 'Class/Settings';
import Shop from 'Class/Shop';
import Achievements from 'Data/User/Achievements';
import Activities from 'Data/User/Activities/index';
import DailyQuest from 'Data/User/DailyQuests';
import Informations from 'Data/User/Informations';
import Inventory from 'Data/User/Inventory';
import Missions from 'Data/User/Missions';
import Todos from 'Data/User/Todos';

import DataStorage, { STORAGE } from 'Utils/DataStorage';

////////////////
// Deprecated //
import Server from 'Class/Server';
import TCP from 'Class/TCP';
////////////////

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

        // Classes
        this.ads = new Ads(this);
        this.consent = new Consent(this);
        this.experience = new Experience(this);
        this.multiplayer = new Multiplayer(this);
        this.notificationsInApp = new NotificationsInApp(this);
        this.server2 = new Server2(this);
        this.settings = new Settings(this);
        this.shop = new Shop(this);
        this.informations = new Informations(this);

        // Data
        this.achievements = new Achievements(this);
        this.activities = new Activities(this);
        this.dailyQuest = new DailyQuest(this);
        this.inventory = new Inventory(this);
        this.missions = new Missions(this);
        this.todos = new Todos(this);

        /** @deprecated */ // TODO: Remove
        this.quests = new Quests(this);
        /** @deprecated */ // TODO: Remove
        this.server = new Server(this);
        /** @deprecated */ // TODO: Remove
        this.tcp = new TCP(this);

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

    /**
     * @param {string} key
     * @returns {key is keyof Stats}
     */
    KeyIsStats(key) {
        // @ts-ignore
        return this.statsKey.includes(key);
    }

    StartTimers() {
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
        clearInterval(this.intervalAchievements);
        clearTimeout(this.timeoutActivities);
        clearInterval(this.intervalActivities);
    }

    async Clear(keepOnboardingState = true) {
        const onboarding = this.settings.onboardingWatched;
        this.xp = 0;
        this.stats = this.experience.GetEmptyExperience();
        this.tempMailSent = null;

        this.notificationsInApp.Clear();
        // TODO: Clear server2 ?
        //this.server2.Clear(); ?
        this.settings.Clear();
        this.shop.Clear();
        this.informations.Clear();

        this.achievements.Clear();
        this.activities.Clear();
        this.dailyQuest.Clear();
        this.inventory.Clear();
        this.missions.Clear();
        this.todos.Clear();

        // TODO: Remove old classes
        this.quests.Clear();
        this.server.Clear();

        this.CleanTimers();
        await this.settings.Save();

        await DataStorage.ClearAll();
        await this.LocalSave();

        if (keepOnboardingState) {
            this.settings.onboardingWatched = onboarding;
            await this.settings.Save();
        }
    }

    /**
     * @param {boolean} [allDevices=false] Disconnect all devices
     * @returns {Promise<boolean>}
     */
    async Disconnect(allDevices = false) {
        const result = await this.server2.tcp.SendAndWait({ action: 'disconnect', allDevices });

        // Error occurred
        if (result === 'interrupted' || result === 'timeout') {
            this.interface.console?.AddLog('error', `Disconnecting failed (${result})`);
            return false;
        }

        // Not connected to the server, disconnect locally
        if (result === 'not-sent' || result.status !== 'disconnect') {
            this.interface.console?.AddLog('warn', 'Not connected to the server, disconnecting locally');
        }

        await this.Clear();
        if (this.server2.IsConnected()) {
            this.interface.ChangePage('login', { storeInHistory: false });
        } else {
            this.interface.ChangePage('waitinternet', { storeInHistory: false });
        }

        return true;
    }

    async Unmount() {
        this.CleanTimers();
        this.server2.Disconnect();
        await this.settings.Save();
        await this.LocalSave();
        await this.SaveOnline();
        this.server.Clear();
    }

    async RefreshStats(onlineSave = true) {
        if (this.server2.IsAuthenticated() && onlineSave) {
            this.activities.RemoveDeletedSkillsActivities();
            await this.SaveOnline();
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

        const onlineSaved = localSaved && (await this.SaveOnline());
        if (!onlineSaved) success = false;

        this.globalSaving = false;
        return success;
    };

    /**
     * Load local user data
     * @returns {Promise<boolean>}
     * @deprecated
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
            todoes: this.todos.Save()
        };

        const debugIndex = this.interface.console?.AddLog('info', 'User data: local saving...');
        const saved = await DataStorage.Save(STORAGE.USER, data);
        if (debugIndex) {
            if (saved) this.interface.console?.EditLog(debugIndex, 'same', 'User data: local save');
            else this.interface.console?.EditLog(debugIndex, 'error', 'User data: local save failed');
        }
        return saved;
    };

    /**
     * @deprecated
     */
    async LocalLoad() {
        const debugIndex = this.interface.console?.AddLog('info', 'User data: local loading...');
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
            if (contains('todoes')) this.todos.Load(data['todoes']);

            if (debugIndex) {
                this.interface.console?.EditLog(debugIndex, 'same', 'User data: local load success');
            }
        } else {
            if (debugIndex) {
                this.interface.console?.EditLog(debugIndex, 'warn', 'User data: local load failed');
            }
        }

        this.RefreshStats(true);
        return data !== null;
    }

    /**
     * @returns {Promise<boolean>} True if data is saved
     * @deprecated
     */
    OnlineSave = async () => {
        if (!this.server.IsConnected()) return false;

        let data = {};
        let saved = false;

        if (this.quests.IsUnsaved()) {
            data['quests'] = this.quests.GetUnsaved();
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
            const debugIndex = this.interface.console?.AddLog('info', 'User data: online saving...');
            saved = await this.server.SaveUserData(data);
            if (saved) {
                this.informations.Purge();
                this.quests.Purge();
                this.inventory.Purge();
                this.missions.Purge();
                if (debugIndex) {
                    this.interface.console?.EditLog(debugIndex, 'same', 'User data: online save success');
                }
                await this.LocalSave();
            } else {
                if (debugIndex) {
                    this.interface.console?.EditLog(debugIndex, 'error', 'User data: online save failed');
                }
            }
            if (DEBUG_DATA) console.log('User data online save:', data);
        }

        return saved;
    };

    async SaveOnline() {
        if (!this.server2.IsAuthenticated()) {
            return false;
        }

        const debugIndex = this.interface.console?.AddLog('info', '[UserData] Online saving...');

        this.notificationsInApp.StartListening();

        await this.activities.SaveOnline();

        if (debugIndex) {
            this.interface.console?.EditLog(debugIndex, 'same', '[UserData] Online save success');
        }

        return true;
    }

    async LoadOnline() {
        if (!this.server2.IsAuthenticated()) {
            return false;
        }

        const debugIndex = this.interface.console?.AddLog('info', '[UserData] Online loading...');

        let success = true;
        success &&= await this.informations.LoadOnline();
        success &&= await this.activities.LoadOnline();

        if (!success) {
            if (debugIndex) {
                this.interface.console?.EditLog(debugIndex, 'error', '[UserData] Online load failed');
            }
            return false;
        }

        if (debugIndex) {
            this.interface.console?.EditLog(debugIndex, 'same', '[UserData] Online load success');
        }

        this.RefreshStats(true);
        return true;
    }

    /**
     * @param {'normal' | 'force' | 'inventories'} [type]
     * @deprecated
     */
    async OnlineLoad(type = 'normal') {
        if (!this.server.IsConnected()) return false;
        const debugIndex = this.interface.console?.AddLog('info', 'User data: online loading...');

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
            if (contains('dataToken')) {
                this.server.dataToken = data['dataToken'];
                this.interface.console?.AddLog('info', 'User data: new data token (' + this.server.dataToken + ')');
            }

            if (debugIndex) {
                this.interface.console?.EditLog(debugIndex, 'same', 'User data: online load success');
            }
        } else {
            if (debugIndex) {
                this.interface.console?.EditLog(debugIndex, 'error', 'User data: online load failed');
            }
        }

        this.RefreshStats(true);
        return data !== null;
    }
}

const user = new UserManager();

export default user;
export { UserManager };
