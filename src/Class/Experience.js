import { isUndefined } from "../Functions/Functions";

const allStats = [ 'sag', 'int', 'con', 'for', 'end', 'agi', 'dex' ];
const XPperHour = 100;
const UserXPperLevel = 20;
const StatXPperLevel = 2;
const SkillXPperLevel = 20;

const MaxHourPerDay = 12;

class Experience {
    constructor(user) {
        this.user = user;
        this.getAllActivities = () => { return this.user.activitiyManager.getAll(); };
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
            let activityDate = new Date(activities[0].startDate);
            let dailyDate = new Date(daily[0].date);
            if (activityDate > dailyDate) {
                events.push(daily[0]);
                daily.splice(0, 1);
            } else {
                events.push(activities[0]);
                activities.splice(0, 1);
            }
        }*/

        const getQuestAvancementFromActivity = (activity) => {
            const activityDate = new Date(activity.startDate);
            let output = null;
            for (let i = 0; i < this.user.quests.daily.length; i++) {
                const daily = this.user.quests.daily[i];
                const dailyDate = new Date(daily.date);
                if (activityDate > dailyDate) {
                    output = daily.skills;
                    output.push(this.user.quests.dailyGetBonusCategory(activityDate));
                }
            }
            return output;
        }

        // Count stats
        const date = new Date(this.user.activitiyManager.getFirst());
        date.setHours(0, 0, 0, 0);
        let activities = [...this.getAllActivities()];
        let questSupp = 0;
        let bonusSupp = 0;
        while (activities.length) {
            const activitiesInDay = this.user.activitiyManager.getByDate(date);
            let questComplete = 0;
            let bonusComplete = 0;
            let hoursRemain = MaxHourPerDay;

            for (let a = 0; a < activitiesInDay.length; a++) {
                const activity = activitiesInDay[a];
                const activityDate = new Date(activity.startDate);
                const durationHour = activity.duration / 60;
                const skillID = activity.skillID;
                const skill = this.user.getSkillByID(skillID);
                const category = skill.Category;

                // Remove from list
                for (let i = 0; i < activities.length; i++) {
                    if (activities[i] == activity) {
                        activities.splice(i, 1);
                        break;
                    }
                }

                // Get Bonus
                const daily = getQuestAvancementFromActivity(activity);
                if (daily !== null) {
                    if (skillID == daily[0] || skillID == daily[1]) { // Quest
                        questComplete += activity.duration;
                    } else if (category == daily[2]) { // Bonus
                        bonusComplete += activity.duration;
                    }
                }

                // Check date
                if (activityDate >= refEndDate) continue;
                if (activityDate < refStartDate) continue;

                // Limit
                hoursRemain -= durationHour;
                if (hoursRemain < 0) continue;

                // XP
                const sagLevel = this.getStatExperience('sag').lvl - 1;
                const xp = (XPperHour * durationHour) + (sagLevel * durationHour);
                const bonusMultiplier = 1 + ((questSupp + bonusSupp) / 100);
                this.user.xp += xp * bonusMultiplier;

                // Stats
                for (let s in allStats) {
                    const stat = allStats[s];
                    this.user.stats[stat] += skill.Stats[stat];
                }
            }

            questComplete /= 60;
            bonusComplete /= 15;
            if (questComplete >= 1) {
                if (questSupp < 0) questSupp = 1;
                else if (questSupp < 21) questSupp += 1;
            } else if (questSupp > 0) {
                questSupp = -5;
            }
            if (bonusComplete >= 1) {
                if (bonusSupp < 10) bonusSupp += 0.5;
            } else {
                bonusSupp = 0;
            }
            date.setDate(date.getDate() + 1);
        }

        return this.__getXPDict(this.user.xp, UserXPperLevel);
    }
    getXPperHour() {
        return XPperHour;
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

    getStatExperience(statKey, untilActivity) {
        let totalXP = 0;
        const activities = this.getAllActivities();
        for (let a in activities) {
            const activity = activities[a];
            const durationHour = activity.duration / 60;
            const skill = this.user.getSkillByID(activity.skillID);

            if (activity == untilActivity) break;
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

        const activities = this.getAllActivities();
        for (let a in activities) {
            const activity = activities[a];
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

    getSkillCategoryExperience(category, relative = false) {
        let totalXP = 0;

        if (relative) {
            // Get max skill experience
            let maxSkillXP = 0;
            for (let s = 0; s < this.user.skills.length; s++) {
                const skill = this.user.skills[s];
                if (skill.Category != category) continue;
                const skillID = skill.ID;
                const skillXP = this.getSkillExperience(skillID);
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
                const skill = this.user.getSkillByID(skillID);
                const cat = skill.Category;
    
                if (cat == category) {
                    const durationHour = activity.duration / 60;
                    totalXP += XPperHour * durationHour;
                }
            }
        }

        let experience = this.__getXPDict(totalXP, SkillXPperLevel);
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
    getAllSkills(searchTxt, filters, sortType, ascending) {
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
                if (skills.startDate < activity.startDate) {
                    skills.startDate = activity.startDate;
                }
            }
        }

        // Skills search
        if (typeof(searchTxt) === 'string' && searchTxt.length > 0) {
            while (1) {
                let a = false;
                for (let s = 0; s < skills.length; s++) {
                    const skillID = skills[s].skillID;
                    const skill = this.user.getSkillByID(skillID);
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
                    const skill = this.user.getSkillByID(skillID);
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
                    const skillXP = this.getSkillExperience(skillID);
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
                    const skill = this.user.getSkillByID(skillID);
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
                    const skill = this.user.getSkillByID(skillID);
                    if (skill.startDate > lastestValue) {
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

    __getXPDict(totalXP, xpPerLevel) {
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