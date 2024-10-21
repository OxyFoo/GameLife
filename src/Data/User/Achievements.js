import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { IUserData } from 'Types/Interface/IUserData';
import DynamicVar from 'Utils/DynamicVar';
import { Round } from 'Utils/Functions';
import { IsNotNull } from 'Utils/Types';
import { GetBattery } from 'Utils/Device';
import { GetGlobalTime } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/Data/App/Achievement').Reward} Reward
 * @typedef {import('Types/Data/App/Achievement').Condition} Condition
 * @typedef {import('Types/Data/App/Achievement').Achievement} Achievement
 * @typedef {import('Ressources/items/stuffs/Stuffs').StuffID} StuffID
 * @typedef {import('Types/Data/User/Achievement').AchievementItem} AchievementItem
 * @typedef {import('Types/Data/User/Achievement').SaveObject_Local_Achievements} SaveObject_Local_Achievements
 * @typedef {import('Types/Data/User/NotificationsInApp').NotificationInApp<'achievement-pending'>} NotificationInAppAchievementPending
 */

/** @extends {IUserData<SaveObject_Local_Achievements>} */
class Achievements extends IUserData {
    /** @param {UserManager} user */
    constructor(user) {
        super();

        this.user = user;
    }

    /** @type {boolean} Prevent multiple checks at the same time */
    loading = false;

    /** @type {DynamicVar<Array<AchievementItem>>} Actual solved achievements */ // prettier-ignore
    achievements = new DynamicVar(/** @type {Array<AchievementItem>} */ ([]));

    /**
     * @private
     * @type {boolean} Prevent multiple claim achievement
     */
    claimAchievementLoading = false;

    Clear = () => {
        this.achievements.Set([]);
    };

    Get = () => {
        return this.achievements.Get();
    };

    /** @param {SaveObject_Local_Achievements} data */
    Load = (data) => {
        if (typeof data.solved !== 'undefined') {
            this.achievements.Set(data.solved);
        }
    };

    /** @returns {SaveObject_Local_Achievements} */
    Save = () => {
        return {
            solved: this.achievements.Get()
        };
    };

    LoadOnline = async () => {
        const result = await this.user.server2.tcp.SendAndWait({ action: 'get-achievements' });

        // Check if result is valid
        if (
            result === 'interrupted' ||
            result === 'not-sent' ||
            result === 'timeout' ||
            result.status !== 'get-achievements'
        ) {
            this.user.interface.console?.AddLog('error', '[Achievements] Error while get achievements');
            return false;
        }

        this.achievements.Set(result.achievements);
        return true;
    };

    GetSolved() {
        return this.achievements
            .Get()
            .filter((a) => a.State === 'OK')
            .sort((a, b) => b.Date - a.Date);
    }

    GetPending() {
        return this.achievements
            .Get()
            .filter((a) => a.State === 'PENDING')
            .sort((a, b) => b.Date - a.Date);
    }

    GetSolvedIDs() {
        return this.GetSolved().map((a) => a.AchievementID);
    }

    GetPendingIDs() {
        return this.GetPending().map((a) => a.AchievementID);
    }

    /**
     * Get last achievements
     * @param {number} [last=3] Number of achievements to return
     * @param {Array<AchievementItem>} [achievementItems=this.GetSolved()] List of achievements to get
     * @returns {Array<Achievement>}
     */
    GetLast(last = 3, achievementItems = this.GetSolved()) {
        return achievementItems
            .slice(0, last)
            .map((achievement) => {
                return dataManager.achievements.GetByID(achievement.AchievementID);
            })
            .filter(IsNotNull);
    }

    /**
     * Show popup with achievement informations
     * @param {number} achievementID
     */
    ShowCardPopup = (achievementID) => {
        const lang = langManager.curr['achievements'];
        const solvedIndexes = this.GetSolvedIDs();
        const achievement = dataManager.achievements.GetByID(achievementID);
        if (achievement === null) {
            this.user.interface.console?.AddLog(
                'error',
                `[Achievements] Error while get achievement (ID: ${achievementID})`
            );
            return;
        }

        const lines = [];

        // Add description
        const description = langManager.GetText(achievement.Description);
        if (description) {
            lines.push(description);
        }

        if (achievement.Type === 'SHOW' || solvedIndexes.includes(achievementID)) {
            // Add condition text
            const conditionText = this.getConditionText(achievement.Condition);
            if (conditionText) {
                lines.push(lang['popup-condition-text'] + conditionText);
            }

            // Add rewards text
            const rewardText = this.getRewardsText(achievement.Rewards);
            if (rewardText) {
                lines.push(rewardText);
            }
        } else if (achievement.Type === 'AUTO') {
            // Add condition text
            const conditionText = this.getConditionText(achievement.Condition);
            if (conditionText) {
                lines.push(lang['popup-hidden-condition']);
            }
        }

        // Add global percentage text
        const decimals = achievement.UniversalProgressPercentage < 1 ? 2 : 0;
        const pourcentage = Round(achievement.UniversalProgressPercentage, decimals);
        lines.push(lang['popup-global-text'].replace('{}', pourcentage.toString()));

        // Show popup
        this.user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: langManager.GetText(achievement.Name),
                message: lines.join('\n\n')
            }
        });
    };

    /**
     * Return condition text with correct langage
     * @param {Condition | null} condition
     * @returns {string | null} Text to show in popup or null if no condition or is invalid
     */
    getConditionText = (condition) => {
        if (condition === null) return '';

        const { Comparator, Operator, Value } = condition;

        const valueNum = typeof Value === 'number' ? Value : null;
        const valueStr = typeof Value === 'string' ? Value : Value?.toString() ?? null;

        const operators = langManager.curr['achievements']['operators'];
        const condText = langManager.curr['achievements']['conditions'];

        if (Operator === 'None') {
            return '';
        }

        let output = null;
        switch (Comparator.Type) {
            case 'Battery':
                if (valueNum === null) {
                    this.user.interface.console?.AddLog('error', '[Achievements] Battery condition with number value');
                    break;
                }

                output = condText['Battery']
                    .replace('{}', operators[Operator])
                    .replace('{}', (valueNum * 100).toString());
                break;

            case 'Level':
                if (valueStr !== null) {
                    output = condText['Level'].replace('{}', valueStr);
                }
                break;

            case 'Sk':
            case 'SkT':
                const skill = dataManager.skills.GetByID(Comparator.Value || 0);
                if (skill === null || valueStr === null) {
                    this.user.interface.console?.AddLog(
                        'error',
                        `[Achievements] Error while get skill (ID: ${Comparator.Value})`
                    );
                    break;
                }

                const skillName = langManager.GetText(skill.Name);
                output = condText[Comparator.Type].replace('{}', valueStr).replace('{}', skillName);
                break;

            case 'St':
                if (valueStr === null || Value === null || typeof Value !== 'string' || !this.user.KeyIsStats(Value)) {
                    this.user.interface.console?.AddLog(
                        'error',
                        '[Achievements] Statistic condition with string value'
                    );
                    break;
                }

                const statName = langManager.curr['statistics']['names'][Value];
                output = condText['St'].replace('{}', valueStr).replace('{}', statName);
                break;

            case 'Ca':
                if (valueStr === null || valueNum === null) {
                    this.user.interface.console?.AddLog('error', '[Achievements] Category condition with number value');
                    break;
                }

                const category = dataManager.skills.GetCategoryByID(valueNum);
                if (category === null) {
                    this.user.interface.console?.AddLog(
                        'error',
                        `[Achievements] Error while get category (ID: ${valueNum})`
                    );
                    break;
                }

                const categoryName = langManager.GetText(category.Name);
                output = condText[Comparator.Type].replace('{}', valueStr).replace('{}', categoryName);
                break;

            case 'HCa':
                if (valueStr === null || Comparator.Value === null) {
                    this.user.interface.console?.AddLog(
                        'error',
                        '[Achievements] Highest category condition with number value'
                    );
                    break;
                }

                output = condText[Comparator.Type].replace('{}', valueStr).replace('{}', Comparator.Value.toString());
                break;

            case 'ItemCount':
                if (valueStr === null) {
                    this.user.interface.console?.AddLog(
                        'error',
                        '[Achievements] Item count condition with string value'
                    );
                    break;
                }

                output = condText['ItemCount'].replace('{}', valueStr);
                break;

            case 'Ad':
                if (valueStr === null) {
                    this.user.interface.console?.AddLog('error', '[Achievements] Ad condition with string value');
                    break;
                }

                output = condText['Ad'].replace('{}', valueStr);
                break;

            case 'SelfFriend':
                if (valueStr === null) {
                    this.user.interface.console?.AddLog(
                        'error',
                        '[Achievements] Self friend condition with string value'
                    );
                    break;
                }

                output = condText['SelfFriend'].replace('{}', valueStr);
                break;
        }

        return output;
    };

    /**
     * Return rewards text with correct langage
     * @param {Array<Reward> | null} rewards
     * @returns {string}
     */
    getRewardsText = (rewards) => {
        if (rewards === null) return '';

        const lang = langManager.curr['achievements']['rewards'];
        const lines = [];

        for (let i = 0; i < rewards.length; i++) {
            const reward = rewards[i];
            const valueStr = typeof reward.Value === 'string' ? reward.Value : reward.Value?.toString();
            const valueNum = typeof reward.Value === 'number' ? reward.Value : null;

            switch (reward.Type) {
                case 'Title':
                    if (valueNum === null && !valueStr.includes('|')) continue;

                    let titleID = valueNum;
                    if (titleID === null) {
                        titleID = parseInt(valueStr.split('|')[0], 10);
                    }

                    const title = dataManager.titles.GetByID(titleID);
                    if (title === null) {
                        this.user.interface.console?.AddLog(
                            'error',
                            '[Achievements] Error while get title ( ID:',
                            titleID,
                            ')'
                        );
                        continue;
                    }

                    const titleName = langManager.GetText(title.Name);
                    const titleLine = lang['title'].replace('{}', titleName);
                    let line = titleLine;

                    // If already have this title
                    if (valueNum === null) {
                        const amount = valueStr.split('|')[1];
                        line += lang['title-conversion'].replace('{}', amount);
                    }

                    lines.push(line);
                    break;

                case 'Item':
                    // eslint-disable-next-line prettier/prettier
                    const item = dataManager.items.GetByID(/** @type {StuffID} */ (valueStr));
                    if (item === null) {
                        this.user.interface.console?.AddLog(
                            'error',
                            `[Achievements] Error while get item (ID: ${valueStr})`
                        );
                        continue;
                    }

                    const itemName = langManager.GetText(item.Name);
                    const itemRarity = langManager.curr['rarities'][item.Rarity];
                    const itemText = itemName + ' (' + itemRarity + ')';
                    const itemLine = lang['item'].replace('{}', itemText);
                    lines.push(itemLine);
                    break;

                case 'OX':
                    const oxLine = lang['ox'].replace('{}', valueStr);
                    lines.push(oxLine);
                    break;
            }
        }

        const output = lines.join('\n');
        return output;
    };

    CheckAchievements = async () => {
        if (!this.user.server2.IsAuthenticated() || this.loading) {
            return;
        }

        this.loading = true;

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
                case 'Battery': // Battery level
                    value = GetBattery();
                    break;

                case 'Level': // Level
                    value = this.user.experience.GetExperience().xpInfo.lvl;
                    break;

                case 'Sk': // Skill level
                    const skillID = Condition.Comparator.Value;
                    if (skillID === null) {
                        this.user.interface.console?.AddLog('error', '[Achievements] Skill condition without skill ID');
                        break;
                    }

                    const skill = dataManager.skills.GetByID(skillID);
                    if (skill === null) {
                        this.user.interface.console?.AddLog(
                            'error',
                            `[Achievements] Error while get skill (ID: ${skillID})`
                        );
                        break;
                    }

                    const experience = this.user.experience.GetSkillExperience(skill);
                    value = experience.lvl;
                    break;

                case 'SkT': // Skill time
                    const skillTimeID = Condition.Comparator.Value;
                    value = 0;
                    const now = GetGlobalTime();
                    const activities = this.user.activities.Get();
                    for (const activity in activities) {
                        if (activities[activity].skillID === skillTimeID && activities[activity].startTime < now) {
                            value += activities[activity].duration / 60;
                        }
                    }
                    break;

                // TODO: Reimplement stat ? Add "statKey" (as string) in Condition.Comparator.Value
                // case 'St': // Statistic level
                //     if (
                //         Condition.Comparator.Value === null ||
                //         this.user.KeyIsStats(Condition.Comparator.Value) === false
                //     ) {
                //         this.user.interface.console?.AddLog(
                //             'error',
                //             '[Achievements] Statistic condition without valid key'
                //         );
                //         break;
                //     }

                //     const stats = this.user.experience.GetExperience().stats;
                //     const statKey = Object.keys(this.user.stats)[Condition.Comparator.Value];
                //     const statLevel = stats[statKey].lvl;
                //     value = statLevel;
                //     break;

                case 'HCa': // nth highest category
                    const CategoryDepth = Condition.Comparator.Value;
                    if (CategoryDepth === null || categories.length < CategoryDepth) continue;

                    let values = [];
                    for (let c = 0; c < categories.length; c++) {
                        const categoryXP = this.user.experience.GetSkillCategoryExperience(categories[c].ID);
                        values.push(categoryXP.lvl);
                    }
                    values.sort();
                    value = values[CategoryDepth - 1];
                    break;

                case 'Ca': // Category level
                    if (Condition.Comparator.Value === null) {
                        this.user.interface.console?.AddLog(
                            'error',
                            '[Achievements] Category condition without category ID'
                        );
                        break;
                    }

                    const categoryID = categories[Condition.Comparator.Value]?.ID;
                    if (categoryID === undefined) continue;
                    const categoryXP = this.user.experience.GetSkillCategoryExperience(categoryID);
                    value = categoryXP.lvl;
                    break;

                case 'ItemCount': // Number of items
                    value = this.user.inventory.stuffs.length;
                    break;

                case 'Ad': // Number of watched ads
                    value = this.user.informations.adTotalWatched;
                    break;

                case 'Title': // Title unlocked
                    const titles = this.user.inventory.GetTitles();
                    const title = titles.find((t) => t.ID === Condition.Comparator.Value);
                    value = typeof title !== 'undefined' ? 1 : 0;
                    break;

                case 'SelfFriend': // Asking self friend
                    value = this.user.informations.achievementSelfFriend ? 1 : 0;
                    break;
            }

            if (value !== null && typeof Condition.Value === 'number') {
                switch (Condition.Operator) {
                    case 'None':
                        if (value >= 1) {
                            completed = true;
                        }
                        break;
                    case 'GT':
                        if (value >= Condition.Value) {
                            completed = true;
                        }
                        break;
                    case 'LT':
                        if (value < Condition.Value) {
                            completed = true;
                        }
                        break;
                }
            }

            if (completed) {
                achievementsSolved.push(achievement.ID);
            }
        }

        if (achievementsSolved.length > 0) {
            const newAchievements = await this.user.server2.tcp.SendAndWait({
                action: 'add-achievement',
                achievementIDs: achievementsSolved
            });

            if (
                newAchievements === 'not-sent' ||
                newAchievements === 'timeout' ||
                newAchievements === 'interrupted' ||
                newAchievements.status !== 'add-achievement' ||
                newAchievements.result !== 'ok' ||
                !newAchievements.achievements
            ) {
                this.user.interface.console?.AddLog(
                    'error',
                    `[Achievements] Error while add achievements (IDs: ${achievementsSolved.join(', ')})`
                );
                this.loading = false;
                return;
            }

            // Load new achievements
            this.achievements.Set(newAchievements.achievements);

            // Save user data
            this.user.LocalSave();
        }

        this.loading = false;
    };

    /**
     * @param {number} achievementID
     * @returns {Promise<Reward[] | null>} Text to show in popup, false if error, null if already claimed
     */
    Claim = async (achievementID) => {
        if (this.claimAchievementLoading) return null;
        this.claimAchievementLoading = true;

        // Get achievement
        const achievement = dataManager.achievements.GetByID(achievementID);
        if (achievement === null) {
            this.user.interface.console?.AddLog(
                'error',
                '[Achievements] Error while get achievement ( ID:',
                achievementID,
                ')'
            );
            this.claimAchievementLoading = false;
            return null;
        }

        // Claim request
        const result = await this.user.server2.tcp.SendAndWait({
            action: 'claim-achievement',
            achievementID
        });

        if (
            result === 'not-sent' ||
            result === 'timeout' ||
            result === 'interrupted' ||
            result.status !== 'claim-achievement' ||
            result.result !== 'ok' ||
            !result.rewards
        ) {
            this.user.interface.console?.AddLog(
                'error',
                `[Achievements] Error while claim achievement (ID: ${achievementID})`
            );
            this.claimAchievementLoading = false;
            return null;
        }

        // Add achievement to solved & get rewards
        const loaded = await this.user.LocalSave();
        if (!loaded) {
            this.user.interface.console?.AddLog(
                'error',
                `[Achievements] Error while load user achievements after claim achievement (ID: ${achievementID})`
            );
        }

        // Load user achievements directly
        await this.LoadOnline();

        this.claimAchievementLoading = false;
        return result.rewards;
    };

    /** @returns {Array<NotificationInAppAchievementPending>} */
    GetNotifications = () => {
        const achievements = this.GetPending();
        return achievements.map((achievement) => {
            return {
                type: 'achievement-pending',
                data: {
                    achievementID: achievement.AchievementID
                },
                timestamp: achievement.Date
            };
        });
    };
}

export default Achievements;
