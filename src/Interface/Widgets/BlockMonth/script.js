import dataManager from 'Managers/DataManager';
import user from 'Managers/UserManager';

import { DAYS } from 'Utils/Date';
import { DAY_TIME, GetGlobalTime, GetMidnightTime, GetTimeZone } from 'Utils/Time';

/**
 * @typedef {import('Data/User/Activities/index').Activity} Activity
 */

/**
 * Represents a day in a calendar or activity tracker with various state flags.
 * @typedef {Object} DayType
 * @property {number} day - The numerical day of the month (1-31).
 * @property {boolean} isToday - Indicates whether this day represents the current date.
 * @property {boolean} isSelected - Indicates whether this day is currently selected by the user.
 * @property {boolean} isActivity - Indicates whether there is activity recorded for this day.
 * @property {boolean} isActivityXP - Indicates whether there is activity with experience points for this day.
 */

/**
 * @typedef {Object} MonthType
 * @property {number} month - The numerical month (0-11).
 * @property {number} year - The year (e.g., 2023).
 * @property {Array<Array<DayType | null>>} data - A two-dimensional array representing weeks and days.
 */

/**
 * @description Return two dimensionnal array, wich contains week, wich contain number of date (0 if null)
 * @param {number | null} month Current month if null
 * @param {number | null} year Current year if null
 * @param {number} [start=1] First day of week, default: 1 (monday)
 * @param {number} [selectedDay=-1] Current selected day (1-31)
 * @returns {MonthType}
 */
function GetBlockMonth(month, year, start = DAYS.monday, selectedDay = -1) {
    if (month === null || year === null) {
        const now = new Date();
        if (month === null) month = now.getMonth();
        if (year === null) year = now.getFullYear();
    }

    /** @type {MonthType} */
    let output = {
        month: month,
        year: year,
        data: []
    };

    const timezone = GetTimeZone() * 60 * 60;
    const todayTime = GetMidnightTime(GetGlobalTime()) + timezone;
    const firstDay = new Date(year, month, 1);
    const firstDayTime = GetGlobalTime(firstDay);
    const firstDayIndex = (firstDay.getDay() + 5 + start) % 7;
    const lastDay = new Date(year, month + 1, 1);
    const lastDayTime = GetGlobalTime(lastDay);
    const weekCount = Math.ceil((lastDayTime - firstDayTime) / (DAY_TIME * 7));

    const allActivities = user.activities.Get();

    let tmpTime = firstDayTime;
    let tmpDay = 1;
    let tmpDayIndex = firstDayIndex;
    let tmpActivityIndex = 0;

    for (let w = 0; w < weekCount || tmpTime < lastDayTime; w++) {
        let tempOutput = new Array(7).fill(null);
        for (let i = 0; i < 7; i++) {
            if (w === 0 && i < firstDayIndex) {
                continue;
            }
            if (tmpTime >= lastDayTime) {
                break;
            }

            const isToday = tmpTime >= todayTime && tmpTime < todayTime + DAY_TIME;
            const isSelected = tmpDay === selectedDay;
            let isActivity = false;
            let isActivityXP = false;

            while (
                tmpActivityIndex < allActivities.length &&
                allActivities[tmpActivityIndex].startTime + timezone < tmpTime
            ) {
                tmpActivityIndex++;
            }

            while (
                tmpActivityIndex < allActivities.length &&
                allActivities[tmpActivityIndex].startTime + timezone < tmpTime + DAY_TIME
            ) {
                isActivity = true;
                const skill = dataManager.skills.GetByID(allActivities[tmpActivityIndex].skillID);
                if ((skill?.XP ?? 0) > 0) {
                    isActivityXP = true;
                    break;
                }
                tmpActivityIndex++;
            }

            tempOutput[i] = {
                day: tmpDay,
                isToday: isToday,
                isSelected: isSelected,
                isActivity: isActivity,
                isActivityXP: isActivityXP
            };

            tmpDay++;
            tmpDayIndex = (tmpDayIndex + 1) % 7;
            tmpTime += DAY_TIME;
        }
        output.data.push(tempOutput);
    }

    return output;
}

/**
 * @param {MonthType} month
 * @returns {boolean}
 */
function DidUpdateBlockMonth(month) {
    const currMonth = GetBlockMonth(month.month, month.year);
    return currMonth.data.some((week, w) =>
        week.some((day, d) => {
            return (
                day?.isToday !== month.data[w][d]?.isToday ||
                day?.isSelected !== month.data[w][d]?.isSelected ||
                day?.isActivity !== month.data[w][d]?.isActivity ||
                day?.isActivityXP !== month.data[w][d]?.isActivityXP
            );
        })
    );
}

export { GetBlockMonth, DidUpdateBlockMonth };
