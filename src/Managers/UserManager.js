import deviceInfoModule from 'react-native-device-info';

import langManager from "./LangManager";
import ServManager from "../Class/Server";
import ThemeManager from '../Class/Themes';
import DataStorage, { STORAGE } from '../Class/DataStorage';

import Base64 from '../Class/Base64';
import Experience from "../Class/Experience";
import { isUndefined } from "../Functions/Functions";

import quotes from '../../ressources/defaultDB/quotes.json';
import titles from '../../ressources/defaultDB/titles.json';
import skills from '../../ressources/defaultDB/skills.json';
import skillsIcon from '../../ressources/defaultDB/skillsIcon.json';
import achievements from '../../ressources/defaultDB/achievements.json';
import helpers from '../../ressources/defaultDB/helpers.json';

const DAYS_PSEUDO_CHANGE = 30;
const DEFAULT_PSEUDO = 'Player';
const DEFAULT_STATS = {
    'sag': 0,
    'int': 0,
    'con': 0,
    'for': 0,
    'end': 0,
    'agi': 0,
    'dex': 0
};

class UserManager {
    conn = new ServManager(this);
    experience = new Experience(this);
    themeManager = new ThemeManager();

    /**
     * this.changePage(pageName, argument);
     * Change page with animation and arg
     * Function loaded in componentDidMount of PageManager (in App.js)
     * I've do that to skip cycles warns
     */
    changePage;
    backPage;
    openPopup;
    closePopup;
    openLeftPanel;

    constructor() {
        // User informations
        this.pseudo = DEFAULT_PSEUDO;
        this.pseudoDate = null;
        this.title = 0;
        this.birth = '';
        this.email = '';
        this.xp = 0;
        this.activities = [];
        this.solvedAchievements = [];
        this.stats = DEFAULT_STATS;
        this.daily = [];

        this.titles = [];
        this.quotes = [];
        this.skills = [];
        this.skillsIcon = [];
        this.achievements = [];
        this.contributors = [];

        this.achievementsLoop = setInterval(this.checkAchievements, 30*1000);
    }

    async clear() {
        this.pseudo = DEFAULT_PSEUDO;
        this.title = 0;
        this.birth = '';
        this.email = '';
        this.xp = 0;
        this.activities = [];
        this.solvedAchievements = [];
        this.pseudoDate = null;
        this.stats = DEFAULT_STATS;
        this.daily = [];

        this.titles = [];
        this.quotes = [];
        this.skills = [];
        this.skillsIcon = [];
        this.achievements = [];
        this.contributors = [];
        this.conn.status = 'offline';
        this.conn.destructor();
        await DataStorage.clearAll();
        await this.saveData(false);
    }

    async disconnect() {
        this.conn.disconnect();
        this.email = '';
        this.changePage();
        await this.saveData();
    }
    async unmount() {
        clearInterval(this.achievementsLoop);
        this.saveData();
        this.conn.destructor();
    }

    async refreshStats(save = true) {
        this.removeDeletedSkills();
        this.experience.getExperience();
        if (save) await this.saveData();
        this.changePage();
    }

    getUnlockTitles = () => {
        let unlockTitles = [
            { key: 0, value: langManager.curr['identity']['empty-title'] }
        ];
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

    getXmlByLogoID = (ID) => {
        let currXml = null;
        for (let i = 0; i < this.skillsIcon.length; i++) {
            const skillIcon = this.skillsIcon[i];
            const skillIconID = skillIcon.ID;
            if (ID == skillIconID) {
                currXml = skillIcon.Content;
                break;
            }
        }
        return currXml;
    }

    getAchievements = () => {
        let achievements = [];

        // Get unlocked
        let solvedAchievements = [...this.solvedAchievements];
        solvedAchievements.reverse();
        for (let s = 0; s < solvedAchievements.length; s++) {
            const achievementID = solvedAchievements[s];
            const achievement = this.getAchievementByID(achievementID);
            achievements.push(achievement);
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
            if (isTime) first = first.replace('T', '');

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
                first = first.replace('Ca', '');
                const CategoryDepth = parseInt(first);
                const categories = this.getSkillCategories(true);
                if (categories.length < CategoryDepth) continue;

                let values = [];
                for (let c = 0; c < categories.length; c++) {
                    const category = categories[c].value;
                    const categoryLevel = this.experience.getSkillCategoryExperience(category).lvl;
                    values.push(categoryLevel);
                }
                values.sort();
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
                this.openPopup('ok', [ title, text ]);

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
        if (this.pseudoDate !== null) {
            const today = new Date();
            const last = new Date(this.pseudoDate);
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
                skills.push({ key: parseInt(skill.ID), value: skill.Name });
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

            if (!isInCats && (!onlyUseful || curr) && !cats.includes(cat)) {
                cats.push(cat);
            }
        }

        // Sort
        cats.sort();
        let cats_sorted = [];
        for (const c in cats) {
            cats_sorted.push({ key: parseInt(c), value: cats[c] });
        }

        return cats_sorted;
    }

    addActivity = (skillID, startDate, duration, save = true) => {
        let output = false;

        const newActivity = {
            skillID: skillID,
            startDate: startDate,
            duration: duration
        }

        // Check if not exist
        let exists = false;
        for (let a = 0; a < this.activities.length; a++) {
            const activity = this.activities[a];
            const activity_compare = {
                skillID: activity.skillID,
                startDate: activity.startDate,
                duration: activity.duration
            }
            if (activity_compare == newActivity) {
                exists = true;
            }
        }

        if (!exists) {
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
                this.refreshStats(save);
            }
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
    getActivitiesByDate = (date) => {
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
        const pseudo = this.pseudo;
        if (this.email) {
            await this.conn.AsyncRefreshAccount();
            await this.saveData(false);
            if (this.isConnected()) {
                await this.loadData(true);
                if (pseudo != DEFAULT_PSEUDO) {
                    this.pseudo = pseudo;
                }
                await this.saveData(true);
                this.changePage();
            }
        } else {
            await this.disconnect();
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

    async saveData(online, saveInternal = false) {
        const _online = typeof(online) === 'boolean' ? online : this.isConnected();
        const data = {
            'lang': langManager.currentLangageKey,
            'pseudo': this.pseudo,
            'pseudoDate': this.pseudoDate,
            'title': this.title,
            'birth': this.birth,
            'xp': this.xp,
            'activities': this.activities,
            'solvedAchievements': this.solvedAchievements,
            'daily': this.daily
        };
        await DataStorage.Save(STORAGE.USER, data, _online, this.conn.token, this.pseudoCallback);

        const email = { 'email': this.email };
        await DataStorage.Save(STORAGE.MAIL, email, false);

        if (saveInternal) {
            const internalData = {
                'skills': this.skills,
                'skillsIcon': this.skillsIcon,
                'titles': this.titles,
                'quotes': this.quotes,
                'achievements': this.achievements,
                'helpers': this.contributors
            }
            await DataStorage.Save(STORAGE.INTERNAL, internalData, false);
        }
    }
    async loadData(online) {
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

        const data_email = await DataStorage.Load(STORAGE.MAIL, false);
        this.email = get(data_email, 'email', '');

        const _online = typeof(online) !== 'undefined' ? online : this.isConnected();
        const data = await DataStorage.Load(STORAGE.USER, _online, this.conn.token);
        if (typeof(data) !== 'undefined') {
            langManager.setLangage(get(data, 'lang', 'fr'));
            this.pseudo = get(data, 'pseudo', this.pseudo);
            this.pseudoDate = get(data, 'pseudoDate', null);
            this.title = get(data, 'title', 0);
            this.birth = get(data, 'birth', '');
            this.xp = get(data, 'xp', 0);
            this.daily = get(data, 'daily', []);
            if (data.hasOwnProperty('activities') && data['activities'].length > 0) {
                if (this.activities.length === 0) {
                    this.activities = data['activities'];
                } else {
                    for (let a in data['activities']) {
                        const activity = data['activities'][a];
                        this.addActivity(activity.skillID, activity.startDate, activity.duration, false);
                    }
                }
            }
            if (data.hasOwnProperty('solvedAchievements')) {
                const achievements = data['solvedAchievements'];
                for (let i = 0; i < achievements.length; i++) {
                    if (!this.solvedAchievements.includes(achievements[i])) {
                        this.solvedAchievements.push(achievements[i]);
                    }
                }
            }
        }

        const internalData = await DataStorage.Load(STORAGE.INTERNAL, false);
        this.titles = get(internalData, 'titles', titles, true);
        this.quotes = get(internalData, 'quotes', quotes, true);
        this.skills = get(internalData, 'skills', skills, true);
        this.skillsIcon = get(internalData, 'skillsIcon', skillsIcon, true);
        this.achievements = get(internalData, 'achievements', achievements, true);
        this.contributors = get(internalData, 'helpers', helpers, true);
    }

    async loadInternalData() {
        if (this.conn.online) {
            const hash = await DataStorage.Load(STORAGE.INTERNAL_HASH, false);
            const data = await this.conn.reqGetInternalData(hash);
            const status = data['status'];

            if (status === 'ok') {
                if (typeof(data['titles']) !== 'undefined') this.titles = data['titles'];
                if (typeof(data['quotes']) !== 'undefined') this.quotes = data['quotes'];
                if (typeof(data['skills']) !== 'undefined') this.skills = data['skills'];
                if (typeof(data['skillsIcon']) !== 'undefined') this.skillsIcon = data['skillsIcon'];
                if (typeof(data['achievements']) !== 'undefined') this.achievements = data['achievements'];
                if (typeof(data['helpers']) !== 'undefined') this.contributors = data['helpers'];
                if (typeof(data['hash']) !== 'undefined') await DataStorage.Save(STORAGE.INTERNAL_HASH, data['hash'], false);
            }
        }

        await this.saveData(false, true);
    }

    dailyAlreadyChanged = () => {
        let output = false;
        for (let d = 0; d < this.daily.length; d++) {
            const daily = this.daily[d];
            const dailyDate = new Date(daily.date);
            const today = new Date();

            const sameYear = today.getFullYear() == dailyDate.getFullYear();
            const sameMonth = today.getMonth() == dailyDate.getMonth();
            const sameDate = today.getDate() == dailyDate.getDate();
            if (sameYear && sameMonth && sameDate) {
                output = true;
                break;
            }
        }
        return output;
    }
    dailyOnChange = (skillID1, skillID2) => {
        const newDaily = {
            'skills': [ skillID1, skillID2 ],
            'date': new Date()
        }
        this.daily.push(newDaily);
        this.saveData();
    }

    dailyTodayCheck = () => {
        let state1 = 0;
        let state2 = 0;

        const dailyBonusCategory = this.dailyGetBonusCategory();
        if (this.daily.length) {
            const IDs = this.dailyGetSkills().skills;
            const today_activities = this.getActivitiesByDate();
            for (let ta = 0; ta < today_activities.length; ta++) {
                const activity = today_activities[ta];
                const skillID = activity.skillID;
                const skill = this.getSkillByID(skillID);
                const category = skill.Category;
                if (IDs.includes(skillID)) {
                    state1 += activity.duration;
                }
                if (category == dailyBonusCategory) {
                    state2 += activity.duration;
                }
            }
        }

        state1 /= 60;
        state2 /= 15;

        return [ state1, state2 ];
    }

    dailyGetSkills = () => {
        if (this.daily.length) return this.daily[this.daily.length - 1];
        else return null;
    }
    dailyGetBonusCategory = (date) => {
        const skillsLength = this.skills.length
        const today = isUndefined(date) ? new Date() : new Date(date);
        const index = (today.getFullYear() * today.getMonth() * today.getDate() * 4) % skillsLength;
        const skill = this.skills[index];
        const category = skill.Category;
        return category;
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