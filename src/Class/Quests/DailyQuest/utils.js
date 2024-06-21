import dataManager from 'Managers/DataManager';

import { GetGlobalTime, GetMidnightTime } from 'Utils/Time';

/**
 * @typedef {import('./index').default} DailyQuest
 * 
 * @callback GetActivitiesIdOfDayType
 * @this {DailyQuest}
 * @param {number} worstStatsQuantity Quantity of worst stats to consider to select skills
 * @param {number} preSelectionCount Number of skills to return
 * @returns {number[]} Selected skills ID
 * 
 * @callback GetDailyProgressType
 * @this {DailyQuest}
 * @param {number[]} skillsIDs Selected skills ID
 * @returns {number} Progress of the day in minutes
 */

/** @type {GetActivitiesIdOfDayType} */
function GetActivitiesIdOfDay(worstStatsQuantity, preSelectionCount) {
    const currentDay = (new Date()).getDay();
    let selectedStats = [];

    // During week: we select the worst stats
    if (currentDay >= 1 && currentDay <= 5) {
        selectedStats = this.user.statsKey
            .map(key => ({ key, value: this.user.stats[key] }))
            .sort((a, b) => a.value.totalXP - b.value.totalXP)
            .slice(0, worstStatsQuantity);
    }

    // During the weekend: we select the best stats
    else {
        selectedStats = this.user.statsKey
            .map(key => ({ key, value: this.user.stats[key] }))
            .sort((a, b) => b.value.totalXP - a.value.totalXP)
            .slice(0, worstStatsQuantity);
    }

    const preSelectedSkillsIDs = dataManager
        .skills.Get()
        .filter(skill => skill.XP > 0)
        .sort((skillA, skillB) => {
            const aStats = selectedStats
                .map(stat => skillA.Stats[stat.key])
                .reduce((a, b) => a + b, 0);
            const bStats = selectedStats
                .map(stat => skillB.Stats[stat.key])
                .reduce((a, b) => a + b, 0);
            return bStats - aStats;
        })
        .map(skill => skill.ID)
        .slice(0, preSelectionCount);

    return preSelectedSkillsIDs;
}

/** @type {GetDailyProgressType} */
function GetDailyProgress(skillsIDs) {
    const now = GetGlobalTime();
    const midnight = GetMidnightTime(now);
    const activities = this.user.activities.Get();

    let progressMinutes = 0;
    for (let i = activities.length - 1; i >= 0; i--) {
        const { skillID, startTime, duration } = activities[i];
        if (startTime < midnight) {
            break;
        }

        if (skillsIDs.includes(skillID)) {
            progressMinutes += duration;
        }
    }

    return progressMinutes;
}

export { GetActivitiesIdOfDay, GetDailyProgress };
