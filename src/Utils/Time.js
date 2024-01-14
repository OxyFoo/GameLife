import { TwoDigit } from './Functions';

const DAY_TIME = 24 * 60 * 60;

/**
 * Get absolute UTC time in seconds
 * @param {Date} [date] (now default)
 * @param {'global' | 'local'} [UTC] [default: 'global']
 * @returns {number} time in seconds
 */
function GetTime(date = new Date(), UTC = 'global') {
    if (UTC === 'local') {
        return Math.floor(date.getTime() / 1000);
    }

    // Global UTC
    const offset = date.getTimezoneOffset() * 60;
    return Math.floor(date.getTime() / 1000) - offset;
}

/**
 * Get year (01/01/XX 00:00) from time in seconds
 * @param {number} [time] in seconds [default: now, local UTC]
 * @returns {number} year in seconds
 */
function GetYearTime(time = GetTime(undefined, 'local')) {
    const startYear = new Date(time * 1000).getFullYear();
    return GetTime(new Date(startYear, 0, 1), 'local');
}

/**
 * Convert local UTC time in seconds to Date object
 * @param {number | null} [time] in seconds [default: now]
 * @returns {Date} Date object in local UTC
 */
function GetDate(time = null) {
    if (time === null)
        time = GetTime(undefined, 'local');
    return new Date(time * 1000);
}

/**
 * Return time to format: HH:MM
 * @param {number} time in seconds
 * @returns {string} HH:MM
 */
function TimeToFormatString(time) {
    const minutesInDay = Math.floor(time / 60) % (24 * 60);
    const HH = Math.floor(minutesInDay / 60);
    const MM = Math.floor(minutesInDay - HH * 60);
    return [ HH, MM ].map(TwoDigit).join(':');
}

/**
 * @param {number} step in minutes (e.g. 15 for round to 15 minutes)
 * @param {number} time in seconds
 * @param {'near' | 'prev' | 'next'} [type] [default: 'near']
 * @returns {number} time rounded to quarters in seconds
 */
function RoundTimeTo(step, time, type = 'near') {
    const stepSeconds = step * 60;
    let mod = time % stepSeconds;
    if (type === 'near' && mod > 450)   mod -= stepSeconds;
    else if (type === 'next')           mod -= stepSeconds;
    return time - mod;
}

/**
 * @param {number} time in seconds of midnight time (local UTC)
 * @returns {number} Time in seconds
 */
function GetMidnightTime(time) {
    time -= time % (24 * 60 * 60);
    return time - (GetTimeZone() * 60 * 60);
}

/**
 * Get age in years from date of birth
 * @param {number} time in seconds (global UTC)
 * @returns {number}
 */
function GetAge(time) {
    const today = GetTime();
    const delta = today - time - (GetTimeZone() * 60 * 60);
    const age = delta / (60 * 60 * 24 * 365.25);
    return Math.floor(age)
}

/**
 * Time until tomorrow midnight
 * @param {number} [now] in seconds
 * @returns {number} time in seconds
 */
function GetTimeToTomorrow(now = GetTime()) {
    return (24 * 60 * 60) - now % (24 * 60 * 60);
}

/**
 * @param {number} time in seconds
 * @returns {number?} time rounded to hours in days until now
 */
function GetDaysUntil(time) {
    const today = GetTime();
    const delta = today - time;
    const days = delta / (60 * 60 * 24);
    return days;
}

/** @returns {number} Timezone in hours */
function GetTimeZone() {
    return - (new Date()).getTimezoneOffset() / 60;
}

/**
 * @param {number} year
 * @returns {number} Days count in year
 */
function GetDaysCountInYear(year) {
    let days = 365;
    if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))
        days++;
    return days;
}

export {
    DAY_TIME,
    GetTime, GetYearTime, GetDate, TimeToFormatString, RoundTimeTo,
    GetMidnightTime, GetAge, GetTimeToTomorrow, GetDaysUntil, GetTimeZone,
    GetDaysCountInYear
};
