import langManager from "../Managers/LangManager";
import { IsUndefined } from "./Functions";

const DAYS = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
}

/**
 * Return two dimensionnal array, wich contains week, wich contain number of date (0 if null)
 * @param {Number} month
 * @param {Number} year
 * @returns {Number[][]}
 */
function GetBlockMonth(month, year, start = DAYS.monday) {
    if (IsUndefined(month)) month = new Date().getMonth();
    if (IsUndefined(year)) year = new Date().getFullYear();

    const date = new Date(year, month, 1);
    let output = [];

    const lastDay = (start + 5) % 7;
    while (date.getMonth() === month) {
        let day, tempOutput = new Array(7).fill(0);
        do {
            day = (date.getDay() + 5 + start) % 7;
            tempOutput[day] = date.getDate();
            date.setDate(date.getDate() + 1);
        } while (date.getMonth() === month && day !== lastDay);
        output.push(tempOutput);
    }
    return output;
}

/**
 * @param {Number} month - Month number (0-11)
 * @param {Number} year - Year
 * @param {Boolean} forceYear - Force year in title
 * @returns {String} Return month title with year if needed (forceYear or different year than current one)
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
 * @returns {String} Return date in format "Monday 1 January 2020"
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
 * @param {Date|Number} date or time in ms
 * @returns {String} dd/mm/yyyy
 */
function DateToFormatString(date) {
    const _date = new Date(date);
    const dd = TwoDigit(_date.getDate());
    const mm = TwoDigit(_date.getMonth() + 1);
    const yyyy = _date.getFullYear();
    return [ dd, mm, yyyy ].join('/');
}

/**
 * Return date with format : HH:MM
 * @param {Date} date
 * @returns {String} HH:MM
 */
function DateToFormatTimeString(date) {
    const _date = new Date(date);
    const HH = TwoDigit(_date.getHours());
    const MM = TwoDigit(_date.getMinutes());
    return [ HH, MM ].join(':');
}

export { DAYS, GetBlockMonth, GetMonthAndYear, GetFullDate,
    DateToFormatString, DateToFormatTimeString };