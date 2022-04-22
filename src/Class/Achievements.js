import dataManager from '../Managers/DataManager';
import langManager from '../Managers/LangManager';

import { GetTime } from '../Utils/Time';
import { GetBattery } from '../Utils/Device';

class Achievements {
    constructor(user) {
        /**
         * @typedef {import('../Managers/UserManager').default} UserManager
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
    }

    Clear() {
        this.solved = [];
        this.UNSAVED_solved = [];
    }
    Load(achievements) {
        const contains = (key) => achievements.hasOwnProperty(key);
        if (contains('solved')) this.solved = achievements['solved'];
        if (contains('unsaved')) this.UNSAVED_solved = achievements['unsaved'];
    }
    LoadOnline(achievements) {
        this.solved = achievements;
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
            description += this.getConditionText(achievement.ID);
            description += this.getRewardsText(achievement.ID);
        }
        this.user.interface.popup.Open('ok', [ title, description ]);
    }

    /**
     * Show popup with achievement rewards
     * @param {Number} achievementID 
     */
    ShowRewardPopup = (achievementID) => {
        const title = langManager.curr['achievements']['alert-reward-title'];
        let text = langManager.curr['achievements']['alert-reward-text'] + '\n\n';
        text += this.getRewardsText(achievementID);
        this.user.interface.popup.Open('ok', [ title, text ], undefined, false);
    }

    /**
     * Return condition text with correct langage
     * @param {Number} achievementID
     * @returns {String}
     */
    getConditionText = (achievementID) => {
        const achievement = dataManager.achievements.GetByID(achievementID);
        if (achievement.Condition === null) return '';
        const { Comparator, Operator, Value } = achievement.Condition;

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
        }

        return output;
    }

    /**
     * Return rewards text with correct langage
     * @param {Number} ID
     * @returns {String}
     */
    getRewardsText = (ID) => {
        let output = '';
        const achievement = dataManager.achievements.GetByID(ID);
        for (let i = 0; i < achievement.Rewards.length; i++) {
            const reward = achievement.Rewards[i];
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
                case 'XP':
                    const xpLine = langManager.curr['achievements']['rewards']['xp'].replace('{}', value);
                    output += '\n' + xpLine + '\n';
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

            // Skip if already solved or hasn't conditions
            if (this.solved.includes(achievement.ID) || achievement.Condition === null) {
                continue;
            }

            const { Condition, Rewards } = achievement;

            let completed = false;
            let value = null;
            const categories = dataManager.skills.categories;

            // Get value to compare
            switch (Condition.Comparator.Type) {
                case 'B': // Battery level
                    value = GetBattery();
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
            }

            if (value === null) {
                continue;
            }

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

            if (completed) {
                const achievementName = dataManager.GetText(achievement.Name);
                const title = langManager.curr['achievements']['alert-achievement-title'];
                const text = langManager.curr['achievements']['alert-achievement-text'].replace('{}', achievementName);
                this.user.interface.popup.Open('ok', [ title, text ]);

                this.AddAchievement(achievement.ID);
            }
        }
    }
}

export default Achievements;