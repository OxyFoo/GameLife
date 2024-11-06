import Ads from 'Class/Ads';
import Consent from 'Class/Consent';
import Experience from 'Class/Experience';
import Multiplayer from 'Class/Multiplayer';
import NotificationsInApp from 'Class/NotificationsInApp';
import Server2 from 'Class/Server2';
import Settings from 'Class/Settings';
import Shop from 'Class/Shop';
import Achievements from 'Data/User/Achievements';
import Activities from 'Data/User/Activities/index';
import DailyQuest from 'Data/User/DailyQuests';
import Informations from 'Data/User/Informations';
import Inventory from 'Data/User/Inventory';
import Missions from 'Data/User/Missions';
import Quests from 'Data/User/Quests';
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

/**
 * @template T
 * @typedef {import('Types/Interface/IUserData').IUserData<T>} IUserData
 */

/**
 * @template T
 * @typedef {import('Types/Interface/IUserClass').IUserClass<T>} IUserClass
 */

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
        this.quests = new Quests(this);
        this.todos = new Todos(this);

        /** @type {IUserClass<*>[]} */
        this.CLASS = [
            this.ads,
            this.consent,
            this.experience,
            this.multiplayer,
            this.notificationsInApp,
            this.server2,
            this.settings,
            this.shop,
            this.informations
        ];

        /** @type {IUserData<*>[]} */
        this.DATA = [
            this.achievements,
            this.activities,
            this.informations,
            this.inventory,
            this.missions,
            this.quests,
            this.todos
        ];

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
        this.stats = this.experience.GetEmptyExperience();
        this.tempMailSent = null;

        this.notificationsInApp.Clear();
        // TODO: Clear server2 ?
        //this.server2.Clear(); ?
        this.settings.Clear();
        this.shop.Clear();
        this.informations.Clear();

        for (const data of this.DATA) {
            data.Clear();
        }

        this.CleanTimers();
        await this.settings.IndependentSave();

        await DataStorage.ClearAll();
        await this.SaveLocal();

        if (keepOnboardingState) {
            this.settings.onboardingWatched = onboarding;
            await this.settings.IndependentSave();
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
        await this.settings.IndependentSave();
        await this.SaveLocal();
        await this.SaveOnline();
    }

    async RefreshStats(onlineSave = true) {
        if (this.server2.IsAuthenticated() && onlineSave) {
            this.activities.RemoveDeletedSkillsActivities();
            await this.SaveOnline();
        }

        const { stats } = this.experience.GetExperience();
        this.stats = stats;
    }

    /**
     * Save online data or local data if online save failed
     * @returns {Promise<boolean>} True if saved online or locally
     */
    GlobalSave = async () => {
        if (this.globalSaving) return false;
        this.globalSaving = true;

        let success = true;

        const localSaved = await this.SaveLocal();
        if (!localSaved) success = false;

        const onlineSaved = localSaved && (await this.SaveOnline());
        if (!onlineSaved) success = false;

        this.globalSaving = false;
        return success;
    };

    /**
     * Load local user data
     * @returns {Promise<boolean>}
     */
    SaveLocal = async () => {
        /** @type {Record<IUserClass<*>['key'], IUserClass<*>['Save']>} */
        const userClass = {};
        for (const data of this.CLASS) {
            userClass[data.key] = data.Save();
        }

        /** @type {Record<IUserData<*>['key'], IUserData<*>['Save']>} */
        const userData = {};
        for (const data of this.DATA) {
            userData[data.key] = data.Save();
        }

        const debugIndex = this.interface.console?.AddLog('info', 'User data: local saving...');
        const savedData = await DataStorage.Save(STORAGE.USER_DATA, userData);
        const savedClass = await DataStorage.Save(STORAGE.USER_CLASS, userClass);
        if (debugIndex) {
            if (savedData && savedClass) {
                this.interface.console?.EditLog(debugIndex, 'same', 'User data: local save');
            } else {
                this.interface.console?.EditLog(
                    debugIndex,
                    'error',
                    `User data: local save failed (${savedData}, ${savedClass})`
                );
            }
        }

        return savedData && savedClass;
    };

    async LoadLocal() {
        const debugIndex = this.interface.console?.AddLog('info', 'User data: local loading...');

        /** @type {Record<IUserClass<*>['key'], IUserClass<*>['Save']> | null} */
        const userClass = await DataStorage.Load(STORAGE.USER_CLASS);

        /** @type {Record<IUserData<*>['key'], IUserData<*>['Save']> | null} */
        const userData = await DataStorage.Load(STORAGE.USER_DATA);

        if (userData === null || userClass === null) {
            if (debugIndex) {
                this.interface.console?.EditLog(debugIndex, 'warn', 'User data: local load failed');
            }
            return false;
        }

        for (const uClass of this.CLASS) {
            if (uClass.key in userClass) {
                uClass.Load(userClass[uClass.key]);
            }
        }

        for (const uData of this.DATA) {
            if (uData.key in userData) {
                uData.Load(userData[uData.key]);
            }
        }

        if (debugIndex) {
            this.interface.console?.EditLog(debugIndex, 'same', 'User data: local load success');
        }

        this.RefreshStats(true);
        return true;
    }

    async SaveOnline() {
        if (!this.server2.IsAuthenticated()) {
            return false;
        }

        const debugIndex = this.interface.console?.AddLog('info', '[UserData] Online saving...');

        this.notificationsInApp.StartListening();

        let success = true;

        for (const data of this.DATA) {
            const savingSuccess = await data.SaveOnline();
            if (success && !savingSuccess) {
                success = false;
            }
        }

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

        for (const data of this.DATA) {
            const loadingSuccess = await data.LoadOnline();
            if (success && !loadingSuccess) {
                success = false;
            }
        }

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
}

const user = new UserManager();

export default user;
export { UserManager };
