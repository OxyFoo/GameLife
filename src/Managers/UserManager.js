import langManager from "./LangManager";
import ServManager from "./ServManager";
import DataManager, { STORAGE } from '../Class/DataManager';

import Experience from "./XPManager";
import { isUndefined } from "../Functions/Functions";

import quotes from '../../ressources/defaultDB/quotes.json';
import titles from '../../ressources/defaultDB/titles.json';
import skills from '../../ressources/defaultDB/skills.json';

class UserManager {
    conn = new ServManager(this);
    experience = new Experience(this);
    
    // this.changePage(pageName, argument);
    // Change page with animation and arg
    // Function loaded in componentDidMount of PageManager (in App.js)
    changePage;
    backPage;

    constructor() {
        // User informations
        this.pseudo = 'Player-XXXX';
        this.title = '';
        this.birth = '';
        this.email = '';
        this.xp = 0;
        this.activities = [];

        this.stats = {
            'sag': 0,
            'int': 2,
            'con': 5,
            'for': 6,
            'end': 8,
            'agi': 9,
            'dex': 10
        };

        this.titles = [];
        this.quotes = [];
        this.skills = [];
    }

    disconnect = () => {
        this.conn.disconnect();
        this.email = '';
        this.changePage();
        this.saveData();
    }
    unmount = () => {
        console.log('unmount');
        this.saveData();
    }
    clear = () => {
        DataManager.Save(STORAGE.USER, '', false);
    }

    refreshStats = (save = true) => {
        this.experience.getExperience();
        if (save) this.saveData();
        this.changePage();
    }

    getSkills = (category) => {
        let skills = [];
        for (let i = 0; i < this.skills.length; i++) {
            let skill = this.skills[i];
            if (typeof(category) === 'undefined' || category === skill.Category) {
                skills.push({ key: skill.ID, value: skill.Name });
            }
        }
        return skills;
    }
    getSkillByID = (ID) => {
        let skill;
        for (let i = 0; i < this.skills.length; i++) {
            if (this.skills[i].ID == ID) {
                skill = this.skills[i];
                break;
            }
        }
        return skill;
    }
    getSkillCategories = () => {
        let cats = [];
        for (let i = 0; i < this.skills.length; i++) {
            let cat = this.skills[i].Category;
            // Search
            let isInCats = false;
            for (let c = 0; c < cats.length; c++) {
                if (cats[c].value == cat) {
                    isInCats = true;
                }
            }
            if (!isInCats) {
                cats.push({ key: cats.length, value: cat });
            }
        }
        return cats;
    }

    addActivity = (skillID, startDate, duration) => {
        let output = false;
        if (this.datetimeIsFree(startDate, duration)) {
            let newActivity = {
                skillID: skillID,
                startDate: startDate,
                duration: duration
            }
            // Add - Sort by date
            const activityDate = new Date(startDate);
            for (let a = 0; a < this.activities.length; a++) {
                const arrayDate = new Date(this.activities[a].startDate);
                if (activityDate < arrayDate) {
                    this.activities.splice(a, 0, newActivity);
                    output = true;
                    break;
                }
            }
            if (!output) {
                this.activities.push(newActivity);
                output = true;
            }
            this.refreshStats();
        }
        return output;
    }
    remActivity = (activity) => {
        for (let i = 0; i < this.activities.length; i++) {
            if (this.activities[i] == activity) {
                this.activities.splice(i, 1);
                break;
            }
        }
        this.refreshStats();
    }
    getActivityByDate = (date) => {
        let output = [];
        const currDate = isUndefined(date) ? new Date() : new Date(date);
        for (let i = 0; i < this.activities.length; i++) {
            const activity = this.activities[i];
            const activityDate = new Date(activity.startDate);
            const sameYear = currDate.getFullYear() == activityDate.getFullYear();
            const sameMonth = currDate.getMonth() == activityDate.getMonth();
            const sameDate = currDate.getDate() == activityDate.getDate();
            if (sameYear && sameMonth && sameDate) {
                output.push(activity);
            }
        }
        return output.reverse();
    }
    getFirstActivity = () => {
        let date = new Date();
        if (this.activities.length) {
            date = new Date(this.activities[0].startDate);
        }
        date.setMinutes(date.getMinutes() - 1);
        return date;
    }
    getActivitiesTotalDuration = () => {
        let totalDuration = 0;
        for (let a in this.activities) {
            const activity = this.activities[a];
            totalDuration += activity.duration;
        }
        return totalDuration;
    }

    datetimeIsFree = (date, duration) => {
        const startDate = new Date(date);
        let output = true;
        const endDate = new Date(startDate);
        endDate.setMinutes(startDate.getMinutes() + duration - 1);
        for (let a = 0; a < this.activities.length; a++) {
            const activity = this.activities[a];
            const activityStartDate = new Date(activity.startDate);
            const activityEndDate = new Date(activityStartDate);
            activityEndDate.setMinutes(activityStartDate.getMinutes() + activity.duration - 1);
            const startDuringActivity = startDate > activityStartDate && startDate < activityEndDate;
            const aroundActivity = startDate <= activityStartDate && endDate >= activityEndDate;

            const endDuringActivity = endDate > activityStartDate && endDate < activityEndDate;
            if (startDuringActivity || endDuringActivity || aroundActivity) {
                output = false;
                break;
            }
        }
        return output;
    }

    async changeUser() {
        if (user.email) {
            await user.conn.AsyncRefreshAccount();
            user.saveData();
        } else {
            user.disconnect();
        }
    }

    saveData(online) {
        const _online = typeof(online) === 'boolean' ? online : this.isConnected();
        const data = {
            'lang': langManager.currentLangageKey,
            'pseudo': this.pseudo,
            'title': this.title,
            'birth': this.birth,
            'email': this.email,
            'xp': this.xp,
            'activities': this.activities,
            'skills': this.skills,
            'titles': this.titles,
            'quotes': this.quotes
        };
        DataManager.Save(STORAGE.USER, data, _online);
    }
    async loadData(online) {
        const _online = typeof(online) !== 'undefined' ? online : this.isConnected();
        const data = await DataManager.Load(STORAGE.USER, _online);

        langManager.setLangage(data['lang']);
        this.pseudo = data['pseudo'] || this.pseudo;
        this.title = data['title'] || '';
        this.birth = data['birth'] || '';
        this.email = data['email'] || '';
        this.xp = data['xp'] || 0;
        if (typeof(data['activities']) !== 'undefined') this.activities = data['activities'];
        this.titles = data['titles'] || titles;
        this.quotes = data['quotes'] || quotes;
        this.skills = data['skills'] || skills;
    }

    async loadInternalData() {
        if (this.conn.online) {
            const data = await this.conn.getInternalData(langManager.currentLangageKey);
            const status = data['status'];

            if (status === 'ok') {
                if (typeof(data['titles']) !== 'undefined') this.titles = data['titles'];
                if (typeof(data['quotes']) !== 'undefined') this.quotes = data['quotes'];
                if (typeof(data['skills']) !== 'undefined') this.skills = data['skills'];
            }
        }

        this.saveData(false);
    }

    isConnected = this.conn.isConnected;

    random(min, max) {
        const m = min || 0;
        const M = max || 1;
        let R = Math.random() * (M - m) + m;
        return parseInt(R);
    }
    sleep(ms) {
        const T = Math.max(0, ms);
        return new Promise(resolve => setTimeout(resolve, T));
    }
}

class Skill {
    constructor() {
        this.Name = '';
        this.Category = '';
        this.Stats = {
            'sag': 0,
            'int': 0,
            'con': 0,
            'for': 0,
            'end': 0,
            'agi': 0,
            'dex': 0
        };
        this.start = 0;
        this.duration = 0;
    }
}

const user = new UserManager();

export default user;