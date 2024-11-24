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
 * @typedef {import('Types/Class/Rewards').Reward} Reward
 * @typedef {import('Types/Data/App/Achievements').Condition} Condition
 * @typedef {import('Types/Data/App/Achievements').Achievement} Achievement
 * @typedef {import('Ressources/items/stuffs/Stuffs').StuffID} StuffID
 * @typedef {import('Types/Data/User/Achievements').AchievementItem} AchievementItem
 * @typedef {import('Types/Data/User/Achievements').SaveObject_Achievements} SaveObject_Achievements
 * @typedef {import('Types/Class/NotificationsInApp').NotificationInApp<'achievement-pending'>} NotificationInAppAchievementPending
 */

/** @extends {IUserData<SaveObject_Achievements>} */
class Achievements extends IUserData {
    /** @type {UserManager} */
    #user;

    /** @param {UserManager} user */
    constructor(user) {
        super('achievements');

        this.#user = user;
    }

    /** @type {boolean} Prevent multiple checks at the same time */
    loading = false;

    /**
     * @private
     * @type {boolean} Prevent multiple claim achievement
     */
    claimAchievementLoading = false;

    /** @type {DynamicVar<AchievementItem[]>} Actual solved achievements */ // prettier-ignore
    achievements = new DynamicVar(/** @type {AchievementItem[]} */ ([]));

    /** @type {AchievementItem[]} */
    #SAVED_achievements = [];

    /** @type {AchievementItem[]} */
    #UNSAVED_achievements = [];

    #token = 0;

    Clear = () => {
        this.achievements.Set([]);
        this.#SAVED_achievements = [];
        this.#UNSAVED_achievements = [];
        this.#token = 0;
    };

    Get = () => {
        return this.achievements.Get().sort((a, b) => b.Date - a.Date);
    };

    #updateAchievements = () => {
        const allAchievements = [...this.#SAVED_achievements, ...this.#UNSAVED_achievements];
        this.achievements.Set(allAchievements.sort((a, b) => b.Date - a.Date));
    };

    /** @param {Partial<SaveObject_Achievements>} data */
    Load = (data) => {
        if (typeof data.solved !== 'undefined') {
            this.#SAVED_achievements = data.solved;
        }
        if (typeof data.unsaved !== 'undefined') {
            this.#UNSAVED_achievements = data.unsaved;
        }
        if (typeof data.token !== 'undefined') {
            this.#token = data.token;
        }

        this.#updateAchievements();
    };

    /** @returns {SaveObject_Achievements} */
    Save = () => {
        return {
            solved: this.#SAVED_achievements,
            unsaved: this.#UNSAVED_achievements,
            token: this.#token
        };
    };

    LoadOnline = async () => {
        const response = await this.#user.server2.tcp.SendAndWait({ action: 'get-achievements', token: this.#token });

        // Check if result is valid
        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'get-achievements' ||
            response.result === 'error'
        ) {
            this.#user.interface.console?.AddLog('error', `[Achievements] Error while get achievements (${response})`);
            return false;
        }

        if (response.result === 'already-up-to-date') {
            return true;
        }

        // Update token & achievements
        this.#token = response.result.token;
        this.#SAVED_achievements = response.result.achievements;
        this.#updateAchievements();

        return true;
    };

    /** @returns {Promise<boolean>} */
    SaveOnline = async (attempt = 2) => {
        if (!this.#isUnsaved()) {
            return true;
        }

        const unsaved = this.#getUnsaved();
        const response = await this.#user.server2.tcp.SendAndWait({
            action: 'save-achievements',
            achievementIDs: unsaved.map((a) => a.AchievementID),
            token: this.#token
        });

        // Check if result is valid
        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'save-achievements' ||
            response.result === 'error'
        ) {
            this.#user.interface.console?.AddLog('error', `[Achievements] Error while add achievements (${response})`);
            return false;
        }

        if (response.result === 'wrong-achievements') {
            this.#user.interface.console?.AddLog('error', '[Achievements] Wrong achievements to save');
            return false;
        }

        // Check if achievements are up to date
        if (response.result === 'not-up-to-date') {
            if (attempt <= 0) {
                this.#user.interface.console?.AddLog('error', '[Achievements] Too many attempts to save achievements');
                return false;
            }

            this.#user.interface.console?.AddLog('info', '[Achievements] Retry to save achievements');
            await this.LoadOnline();
            return this.SaveOnline(attempt - 1);
        }

        this.#token = response.result.token;
        this.#purge(response.result.newAchievements);

        return true;
    };

    #isUnsaved = () => {
        return this.#UNSAVED_achievements.length > 0;
    };

    #getUnsaved = () => {
        return this.#UNSAVED_achievements;
    };

    /** @param {AchievementItem[]} newAchievements */
    #purge = (newAchievements) => {
        this.#SAVED_achievements.push(...newAchievements);
        this.#UNSAVED_achievements = [];
        this.#updateAchievements();
    };

    GetSolved() {
        return this.achievements.Get().filter((a) => a.State === 'OK');
    }

    GetPending() {
        return this.achievements.Get().filter((a) => a.State === 'PENDING');
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
     * @param {AchievementItem[]} [achievementItems=this.GetSolved()] List of achievements to get
     * @returns {Achievement[]}
     */
    GetLast(last = 3, achievementItems = this.Get()) {
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
            this.#user.interface.console?.AddLog(
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
            const rewardText = this.#user.rewards.GetText('not-claim', achievement.Rewards);
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
        this.#user.interface.popup?.OpenT({
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
        const valueStr = typeof Value === 'string' ? Value : (Value?.toString() ?? null);

        const operators = langManager.curr['achievements']['operators'];
        const condText = langManager.curr['achievements']['conditions'];

        if (Operator === 'None') {
            return '';
        }

        let output = null;
        switch (Comparator.Type) {
            case 'Battery':
                if (valueNum === null) {
                    this.#user.interface.console?.AddLog('error', '[Achievements] Battery condition with number value');
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
                    this.#user.interface.console?.AddLog(
                        'error',
                        `[Achievements] Error while get skill (ID: ${Comparator.Value})`
                    );
                    break;
                }

                const skillName = langManager.GetText(skill.Name);
                output = condText[Comparator.Type].replace('{}', valueStr).replace('{}', skillName);
                break;

            case 'St':
                if (
                    valueStr === null ||
                    Value === null ||
                    typeof Value !== 'string' ||
                    !this.#user.experience.KeyIsStats(Value)
                ) {
                    this.#user.interface.console?.AddLog(
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
                    this.#user.interface.console?.AddLog(
                        'error',
                        '[Achievements] Category condition with number value'
                    );
                    break;
                }

                const category = dataManager.skills.GetCategoryByID(valueNum);
                if (category === null) {
                    this.#user.interface.console?.AddLog(
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
                    this.#user.interface.console?.AddLog(
                        'error',
                        '[Achievements] Highest category condition with number value'
                    );
                    break;
                }

                output = condText[Comparator.Type].replace('{}', valueStr).replace('{}', Comparator.Value.toString());
                break;

            case 'ItemCount':
                if (valueStr === null) {
                    this.#user.interface.console?.AddLog(
                        'error',
                        '[Achievements] Item count condition with string value'
                    );
                    break;
                }

                output = condText['ItemCount'].replace('{}', valueStr);
                break;

            case 'Ad':
                if (valueStr === null) {
                    this.#user.interface.console?.AddLog('error', '[Achievements] Ad condition with string value');
                    break;
                }

                output = condText['Ad'].replace('{}', valueStr);
                break;

            case 'SelfFriend':
                if (valueStr === null) {
                    this.#user.interface.console?.AddLog(
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

    CheckAchievements = async () => {
        if (!this.#user.server2.IsAuthenticated() || this.loading) {
            return;
        }

        this.loading = true;

        const savedIDs = this.#SAVED_achievements.map((a) => a.AchievementID);
        const unsavedIDs = this.#UNSAVED_achievements.map((a) => a.AchievementID);
        const allIDs = [...savedIDs, ...unsavedIDs];
        const achievements = dataManager.achievements.Get().filter((a) => !allIDs.includes(a.ID));

        /** @type {number[]} */
        const newAchievementsIDSolved = [];

        for (let a = 0; a < achievements.length; a++) {
            const achievement = achievements[a];
            const isPending = unsavedIDs.includes(achievement.ID);
            const isSolved = savedIDs.includes(achievement.ID);
            const isAlreadyChecked = newAchievementsIDSolved.includes(achievement.ID);

            // Skip if already solved or hasn't conditions
            if (isPending || isSolved || isAlreadyChecked || achievement.Condition === null) {
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
                    value = this.#user.experience.experience.Get().xpInfo.lvl;
                    break;

                case 'Sk': // Skill level
                    const skillID = Condition.Comparator.Value;
                    if (skillID === null) {
                        this.#user.interface.console?.AddLog(
                            'error',
                            '[Achievements] Skill condition without skill ID'
                        );
                        break;
                    }

                    const skill = dataManager.skills.GetByID(skillID);
                    if (skill === null) {
                        this.#user.interface.console?.AddLog(
                            'error',
                            `[Achievements] Error while get skill (ID: ${skillID})`
                        );
                        break;
                    }

                    const experience = this.#user.experience.GetSkillExperience(skill);
                    value = experience.lvl;
                    break;

                case 'SkT': // Skill time
                    const skillTimeID = Condition.Comparator.Value;
                    value = 0;
                    const now = GetGlobalTime();
                    const activities = this.#user.activities.Get();
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
                        const categoryXP = this.#user.experience.GetSkillCategoryExperience(categories[c].ID);
                        values.push(categoryXP.lvl);
                    }
                    values.sort();
                    value = values[CategoryDepth - 1];
                    break;

                case 'Ca': // Category level
                    if (Condition.Comparator.Value === null) {
                        this.#user.interface.console?.AddLog(
                            'error',
                            '[Achievements] Category condition without category ID'
                        );
                        break;
                    }

                    const categoryID = categories[Condition.Comparator.Value]?.ID;
                    if (categoryID === undefined) continue;
                    const categoryXP = this.#user.experience.GetSkillCategoryExperience(categoryID);
                    value = categoryXP.lvl;
                    break;

                case 'ItemCount': // Number of items
                    value = this.#user.inventory.stuffs.length;
                    break;

                case 'Ad': // Number of watched ads
                    value = this.#user.informations.adTotalWatched;
                    break;

                case 'Title': // Title unlocked
                    const titles = this.#user.inventory.GetTitles();
                    const title = titles.find((t) => t.ID === Condition.Comparator.Value);
                    value = typeof title !== 'undefined' ? 1 : 0;
                    break;

                case 'SelfFriend': // Asking self friend
                    value = this.#user.informations.achievementSelfFriend ? 1 : 0;
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
                newAchievementsIDSolved.push(achievement.ID);
            }
        }

        if (newAchievementsIDSolved.length > 0) {
            // Save new achievements
            /** @type {AchievementItem[]} */
            const newAchievements = newAchievementsIDSolved.map((id) => {
                return {
                    AchievementID: id,
                    Date: GetGlobalTime(),
                    State: 'PENDING'
                };
            });

            this.#UNSAVED_achievements.push(...newAchievements);
            this.#updateAchievements();
            await this.SaveOnline();
            await this.#user.SaveLocal();
        }

        this.loading = false;
    };

    /**
     * Get rewards for an achievement and mark it as solved
     * @param {number} achievementID
     * @returns {Promise<{ rewards: Reward[], newOx: number } | null>} Rewards or null if an error occurred
     */
    Claim = async (achievementID) => {
        // Prevent multiple claims
        if (this.claimAchievementLoading || !this.#user.server2.IsAuthenticated()) {
            return null;
        }

        if (this.#SAVED_achievements.find((a) => a.AchievementID === achievementID) === undefined) {
            this.#user.interface.console?.AddLog(
                'error',
                `[Achievements] Claim achievement not found in solved achievements (ID: ${achievementID})`
            );
            return null;
        }

        this.claimAchievementLoading = true;

        // Get achievement
        const achievement = dataManager.achievements.GetByID(achievementID);
        if (achievement === null) {
            this.#user.interface.console?.AddLog(
                'error',
                `[Achievements] Error while get achievement (ID: ${achievementID})`
            );
            this.claimAchievementLoading = false;
            return null;
        }

        // Claim request
        const response = await this.#user.server2.tcp.SendAndWait({
            action: 'claim-achievement',
            achievementID,
            token: this.#token
        });

        // Check if response is valid
        if (
            response === 'not-sent' ||
            response === 'timeout' ||
            response === 'interrupted' ||
            response.status !== 'claim-achievement' ||
            response.result === 'error'
        ) {
            this.#user.interface.console?.AddLog(
                'error',
                `[Achievements] Error while claim achievement (ID: ${achievementID})`
            );
            this.claimAchievementLoading = false;
            return null;
        }

        if (response.result === 'not-up-to-date') {
            this.claimAchievementLoading = false;
            return null;
        }

        // Update token
        this.#token = response.result.token;

        // Update achievement state
        const index = this.#SAVED_achievements.findIndex((a) => a.AchievementID === achievementID);
        if (index === -1) {
            this.#user.interface.console?.AddLog(
                'error',
                `[Achievements] Claim achievement not found in solved achievements (ID: ${achievementID})`
            );
            this.claimAchievementLoading = false;
            return null;
        }

        this.#SAVED_achievements[index].State = 'OK';
        this.#updateAchievements();
        this.#user.SaveLocal();

        this.claimAchievementLoading = false;
        return {
            rewards: response.result.rewards,
            newOx: response.result.newOx
        };
    };

    /** @returns {NotificationInAppAchievementPending[]} */
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
