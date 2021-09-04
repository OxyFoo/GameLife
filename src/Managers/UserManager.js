import deviceInfoModule from 'react-native-device-info';

import langManager from "./LangManager";
import ServManager from "./ServManager";
import DataManager, { STORAGE } from '../Class/DataManager';

import Experience from "./XPManager";
import { isUndefined } from "../Functions/Functions";

import quotes from '../../ressources/defaultDB/quotes.json';
import titles from '../../ressources/defaultDB/titles.json';
import skills from '../../ressources/defaultDB/skills.json';
import achievements from '../../ressources/defaultDB/achievements.json';
import helpers from '../../ressources/defaultDB/helpers.json';

const DAYS_PSEUDO_CHANGE = 1;

class UserManager {
    conn = new ServManager(this);
    experience = new Experience(this);
    
    // this.changePage(pageName, argument);
    // Change page with animation and arg
    // Function loaded in componentDidMount of PageManager (in App.js)
    changePage;
    backPage;
    openPopup;
    closePopup;
    openLeftPanel;

    constructor() {
        this.firstStart = true;

        // User informations
        this.pseudo = 'Player';
        this.title = 0;
        this.birth = '';
        this.email = '';
        this.xp = 0;
        this.activities = [];

        this.stats = {
            'sag': 0,
            'int': 0,
            'con': 0,
            'for': 0,
            'end': 0,
            'agi': 0,
            'dex': 0
        };

        this.titles = [];
        this.quotes = [];
        this.skills = [];
        this.achievements = [];
        this.solvedAchievements = [];
        this.contributors = [];
        this.lastPseudoDate = null;

        this.achievementsLoop = setInterval(this.checkAchievements, 30*1000);
    }

    disconnect = () => {
        this.conn.disconnect();
        this.email = '';
        this.changePage();
        this.saveData();
    }
    unmount = () => {
        clearInterval(this.achievementsLoop);
        this.saveData();
        this.conn.destructor();
    }

    refreshStats = (save = true) => {
        this.removeDeletedSkills();
        this.experience.getExperience();
        if (save) this.saveData();
        this.changePage();
    }

    getUnlockTitles = () => {
        let unlockTitles = [];
        for (let t = 0; t < this.titles.length; t++) {
            const title = this.titles[t];
            const cond = parseInt(title.AchievementsCondition);
            if (isNaN(cond)) {
                continue;
            }
            if (cond === 0 || this.solvedAchievements.includes(cond)) {
                const newTitle = { key: title.ID, value: title.Title };
                unlockTitles.push(newTitle);
            }
        }
        return unlockTitles;
    }

    getTitleByID = (ID) => {
        let currTitle = null;
        for (let t = 0; t < this.titles.length; t++) {
            const title = this.titles[t];
            const titleID = parseInt(title.ID);
            if (ID == titleID) {
                currTitle = title.Title;
                break;
            }
        }
        return currTitle;
    }

    getAchievements = () => {
        const achievements = [];
        // Get unlocked
        for (let a = 0; a < this.achievements.length; a++) {
            const achievement = this.achievements[a];
            if (this.solvedAchievements.includes(parseInt(achievement.ID)) && achievement.Type != -1) {
                achievements.push(achievement);
            }
        }
        // Get others
        for (let a = 0; a < this.achievements.length; a++) {
            const achievement = this.achievements[a];
            if (!achievements.includes(achievement) && achievement.Type == 1) {
                achievements.push(achievement);
            }
        }
        return achievements;
    }

    getAchievementByID = (ID) => {
        let output;
        for (let a = 0; a < this.achievements.length; a++) {
            const achievement = this.achievements[a];
            if (achievement.ID == ID) {
                output = achievement;
                break;
            }
        }
        return output;
    }

    checkAchievements = () => {
        for (let a = 0; a < this.achievements.length; a++) {
            const achievement = this.achievements[a];
            const achievementID = parseInt(achievement.ID);
            if (this.solvedAchievements.includes(achievementID)) {
                continue;
            }
            if (typeof(achievement.Conditions) === 'undefined') {
                continue;
            }
            const conditions = achievement.Conditions.split(' ');
            if (conditions.length != 3) {
                continue;
            }

            let valid = false;
            let value;
            let first = conditions[0];
            let operator = conditions[1];
            let compareValue = conditions[2];

            // Is time (or Level)
            const isTime = first.includes('T');
            first = first.replace('T', '');

            // Get value to compare
            if (first === 'B') {
                if (!deviceInfoModule.isEmulatorSync()) {
                    const batteryLevel = deviceInfoModule.getBatteryLevelSync();
                    value = batteryLevel;
                }
            } else
            if (first.startsWith('Sk')) {
                // Skill level
                first = first.replace('Sk', '');
                const skillID = parseInt(first);
                if (isTime) {
                    // Get total time
                    value = 0;
                    for (const a in this.activities) {
                        if (this.activities[a].ID == skillID) {
                            value += this.activities[a].duration / 60;
                        }
                    }
                } else {
                    // Get level
                    value = this.experience.getSkillExperience(skillID).lvl;
                }
            } else
            if (first.startsWith('St')) {
                // Stat level
                first = first.replace('St', '');
                const statKey = first;
                const statLevel = this.experience.getStatExperience(statKey).lvl;
                value = statLevel;
            } else
            if (first == 'Ca') {
                // Get Max category level
                const categories = this.getSkillCategories(true);
                let maxLevel = 0;
                for (let c = 0; c < categories.length; c++) {
                    const category = categories[c];
                    const categoryXP = this.experience.getSkillCategoryExperience(category.value, true);
                    if (categoryXP.lvl > maxLevel) {
                        maxLevel = categoryXP.lvl;
                    }
                }
                value = maxLevel;
            } else
            if (first.endsWith('Ca')) {
                // Categorie
                first = first.replace('Ca');
                const CategoryDepth = parseInt(first);
                const categories = this.getSkillCategories(true);
                if (categories.length < CategoryDepth) continue;
                let values = [];
                for (let c = 0; c < categories.length; c++) {
                    const category = categories[c];
                    const categoryLevel = this.experience.getSkillCategoryExperience(category).lvl;
                    values.push(categoryLevel);
                }
                values = values.sort().reverse();
                value = values[CategoryDepth - 1];
            }

            if (typeof(value) === 'undefined') {
                continue;
            }

            switch (operator) {
                case 'GT':
                    if (value >= compareValue)
                        valid = true;
                    break;
                case 'LT':
                    if (value < compareValue)
                        valid = true;
                    break;
            }

            if (valid) {
                const title = langManager.curr['achievements']['alert-achievement-title'];
                let text = langManager.curr['achievements']['alert-achievement-text'];
                text = text.replace('{}', achievement.Name);
                user.openPopup('ok', [ title, text ]);

                this.solvedAchievements.push(achievementID);
                this.saveData();
            }
        }
    }

    removeDeletedSkills = () => {
        for (let a in this.activities) {
            let activity = this.activities[a];
            let skillID = activity.skillID;
            const skill = this.getSkillByID(skillID);
            if (typeof(skill) === 'undefined') {
                this.remActivity(activity);
                this.removeDeletedSkills();
                break;
            }
        }
    }

    daysBeforeChangePseudo = () => {
        let days = 0;
        if (this.lastPseudoDate !== null) {
            const today = new Date();
            const last = new Date(this.lastPseudoDate);
            const delta = (today - last) / (1000 * 60 * 60 * 24);
            days = DAYS_PSEUDO_CHANGE - Math.round(delta);
        }
        return days;
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
    getSkillCategories = (onlyUseful = false) => {
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

            let curr = false;
            for (let a = 0; a < this.activities.length; a++) {
                if (this.activities[a].skillID == this.skills[i].ID) {
                    curr = true;
                }
            }

            if (!isInCats && (!onlyUseful || curr)) {
                cats.push({ key: cats.length, value: cat });
            }
        }
        return cats;
    }

    addActivity = (skillID, startDate, duration) => {
        let output = false;

        const newActivity = {
            skillID: skillID,
            startDate: startDate,
            duration: duration
        }

        // Check if not exist
        for (let a = 0; a < this.activities.length; a++) {
            const activity = this.activities[a];
            if (activity == newActivity) {
                output = null;
                return;
            }
        }

        if (this.datetimeIsFree(startDate, duration)) {
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
            user.saveData(false);
            if (user.isConnected()) {
                await user.loadData(true);
                user.saveData();
                user.changePage();
            }
        } else {
            user.disconnect();
        }
    }

    pseudoCallback = (status) => {
        if (status === "wrongtimingpseudo") {
            const title = langManager.curr['identity']['alert-wrongtimingpseudo-title'];
            const text = langManager.curr['identity']['alert-wrongtimingpseudo-text'];
            this.openPopup('ok', [ title, text ]);
        } else if (status === "wrongpseudo") {
            const title = langManager.curr['identity']['alert-wrongpseudo-title'];
            const text = langManager.curr['identity']['alert-wrongpseudo-text'];
            this.openPopup('ok', [ title, text ]);
        }
    }

    saveData(online) {
        const _online = typeof(online) === 'boolean' ? online : this.isConnected();
        const data = {
            'firstStart': this.firstStart,
            'lang': langManager.currentLangageKey,
            'pseudo': this.pseudo,
            'title': this.title,
            'birth': this.birth,
            'email': this.email,
            'xp': this.xp,
            'activities': this.activities,
            'pseudoDate': this.lastPseudoDate,
            'solvedAchievements': this.solvedAchievements
        };
        const internalData = {
            'skills': this.skills,
            'titles': this.titles,
            'quotes': this.quotes,
            'achievements': this.achievements,
            'helpers': this.contributors
        }
        DataManager.Save(STORAGE.INTERNAL, internalData, false);
        DataManager.Save(STORAGE.USER, data, _online, this.conn.token, this.pseudoCallback);
    }
    async loadData(online) {
        const _online = typeof(online) !== 'undefined' ? online : this.isConnected();

        const get = (data, index, defaultValue, oneBlock = false) => {
            let output = defaultValue;
            if (typeof(data) !== 'undefined') {
                if (data.hasOwnProperty(index) && data[index] !== null) {
                    if (oneBlock) {
                        output = data[index];
                    } else
                    if (typeof(data[index]) !== 'object' || data[index].length > 0) {
                        output = data[index];
                    }
                }
            }
            return output;
        }

        const data = await DataManager.Load(STORAGE.USER, _online, this.conn.token);
        langManager.setLangage(get(data, 'lang', 'fr'));
        this.firstStart = get(data, 'firstStart', false);
        this.pseudo = get(data, 'pseudo', this.pseudo);
        this.title = get(data, 'title', 0);
        this.birth = get(data, 'birth', '');
        this.email = get(data, 'email', '');
        this.xp = get(data, 'xp', 0);
        if (typeof(data) !== 'undefined') {
            if (data.hasOwnProperty('activities') && data['activities'].length > 0) {
                for (let a in data['activities']) {
                    const activity = data['activities'][a];
                    this.addActivity(activity.skillID, activity.startDate, activity.duration);
                }
                this.activities = get(data, 'activities');
            }
        }
        this.lastPseudoDate = get(data, 'pseudoDate', null);
        this.solvedAchievements = get(data, 'solvedAchievements', this.solvedAchievements);

        const internalData = await DataManager.Load(STORAGE.INTERNAL, false);
        this.titles = get(internalData, 'titles', titles, true);
        this.quotes = get(internalData, 'quotes', quotes, true);
        this.skills = get(internalData, 'skills', skills, true);
        this.achievements = get(internalData, 'achievements', achievements, true);
        this.contributors = get(internalData, 'helpers', helpers, true);
    }

    async loadInternalData() {
        if (this.conn.online) {
            const data = await this.conn.getInternalData();
            const status = data['status'];

            if (status === 'ok') {
                if (typeof(data['titles']) !== 'undefined') this.titles = data['titles'];
                if (typeof(data['quotes']) !== 'undefined') this.quotes = data['quotes'];
                if (typeof(data['skills']) !== 'undefined') this.skills = data['skills'];
                if (typeof(data['achievements']) !== 'undefined') this.achievements = data['achievements'];
                if (typeof(data['helpers']) !== 'undefined') this.contributors = data['helpers'];
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