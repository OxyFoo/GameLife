import DataStorage, { STORAGE } from 'Utils/DataStorage';

import Achievements from 'Data/App/Achievements';
import Ads from 'Data/App/Ads';
import Contributors from 'Data/App/Contributors';
import Items from 'Data/App/Items';
import Quotes from 'Data/App/Quotes';
import Skills from 'Data/App/Skills';
import Titles from 'Data/App/Titles';

/**
 * @typedef {import('Managers/UserManager').default} User
 *
 * @typedef {import('Types/Data/App/index').DataHashes} DataHashes
 * @typedef {import('Types/Data/App/index').DataTypes} DataTypes
 */

class DataManager {
    /** @type {DataHashes} */
    #tableHashes = {
        achievements: 0,
        ads: 0,
        contributors: 0,
        quotes: 0,
        skills: 0,
        skillIcons: 0,
        skillCategories: 0,
        titles: 0
    };

    constructor() {
        this.achievements = new Achievements();
        this.ads = new Ads();
        this.contributors = new Contributors();
        this.items = new Items();
        this.quotes = new Quotes();
        this.skills = new Skills();
        this.titles = new Titles();
    }

    Clear() {
        this.achievements.Clear();
        this.ads.Clear();
        this.contributors.Clear();
        this.items.Clear();
        this.quotes.Clear();
        this.skills.Clear();
        this.titles.Clear();
        DataStorage.Save(STORAGE.APPDATA, null);
        DataStorage.Save(STORAGE.APPDATA_HASHES, null);
    }

    /**
     * @returns {boolean} False if at least one data is empty
     */
    DataAreLoaded() {
        const achievements = this.achievements.achievements.length > 0;
        const ads = this.ads.ads.length > 0;
        const contributors = this.contributors.contributors.length > 0;
        const items = this.items.Get().length > 0 || true; // TODO: Reimplement items
        const quotes = this.quotes.Get().length > 0;
        const skills = this.skills.Get().skills.length > 0;
        const titles = this.titles.Get().length > 0;
        return achievements && ads && contributors && items && quotes && skills && titles;
    }

    /**
     * Local save App data
     * @param {User} user
     * @returns {Promise<boolean>} True if the data was successfully saved
     */
    async LocalSave(user) {
        const debugIndex = user.interface.console?.AddLog('info', 'App data: local saving...');

        // Save hashes
        const savedHashes = await DataStorage.Save(STORAGE.APPDATA_HASHES, this.#tableHashes);
        if (!savedHashes) {
            user.interface.console?.EditLog(debugIndex, 'error', 'App data: local save failed');
            return false;
        }

        // Save app data
        /** @type {DataTypes} */
        const appData = {
            achievements: this.achievements.Save(),
            ads: this.ads.Save(),
            contributors: this.contributors.Save(),
            //items: this.items.Save(), // TODO: Reimplement items
            quotes: this.quotes.Save(),
            ...this.skills.Save(),
            titles: this.titles.Save()
        };

        const saved = await DataStorage.Save(STORAGE.APPDATA, appData);
        if (saved) {
            user.interface.console?.EditLog(debugIndex, 'same', 'App data: local save success');
        } else {
            user.interface.console?.EditLog(debugIndex, 'error', 'App data: local save failed');
        }

        return saved;
    }

    /**
     * Local load app data
     * @param {User} user
     * @returns {Promise<boolean>} True if the data was successfully loaded
     */
    async LocalLoad(user) {
        const debugIndex = user.interface.console?.AddLog('info', 'App data: local loading...');

        // Load hashes
        /** @type {DataHashes | null} */
        const hashes = await DataStorage.Load(STORAGE.APPDATA_HASHES);
        if (hashes === null) {
            user.interface.console?.EditLog(debugIndex, 'warn', 'App data: local load failed');
            return false;
        }

        this.#tableHashes = hashes;

        // Load app data
        /** @type {Partial<DataTypes> | null} */
        const appData = await DataStorage.Load(STORAGE.APPDATA);
        if (appData === null) {
            user.interface.console?.EditLog(debugIndex, 'warn', 'App data: local load failed');
            return false;
        }

        // Load data
        this.achievements.Load(appData.achievements);
        this.ads.Load(appData.ads);
        this.contributors.Load(appData.contributors);
        //this.items.Load(appData.items); // TODO: Reimplement items
        this.quotes.Load(appData.quotes);
        this.skills.Load({
            skills: appData.skills,
            skillIcons: appData.skillIcons,
            skillCategories: appData.skillCategories
        });
        this.titles.Load(appData.titles);

        user.interface.console?.EditLog(debugIndex, 'same', 'App data: local load success');
        return true;
    }

    /**
     * Load app data from the server
     * @param {User} user
     * @returns {Promise<boolean>} True if the data was successfully loaded
     */
    async OnlineLoad(user) {
        const debugIndex = user.interface.console?.AddLog('info', 'App data: online loading...');

        const response = await user.server2.tcp.SendAndWait({
            action: 'get-app-data',
            tableHashes: this.#tableHashes
        });

        // Check errors
        if (response === 'timeout' || response === 'not-sent' || response === 'interrupted') {
            user.interface.console?.EditLog(
                debugIndex,
                'error',
                `[DataManager] Server connection failed (${response})`
            );
            return false;
        }

        // Check if the response is valid
        if (response.status !== 'get-app-data' || response.data === null || response.hashes === null) {
            user.interface.console?.EditLog(debugIndex, 'error', 'App data: invalid response');
            return false;
        }

        // Load hashes
        this.#tableHashes = response.hashes;

        // Load data
        if (response.data.achievements !== null) {
            this.achievements.Load(response.data.achievements);
        }
        if (response.data.ads !== null) {
            this.ads.Load(response.data.ads);
        }
        if (response.data.contributors !== null) {
            this.contributors.Load(response.data.contributors);
        }
        // if (response.data.items !== null) {
        //     this.items.Load(response.data.items);
        // }
        if (response.data.quotes !== null) {
            this.quotes.Load(response.data.quotes);
        }
        if (
            response.data.skills !== null &&
            response.data.skillIcons !== null &&
            response.data.skillCategories !== null
        ) {
            this.skills.Load({
                skills: response.data.skills,
                skillIcons: response.data.skillIcons,
                skillCategories: response.data.skillCategories
            });
        }
        if (response.data.titles !== null) {
            this.titles.Load(response.data.titles);
        }

        // TODO: Load links => user.settings.LoadMusicLinks(reqMusicLinks);
        // TODO: Load IAPs => user.shop.LoadIAPs(reqIAP);
        // TODO: Load price factor => user.shop.priceFactor = priceFactor;

        user.interface.console?.EditLog(debugIndex, 'same', 'App data: online load success');
        return true;
    }
}

const dataManager = new DataManager();
export { DataManager };
export default dataManager;
