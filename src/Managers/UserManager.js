import langManager from "./LangManager";
import ServManager from "./ServManager";
import DataManager, { STORAGE } from './DataManager';

import quotes from '../../ressources/langs/quotes.json';

class UserManager {
    conn = new ServManager(this);

    constructor() {
        // this.changePage(pageName, argument);
        // Change page with animation and arg
        // Function loaded in componentDidMount of PageManager (in App.js)
        this.changePage;

        // User informations
        this.pseudo = 'Player-XXXX';
        this.title = 'Titre';
        this.birth = '';
        this.email = '';
        this.xp = 0;

        this.stats = {
            'sag': 0,
            'int': 2,
            'conf': 5,
            'for': 6,
            'end': 8,
            'agil': 9,
            'dex': 10
        };

        this.skills = [
            //new Skill('skill1', 10, 'DD/MM/YY')
        ];

        this.titles = [];
        this.quotes = quotes;
    }

    disconnect = () => {
        this.conn.disconnect();
        this.email = '';
        this.changePage();
        //this.storage.Save();
    }
    unmount = () => {
        console.log('unmount');
        //this.storage.Save();
    }

    saveData() {
        const data = {
            'lang': langManager.currentLangageKey,
            'pseudo': this.pseudo,
            'title': this.title,
            'birth': this.birth,
            'email': this.email,
            'xp': this.xp,
            'stats': this.stats,
            'skills': this.skills,
            'titles': this.titles,
            'quotes': this.quotes
        };
        DataManager.Save(STORAGE.USER, data, this.isConnected());
    }
    async loadData() {
        const data = await DataManager.Load(STORAGE.USER, this.isConnected());

        langManager.setLangage(data['lang']);
        this.pseudo = data['pseudo'];
        this.title = data['title'];
        this.birth = data['birth'];
        this.email = data['email'];
        this.xp = data['xp'];
        this.stats = data['stats'];
        this.skills = data['skills'];
        this.titles = data['titles'];
        this.quotes = data['quotes'];
    }

    async loadAllData() {
        await this.loadData();

        const data = await this.conn.getInternalData();
        const status = data['status'];

        if (status === 'ok') {
            this.titles = data['titles'];
            this.quotes = data['quotes'];
        }

        this.saveData();
    }

    isConnected = this.conn.isConnected;
}

class Stat {
    constructor(key, xp) {
        this.key = key;
        this.xp = xp;
    }
}

class Skill {
    constructor(key, xp, lastTime) {
        this.key = key;
        this.title = '';
        this.cat = '';
        this.xp = xp;
        this.lastTime = lastTime;
        this.caracs = {
            'sag': 0,
            'int': 0,
            'conf': 0,
            'for': 0,
            'end': 0,
            'agil': 0,
            'dex': 0
        };
    }

    /*getSkillName = (key) => {
        return langManager.currentLangage[key]['name'];
    }
    getCatName = (key) => {
        return langManager.currentLangage[key]['cat'];
    }

    getCarac = (key, carac) => {
        return langManager.currentLangage[key][carac];
    }*/
}

const user = new UserManager();

export default user;