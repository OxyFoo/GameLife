import { IAppData } from 'Types/Interface/IAppData';

/**
 * @typedef {import('Types/Data/App/Achievements').Achievement} Achievement
 */

/** @extends {IAppData<Achievement[]>} */
class Achievements extends IAppData {
    /** @type {Array<Achievement>} */
    achievements = [];

    Clear = () => {
        this.achievements = [];
    };

    /** @param {Array<Achievement>} achievements */
    Load = (achievements) => {
        if (typeof achievements !== 'object') {
            return;
        }

        this.achievements = achievements;
    };

    Save = () => {
        return this.achievements;
    };

    Get = () => {
        return this.achievements;
    };

    /**
     * @param {number} ID
     * @returns {Achievement | null}
     */
    GetByID = (ID) => this.achievements.find((a) => a.ID === ID) || null;

    /**
     * Returns all achievements that are visible, with solved first
     * @param {Array<number>} solvedIDs
     * @returns {Array<Achievement>}
     */
    GetAll = (solvedIDs) => {
        let achievements = [];

        // Get unlocked
        const solvedAchievements = [...solvedIDs].reverse();
        for (let s = 0; s < solvedAchievements.length; s++) {
            const achievementID = solvedAchievements[s];
            const achievement = this.GetByID(achievementID);
            if (achievement !== null) {
                achievements.push(achievement);
            }
        }

        // Get others
        for (let a = 0; a < this.achievements.length; a++) {
            const achievement = this.achievements[a];
            if (!solvedIDs.includes(achievement.ID) && achievement.Type !== 'HIDE') {
                achievements.push(achievement);
            }
        }

        return achievements;
    };
}

export default Achievements;
