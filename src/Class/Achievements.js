import dataManager from '../Managers/DataManager';
import langManager from '../Managers/LangManager';

import DynamicVar from '../Utils/DynamicVar';
import { GetTime } from '../Utils/Time';
import { GetBattery } from '../Utils/Device';

/**
 * @typedef {import('../Managers/UserManager').default} UserManager
 * @typedef {import('../Data/Achievements').Condition} Condition
 * @typedef {import('../Data/Achievements').Reward} Reward
 * @typedef {import('../Data/Achievements').Achievement} Achievement
 */

class Achievements {
    constructor(user) {
        /**
         * @type {UserManager}
         */
        this.user = user;

        /**
         * @type {Array<Number>}
         */
        this.solved = [];

        /**
         * @type {Array<Number>}
         */
        this.UNSAVED_solved = [];

        /**
         * @type {Number?}
         */
        this.achievementQueue = null;

        /**
         * @description Contain all activities, updated when adding, editing or removing
         */
        this.allSolved = new DynamicVar([]);
    }

    Clear() {
        this.solved = [];
        this.UNSAVED_solved = [];
    }
    Load(achievements) {
        const contains = (key) => achievements.hasOwnProperty(key);
        if (contains('solved')) this.solved = achievements['solved'];
        if (contains('unsaved')) this.UNSAVED_solved = achievements['unsaved'];
        this.allSolved.Set(this.Get());
    }
    LoadOnline(achievements) {
        this.solved = achievements;
        this.allSolved.Set(achievements);
    }
    Save() {
        const achievements = {
            solved: this.solved,
            unsaved: this.UNSAVED_solved
        };
        return achievements;
    }
    Get() {
        return [ ...this.solved, ...this.UNSAVED_solved ];
    }

    /**
     * Get last achievements
     * @param {Number} [last=3] Number of achievements to return
     * @returns {Array<Achievement>}
     */
    GetLast(last = 3) {
        const completeAchievements = this.Get().reverse().slice(0, last);
        return completeAchievements.map(dataManager.achievements.GetByID);
    }

    IsUnsaved = () => {
        return this.UNSAVED_solved.length > 0;
    }
    Purge = () => {
        this.UNSAVED_solved.map(this.ShowRewardPopup);
        this.solved = [ this.solved, this.UNSAVED_solved ];
        this.UNSAVED_solved = [];
    }

    AddAchievement = async (achievementID) => {
        this.UNSAVED_solved.push(achievementID);
        this.allSolved.Set(this.Get());
        await this.user.LocalSave();
        await this.user.OnlineSave();
        await this.user.OnlineLoad(true);
    }

    /**
     * Show popup with achievement informations
     * @param {Number} achievementID 
     */
    ShowCardPopup = (achievementID) => {
        const solvedIndexes = this.Get();
        const achievement = dataManager.achievements.GetByID(achievementID);
        const title = dataManager.GetText(achievement.Name);
        let description = dataManager.GetText(achievement.Description) + '\n';
        if (achievement.Type === 1 || solvedIndexes.includes(achievementID)) {
            description += this.getConditionText(achievement.Condition);
            description += this.getRewardsText(achievement.Rewards);
        }
        this.user.interface.popup.Open('ok', [ title, description ]);
    }

    /**
     * Show popup with achievement rewards
     * @param {Number} achievementID 
     */
    ShowRewardPopup = (achievementID) => {
        const achievement = dataManager.achievements.GetByID(achievementID);
        const reward = this.getRewardsText(achievement.Rewards);
        if (!reward) return;
        const title = langManager.curr['achievements']['alert-reward-title'];
        const text = langManager.curr['achievements']['alert-reward-text'] + '\n\n' + reward;
        this.user.interface.popup.Open('ok', [ title, text ], undefined, false);
    }

    /**
     * Return condition text with correct langage
     * @param {Condition} condition
     * @returns {String}
     */
    getConditionText = (condition) => {
        if (condition === null) return '';
        const { Comparator, Operator, Value } = condition;

        const operators = langManager.curr['achievements']['operators'];
        const condText = langManager.curr['achievements']['conditions'];
        let output = '\n' + condText['header'];
        switch (Comparator.Type) {
            case 'B':
                output += condText['B'];
                output = output.replace('{}', operators[Operator]);
                output = output.replace('{}', parseInt(Value * 100));
                output += '\n';
                break;
            case 'Lvl':
                output += condText['Lvl'];
                output = output.replace('{}', Value);
                output += '\n';
                break;
            case 'Sk':
            case 'SkT':
                const skill = dataManager.skills.GetByID(Value);
                const skillName = dataManager.GetText(skill.Name);
                output += condText[Comparator.Type];
                output = output.replace('{}', Value);
                output = output.replace('{}', skillName);
                output += '\n';
                break;
            case 'St':
                const statName = langManager.curr['statistics']['names'][Value];
                output += condText['St'];
                output = output.replace('{}', Value);
                output = output.replace('{}', statName);
                output += '\n';
                break;
            case 'Ca':
                const category = dataManager.skills.GetCategoryByID(Value);
                const categoryName = dataManager.GetText(category.Name);
                output += condText[Comparator.Type];
                output = output.replace('{}', Value);
                output = output.replace('{}', categoryName);
                output += '\n';
                break;
            case 'HCa':
                output += condText[Comparator.Type];
                output = output.replace('{}', Value);
                output = output.replace('{}', Comparator.Value);
                output += '\n';
                break;
            case 'It':
                output += condText['It'];
                output = output.replace('{}', Value);
                output += '\n';
                break;
            case 'Ad':
                output += condText['Ad'];
                output = output.replace('{}', Value);
                output += '\n';
                break;
        }

        return output;
    }

    /**
     * Return rewards text with correct langage
     * @param {Array<Reward>} rewards
     * @returns {String}
     */
    getRewardsText = (rewards) => {
        let output = '';
        for (let i = 0; i < rewards.length; i++) {
            const reward = rewards[i];
            const value = reward.Value;
            switch (reward.Type) {
                case 'Title':
                    const title = dataManager.titles.GetByID(value);
                    const titleName = dataManager.GetText(title.Name);
                    const titleLine = langManager.curr['achievements']['rewards']['title'].replace('{}', titleName);
                    output += '\n' + titleLine + '\n';
                    break;
                case 'Item':
                    const item = dataManager.items.GetByID(value);
                    const itemName = dataManager.GetText(item.Name);
                    const itemLine = langManager.curr['achievements']['rewards']['item'].replace('{}', itemName);
                    output += '\n' + itemLine + '\n';
                    break;
                case 'OX':
                    const oxLine = langManager.curr['achievements']['rewards']['ox'].replace('{}', value);
                    output += '\n' + oxLine + '\n';
                    break;
            }
        }
        return output;
    }

    CheckAchievements = () => {
        const achievements = dataManager.achievements.achievements;
        const stats = this.user.experience.GetExperience().stats;

        for (let a = 0; a < achievements.length; a++) {
            const achievement = achievements[a];
            const isInQueue = this.achievementQueue !== null && this.achievementQueue === achievement.ID;

            // Skip if already solved or hasn't conditions
            if (!isInQueue && (this.solved.includes(achievement.ID) || achievement.Condition === null)) {
                continue;
            }

            const { Condition, Rewards } = achievement;

            let completed = false;
            let value = null;
            const categories = dataManager.skills.categories;

            // Get value to compare
            switch (Condition?.Comparator.Type) {
                case 'B': // Battery level
                    value = GetBattery();
                    break;
                case 'Lvl': // Level
                    value = this.user.experience.GetExperience().xpInfo.lvl;
                    break;
                case 'Sk': // Skill level
                    const skillID = Condition.Comparator.Value;
                    value = this.user.experience.GetSkillExperience(skillID).lvl;
                    break;
                case 'SkT': // Skill time
                    const skillTimeID = Condition.Comparator.Value;
                    value = 0;
                    const now = GetTime();
                    const activities = this.user.activities.Get();
                    for (const a in activities) {
                        if (activities[a].skillID === skillTimeID && activities[a].startTime < now) {
                            value += activities[a].duration / 60;
                        }
                    }
                    break;
                case 'St': // Statistic level
                    const statKey = Object.keys(this.user.stats)[Condition.Comparator.Value];
                    const statLevel = stats[statKey].lvl;
                    value = statLevel;
                    break;
                case 'HCa': // nth highest category
                    const CategoryDepth = Condition.Comparator.Value;
                    if (categories.length < CategoryDepth) continue;
    
                    let values = [];
                    for (let c = 0; c < categories.length; c++) {
                        const categoryXP = this.user.experience.GetSkillCategoryExperience(categories[c].ID);
                        values.push(categoryXP.lvl);
                    }
                    values.sort();
                    value = values[CategoryDepth - 1];
                    break;
                case 'Ca': // Category level
                    const categoryXP = this.user.experience.GetSkillCategoryExperience(categories[c].ID);
                    value = categoryXP.lvl;
                    break;
                case 'It': // Number of items
                    value = this.user.inventory.GetStuffs().length;
                    break;
                case 'Ad': // Number of watched ads
                    value = this.user.informations.adTotalWatched;
                    break;
            }

            if (isInQueue) {
                completed = true;
                this.achievementQueue = null;
            }

            if (value !== null) {
                switch (Condition.Operator) {
                    case 'GT':
                        if (value >= Condition.Value)
                            completed = true;
                        break;
                    case 'LT':
                        if (value < Condition.Value)
                            completed = true;
                        break;
                }
            }

            if (completed) {
                const achievementName = dataManager.GetText(achievement.Name);
                const title = langManager.curr['achievements']['alert-achievement-title'];
                const text = langManager.curr['achievements']['alert-achievement-text'].replace('{}', achievementName);
                this.user.interface.popup.Open('ok', [ title, text ], undefined, false);

                this.AddAchievement(achievement.ID);
            }
        }
    }
}

export default Achievements;