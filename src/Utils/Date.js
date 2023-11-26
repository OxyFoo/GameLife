import langManager from 'Managers/LangManager';

import { GetDate } from './Time';
import { TwoDigit } from './Functions';

/**
 * @typedef {import('Class/Activities').Activity} Activity
 */

const DAYS = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
};

/**
 * Return day number (0-6)
 * @param {Date} date Date object
 * @param {number} [firstDay] First day of week, default: 1 (monday)
 * @returns {number} 0-6
 */
function GetDay(date, firstDay = DAYS.monday) {
    const day = date.getUTCDay();
    return (day + 5 + firstDay) % 7;
}

/**
 * @param {number} month Month number (0-11)
 * @param {number} year Year
 * @param {boolean} forceYear Force year in title
 * @returns {string} Return month title with year if needed (forceYear or different year than current one)
 */
function GetMonthAndYear(month, year, forceYear = false) {
    let title = langManager.curr['dates']['month'][month];
    if (new Date().getFullYear() !== year || forceYear) {
        title += ' ' + year;
    }
    return title;
}

/**
 * @param {Date} date
 * @returns {string} Return date in format "Monday 1 January 2020"
 */
function GetFullDate(date) {
    const _date = new Date(date);
    const months = langManager.curr['dates']['month'];
    const days = langManager.curr['dates']['days'];
    const M = _date.getMonth();
    const D = _date.getDay();
    const DD = _date.getDate();
    const YYYY = _date.getFullYear();
    return days[D] + ' ' + DD + ' ' + months[M] + ' ' + YYYY;
}

/**
 * Return date with format : dd/mm/yyyy
 * @param {Date} date
 * @returns {string} dd/mm/yyyy
 */
function DateToFormatString(date) {
    const dd = TwoDigit(date.getDate());
    const mm = TwoDigit(date.getMonth() + 1);
    const yyyy = date.getFullYear();
    return [ dd, mm, yyyy ].join('/');
}

/**
 * Return date with format : HH:MM
 * @param {Date} date
 * @returns {string} HH:MM
 */
function DateToFormatTimeString(date) {
    const HH = TwoDigit(date.getHours());
    const MM = TwoDigit(date.getMinutes());
    return [ HH, MM ].join(':');
}

/**
 * @param {Array<number>} days Array of week days (0-6)
 * @param {number} start Time in seconds
 * @param {number} end Time in seconds
 * @returns {boolean} Days contained between start and end
 */
function WeekDayBetween(days, start, end) {
    if (end < start) return false;
    let day = GetDay(GetDate(start));
    const endDay = GetDay(GetDate(end));
    while (day !== endDay) {
        if (days.includes(day)) return true;
        day = (day + 1) % 7;
    }
    return false;
}

/**
 * @param {Array<number>} days Array of month days (0-30)
 * @param {number} start Time in seconds
 * @param {number} end Time in seconds
 * @returns {boolean} Days contained between start and end
 */
function MonthDayBetween(days, start, end) {
    if (end < start) return false;
    let day = GetDay(GetDate(start));
    const endDay = GetDay(GetDate(end));
    while (day !== endDay) {
        if (days.includes(day)) return true;
        day = (day + 1) % 31;
    }
    return false;
}

export {
    DAYS, GetDay, GetMonthAndYear, GetFullDate,
    DateToFormatString, DateToFormatTimeString,
    WeekDayBetween, MonthDayBetween
};
