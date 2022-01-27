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

    Load(achievements) {
        if (typeof(achievements) === 'object') {
            this.achievements = achievements;
        }
    }
    Save() {
        return this.achievements;
    }

    // TODO - Update this function
    GetAchievements = (solved) => {
        let achievements = [];

        // Get unlocked
        let solvedAchievements = [...solved];
        solvedAchievements.reverse();
        for (let s = 0; s < solvedAchievements.length; s++) {
            const achievementID = solvedAchievements[s];
            const achievement = this.GetAchievementByID(achievementID);
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

    GetAchievementByID = (ID) => {
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