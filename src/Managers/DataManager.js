import DataStorage, { STORAGE } from 'Utils/DataStorage';

import Achievements from 'Data/Achievements';
import Contributors from 'Data/Contributors';
import Items from 'Data/Items';
import Quotes from 'Data/Quotes';
import Skills from 'Data/Skills';
import Titles from 'Data/Titles';

/**
 * @typedef {import('Managers/UserManager').default} User
 *
 * @typedef {import('Types/Data/index').DataHashes} DataHashes
 * @typedef {import('Types/Data/index').DataTypes} DataTypes
 */

class DataManager {
    /** @type {DataHashes} */
    #tableHashes = {
        achievements: 0,
        contributors: 0,
        quotes: 0,
        skills: 0,
        skillIcons: 0,
        skillCategories: 0,
        titles: 0
    };

    constructor() {
        this.achievements = new Achievements();
        this.contributors = new Contributors();
        this.items = new Items();
        this.quotes = new Quotes();
        this.skills = new Skills();
        this.titles = new Titles();
    }

    Clear() {
        this.achievements.Clear();
        this.contributors.Clear();
        this.items.Clear();
        this.quotes.Clear();
        this.skills.Clear();
        this.titles.Clear();
        DataStorage.Save(STORAGE.INTERNAL, null);
        DataStorage.Save(STORAGE.INTERNAL_HASHES, null);
    }

    /**
     * @returns {boolean} False if at least one data is empty
     */
    DataAreLoaded() {
        const achievements = this.achievements.achievements.length > 0;
        const contributors = this.contributors.contributors.length > 0;
        const items = this.items.Get().length > 0;
        const quotes = this.quotes.Get().length > 0;
        const skills = this.skills.Get().skills.length > 0;
        const titles = this.titles.Get().length > 0;
        return achievements && contributors && items && quotes && skills && titles;
    }

    /**
     * Local save Internal data
     * @param {User} user
     * @returns {Promise<boolean>} True if the data was successfully saved
     */
    async LocalSave(user) {
        const debugIndex = user.interface.console?.AddLog('info', 'Internal data: local saving...');

        // Save hashes
        const savedHashes = await DataStorage.Save(STORAGE.INTERNAL_HASHES, this.#tableHashes);
        if (!savedHashes) {
            user.interface.console?.EditLog(debugIndex, 'error', 'Internal data: local save failed');
            return false;
        }

        // Save internal data
        /** @type {DataTypes} */
        const internalData = {
            achievements: this.achievements.Save(),
            contributors: this.contributors.Save(),
            //items: this.items.Save(), // TODO: Reimplement items
            quotes: this.quotes.Save(),
            ...this.skills.Save(),
            titles: this.titles.Save()
        };

        const saved = await DataStorage.Save(STORAGE.INTERNAL, internalData);
        if (saved) {
            user.interface.console?.EditLog(debugIndex, 'same', 'Internal data: local save success');
        } else {
            user.interface.console?.EditLog(debugIndex, 'error', 'Internal data: local save failed');
        }

        return saved;
    }

    /**
     * Local load Internal data
     * @param {User} user
     * @returns {Promise<boolean>} True if the data was successfully loaded
     */
    async LocalLoad(user) {
        const debugIndex = user.interface.console?.AddLog('info', 'Internal data: local loading...');

        // Load hashes
        /** @type {DataHashes | null} */
        const hashes = await DataStorage.Load(STORAGE.INTERNAL_HASHES);
        if (hashes === null) {
            user.interface.console?.EditLog(debugIndex, 'warn', 'Internal data: local load failed');
            return false;
        }

        this.#tableHashes = hashes;

        // Load internal data
        /** @type {DataTypes | null} */
        const internalData = await DataStorage.Load(STORAGE.INTERNAL);
        if (internalData === null) {
            user.interface.console?.EditLog(debugIndex, 'warn', 'Internal data: local load failed');
            return false;
        }

        // Load data
        this.achievements.Load(internalData.achievements);
        this.contributors.Load(internalData.contributors);
        //this.items.Load(internalData.items); // TODO: Reimplement items
        this.quotes.Load(internalData.quotes);
        this.skills.Load({
            skills: internalData.skills,
            skillIcons: internalData.skillIcons,
            skillCategories: internalData.skillCategories
        });
        this.titles.Load(internalData.titles);

        user.interface.console?.EditLog(debugIndex, 'same', 'Internal data: local load success');
        return true;
    }

    /**
     * Load Internal data from the server
     * @param {User} user
     * @returns {Promise<boolean>} True if the data was successfully loaded
     */
    async OnlineLoad(user) {
        const debugIndex = user.interface.console?.AddLog('info', 'Internal data: online loading...');

        const response = await user.server2.tcp.SendAndWait({
            action: 'get-internal-data',
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
        if (response.status !== 'get-internal-data' || response.data === null || response.hashes === null) {
            user.interface.console?.EditLog(debugIndex, 'error', 'Internal data: invalid response');
            return false;
        }

        // Load hashes
        this.#tableHashes = response.hashes;

        // Load data
        if (response.data.achievements !== null) {
            this.achievements.Load(response.data.achievements);
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

        user.interface.console?.EditLog(debugIndex, 'same', 'Internal data: online load success');
        return true;
    }
}

const dataManager = new DataManager();
export { DataManager };
export default dataManager;
