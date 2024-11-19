import { DAY_TIME, GetDate, GetLocalTime, GetTimeZone } from 'Utils/Time';

/**
 * @typedef {import('Data/User/Activities/index').default} Activities
 * @typedef {import('Types/Data/User/Quests').Quest} Quest
 */

/**
 * @param {Activities} activities
 * @param {Quest} quest
 * @returns {number} Streak
 */
function getStreakFromMonthOrWeek(activities, quest) {
    let streak = 0;
    const timeNow = GetLocalTime();
    const todayMidnight = timeNow - (timeNow % DAY_TIME) - GetTimeZone() * 60 * 60;

    const allActivitiesTime = activities
        .Get()
        .filter((activity) => quest.skills.includes(activity.skillID))
        .filter((activity) => activities.GetExperienceStatus(activity) === 'grant')
        .map((activity) => ({
            localStart: activity.startTime + activity.timezone * 60 * 60,
            duration: activity.duration
        }));

    let n = allActivitiesTime.length;
    let currDuration = 0;
    let lastMidnight = todayMidnight;

    if (allActivitiesTime.length === 0) {
        return 0;
    }

    while (true) {
        // Skip days that are not in repeat
        const day = GetDate(lastMidnight + GetTimeZone() * 60 * 60);
        if (quest.schedule.type === 'week') {
            const dayIndex = (day.getDay() + 7 - 1) % 7;
            if (!quest.schedule.repeat.includes(dayIndex)) {
                currDuration = 0;
                lastMidnight -= DAY_TIME;
                continue;
            }
        } else if (quest.schedule.type === 'month') {
            const dayIndex = day.getDate() - 1;
            if (!quest.schedule.repeat.includes(dayIndex)) {
                currDuration = 0;
                lastMidnight -= DAY_TIME;
                continue;
            }
        }

        // Check if there is no more activities
        if (--n < 0) {
            break;
        }

        // Add duration of activities in the same day
        const activity = allActivitiesTime[n];
        if (activity.localStart > lastMidnight + DAY_TIME) {
            continue;
        }
        const currDay = activity.localStart >= lastMidnight;
        if (currDay) {
            currDuration += activity.duration;
        }

        // Check if streak is broken
        const isToday = lastMidnight === todayMidnight;
        const isComplete = currDuration >= quest.schedule.duration;
        if (!currDay && !isToday && !isComplete) {
            break;
        }

        // Check if streak is continued
        if (isComplete) {
            streak++;
            currDuration = 0;
            lastMidnight -= DAY_TIME;
        }

        // Check if streak is continued even if not complete (only if today)
        else if (isToday) {
            n++;
            currDuration = 0;
            lastMidnight -= DAY_TIME;
        }
    }

    return streak;
}

// TODO: Implement this
/**
 * @param {Quest} quest
 * @returns {number} Streak
 */
function getStreakFromFrequencyByMonth(quest) {
    return -1;
}

// TODO: Implement this
/**
 * @param {Quest} quest
 * @returns {number} Streak
 */
function getStreakFromFrequencyByWeek(quest) {
    return -1;
}

export { getStreakFromMonthOrWeek, getStreakFromFrequencyByMonth, getStreakFromFrequencyByWeek };
