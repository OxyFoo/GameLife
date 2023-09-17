import dataManager from 'Managers/DataManager';

import { GetTime } from 'Utils/Time';

const UserXPperLevel = 20;
const StatXPperLevel = 2;
const SkillXPperLevel = 20;


/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Managers/UserManager').Stats} Stats
 * 
 * @typedef {object} XPInfo
 * @property {number} xp - Current XP
 * @property {number} lvl - Current level
 * @property {number} next - XP to next level
 * @property {number} totalXP - Total XP
 * 
 * @typedef {object} EnrichedXPInfo
 * @property {number} xp - Current XP
 * @property {number} lvl - Current level
 * @property {number} next - XP to next level
 * @property {number} totalXP - Total XP
 * @property {number} lastTime - Last time the user gained XP
 */

class Experience {
    constructor(user) {
        /** @type {UserManager} */
        this.user = user;
        this.getUsefulActivities = this.user.activities.GetUseful;
    }

    GetEmptyExperience() {
        const getDict = i => ({[i]: this.getXPDict()});
        const stats = this.user.statsKey.map(getDict);
        return Object.assign({}, ...stats);
    }

    /**
     * @returns {{stats: Stats, xpInfo: XPInfo}}
     */
    GetExperience() {
        const activities = this.getUsefulActivities();
        let XP = 0;
        const { statsKey } = this.user;

        /** @type {Stats} */
        const stats = Object.assign({}, ...statsKey.map(i => ({[i]: null})));

        /** @type {{ [key: string]: number }} */
        const statValues = Object.assign({}, ...statsKey.map(i => ({[i]: 0})));

        for (let a in activities) {
            const activity = activities[a];
            const durationHour = activity.duration / 60;
            const skill = dataManager.skills.GetByID(activity.skillID);

            // XP
            XP += skill.XP * durationHour;

            // Stats
            for (let s in statsKey) {
                const stat = statsKey[s];
                statValues[stat] += skill.Stats[stat];
            }
        }

        for (let k in statsKey) {
            const key = statsKey[k];
            stats[key] = this.getXPDict(statValues[key], StatXPperLevel);
        }

        const output = {
            'stats': stats,
            'xpInfo': this.getXPDict(XP, UserXPperLevel)
        }
        return output;
    }

    /**
     * @param {number} skillID
     * @returns {EnrichedXPInfo}
     */
    GetSkillExperience(skillID) {
        let totalXP = 0;
        let lastTime = 0;
        const now = GetTime();

        const activities = this.getUsefulActivities();
        for (let a in activities) {
            const activity = activities[a];
            if (activity.skillID == skillID) {
                const startTime = activity.startTime;
                if (startTime <= now && startTime > lastTime) {
                    lastTime = startTime;
                }
                const durationHour = activity.duration / 60;
                const skill = dataManager.skills.GetByID(skillID);
                totalXP += skill.XP * durationHour;
            }
        }

        const experience = this.getXPDict(totalXP, SkillXPperLevel);
        return {
            ...experience,
            lastTime: lastTime
        };
    }

    /**
     * @param {number} categoryID
     * @returns {XPInfo}
     */
    GetSkillCategoryExperience(categoryID) {
        let totalXP = 0;

        const activities = this.getUsefulActivities();
        for (let a in activities) {
            const activity = activities[a];
            const skill = dataManager.skills.GetByID(activity.skillID);

            if (skill.CategoryID === categoryID) {
                const durationHour = activity.duration / 60;
                totalXP += skill.XP * durationHour;
            }
        }

        return this.getXPDict(totalXP, SkillXPperLevel);
    }

    /**
     * @param {number} totalXP
     * @param {number} xpPerLevel
     * @returns {XPInfo}
     */
    getXPDict(totalXP = 0, xpPerLevel = 1) {
        let xp = totalXP;
        let lvl = 0;
        while (xp >= lvl * xpPerLevel) {
            xp -= lvl * xpPerLevel;
            lvl += 1;
        }

        const experience = {
            'xp': xp,
            'lvl': lvl,
            'next': lvl * xpPerLevel,
            'totalXP': totalXP
        }
        return experience;
    }
}

export default Experience;