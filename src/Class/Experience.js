import dataManager from 'Managers/DataManager';

import { IUserClass } from 'Types/Interface/IUserClass';
import DynamicVar from 'Utils/DynamicVar';
import { MinMax, Round, Sum } from 'Utils/Functions';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/Data/App/Skills').Skill} Skill
 * @typedef {import('Types/Class/Experience').XPInfo} XPInfo
 * @typedef {import('Types/Class/Experience').Stats} Stats
 * @typedef {import('Types/Class/Experience').StatsXP} StatsXP
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

class Experience extends IUserClass {
    /** @type {UserManager} */
    #user;

    /**
     * @readonly
     * @type {Array<keyof Stats>}
     */
    statsKey = ['int', 'soc', 'for', 'sta', 'agi', 'dex'];

    experience = new DynamicVar({
        stats: this.GetEmptyExperience(),
        xpInfo: this.getXPDict(0)
    });

    /** @type {Symbol | null} */
    #listenerActivities = null;

    /** @param {UserManager} user */
    constructor(user) {
        super('experience');

        this.#user = user;
    }

    onMount = () => {
        this.UpdateExperience();
        this.#listenerActivities = this.#user.activities.allActivities.AddListener(this.UpdateExperience);
    };

    onUnmount = () => {
        this.#user.activities.allActivities.RemoveListener(this.#listenerActivities);
    };

    Clear = () => {
        this.experience.Set({ stats: this.GetEmptyExperience(), xpInfo: this.getXPDict(0) });
    };

    /** @returns {Stats} */
    GetEmptyExperience() {
        const stats = this.statsKey.map((i) => ({ [i]: this.getXPDict() }));
        return Object.assign({}, ...stats);
    }

    /**
     * @param {string} key
     * @returns {key is keyof Stats}
     */
    KeyIsStats(key) {
        // @ts-ignore
        return this.statsKey.includes(key);
    }

    UpdateExperience = () => {
        const activities = this.#user.activities.GetUseful(true);
        this.#user.interface?.console?.AddLog('info', 'UpdateExperience', activities.length);

        let XP = 0;

        /** @type {Stats} */
        const stats = Object.assign({}, ...this.statsKey.map((i) => ({ [i]: null })));

        /** @type {{ [key: string]: number }} */
        const statValues = Object.assign({}, ...this.statsKey.map((i) => ({ [i]: 0 })));

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
            for (let s in this.statsKey) {
                const stat = this.statsKey[s];
                statValues[stat] += skill.Stats[stat];
            }
        }

        for (let k in this.statsKey) {
            const key = this.statsKey[k];
            stats[key] = this.getXPDict(statValues[key], 'stat');
        }

        this.experience.Set({ stats, xpInfo: this.getXPDict(XP, 'user') });
    };

    GetStatsNumber = () => {
        const experience = this.experience.Get();
        return Object.assign({}, ...this.statsKey.map((key) => ({ [key]: Round(experience.stats[key].totalXP, 2) })));
    };

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
        const activities = this.#user.activities.GetBySkillID(skill.ID);
        const durations = activities
            .filter((activity) => this.#user.activities.GetExperienceStatus(activity) !== 'isNotPast')
            .map((a) => a.duration);

        const totalDuration = Sum(durations);
        const totalXP = skill.XP * (totalDuration / 60);

        const experience = this.getXPDict(totalXP, 'skill');
        const lastTime = activities.length === 0 ? 0 : (activities.at(-1)?.startTime ?? 0);
        return { ...experience, lastTime };
    }

    /**
     * @param {number} categoryID
     * @returns {XPInfo}
     */
    GetSkillCategoryExperience(categoryID) {
        let totalXP = 0;

        const activities = this.#user.activities.GetUseful();
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
