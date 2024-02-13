import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import DynamicVar from 'Utils/DynamicVar';
import { GetTime } from 'Utils/Time';
import { GetBattery } from 'Utils/Device';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Data/Achievements').Condition} Condition
 * @typedef {import('Data/Achievements').Reward} Reward
 * @typedef {import('Data/Achievements').Achievement} Achievement
 * @typedef {import('Types/NotificationInApp').NotificationInApp<'achievement-pending'>} NotificationInAppAchievementPending
 */

class AchievementItem {
    AchievementID = 0;

    /** @type {'OK' | 'PENDING'} */
    State = 'OK';

    /** @type {number} Unix UTC timestamp in seconds */
    Date = 0;
}

class Achievements {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;
    }

    /** @type {boolean} Prevent multiple checks at the same time */
    loading = false;

    /** @type {DynamicVar<Array<AchievementItem>>} */
    achievements = new DynamicVar([]);

    /**
     * @private
     * @type {boolean} Prevent multiple claim achievement
     */
    claimAchievementLoading = false;

    Clear() {
        this.achievements.Set([]);
    }
    Load(achievements) {
        const contains = (key) => achievements.hasOwnProperty(key);
        if (contains('solved')) this.achievements.Set(achievements['solved']);
    }
    LoadOnline(achievements) {
        /** @type {any} @returns {AchievementItem} */
        const mapper = (a) => Object.assign(new AchievementItem(), a);
        this.achievements.Set(achievements.map(mapper));
    }
    Save() {
        const achievements = {
            solved: this.achievements.Get()
        };
        return achievements;
    }
    GetSolved() {
        return this.achievements.Get()
                                .filter(a => a.State === 'OK')
                                .sort((a, b) => b.Date - a.Date);
    }
    GetPending() {
        return this.achievements.Get()
                                .filter(a => a.State === 'PENDING')
                                .sort((a, b) => b.Date - a.Date);
    }

    GetSolvedIDs() {
        return this.GetSolved().map(a => a.AchievementID);
    }
    GetPendingIDs() {
        return this.GetPending().map(a => a.AchievementID);
    }

    /**
     * Get last achievements
     * @param {number} [last=3] Number of achievements to return
     * @returns {Array<Achievement>}
     */
    GetLast(last = 3) {
        const completeAchievements = this.GetSolved().reverse().slice(0, last);
        return completeAchievements.map(achievement => {
            return dataManager.achievements.GetByID(achievement.AchievementID);
        });
    }

    /**
     * Show popup with achievement informations
     * @param {number} achievementID 
     */
    ShowCardPopup = (achievementID) => {
        const solvedIndexes = this.GetSolvedIDs();
        const achievement = dataManager.achievements.GetByID(achievementID);
        const title = dataManager.GetText(achievement.Name);
        let description = dataManager.GetText(achievement.Description);
        if (description.length > 0) description += '\n';

        if (solvedIndexes.includes(achievementID)) {
            description += this.getConditionText(achievement.Condition);

            const rewardText = this.getRewardsText(achievement.Rewards);
            if (rewardText) description += '\n' + rewardText;
        }
        this.user.interface.popup.Open('ok', [ title, description ]);
    }

    /**
     * Return condition text with correct langage
     * @param {Condition} condition
     * @returns {string}
     */
    getConditionText = (condition) => {
        if (condition === null) return '';
        const { Comparator, Operator, Value } = condition;

        const valueNum = typeof(Value) === 'number' ? Value : null;
        const valueStr = typeof(Value) === 'string' ? Value : Value?.toString();

        const operators = langManager.curr['achievements']['operators'];
        const condText = langManager.curr['achievements']['conditions'];
        let output = '\n' + condText['header'];
        switch (Comparator.Type) {
            case 'B':
                output += condText['B']
                            .replace('{}', operators[Operator])
                            .replace('{}', (valueNum * 100).toString()) + '\n';
                break;

            case 'Lvl':
                output += condText['Lvl']
                            .replace('{}', valueStr) + '\n';
                break;

            case 'Sk':
            case 'SkT':
                const skill = dataManager.skills.GetByID(valueNum);
                if (skill === null) {
                    output += condText['Sk']
                                .replace('{}', 'Error: Skill not found\n');
                    break;
                }
                const skillName = dataManager.GetText(skill.Name);
                output += condText[Comparator.Type]
                            .replace('{}', valueStr)
                            .replace('{}', skillName) + '\n';
                break;

            case 'St':
                const statName = langManager.curr['statistics']['names'][Value];
                output += condText['St']
                            .replace('{}', valueStr)
                            .replace('{}', statName) + '\n';
                break;

            case 'Ca':
                const category = dataManager.skills.GetCategoryByID(valueNum);
                const categoryName = dataManager.GetText(category.Name);
                output += condText[Comparator.Type]
                            .replace('{}', valueStr)
                            .replace('{}', categoryName) + '\n';
                break;

            case 'HCa':
                output += condText[Comparator.Type]
                            .replace('{}', valueStr)
                            .replace('{}', Comparator.Value.toString()) + '\n';
                break;

            case 'It':
                output += condText['It']
                            .replace('{}', valueStr) + '\n';
                break;

            case 'Ad':
                output += condText['Ad']
                            .replace('{}', valueStr) + '\n';
                break;
        }

        return output;
    }

    /**
     * Return rewards text with correct langage
     * @param {Array<Reward>} rewards
     * @returns {string}
     */
    getRewardsText = (rewards) => {
        const lang = langManager.curr['achievements']['rewards'];
        let output = '';

        for (let i = 0; i < rewards.length; i++) {
            const reward = rewards[i];
            const valueStr = typeof(reward.Value) === 'string' ? reward.Value : reward.Value?.toString();
            const valueNum = typeof(reward.Value) === 'number' ? reward.Value : null;

            switch (reward.Type) {
                case 'Title':
                    if (valueNum === null && !valueStr.includes('|')) continue;

                    let titleID = valueNum;
                    if (titleID === null) {
                        titleID = parseInt(valueStr.split('|')[0]);
                    }

                    const title = dataManager.titles.GetByID(titleID);
                    const titleName = dataManager.GetText(title.Name);
                    const titleLine = lang['title'].replace('{}', titleName);
                    output += titleLine;

                    // If already have this title
                    if (valueNum === null) {
                        const amount = valueStr.split('|')[1];
                        output += lang['title-conversion'].replace('{}', amount);
                    }

                    output += '\n';
                    break;

                case 'Item':
                    const item = dataManager.items.GetByID(valueStr);
                    const itemName = dataManager.GetText(item.Name);
                    const itemRarity = langManager.curr['rarities'][item.Rarity];
                    const itemText = itemName + ' (' + itemRarity + ')';
                    const itemLine = lang['item'].replace('{}', itemText);
                    output += itemLine + '\n';
                    break;

                case 'OX':
                    const oxLine = lang['ox'].replace('{}', valueStr);
                    output += oxLine + '\n';
                    break;
            }
        }

        return output;
    }

    CheckAchievements = async () => {
        if (!this.user.server.IsConnected() || this.loading) return;
        this.loading = true;

        const stats = this.user.experience.GetExperience().stats;

        const solvedIDs = this.GetSolvedIDs();
        const pendingIDs = this.GetPendingIDs();
        const achievements = dataManager.achievements.GetAll(solvedIDs);

        const achievementsSolved = [];
        for (let a = 0; a < achievements.length; a++) {
            const achievement = achievements[a];
            const isPending = pendingIDs.includes(achievement.ID);
            const isSolved = solvedIDs.includes(achievement.ID);

            // Skip if already solved or hasn't conditions
            if (isPending || isSolved || achievement.Condition === null) {
                continue;
            }

            const { Condition } = achievement;

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
                    value = this.user.experience.GetSkillExperience(skillID)?.lvl || 0;
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
                    const categoryID = categories[Condition.Comparator.Value]?.ID;
                    if (categoryID === undefined) continue;
                    const categoryXP = this.user.experience.GetSkillCategoryExperience(categoryID);
                    value = categoryXP.lvl;
                    break;

                case 'It': // Number of items
                    value = this.user.inventory.stuffs.length;
                    break;

                case 'Ad': // Number of watched ads
                    value = this.user.informations.adTotalWatched;
                    break;

                case 'Tt': // Title unlocked
                    const titles = this.user.inventory.GetTitles();
                    const title = titles.find(t => t.ID === Condition.Comparator.Value);
                    value = typeof(title) !== 'undefined' ? 1 : 0;
                    break;
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
                achievementsSolved.push(achievement.ID);
            }
        }

        if (achievementsSolved.length > 0) {
            const newAchievements = await this.user.server.AddAchievements(achievementsSolved);
            if (newAchievements === false) {
                this.user.interface.console.AddLog('error', 'Achievements: Error while adding achievement ( ID:', achievementsSolved, ')');
                this.loading = false;
                return;
            }
    
            this.LoadOnline(newAchievements);
            this.user.LocalSave();
        }

        this.loading = false;
    }

    /**
     * @param {number} achievementID
     * @returns {Promise<string | false | null>} Text to show in popup, false if error, null if already claimed
     */
    Claim = async (achievementID) => {
        if (this.claimAchievementLoading) return null;
        this.claimAchievementLoading = true;

        const lang = langManager.curr['achievements'];

        // Get achievement
        const achievement = dataManager.achievements.GetByID(achievementID);
        if (achievement === null) {
            this.user.interface.console.AddLog('error', 'Achievements: Error while get achievement ( ID:', achievementID, ')');
            this.claimAchievementLoading = false;
            return false;
        }

        // Claim request
        const result = await this.user.server.ClaimAchievement(achievement.ID);
        if (result === false) {
            this.user.interface.console.AddLog('error', 'Achievements: Error while claim achievement ( ID:', achievement.ID, ')');
            this.claimAchievementLoading = false;
            return false;
        }

        // Get rewards
        let rewardText = '';
        if (result) {
            const rewards = dataManager.achievements.parseReward(result);
            rewardText = this.getRewardsText(rewards);
        }

        // Add achievement to solved & get rewards
        await this.user.LocalSave();
        await this.user.OnlineLoad(true);

        // Show popup
        const achievementName = dataManager.GetText(achievement.Name);
        let text = lang['alert-achievement-text'].replace('{}', achievementName);
        if (rewardText) {
            text += `\n\n${rewardText}`;
        }

        // Prevent another claim before popup open
        setTimeout(() => {
            this.claimAchievementLoading = false;
        }, 500);

        return text;
    }

    /** @returns {Array<NotificationInAppAchievementPending>} */
    GetNotifications = () => {
        const achievements = this.GetPending();
        return achievements.map(achievement => {
            return {
                type: 'achievement-pending',
                data: {
                    achievementID: achievement.AchievementID
                },
                timestamp: achievement.Date
            };
        });
    }
}

export { AchievementItem };
export default Achievements;
