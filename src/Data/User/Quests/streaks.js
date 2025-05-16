import { DAY_TIME, GetDate, GetLocalTime, GetTimeZone } from 'Utils/Time';
import { getStartOfMonth, getStartOfWeek } from './utils';

/**
 * @typedef {import('Data/User/Activities').Activity} Activity
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Quests').Quest} Quest
 */

/**
 * @param {Activity[]} activities
 * @param {Quest} quest
 * @returns {number} Streak
 */
function getStreakFromMonthOrWeek(activities, quest) {
    if (activities.length === 0) {
        return 0;
    }

    let streak = 0;
    const timeNow = GetLocalTime();
    const todayMidnight = timeNow - (timeNow % DAY_TIME) - GetTimeZone() * 60 * 60;

    const allActivitiesTime = activities.map((activity) => ({
        localStart: activity.startTime + activity.timezone * 60 * 60,
        duration: activity.duration
    }));

    let n = allActivitiesTime.length;
    let currDuration = 0;
    let lastMidnight = todayMidnight;

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

/**
 * @param {Activity[]} activities
 * @param {Quest} quest
 * @returns {number} Streak
 */
function getStreakFromFrequencyByMonth(activities, quest) {
    if (quest.schedule.type !== 'frequency') {
        return -1;
    }
    if (quest.schedule.frequencyMode !== 'month') {
        return -1;
    }

    let streak = 0;

    const { quantity, duration } = quest.schedule;
    const startOfMonth = getStartOfMonth(quest.created);

    let streakThisMonth = 0;
    let currentMonth = startOfMonth;
    let currentDuration = 0;
    for (let i = activities.length - 1; i >= 0; i--) {
        const activity = activities[i];

        // Activity is in future
        if (activity.startTime > currentMonth + 30 * DAY_TIME) {
            continue;
        }

        // Current month is over
        if (activity.startTime < currentMonth) {
            // Skip first month, because it is not complete
            if (currentMonth === startOfMonth) {
                currentMonth -= 30 * DAY_TIME;
                continue;
            }
            break;
        }

        // Fill the current month
        if (currentDuration < duration) {
            currentDuration += activity.duration;
        }

        // Check if the month is complete
        if (currentDuration >= duration) {
            streakThisMonth++;
            currentDuration = 0;

            // Check if the streak is complete
            if (streakThisMonth >= quantity) {
                streak++;
                streakThisMonth = 0;
                currentMonth -= 30 * DAY_TIME;
            }
        }
    }

    return streak;
}

/**
 * @param {Activity[]} activities
 * @param {Quest} quest
 * @returns {number} Streak
 */
function getStreakFromFrequencyByWeek(activities, quest) {
    if (quest.schedule.type !== 'frequency') {
        return -1;
    }
    if (quest.schedule.frequencyMode !== 'week') {
        return -1;
    }

    let streak = 0;

    const { quantity, duration } = quest.schedule;
    const startOfWeek = getStartOfWeek(quest.created);

    let streakThisWeek = 0;
    let currentWeek = startOfWeek;
    let currentDuration = 0;
    for (let i = activities.length - 1; i >= 0; i--) {
        const activity = activities[i];

        // Activity is in future
        if (activity.startTime > currentWeek + 7 * DAY_TIME) {
            continue;
        }

        // Current week is over
        if (activity.startTime < currentWeek) {
            // Skip first week, because it is not complete
            if (currentWeek === startOfWeek) {
                currentWeek -= 7 * DAY_TIME;
                continue;
            }
            break;
        }

        // Fill the current week
        if (currentDuration < duration) {
            currentDuration += activity.duration;
        }

        // Check if the week is complete
        if (currentDuration >= duration) {
            streakThisWeek++;
            currentDuration = 0;

            // Check if the streak is complete
            if (streakThisWeek >= quantity) {
                streak++;
                streakThisWeek = 0;
                currentWeek -= 7 * DAY_TIME;
            }
        }
    }

    return streak;
}

export { getStreakFromMonthOrWeek, getStreakFromFrequencyByMonth, getStreakFromFrequencyByWeek };
