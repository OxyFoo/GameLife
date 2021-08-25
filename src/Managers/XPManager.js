import { isUndefined } from "../Functions/Functions";

const allStats = [ 'sag', 'int', 'con', 'for', 'end', 'agi', 'dex' ];
const XPperHour = 100;
const UserXPperLevel = 20;
const StatXPperLevel = 2;
const SkillXPperLevel = 20;

class Experience {
    constructor(user) {
        this.user = user;
    }

    /**
     * Calculate user xp & lvl & stats
     * @param {Date} toDate Date before calculate stats (undefined to calculate before now)
     * @param {Date} fromDate Date after calculate stats (undefined to calculate all time)
     * @returns {Dict} xp, totalXP, lvl, next (amount of XP for next level)
     */
     getExperience(toDate, fromDate) {
        const refEndDate = !isUndefined(toDate) ? new Date(toDate) : new Date();
        const refStartDate = !isUndefined(fromDate) ? new Date(fromDate) : new Date(null);

        // Reset stats
        this.user.xp = 0;
        for (let s in allStats) {
            const stat = allStats[s];
            this.user.stats[stat] = 0;
        }

        // Count stats
        for (let a in this.user.activities) {
            const activity = this.user.activities[a];
            const activityDate = new Date(activity.startDate);
            const durationHour = activity.duration / 60;
            const skillID = activity.skillID;
            const skill = this.user.getSkillByID(skillID);

            // Check date
            if (activityDate >= refEndDate) continue;
            if (activityDate < refStartDate) continue;

            // XP
            const xp = (XPperHour * durationHour) + (this.user.stats.sag * durationHour);
            this.user.xp += xp;

            // Stats
            for (let s in allStats) {
                const stat = allStats[s];
                this.user.stats[stat] += skill.Stats[stat];
            }
        }

        return this.__getXPDict(this.user.xp, UserXPperLevel);
    }

    getXPTo(level) {
        let _lvl = 0;
        let _xp = 0;
        while (_lvl <= level) {
            _xp += _lvl * UserXPperLevel;
            _lvl += 1;
        }
        return _xp;
    }

    getStatExperience(statKey) {
        let totalXP = 0;
        for (let a in this.user.activities) {
            const activity = this.user.activities[a];
            const durationHour = activity.duration / 60;
            const skill = this.user.getSkillByID(activity.skillID);
            totalXP += skill.Stats[statKey] * durationHour;
        }
        return this.__getXPDict(totalXP, StatXPperLevel);
    }

    getSkillExperience(skillID) {
        let totalXP = 0;
        let stats = {};

        for (let s in allStats) {
            stats[allStats[s]] = 0;
        }

        for (let a in this.user.activities) {
            const activity = this.user.activities[a];
            if (activity.skillID == skillID) {
                const durationHour = activity.duration / 60;
                const skill = this.user.getSkillByID(skillID);
                totalXP += XPperHour * durationHour;
                for (let s in allStats) {
                    const localXP = skill.Stats[allStats[s]] * durationHour;
                    stats[allStats[s]] += localXP;
                }
            }
        }

        // TODO - vérifier les valeurs !!!
        let experience = this.__getXPDict(totalXP, SkillXPperLevel);
        experience['stat'] = stats;

        return experience;
    }

    /**
     * 
     * @param {*} searchTxt 
     * @param {*} filter 
     * @param {Number} sortType 0:XP, 1:Date, 2:A-Z
     * @param {Boolean} ascending
     * @returns {Array} of skills
     */
    getAllSkills(searchTxt, filter, sortType, ascending) {
        let skills = [];

        const skillsContainSkillID = (skillID) => {
            let isIn = false;
            for (let a in skills) {
                if (skills[a].skillID == skillID) {
                    isIn = a; break;
                }
            }
            return isIn;
        }

        const activities = this.user.activities;
        for (let a in activities) {
            const activity = activities[a];
            const skillID = activity.skillID;
            const index = skillsContainSkillID(skillID);
            if (index === false) {
                skills.push({ ...activity, count: 1 });
            } else {
                skills.count += 1;
                skills.duration += activity.duration;
                if (skills.startDate < activity.startDate) {
                    skills.startDate = activity.startDate;
                }
            }
        }

        return skills;
    }

    __getXPDict(totalXP, xpPerLevel) {
        let xp = totalXP;
        let lvl = 0;
        while (xp >= lvl * xpPerLevel) {
            xp -= lvl * xpPerLevel;
            lvl += 1;
        }
        const experience = {
            'xp': xp,
            'lvl': lvl,
            'next': (lvl + 1) * xpPerLevel,
            'totalXP': totalXP
        }
        return experience;
    }
}

export default Experience;