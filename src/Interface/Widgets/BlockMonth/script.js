import dataManager from 'Managers/DataManager';
import user from 'Managers/UserManager';

import { DAYS } from 'Utils/Date';
import { DAY_TIME, GetGlobalTime, GetMidnightTime, GetTimeZone } from 'Utils/Time';

/**
 * @typedef {import('Data/User/Activities/index').Activity} Activity
 */

class DayType {
    /** @type {number} */   day;
    /** @type {boolean} */  isToday;
    /** @type {boolean} */  isSelected;
    /** @type {boolean} */  isActivity;
    /** @type {boolean} */  isActivityXP;
}

class MonthType {
    /** @type {number} */
    month;
    /** @type {number} */
    year;
    /** @type {Array<Array<DayType | null>>} */
    data = []
}

/**
 * @description Return two dimensionnal array, wich contains week, wich contain number of date (0 if null)
 * @param {number | null} [month=null] Current month if null
 * @param {number | null} [year=null] Current year if null
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

            while (tmpActivityIndex < allActivities.length && allActivities[tmpActivityIndex].startTime + timezone < tmpTime) {
                tmpActivityIndex++;
            }

            while (tmpActivityIndex < allActivities.length && allActivities[tmpActivityIndex].startTime + timezone < tmpTime + DAY_TIME) {
                isActivity = true;
                const skill = dataManager.skills.GetByID(allActivities[tmpActivityIndex].skillID);
                if (skill?.XP ?? 0 > 0) {
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
    return currMonth.data.some((week, w) => week.some((day, d) => {
        return day?.isToday !== month.data[w][d]?.isToday ||
            day?.isSelected !== month.data[w][d]?.isSelected ||
            day?.isActivity !== month.data[w][d]?.isActivity ||
            day?.isActivityXP !== month.data[w][d]?.isActivityXP;
    }));
}

export {
    MonthType, DayType,
    GetBlockMonth, DidUpdateBlockMonth
};
