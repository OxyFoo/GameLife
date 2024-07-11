import langManager from 'Managers/LangManager';

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
 * @deprecated Replaced by DateFormat
 */
function DateToFormatString(date) {
    const dd = TwoDigit(date.getDate());
    const mm = TwoDigit(date.getMonth() + 1);
    const yyyy = date.getFullYear();
    return [dd, mm, yyyy].join('/');
}

/**
 * Return local date with format. E.g. DD/MM/YYYY
 * @param {Date} date
 * @param {string} format DD MM YYYY HH mm
 * @returns {string} Formatted date
 */
function DateFormat(date, format = 'DD/MM/YYYY') {
    let output = format;

    if (format.includes('DD')) {
        const DD = TwoDigit(date.getDate());
        output = output.replace('DD', DD);
    }
    if (format.includes('MM')) {
        const MM = TwoDigit(date.getMonth() + 1);
        output = output.replace('MM', MM);
    }
    if (format.includes('YYYY')) {
        const YYYY = date.getFullYear().toString();
        output = output.replace('YYYY', YYYY);
    }
    if (format.includes('HH')) {
        const HH = TwoDigit(date.getHours());
        output = output.replace('HH', HH);
    }
    if (format.includes('mm')) {
        const mm = TwoDigit(date.getMinutes());
        output = output.replace('mm', mm);
    }

    return output;
}

/**
 * Return date with format : HH:MM
 * @param {Date} date
 * @returns {string} HH:MM
 * @deprecated Replaced by DateFormat
 */
function DateToFormatTimeString(date) {
    const HH = TwoDigit(date.getHours());
    const MM = TwoDigit(date.getMinutes());
    return [HH, MM].join(':');
}

export { DAYS, GetDay, GetMonthAndYear, GetFullDate, DateToFormatString, DateToFormatTimeString, DateFormat };
