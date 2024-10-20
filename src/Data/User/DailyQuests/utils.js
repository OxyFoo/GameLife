import dataManager from 'Managers/DataManager';

import { GetGlobalTime, GetMidnightTime } from 'Utils/Time';

/**
 * @typedef {import('./index').default} DailyQuest
 *
 * @typedef {(preSelectionCount: number, worstStatsQuantity: number) => number[]} GetActivitiesIdOfDayType
 * @typedef {(skillsIDs: number[]) => number} GetDailyProgressType
 */

/**
 * @this {DailyQuest}
 * @type {GetActivitiesIdOfDayType}
 */
function GetActivitiesIdOfDay(preSelectionCount, worstStatsQuantity) {
    const currentDay = new Date().getDay();

    let selectedStats = [];

    // During week: we select the worst stats
    if (currentDay >= 1 && currentDay <= 5) {
        selectedStats = this.user.statsKey
            .map((key) => ({ key, value: this.user.stats[key] }))
            .sort((a, b) => a.value.totalXP - b.value.totalXP)
            .slice(0, worstStatsQuantity);
    }

    // During the weekend: we select the best stats
    else {
        selectedStats = this.user.statsKey
            .map((key) => ({ key, value: this.user.stats[key] }))
            .sort((a, b) => b.value.totalXP - a.value.totalXP)
            .slice(0, worstStatsQuantity);
    }

    const preSelectedSkillsIDs = dataManager.skills
        .Get()
        .skills.filter((skill) => skill.XP > 0)
        .sort((skillA, skillB) => {
            const aStats = selectedStats.map((stat) => skillA.Stats[stat.key]).reduce((a, b) => a + b, 0);
            const bStats = selectedStats.map((stat) => skillB.Stats[stat.key]).reduce((a, b) => a + b, 0);
            return bStats - aStats;
        })
        .map((skill) => ({
            ID: skill.ID,
            name: skill.Name.fr,
            value: selectedStats.map((s) => skill.Stats[s.key]).reduce((a, b) => a + b, 0)
        }))
        .slice(0, preSelectionCount)
        .map((skill) => skill.ID);

    return preSelectedSkillsIDs;
}

/**
 * @this {DailyQuest}
 * @type {GetDailyProgressType}
 */
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
