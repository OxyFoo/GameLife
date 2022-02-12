import dataManager from '../Managers/DataManager';

import { GetTime } from '../Utils/Time';

const UserXPperLevel = 20;
const StatXPperLevel = 2;
const SkillXPperLevel = 20;


/**
 * @typedef {import('../Managers/UserManager').default} UserManager
 * @typedef {import('../Managers/UserManager').Stats} Stats
 * 
 * @typedef {Object} XPInfo
 * @property {Number} xp - Current XP
 * @property {Number} lvl - Current level
 * @property {Number} next - XP to next level
 * @property {Number} totalXP - Total XP
 */

class Experience {
    constructor(user) {
        /**
         * @type {UserManager}
         */
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

        let stats = Object.assign({}, ...this.user.statsKey.map(i => ({[i]: 0})));
        const statsKeys = Object.keys(stats);

        for (let a in activities) {
            const activity = activities[a];
            const durationHour = activity.duration / 60;
            const skill = dataManager.skills.GetByID(activity.skillID);

            // XP
            XP += skill.XP * durationHour;

            // Stats
            for (let s in statsKeys) {
                const stat = statsKeys[s];
                stats[stat] += skill.Stats[stat];
            }
        }

        for (let key in stats) {
            stats[key] = this.getXPDict(stats[key], StatXPperLevel);
        }

        const output = {
            'stats': stats,
            'xpInfo': this.getXPDict(XP, UserXPperLevel)
        }
        return output;
    }

    // TODO - Remove if unused
    GetXPTo(level) {
        let _lvl = 0;
        let _xp = 0;
        while (_lvl <= level) {
            _xp += _lvl * UserXPperLevel;
            _lvl += 1;
        }
        return _xp;
    }

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

        let experience = this.getXPDict(totalXP, SkillXPperLevel);
        experience['lastTime'] = lastTime;

        return experience;
    }

    // TODO - Update
    GetSkillCategoryExperience(category, relative = false) {
        let totalXP = 0;

        if (relative) {
            // Get max skill experience
            let maxSkillXP = 0;
            const skills = dataManager.skills.skills;
            for (let s = 0; s < skills.length; s++) {
                const skill = skills[s];
                if (skill.Category != category) continue;
                const skillID = skill.ID;
                const skillXP = this.GetSkillExperience(skillID);
                if (skillXP.totalXP > maxSkillXP) {
                    maxSkillXP = skillXP.totalXP;
                }
            }
            totalXP = maxSkillXP;
        } else {
            const activities = this.getUsefulActivities();
            for (let a in activities) {
                const activity = activities[a];
                const skillID = activity.skillID;
                const skill = dataManager.skills.GetByID(skillID);
                const cat = skill.Category;
    
                if (cat == category) {
                    const durationHour = activity.duration / 60;
                    totalXP += skill.XP * durationHour;
                }
            }
        }

        let experience = this.getXPDict(totalXP, SkillXPperLevel);
        return experience;
    }

    getXPDict(totalXP = 0, xpPerLevel = 1) {
        let xp = parseInt(totalXP);
        let lvl = 0;
        while (xp >= lvl * xpPerLevel) {
            xp -= lvl * xpPerLevel;
            lvl += 1;
        }

        const experience = {
            'xp': xp,
            'lvl': lvl,
            'next': lvl * xpPerLevel,
            'totalXP': parseInt(totalXP)
        }
        return experience;
    }
}

export default Experience;