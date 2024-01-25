import dataManager from 'Managers/DataManager';
import user from 'Managers/UserManager';

import { DAYS } from 'Utils/Date';
import { GetTime } from 'Utils/Time';

/**
 * @typedef {import('Class/Activities').Activity} Activity
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
 * @param {number} [selectedDay=-1] Current day (0-6)
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

    const tmpDate = new Date(year, month, 1);
    const lastDay = (start + 5) % 7;

    while (tmpDate.getMonth() === month) {
        let day;

        /** @type {Array<DayType>} */
        let tempOutput = new Array(7).fill(null);
        do {
            day = (tmpDate.getDay() + 5 + start) % 7;
            const isToday = tmpDate.toDateString() === new Date().toDateString();
            const isSelected = selectedDay === tmpDate.getDate();
            const activities = user.activities.GetByTime(GetTime(tmpDate, 'global'));
            const isActivity = activities.length > 0;
            const isActivityXP = !!activities.find(a => dataManager.skills.GetByID(a.skillID)?.XP ?? 0 > 0);

            tempOutput[day] = {
                day: tmpDate.getDate(),
                isToday: isToday,
                isSelected: isSelected,
                isActivity: isActivity,
                isActivityXP: isActivityXP
            };
            tmpDate.setDate(tmpDate.getDate() + 1);
        } while (tmpDate.getMonth() === month && day !== lastDay);
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
