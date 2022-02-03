import dataManager from '../Managers/DataManager';

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
        this.solved = achievements['solved'];
        this.UNSAVED_solved = achievements['unsaved'];
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
        this.solved = [ this.solved, this.UNSAVED_solved ];
        this.UNSAVED_solved = [];
    }

    AddAchievement(achievementID) {
        this.UNSAVED_solved.push(achievementID);
    }

    // TODO - Add events (gifts while online saving)
    CheckAchievements() {
        const achievements = dataManager.achievements.achievements;
        const stats = this.user.experience.GetExperience().stats;

        for (let a = 0; a < achievements.length; a++) {
            const achievement = achievements[a];
            const achievementID = parseInt(achievement.ID);
            if (this.solved.includes(achievementID)) {
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
                    const activities = this.user.activities.Get();
                    for (const a in activities) {
                        if (activities[a].ID == skillID) {
                            value += activities[a].duration / 60;
                        }
                    }
                } else {
                    // Get level
                    value = this.user.experience.GetSkillExperience(skillID).lvl;
                }
            } else
            if (first.startsWith('St')) {
                // Stat level
                first = first.replace('St', '');
                const statKey = first;
                const statLevel = stats[statKey].lvl;
                value = statLevel;
            } else
            if (first == 'Ca') {
                // Get Max category level
                const categories = dataManager.skills.GetCategories(true);
                let maxLevel = 0;
                for (let c = 0; c < categories.length; c++) {
                    const category = categories[c];
                    const categoryXP = this.user.experience.GetSkillCategoryExperience(category.value, true);
                    if (categoryXP.lvl > maxLevel) {
                        maxLevel = categoryXP.lvl;
                    }
                }
                value = maxLevel;
            } else
            if (first.endsWith('Ca')) {
                // Categorie
                // TODO - Bug ici, mais avant changer les catégories
                first = first.replace('Ca', '');
                const CategoryDepth = parseInt(first);
                const categories = dataManager.skills.GetCategories(true);
                if (categories.length < CategoryDepth) continue;

                let values = [];
                for (let c = 0; c < categories.length; c++) {
                    const category = categories[c].value;
                    const categoryLevel = this.user.experience.GetSkillCategoryExperience(category).lvl;
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
                const text = langManager.curr['achievements']['alert-achievement-text'].replace('{}', achievement.Name);
                this.user.interface.popup.Open('ok', [ title, text ]);

                this.AddAchievement(achievementID);
                this.user.EventNewAchievement(achievement);
            }
        }
    }
}

export default Achievements;