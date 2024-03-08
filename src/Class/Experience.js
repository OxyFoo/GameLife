import dataManager from 'Managers/DataManager';

import { MinMax, Sum } from 'Utils/Functions';

const USER_XP_PER_LEVEL = 20;
const STAT_XP_PER_LEVEL = 2;
const SKILL_XP_PER_LEVEL = 20;


/**
 * @typedef {import('Class/Activities').Activity} Activity
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

        this.cache = {
            id: '',
            /** @type {{stats: Stats, xpInfo: XPInfo}} */
            experience: {
                stats: this.GetEmptyExperience(),
                xpInfo: this.getXPDict(0, 1)
            }
        };
    }

    /** @returns {Stats} */
    GetEmptyExperience() {
        const stats = this.user.statsKey.map(i => ({[i]: this.getXPDict()}));
        return Object.assign({}, ...stats);
    }

    /**
     * @returns {{stats: Stats, xpInfo: XPInfo}}
     */
    GetExperience() {
        const { statsKey } = this.user;
        const activities = this.getUsefulActivities();

        if (this.cache.id === activities.length.toString()) {
            return this.cache.experience;
        }

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

            // Friends bonus
            XP += XP * this.GetExperienceFriendBonus(activity);

            // Stats
            for (let s in statsKey) {
                const stat = statsKey[s];
                statValues[stat] += skill.Stats[stat];
            }
        }

        for (let k in statsKey) {
            const key = statsKey[k];
            stats[key] = this.getXPDict(statValues[key], STAT_XP_PER_LEVEL);
        }

        this.cache.id = activities.length.toString();
        this.cache.experience = { stats, xpInfo: this.getXPDict(XP, USER_XP_PER_LEVEL) };

        return {
            stats: stats,
            xpInfo: this.getXPDict(XP, USER_XP_PER_LEVEL)
        };
    }

    /**
     * @param {Activity} activity
     * @returns {number} XP bonus (between 0 and 0.2)
     */
    GetExperienceFriendBonus(activity) {
        if (activity.friends.length === 0) return 0;

        const bonus = activity.friends.length * 2;
        return MinMax(0, bonus, 20) / 100;
    }

    /**
     * @param {number} skillID
     * @returns {EnrichedXPInfo | null} null if the skill doesn't exist
     */
    GetSkillExperience(skillID) {
        const skill = dataManager.skills.GetByID(skillID);
        if (skill === null) return null;

        const activities = this.user.activities.GetBySkillID(skillID);
        const durations = activities
            .filter(activity => this.user.activities.GetExperienceStatus(activity) !== 'isNotPast')
            .map(a => a.duration);

        const totalDuration = Sum(durations);
        const totalXP = skill.XP * (totalDuration / 60);

        const experience = this.getXPDict(totalXP, SKILL_XP_PER_LEVEL);
        const lastTime = activities.length > 0 ? activities.at(-1).startTime : 0;
        return { ...experience, lastTime };
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

        return this.getXPDict(totalXP, SKILL_XP_PER_LEVEL);
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

        return { xp, lvl, next, totalXP };
    }
}

export { USER_XP_PER_LEVEL, STAT_XP_PER_LEVEL, SKILL_XP_PER_LEVEL };
export default Experience;
