import langManager from "./LangManager";
import { Request_Async } from "../Functions/Request";
import DataStorage, { STORAGE } from "../Functions/DataStorage";

import Achievements from "../Data/Achievements";
import Skills from "../Data/Skills";
import Titles from "../Data/Titles";
import Quotes from "../Data/Quotes";
import Contributors from "../Data/Contributors";

class DataManager {
    constructor() {
        this.achievements = new Achievements();
        this.skills = new Skills();
        this.titles = new Titles();
        this.quotes = new Quotes();
        this.contributors = new Contributors();
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

    async localSave() {
        const internalData = {
            'achievements': this.achievements.Save(),
            'contributors': this.contributors.save(),
            'quotes': this.quotes.Save(),
            'skills': this.skills.save(),
            'titles': this.titles.save()
        }
        const saved = await DataStorage.Save(STORAGE.INTERNAL, internalData, false);
        return saved;
    }

    async localLoad() {
        const internalData = await DataStorage.Load(STORAGE.INTERNAL, false);
        if (internalData !== null) {
            this.achievements.Load(internalData['achievements']);
            this.contributors.load(internalData['contributors']);
            this.quotes.Load(internalData['quotes']);
            this.skills.load(internalData['skills']);
            this.titles.load(internalData['titles']);
        }
        return internalData !== null;
    }

    async onlineLoad() {
        // TODO - null pour les tests
        //const hash = null;
        const hash = await DataStorage.Load(STORAGE.INTERNAL_HASH, false);
        const data = {
            'action': 'getInternalData',
            'hash': hash === null ? '' : hash['hash'],
            'lang': langManager.currentLangageKey
        };
        const reqInternalData = await Request_Async(data);

        if (reqInternalData.status === 200) {
            const status = reqInternalData.content['status'];

            if (status === 'ok') {
                const tables = reqInternalData.content['tables'];
                const hash = reqInternalData.content['hash'];

                if (tables.hasOwnProperty('achievements')) this.achievements.Set(tables['achievements']);

                //this.achievements.achievements = tables['achievements'];
                this.contributors.contributors = tables['contributors'];
                this.quotes.quotes = tables['quotes'];
                this.skills.skills = tables['skills'];
                this.skills.icons = tables['skillsIcon'];
                this.skills.categories = tables['skillsCategory'];
                this.titles.titles = tables['titles'];
                await DataStorage.Save(STORAGE.INTERNAL_HASH, { hash: hash }, false);
                await this.localSave();
            } else if (status === 'same') {
                await this.localLoad();
            }
        }
    }
}

const dataManager = new DataManager();
export default dataManager;