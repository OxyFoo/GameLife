import langManager from 'Managers/LangManager';

import { Request_Async } from 'Utils/Request';
import DataStorage, { STORAGE } from 'Utils/DataStorage';

import Achievements from 'Data/Achievements';
import Contributors from 'Data/Contributors';
import Items from 'Data/Items';
import Quotes from 'Data/Quotes';
import Skills from 'Data/Skills';
import Titles from 'Data/Titles';
import News from 'Data/News';

/**
 * @typedef {import('Managers/UserManager').default} User
 */

class DataManager {
    constructor() {
        this.achievements = new Achievements();
        this.contributors = new Contributors();
        this.items = new Items();
        this.quotes = new Quotes();
        this.skills = new Skills();
        this.titles = new Titles();
        this.news = new News();
    }

    Clear() {
        this.achievements.Clear();
        this.contributors.Clear();
        this.items.Clear();
        this.quotes.Clear();
        this.skills.Clear();
        this.titles.Clear();
        this.news.Clear();
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
        const skills = this.skills.Get().length > 0;
        const titles = this.titles.Get().length > 0;
        return achievements && contributors && items && quotes && skills && titles;
    }

    GetText(value) {
        let output = '';
        if (typeof(value) === 'object') {
            const key = langManager.currentLangageKey;
            if (value.hasOwnProperty(key)) output = value[key];
            else if (value.hasOwnProperty('fr')) output = value['fr'];
        }
        return output;
    }

    /**
     * import user as argument, bad but it skip cycles warns
     */

    /**
     * Local save Internal data
     * @param {User} user
     * @returns {Promise<boolean>} True if the data was successfully saved
     */
    async LocalSave(user) {
        const debugIndex = user.interface.console.AddLog('info', 'Internal data: local saving...');
        const internalData = {
            'achievements': this.achievements.Save(),
            'contributors': this.contributors.Save(),
            'items': this.items.Save(),
            'quotes': this.quotes.Save(),
            'skills': this.skills.Save(),
            'titles': this.titles.Save()
        }
        const saved = await DataStorage.Save(STORAGE.INTERNAL, internalData);
        if (saved) user.interface.console.EditLog(debugIndex, 'same', 'Internal data: local save success');
        else user.interface.console.EditLog(debugIndex, 'error', 'Internal data: local save failed');
        return saved;
    }

    /**
     * Local load Internal data
     * @param {User} user
     * @returns {Promise<boolean>} True if the data was successfully loaded
     */
    async LocalLoad(user) {
        const debugIndex = user.interface.console.AddLog('info', 'Internal data: local loading...');
        const internalData = await DataStorage.Load(STORAGE.INTERNAL);
        if (internalData !== null) {
            this.achievements.Load(internalData['achievements']);
            this.contributors.Load(internalData['contributors']);
            this.items.Load(internalData['items']);
            this.quotes.Load(internalData['quotes']);
            this.skills.Load(internalData['skills']);
            this.titles.Load(internalData['titles']);
            user.interface.console.EditLog(debugIndex, 'same', 'Internal data: local load success');
        } else {
            user.interface.console.EditLog(debugIndex, 'warn', 'Internal data: local load failed');
        }
        return internalData !== null;
    }

    /**
     * Load Internal data from the server
     * @param {User} user
     * @returns {Promise<boolean>} True if the data was successfully loaded
     */
    async OnlineLoad(user) {
        await this.LocalLoad(user);

        const debugIndex = user.interface.console.AddLog('info', 'Internal data: online loading...');
        const appHashes = await DataStorage.Load(STORAGE.INTERNAL_HASHES);
        const data = {
            'action': 'getInternalData',
            'hashes': appHashes
        };
        const reqInternalData = await Request_Async(data);

        if (reqInternalData.status === 200) {
            const status = reqInternalData.content['status'];

            if (status === 'ok') {
                const reqNews = reqInternalData.content['news'];
                if (typeof(reqNews) === 'object') {
                    this.news.Load(reqNews);
                }

                const reqMusicLinks = reqInternalData.content['music-links'];
                if (typeof(reqMusicLinks) === 'object') {
                    user.settings.LoadMusicLinks(reqMusicLinks);
                }

                const reqTables = reqInternalData.content['tables'];
                if (reqTables.hasOwnProperty('achievements')) this.achievements.Load(reqTables['achievements']);
                if (reqTables.hasOwnProperty('contributors')) this.contributors.Load(reqTables['contributors']);
                if (reqTables.hasOwnProperty('items')) this.items.Load(reqTables['items']);
                if (reqTables.hasOwnProperty('quotes')) this.quotes.Load(reqTables['quotes']);
                if (reqTables.hasOwnProperty('skills')) this.skills.Load(reqTables);
                if (reqTables.hasOwnProperty('titles')) this.titles.Load(reqTables['titles']);

                const reqHashes = reqInternalData.content['hashes'];
                await DataStorage.Save(STORAGE.INTERNAL_HASHES, reqHashes);
                user.interface.console.EditLog(debugIndex, 'same', 'Internal data: online load success');
                await this.LocalSave(user);
                return true;
            }
        }
        user.interface.console.EditLog(debugIndex, 'error', 'Internal data: online load failed');
        return false;
    }
}

const dataManager = new DataManager();
export { DataManager };
export default dataManager;
