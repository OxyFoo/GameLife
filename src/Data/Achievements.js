import langManager from "../Managers/LangManager";
import { strIsJSON } from "../Functions/Functions";

class Achievement {
    ID = 0;
    Type = 0;
    Name = { 'fr': '', 'en': '' };
    Description = { 'fr': '', 'en': '' };
    Conditions = '';
    Reward = '';
}

class Achievements {
    constructor() {
        /**
         * @type {Achievement[]}
         */
        this.achievements = [];
    }

    save() {
        return JSON.stringify(this.achievements);
    }
    load(achievements) {
        if (strIsJSON(achievements)) {
            this.achievements = JSON.parse(achievements);
            for (let i = 0; i < this.achievements.length; i++) {
                if (strIsJSON(this.achievements[i].Name)) {
                    this.achievements[i].Name = JSON.parse(this.achievements[i].Name);
                }
                if (strIsJSON(this.achievements[i].Description)) {
                    this.achievements[i].Description = JSON.parse(this.achievements[i].Description);
                }
            }
        }
    }

    getAchievements = (solved) => {
        let achievements = [];

        // Get unlocked
        let solvedAchievements = [...solved];
        solvedAchievements.reverse();
        for (let s = 0; s < solvedAchievements.length; s++) {
            const achievementID = solvedAchievements[s];
            const achievement = this.getAchievementByID(achievementID);
            if (achievement && achievement.Type != -1) {
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
}

export default Achievements;