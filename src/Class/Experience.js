import dataManager from '../Managers/DataManager';

import { IsUndefined } from '../Functions/Functions';
import { GetMidnightTime, GetTime } from '../Functions/Time';
import { DEFAULT_STATS } from '../Managers/UserManager';

const allStats = [ 'int', 'soc', 'for', 'end', 'agi', 'dex' ];
const UserXPperLevel = 20;
const StatXPperLevel = 2;
const SkillXPperLevel = 20;

const MaxHourPerDay = 12;

class XPInfo {
    xp = 0;
    lvl = 0;
    next = 0;
    totalXP = 0;
}

class Experience {
    constructor(user) {
        /**
         * @typedef {import('../Managers/UserManager').default} UserManager
         * @type {UserManager}
         */
        this.user = user;
        this.getAllActivities = () => this.user.activities.GetAll();
    }

    /**
     * @param {Number} startTime Default: now in seconds
     * @param {Number} day Number of day after startTime, 0 = until today (included)
     * @returns {XPInfo}
     */
    GetExperience(startTime = GetTime(new Date()), day = 0) {
        const _startTime = GetMidnightTime(startTime);
        const _durationDays = day > 0 ? day : Math.min(1, Math.floor((GetTime(new Date()) - _startTime) / 86400));
        const _endTime = _startTime + 86400 * _durationDays;

        // Reset stats
        let XP = 0;
        // Remove this
        let STATS = DEFAULT_STATS;
        for (let s in allStats) {
            const stat = allStats[s];
            this.user.stats[stat] = 0;
        }

        // Count XP & stats
        for (let time = _startTime; time <= _endTime; time += 86400) {
            const activitiesInDay = this.user.activities.GetByTime(time);
            let hoursRemain = MaxHourPerDay;

            for (let a = 0; a < activitiesInDay.length; a++) {
                const activity = activitiesInDay[a];
                const durationHour = activity.duration / 60;
                const skillID = activity.skillID;
                const skill = dataManager.skills.GetByID(skillID);

                // Limit
                if (skill.XP > 0) hoursRemain -= durationHour;
                if (hoursRemain < 0) continue;

                // XP
                XP += skill.XP * durationHour;

                // Stats
                for (let s in allStats) {
                    const stat = allStats[s];
                    this.user.stats[stat] += skill.Stats[stat];
                }
            }
        }

        return this.getXPDict(XP, UserXPperLevel);
    }

    /**
     * TODO - Replace this function
     * Calculate user xp & lvl & stats
     * @param {Date} toDate Date before calculate stats (undefined to calculate before now)
     * @param {Date} fromDate Date after calculate stats (undefined to calculate all time)
     * @returns {XPInfo} xp, totalXP, lvl, next (amount of XP for next level)
     */
    getExperience(toDate, fromDate) {
        console.warn('Old function (Class/Experience.js line 82');
        const refEndDate = !IsUndefined(toDate) ? new Date(toDate) : new Date();
        const refStartDate = !IsUndefined(fromDate) ? new Date(fromDate) : new Date(null);

        // Reset stats
        let XP = 0;
        for (let s in allStats) {
            const stat = allStats[s];
            this.user.stats[stat] = 0;
        }

        // Sort activities & daily
        /*let events = [];
        let activities = [...this.user.activities];
        let daily = [...this.user.quests.daily];
        while (activities.length || daily.length) {
            if (!activities.length) {
                events.push(daily[0]);
                daily.splice(0, 1);
                continue;
            }
            if (!daily.length) {
                events.push(activities[0]);
                activities.splice(0, 1);
                continue;
            }
            let activityDate = new Date(activities[0].startTime);
            let dailyDate = new Date(daily[0].date);
            if (activityDate > dailyDate) {
                events.push(daily[0]);
                daily.splice(0, 1);
            } else {
                events.push(activities[0]);
                activities.splice(0, 1);
            }
        }*/

        // Count XP & stats (old)
        let time = this.user.activities.GetFirstTime();
        let activities = [...this.getAllActivities()];

        while (activities.length) {
            const activitiesInDay = this.user.activities.GetByTime(time);
            let hoursRemain = MaxHourPerDay;

            for (let a = 0; a < activitiesInDay.length; a++) {
                const activity = activitiesInDay[a];
                const activityDate = new Date(activity.startTime);
                const durationHour = activity.duration / 60;
                const skillID = activity.skillID;
                const skill = dataManager.skills.GetByID(skillID);

                // Remove from list
                for (let i = 0; i < activities.length; i++) {
                    if (activities[i] == activity) {
                        activities.splice(i, 1);
                        break;
                    }
                }

                // Check date
                if (activityDate >= refEndDate) continue;
                if (activityDate < refStartDate) continue;

                // Limit
                if (skill.XP > 0) hoursRemain -= durationHour;
                if (hoursRemain < 0) continue;

                // XP
                XP += skill.XP * durationHour;

                // Stats
                for (let s in allStats) {
                    const stat = allStats[s];
                    this.user.stats[stat] += skill.Stats[stat];
                }
            }

            time += 86400;
        }

        return this.getXPDict(XP, UserXPperLevel);
    }

    GetXPTo(level) {
        let _lvl = 0;
        let _xp = 0;
        while (_lvl <= level) {
            _xp += _lvl * UserXPperLevel;
            _lvl += 1;
        }
        return _xp;
    }

    GetStatExperience(statKey, untilActivity) {
        let totalXP = 0;
        const activities = this.getAllActivities();
        for (let a in activities) {
            const activity = activities[a];
            const durationHour = activity.duration / 60;
            const skill = dataManager.skills.GetByID(activity.skillID);

            if (activity == untilActivity) break;
            totalXP += skill.Stats[statKey] * durationHour;
        }
        return this.getXPDict(totalXP, StatXPperLevel);
    }

    GetSkillExperience(skillID) {
        let totalXP = 0;
        let stats = {};

        for (let s in allStats) {
            stats[allStats[s]] = 0;
        }

        const activities = this.getAllActivities();
        for (let a in activities) {
            const activity = activities[a];
            if (activity.skillID == skillID) {
                const durationHour = activity.duration / 60;
                const skill = dataManager.skills.GetByID(skillID);
                totalXP += skill.XP * durationHour;
                for (let s in allStats) {
                    const localXP = skill.Stats[allStats[s]] * durationHour;
                    stats[allStats[s]] += localXP;
                }
            }
        }

        // TODO - vérifier les valeurs !!!
        let experience = this.getXPDict(totalXP, SkillXPperLevel);
        experience['stat'] = stats;

        return experience;
    }

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
            const activities = this.getAllActivities();
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

    /**
     * 
     * @param {*} searchTxt 
     * @param {*} filters 
     * @param {Number} sortType 0:XP, 1:Date, 2:A-Z
     * @param {Boolean} ascending
     * @returns {Array} of skills
     */
    GetAllSkills(searchTxt, filters, sortType, ascending) {
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

        // Get all skills
        const activities = [...this.getAllActivities()].reverse();
        for (let a in activities) {
            const activity = activities[a];
            const skillID = activity.skillID;
            const index = skillsContainSkillID(skillID);
            if (index === false) {
                skills.push({ ...activity, count: 1 });
            } else {
                skills.count += 1;
                skills.duration += activity.duration;
                if (skills.startTime < activity.startTime) {
                    skills.startTime = activity.startTime;
                }
            }
        }

        // Skills search
        if (typeof(searchTxt) === 'string' && searchTxt.length > 0) {
            while (1) {
                let a = false;
                for (let s = 0; s < skills.length; s++) {
                    const skillID = skills[s].skillID;
                    const skill = dataManager.skills.GetByID(skillID);
                    if (!skill.Name.includes(searchTxt)) {
                        skills.splice(s, 1);
                        a = true;
                        break;
                    }
                }
                if (!a) break;
            }
        }

        // Skills filters
        if (typeof(filters) !== 'undefined' && filters.length > 0) {
            while (1) {
                let a = false;
                for (let s = 0; s < skills.length; s++) {
                    const skillID = skills[s].skillID;
                    const skill = dataManager.skills.GetByID(skillID);
                    if (!filters.includes(skill.Category)) {
                        skills.splice(s, 1);
                        a = true;
                        break;
                    }
                }
                if (!a) break;
            }
        }

        // Skills sorting
        let sortedSkills = [];
        const skillslength = skills.length;
        if (sortType === 0) { // Sort by XP
            for (let i = 0; i < skillslength; i++) {
                let biggestValue = 0;
                let biggestIndex = 0;
                for (let s = 0; s < skills.length; s++) {
                    const skillID = skills[s].skillID;
                    const skillXP = this.GetSkillExperience(skillID);
                    if (skillXP.totalXP > biggestValue) {
                        biggestIndex = s;
                        biggestValue = skillXP.totalXP;
                    }
                }
                sortedSkills.push(skills[biggestIndex]);
                skills.splice(biggestIndex, 1);
            }
            if (!ascending) sortedSkills.reverse();
        } else if (sortType === 1) { // Sort by alphabetic
            for (let i = 0; i < skillslength; i++) {
                let lastestValue = '';
                let lastestIndex = 0;
                for (let s = 0; s < skills.length; s++) {
                    const skillID = skills[s].skillID;
                    const skill = dataManager.skills.GetByID(skillID);
                    if (skill.Name.localeCompare(lastestValue) === 1) {
                        lastestIndex = s;
                        lastestValue = skill.Name;
                    }
                }
                sortedSkills.push(skills[lastestIndex]);
                skills.splice(lastestIndex, 1);
            }
            if (ascending) sortedSkills.reverse();
        } else if (sortType === 2) { // Sort by Date
            for (let i = 0; i < skillslength; i++) {
                let lastestValue = 0;
                let lastestIndex = 0;
                for (let s = 0; s < skills.length; s++) {
                    const skillID = skills[s].skillID;
                    const skill = dataManager.skills.GetByID(skillID);
                    if (skill.startTime > lastestValue) {
                        lastestIndex = s;
                        lastestValue = skill.Name;
                    }
                }
                sortedSkills.push(skills[lastestIndex]);
                skills.splice(lastestIndex, 1);
            }
            if (ascending) sortedSkills.reverse();
        }

        return sortedSkills;
    }

    getXPDict(totalXP, xpPerLevel) {
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