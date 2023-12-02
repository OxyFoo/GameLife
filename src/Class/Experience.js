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
    /** @param {UserManager} user */
    constructor(user) {
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
        const { statsKey } = this.user;
        const activities = this.getUsefulActivities();
        let XP = 0;

        /** @type {Stats} */
        const stats = Object.assign({}, ...statsKey.map(i => ({[i]: null})));

        /** @type {{ [key: string]: number }} */
        const statValues = Object.assign({}, ...statsKey.map(i => ({[i]: 0})));

        for (let a in activities) {
            const activity = activities[a];
            const skill = dataManager.skills.GetByID(activity.skillID);
            if (skill === null) continue;

            // XP
            const durationHour = activity.duration / 60;
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

        return {
            'stats': stats,
            'xpInfo': this.getXPDict(XP, UserXPperLevel)
        };
    }

    /**
     * @param {number} skillID
     * @returns {EnrichedXPInfo | null} null if the skill doesn't exist
     */
    GetSkillExperience(skillID) {
        let totalXP = 0;
        let lastTime = 0;
        const now = GetTime();

        const skill = dataManager.skills.GetByID(skillID);
        if (skill === null) return null;

        const activities = this.getUsefulActivities();
        for (let a in activities) {
            const activity = activities[a];
            if (activity.skillID == skillID) {
                const startTime = activity.startTime;
                if (startTime <= now && startTime > lastTime) {
                    lastTime = startTime;
                }
                const durationHour = activity.duration / 60;
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
            if (skill === null) continue;

            if (skill.CategoryID === categoryID) {
                const durationHour = activity.duration / 60;
                totalXP += skill.XP * durationHour;
            }
        }

        return this.getXPDict(totalXP, SkillXPperLevel);
    }

    /**
     * @description Use arithmetic series
     * * Equation: `Sn = n/2 * (a1 + an)` with `an = (n - 1) * xpPerLevel`
     * * Variables: `a1 = 0`, `Sn -> Total xp`, `n -> level`
     * 
     * - `Sn = n/2 * ((n - 1) * xpPerLevel)`
     * - `TotalXP = lvl/2 * ((lvl - 1) * xpPerLevel))`
     * - `lvl = 1/2 + Math.sqrt(1 + 8 * totalXP / xpPerLevel)/2`
     * @param {number} totalXP
     * @param {number} xpPerLevel
     * @returns {XPInfo}
     */
    getXPDict(totalXP = 0, xpPerLevel = 1) {
        if (totalXP < 0 || xpPerLevel < 1) {
            return { 'xp': 0, 'lvl': 0, 'next': 0, 'totalXP': 0 };
        }

        const lvl = Math.floor((1 + Math.sqrt(1 + 8 * totalXP / xpPerLevel)) / 2);
        const xp = totalXP - (lvl * (lvl - 1) / 2) * xpPerLevel;
        const next = lvl * xpPerLevel;

        return {
            'xp': xp,
            'lvl': lvl,
            'next': next,
            'totalXP': totalXP
        };
    }
}

export default Experience;
