import Ads from 'Class/Ads';
import Consent from 'Class/Consent';
import Experience from 'Class/Experience';
import Multiplayer from 'Class/Multiplayer';
import NotificationsInApp from 'Class/NotificationsInApp';
import Rewards from 'Class/Rewards';
import Server2 from 'Class/Server2';
import Settings from 'Class/Settings';
import Shop from 'Class/Shop';
import Achievements from 'Data/User/Achievements';
import Activities from 'Data/User/Activities/index';
import DailyQuest from 'Data/User/DailyQuests';
import Informations from 'Data/User/Informations';
import Inventory from 'Data/User/Inventory';
import Missions from 'Data/User/Missions';
import Quests from 'Data/User/Quests/index';
import Todos from 'Data/User/Todos';

import DataStorage, { STORAGE } from 'Utils/DataStorage';

// TODO
////////////////
// Deprecated //
import Server from 'Class/Server';
////////////////

/**
 * @typedef {import('Interface/Components').Character} Character
 * @typedef {import('Interface/FlowEngine/back').default['_public']} FlowEngine
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
        // Classes
        this.ads = new Ads(this);
        this.consent = new Consent(this);
        this.experience = new Experience(this);
        this.multiplayer = new Multiplayer(this);
        this.notificationsInApp = new NotificationsInApp(this);
        this.rewards = new Rewards(this);
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
            this.dailyQuest,
            this.informations,
            this.inventory,
            this.missions,
            this.quests,
            this.todos
        ];

        /** @deprecated */ // TODO: Remove
        this.server = new Server(this);
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

    StartTimers() {
        this.experience.onMount();
        this.dailyQuest.onMount();
        this.notificationsInApp.Initialize();

        // Check achievements every 20 seconds
        this.achievements.CheckAchievements();
        this.intervalAchievements = setInterval(this.achievements.CheckAchievements, 20 * 1000);
    }

    async Clear(keepOnboardingState = true) {
        this.tempMailSent = null;

        for (const data of this.CLASS) {
            data.Clear();
        }

        for (const data of this.DATA) {
            data.Clear();
        }

        await this.onUnmount(true);
        await DataStorage.ClearAll();
        await this.SaveLocal();

        if (!keepOnboardingState) {
            this.settings.onboardingWatched = false;
        }

        await this.settings.IndependentSave();
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

        this.interface.ClearHistory();

        return true;
    }

    async onUnmount(reconnect = false) {
        clearInterval(this.intervalAchievements);

        this.server2.Disconnect();
        this.experience.onUnmount();
        this.dailyQuest.onUnmount();
        this.notificationsInApp.Unmount();

        await this.settings.IndependentSave();
        await this.SaveLocal();
        await this.SaveOnline();

        if (reconnect) {
            await this.server2.Connect();
        }
    }

    /**
     * Save online data or local data if online save failed
     * @returns {Promise<boolean>} True if saved online or locally
     */
    GlobalSave = async () => {
        if (this.globalSaving) return false;
        this.globalSaving = true;

        let success = true;

        const onlineSaved = await this.SaveOnline();
        if (!onlineSaved) success = false;

        const localSaved = await this.SaveLocal();
        if (!localSaved) success = false;

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

        return true;
    }

    async SaveOnline() {
        if (!this.server2.IsAuthenticated()) {
            return false;
        }

        const debugIndex = this.interface.console?.AddLog('info', '[UserData] Online saving...');

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

        return true;
    }
}

const user = new UserManager();

export default user;
export { UserManager };
