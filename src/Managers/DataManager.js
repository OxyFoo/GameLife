import langManager from "./LangManager";
import { Request_Async } from "../Functions/Request";
import DataStorage, { STORAGE } from "../Functions/DataStorage";

import user from "./UserManager";

import Achievements from "../Data/Achievements";
import Skills from "../Data/Skills";
import Titles from "../Data/Titles";
import Quotes from "../Data/Quotes";
import Contributors from "../Data/Contributors";

class DataManager {
    constructor() {
        user.dataManager = this

        this.achievements = new Achievements();
        this.skills = new Skills(this);
        this.titles = new Titles();
        this.quotes = new Quotes();
        this.contributors = new Contributors();

        this.news = [];
    }

    DataAreLoaded() {
        const achievements = this.achievements.achievements.length > 0;
        const skills = this.skills.skills.length > 0;
        const titles = this.titles.titles.length > 0;
        const quotes = this.quotes.quotes.length > 0;
        const contributors = this.contributors.contributors.length > 0;
        return achievements, skills, titles, quotes, contributors
    }

    GetText(value) {
        let output = '';
        if (typeof(value) === 'object') {
            const key = langManager.currentLangageKey;
            if (key in value) output = value[key];
            else output = value['fr'];
        }
        return output;
    }

    async LocalSave() {
        const internalData = {
            'achievements': this.achievements.Save(),
            'contributors': this.contributors.Save(),
            'quotes': this.quotes.Save(),
            'skills': this.skills.Save(),
            'titles': this.titles.Save()
        }
        const saved = await DataStorage.Save(STORAGE.INTERNAL, internalData, false);
        if (saved) user.AddLog('info', 'Internal data: local save');
        else       user.AddLog('error', 'Internal data: local save failed');
        return saved;
    }

    async LocalLoad() {
        const internalData = await DataStorage.Load(STORAGE.INTERNAL, false);
        if (internalData !== null) {
            this.achievements.Load(internalData['achievements']);
            this.contributors.Load(internalData['contributors']);
            this.quotes.Load(internalData['quotes']);
            this.skills.Load(internalData['skills']);
            this.titles.Load(internalData['titles']);
            user.AddLog('info', 'Internal data: local load');
        } else {
            user.AddLog('warn', 'Internal data: local load failed');
        }
        return internalData !== null;
    }

    async OnlineLoad() {
        await this.LocalLoad();

        const appHashes = await DataStorage.Load(STORAGE.INTERNAL_HASHES, false);
        const data = {
            'action': 'getInternalData',
            'hashes': appHashes
        };
        const reqInternalData = await Request_Async(data);

        if (reqInternalData.status === 200) {
            const status = reqInternalData.content['status'];

            if (status === 'ok') {
                const reqHashes = reqInternalData.content['hashes'];
                const reqTables = reqInternalData.content['tables'];

                const reqNews = reqInternalData.content['news'];
                if (typeof(reqNews) === 'object') this.news = reqNews;

                if (reqTables.hasOwnProperty('achievements')) this.achievements.Load(reqTables['achievements']);
                if (reqTables.hasOwnProperty('contributors')) this.contributors.Load(reqTables['contributors']);
                if (reqTables.hasOwnProperty('quotes')) this.quotes.Load(reqTables['quotes']);
                if (reqTables.hasOwnProperty('skills')) {
                    const skills = {
                        skills: reqTables['skills'],
                        skillsIcons: reqTables['skillsIcon'],
                        skillsCategories: reqTables['skillsCategory']
                    };
                    this.skills.Load(skills);
                }
                if (reqTables.hasOwnProperty('titles')) this.titles.Load(reqTables['titles']);

                user.AddLog('info', 'Internal data: online load');
                await DataStorage.Save(STORAGE.INTERNAL_HASHES, reqHashes, false);
                await this.LocalSave();
            } else {
                user.AddLog('warn', 'Internal data: online load failed');
            }
        }
    }
}

const dataManager = new DataManager();
export default dataManager;