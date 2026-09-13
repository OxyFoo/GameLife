import { GetLocalDayIndex } from '@oxyfoo/gamelife-types/Rules/Time';
import { DAY_TIME, GetLocalTime, GetTimeZone } from 'Utils/Time';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').Activity} Activity
 *
 * @typedef {object} SkillStreaks
 * @property {number} current Consecutive active days ending today (or yesterday when today is not done yet)
 * @property {number} best Longest run of consecutive active days ever
 *
 * @typedef {object} SkillRate
 * @property {number} activeDays Days with at least one activity inside the window
 * @property {number} totalDays Days inside the window (0 without any activity and without fixed window)
 * @property {number} rate activeDays / totalDays in [0-1] (0 when totalDays is 0)
 *
 * @typedef {object} SkillFrequency
 * @property {number} todayIndex Local day index of today
 * @property {number | null} firstDayIndex Local day index of the first non-future activity, null if none
 * @property {number} currentStreak
 * @property {number} bestStreak
 * @property {number} activeDays
 * @property {number} totalDays
 * @property {number} rate
 * @property {Map<number, number>} dailyMinutes Minutes per local day index (future days excluded)
 *
 * @typedef {object} HistogramDay
 * @property {number} dayIndex
 * @property {number} minutes
 * @property {number} day Day of month (1-31)
 * @property {number} month Month (0-11)
 * @property {number} year
 * @property {boolean} showMonth True on the first day of a month and on the oldest loaded day
 */

/** Default window of the rate, in days (today included) */
const RATE_WINDOW_DAYS = 30;

/** "Nice" maximums of the histogram scale, in minutes */
const NICE_MAX_STEPS_MINUTES = [30, 60, 120, 240, 360, 480, 720];
const NICE_MAX_FALLBACK_STEP_MINUTES = 240;

/**
 * Local day index of today on the device timezone (same rule as GetLocalDayIndex for an activity added now)
 * @returns {number}
 */
function GetTodayLocalDayIndex() {
    return GetLocalDayIndex({ startTime: GetLocalTime(), timezone: GetTimeZone() });
}

/**
 * Local day indexes with at least one activity, future days excluded
 * @param {Activity[]} activities
 * @param {number} todayIndex
 * @returns {Set<number>}
 */
function GetSkillDayIndexes(activities, todayIndex) {
    /** @type {Set<number>} */
    const dayIndexes = new Set();
    for (const activity of activities) {
        const day = GetLocalDayIndex(activity);
        if (day <= todayIndex) {
            dayIndexes.add(day);
        }
    }
    return dayIndexes;
}

/**
 * @param {Set<number>} dayIndexes
 * @param {number} todayIndex
 * @returns {number | null} Oldest day index (today at most), null if there is none
 */
function GetFirstDayIndex(dayIndexes, todayIndex) {
    /** @type {number | null} */
    let first = null;
    for (const day of dayIndexes) {
        if (day <= todayIndex && (first === null || day < first)) {
            first = day;
        }
    }
    return first;
}

/**
 * Current streak: consecutive active days ending today, or yesterday when today is not done yet
 * (today never breaks the streak). Best streak: longest run of consecutive active days.
 * @param {Set<number>} dayIndexes
 * @param {number} todayIndex
 * @returns {SkillStreaks}
 */
function ComputeStreaks(dayIndexes, todayIndex) {
    let current = 0;
    let day = dayIndexes.has(todayIndex) ? todayIndex : todayIndex - 1;
    while (dayIndexes.has(day)) {
        current++;
        day--;
    }

    const sorted = [...dayIndexes].filter((d) => d <= todayIndex).sort((a, b) => a - b);
    let best = 0;
    let run = 0;
    for (let i = 0; i < sorted.length; i++) {
        run = i > 0 && sorted[i] === sorted[i - 1] + 1 ? run + 1 : 1;
        if (run > best) {
            best = run;
        }
    }

    return { current, best };
}

/**
 * Share of active days inside a window ending today
 * @param {Set<number>} dayIndexes
 * @param {number} todayIndex
 * @param {number | null} windowDays Window length in days (today included), null = since the first active day
 * @returns {SkillRate}
 */
function ComputeRate(dayIndexes, todayIndex, windowDays) {
    const startDay = windowDays !== null ? todayIndex - windowDays + 1 : GetFirstDayIndex(dayIndexes, todayIndex);
    if (startDay === null) {
        return { activeDays: 0, totalDays: 0, rate: 0 };
    }

    const totalDays = todayIndex - startDay + 1;
    let activeDays = 0;
    for (const day of dayIndexes) {
        if (day >= startDay && day <= todayIndex) {
            activeDays++;
        }
    }

    return { activeDays, totalDays, rate: totalDays > 0 ? activeDays / totalDays : 0 };
}

/**
 * Minutes of activity per local day index, future days excluded
 * @param {Activity[]} activities
 * @param {number} todayIndex
 * @returns {Map<number, number>}
 */
function ComputeDailyMinutes(activities, todayIndex) {
    /** @type {Map<number, number>} */
    const dailyMinutes = new Map();
    for (const activity of activities) {
        const day = GetLocalDayIndex(activity);
        if (day > todayIndex) {
            continue;
        }
        dailyMinutes.set(day, (dailyMinutes.get(day) ?? 0) + activity.duration);
    }
    return dailyMinutes;
}

/**
 * Round a maximum (in minutes) up to a "nice" scale value
 * @param {number} maxMinutes
 * @returns {number}
 */
function GetNiceMaxMinutes(maxMinutes) {
    const step = NICE_MAX_STEPS_MINUTES.find((value) => value >= maxMinutes);
    if (typeof step !== 'undefined') {
        return step;
    }
    return Math.ceil(maxMinutes / NICE_MAX_FALLBACK_STEP_MINUTES) * NICE_MAX_FALLBACK_STEP_MINUTES;
}

/**
 * Calendar date of a local day index (a local day index is a calendar date, hence the UTC getters)
 * @param {number} dayIndex
 * @returns {{ day: number, month: number, year: number }}
 */
function DayIndexToDate(dayIndex) {
    const date = new Date(dayIndex * DAY_TIME * 1000);
    return { day: date.getUTCDate(), month: date.getUTCMonth(), year: date.getUTCFullYear() };
}

/**
 * Days of the histogram, from the oldest to the newest (both included)
 * @param {Map<number, number>} dailyMinutes
 * @param {number} oldestDayIndex
 * @param {number} newestDayIndex
 * @returns {HistogramDay[]}
 */
function GetHistogramDays(dailyMinutes, oldestDayIndex, newestDayIndex) {
    /** @type {HistogramDay[]} */
    const days = [];
    for (let dayIndex = oldestDayIndex; dayIndex <= newestDayIndex; dayIndex++) {
        const { day, month, year } = DayIndexToDate(dayIndex);
        days.push({
            dayIndex,
            minutes: dailyMinutes.get(dayIndex) ?? 0,
            day,
            month,
            year,
            showMonth: day === 1 || dayIndex === oldestDayIndex
        });
    }
    return days;
}

/**
 * Frequency of a skill from its activities: streaks, rate and minutes per day. Nothing is persisted.
 * @param {Activity[]} activities Activities of the skill
 * @param {number} todayIndex
 * @param {number | null} windowDays Rate window in days (today included), null = since the first activity
 * @returns {SkillFrequency}
 */
function ComputeSkillFrequency(activities, todayIndex, windowDays) {
    const dayIndexes = GetSkillDayIndexes(activities, todayIndex);
    const { current, best } = ComputeStreaks(dayIndexes, todayIndex);
    const { activeDays, totalDays, rate } = ComputeRate(dayIndexes, todayIndex, windowDays);

    return {
        todayIndex,
        firstDayIndex: GetFirstDayIndex(dayIndexes, todayIndex),
        currentStreak: current,
        bestStreak: best,
        activeDays,
        totalDays,
        rate,
        dailyMinutes: ComputeDailyMinutes(activities, todayIndex)
    };
}

export {
    RATE_WINDOW_DAYS,
    GetTodayLocalDayIndex,
    GetSkillDayIndexes,
    GetFirstDayIndex,
    ComputeStreaks,
    ComputeRate,
    ComputeDailyMinutes,
    GetNiceMaxMinutes,
    DayIndexToDate,
    GetHistogramDays,
    ComputeSkillFrequency
};
