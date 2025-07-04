import Storage from 'Utils/Storage';

import Achievements from 'Data/App/Achievements';
import Ads from 'Data/App/Ads';
import Contributors from 'Data/App/Contributors';
import DailyQuestsRewards from 'Data/App/DailyQuestsRewards';
import Items from 'Data/App/Items';
import Missions from 'Data/App/Missions';
import Quotes from 'Data/App/Quotes';
import Skills from 'Data/App/Skills';
import Titles from 'Data/App/Titles';

/**
 * @typedef {import('Managers/UserManager').default} User
 *
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/index').DataHashes} DataHashes
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/index').DataTypes} DataTypes
 */

class DataManager {
    /** @type {DataHashes} */
    #tableHashes = {
        achievements: 0,
        ads: 0,
        contributors: 0,
        dailyQuestsRewards: 0,
        items: 0,
        missions: 0,
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
        this.dailyQuestsRewards = new DailyQuestsRewards();
        this.items = new Items();
        this.missions = new Missions();
        this.quotes = new Quotes();
        this.skills = new Skills();
        this.titles = new Titles();
    }

    Clear() {
        this.achievements.Clear();
        this.ads.Clear();
        this.contributors.Clear();
        this.dailyQuestsRewards.Clear();
        this.items.Clear();
        this.quotes.Clear();
        this.skills.Clear();
        this.titles.Clear();

        this.#tableHashes = {
            achievements: 0,
            ads: 0,
            contributors: 0,
            dailyQuestsRewards: 0,
            items: 0,
            missions: 0,
            quotes: 0,
            skills: 0,
            skillIcons: 0,
            skillCategories: 0,
            titles: 0
        };

        Storage.Save('APP_DATA', null);
        Storage.Save('APPDATA_HASHES', null);
    }

    /**
     * @returns {boolean} False if at least one data is empty
     */
    DataAreLoaded() {
        const achievementsAreLoaded = this.achievements.achievements.length > 0;
        const contributorsAreLoaded = this.contributors.contributors.length > 0;
        const dailyQuestsRewardsAreLoaded = this.dailyQuestsRewards.Get().length > 0;
        const itemsAreLoaded = this.items.Get().length > 0;
        const quotesAreLoaded = this.quotes.Get().length > 0;
        const _skills = this.skills.Get();
        const skillsAreLoaded = _skills.skills.length > 0;
        const skillIconsAreLoaded = _skills.skillIcons.length > 0;
        const skillCategoriesAreLoaded = _skills.skillCategories.length > 0;
        const titlesAreLoaded = this.titles.Get().length > 0;

        return (
            achievementsAreLoaded &&
            contributorsAreLoaded &&
            dailyQuestsRewardsAreLoaded &&
            itemsAreLoaded &&
            quotesAreLoaded &&
            skillsAreLoaded &&
            skillIconsAreLoaded &&
            skillCategoriesAreLoaded &&
            titlesAreLoaded
        );
    }

    /**
     * Local save App data
     * @param {User} user
     * @returns {Promise<boolean>} True if the data was successfully saved
     */
    async SaveLocal(user) {
        const debugIndex = user.interface.console?.AddLog('info', 'App data: local saving...');

        // Save hashes
        const savedHashes = await Storage.Save('APPDATA_HASHES', this.#tableHashes);
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
            dailyQuestsRewards: this.dailyQuestsRewards.Save(),
            items: this.items.Save(),
            missions: this.missions.Save(),
            quotes: this.quotes.Save(),
            ...this.skills.Save(),
            titles: this.titles.Save()
        };

        const saved = await Storage.Save('APP_DATA', appData);
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
    async LoadLocal(user) {
        const debugIndex = user.interface.console?.AddLog('info', 'App data: local loading...');

        // Load hashes
        /** @type {DataHashes | null} */
        const hashes = await Storage.Load('APPDATA_HASHES');
        if (hashes === null) {
            user.interface.console?.EditLog(debugIndex, 'warn', 'App data: local load failed');
            return false;
        }

        this.#tableHashes = hashes;

        // Load app data
        /** @type {Partial<DataTypes> | null} */
        const appData = await Storage.Load('APP_DATA');
        if (appData === null) {
            user.interface.console?.EditLog(debugIndex, 'warn', 'App data: local load failed');
            return false;
        }

        // Load data
        this.achievements.Load(appData.achievements);
        this.ads.Load(appData.ads);
        this.contributors.Load(appData.contributors);
        this.dailyQuestsRewards.Load(appData.dailyQuestsRewards);
        this.items.Load(appData.items);
        this.missions.Load(appData.missions);
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
    async LoadOnline(user) {
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
        if (response.data.dailyQuestsRewards !== null) {
            this.dailyQuestsRewards.Load(response.data.dailyQuestsRewards);
        }
        if (response.data.items !== null) {
            this.items.Load(response.data.items);
        }
        if (response.data.missions !== null) {
            this.missions.Load(response.data.missions);
        }
        if (response.data.quotes !== null) {
            this.quotes.Load(response.data.quotes);
        }
        if (
            response.data.skills !== null ||
            response.data.skillIcons !== null ||
            response.data.skillCategories !== null
        ) {
            this.skills.Load({
                skills: response.data.skills ?? undefined,
                skillIcons: response.data.skillIcons ?? undefined,
                skillCategories: response.data.skillCategories ?? undefined
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

    CountAll() {
        return (
            this.achievements.Get().length +
            this.ads.Get().length +
            this.contributors.Get().length +
            this.dailyQuestsRewards.Get().length +
            this.items.Get().length +
            this.missions.Get().length +
            this.quotes.Get().length +
            this.skills.Get().skills.length +
            this.skills.Get().skillIcons.length +
            this.skills.Get().skillCategories.length +
            this.titles.Get().length
        );
    }
}

const dataManager = new DataManager();
export { DataManager };
export default dataManager;
