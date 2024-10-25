import dataManager from 'Managers/DataManager';

import { MinMax, Sum } from 'Utils/Functions';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Managers/UserManager').Stats} Stats
 * @typedef {import('Types/Data/App/Skills').Skill} Skill
 * @typedef {import('Types/Class/Experience').XPInfo} XPInfo
 * @typedef {import('Types/Class/Experience').EnrichedXPInfo} EnrichedXPInfo
 * @typedef {import('Types/Data/User/Activities').Activity} Activity
 */

/**
 * @typedef {'user' | 'stat' | 'skill'} XPTypes
 *
 * @typedef {object} XPOptions
 * @property {number} xpPerLevel
 * @property {number} increaseRatio Default: 0.5. ]0, 1[ for logarithmic, 1 for linear and ]1, 2] for exponential
 */

/** @type {{ [key in XPTypes]: XPOptions }} */
const XPOptions = {
    user: {
        xpPerLevel: 20,
        increaseRatio: 0.5
    },
    stat: {
        xpPerLevel: 6,
        increaseRatio: 0.8
    },
    skill: {
        xpPerLevel: 15,
        increaseRatio: 0.6
    }
};

class Experience {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;
        this.getUsefulActivities = () => this.user.activities.GetUseful();

        this.cache = {
            id: '',
            /** @type {{stats: Stats, xpInfo: XPInfo}} */
            experience: {
                stats: this.GetEmptyExperience(),
                xpInfo: this.getXPDict(0)
            }
        };
    }

    /** @returns {Stats} */
    GetEmptyExperience() {
        const stats = this.user.statsKey.map((i) => ({ [i]: this.getXPDict() }));
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
        const stats = Object.assign({}, ...statsKey.map((i) => ({ [i]: null })));

        /** @type {{ [key: string]: number }} */
        const statValues = Object.assign({}, ...statsKey.map((i) => ({ [i]: 0 })));

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
            stats[key] = this.getXPDict(statValues[key], 'stat');
        }

        this.cache.id = activities.length.toString();
        this.cache.experience = { stats, xpInfo: this.getXPDict(XP, 'user') };

        return {
            stats: stats,
            xpInfo: this.getXPDict(XP, 'user')
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
     * @param {Skill} skill
     * @returns {EnrichedXPInfo}
     */
    GetSkillExperience(skill) {
        const activities = this.user.activities.GetBySkillID(skill.ID);
        const durations = activities
            .filter((activity) => this.user.activities.GetExperienceStatus(activity) !== 'isNotPast')
            .map((a) => a.duration);

        const totalDuration = Sum(durations);
        const totalXP = skill.XP * (totalDuration / 60);

        const experience = this.getXPDict(totalXP, 'skill');
        const lastTime = activities.length === 0 ? 0 : activities.at(-1)?.startTime ?? 0;
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

        return this.getXPDict(totalXP, 'skill');
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
     * @param {XPTypes} type
     * @returns {XPInfo}
     */
    getXPDict(totalXP = 0, type = 'user') {
        const { xpPerLevel, increaseRatio } = XPOptions[type];

        if (totalXP < 0 || xpPerLevel <= 0) {
            return { xp: 0, lvl: 0, next: 0, totalXP: 0 };
        }

        const lvl = Math.floor((1 + Math.pow(1 + (8 * totalXP) / xpPerLevel, increaseRatio)) / 2);
        const xpForCurrLevel = (xpPerLevel * (Math.pow(2 * (lvl + 0) - 1, 1 / increaseRatio) - 1)) / 8;
        const xpForNextLevel = (xpPerLevel * (Math.pow(2 * (lvl + 1) - 1, 1 / increaseRatio) - 1)) / 8;

        const xp = totalXP - xpForCurrLevel;
        const next = xpForNextLevel - xpForCurrLevel;

        return { xp, lvl, next, totalXP };
    }
}

export default Experience;
