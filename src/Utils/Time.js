import { TwoDigit } from './Functions';

/**
 * Get absolute UTC time in seconds
 * @param {Date} [date] (now default)
 * @param {boolean} [localUTC=false] (global default)
 * @returns {number} time in seconds
 */
function GetTime(date = new Date(), localUTC = false) {
    let time = Math.floor(date.getTime() / 1000);
    if (localUTC) {
        time -= date.getTimezoneOffset() * 60;
    }
    return time;
}

/**
 * Get date from time to Date object
 * @param {number} time in seconds
 * @param {boolean} [localUTC=false] (global default)
 * @returns {Date} Date object in local UTC
 */
function GetDate(time = GetTime(), localUTC = false) {
    const date = new Date(time * 1000);
    if (localUTC) {
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    }
    return date;
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
 * @param {number} time in seconds
 * @returns {number} time rounded to quarters in seconds
 */
function RoundToQuarter(time) {
    let mod = time % 900;
    if (mod > 450) mod += 900;
    return time - mod;
}

/**
 * @param {number} time in seconds 
 * @returns {number} Time in seconds
 */
function GetMidnightTime(time) {
    time -= time % (24 * 60 * 60);
    return time;
}

/**
 * Get age in years from date of birth
 * @param {number} time in seconds
 * @returns {number}
 */
function GetAge(time) {
    const birthDay = GetDate(time);
    const today = new Date().getTime();
    return new Date(today - birthDay).getUTCFullYear() - 1970;
}

/**
 * 
 * @param {number} max_hour
 * @param {number} step_minutes
 * @returns {Array<{key: 0, value: '00:00', duration: 0}>} Array of dict : { key: k, value: HH:MM, duration: minutes } over a period of max_hour each step_minutes
 */
function GetDurations(max_hour = 4, step_minutes = 15) {
    let durations = [];

    let date = new Date();
    date.setHours(0, step_minutes, 0, 0);
    const count = max_hour * (60 / step_minutes);
    for (let i = 0; i < count; i++) {
        const textDuration = TwoDigit(date.getHours()) + ':' + TwoDigit(date.getMinutes());
        const totalDuration = date.getHours() * 60 + date.getMinutes();
        const newDuration = { key: durations.length, value: textDuration, duration: totalDuration };
        durations.push(newDuration);
        date.setMinutes(date.getMinutes() + step_minutes);
    }

    return durations;
}

/**
 * Time until tomorrow midnight
 * @returns {string} HH:MM
 */
function GetTimeToTomorrow() {
    const today = GetTime(undefined, true);
    const delta = (24 * 60 * 60) - today % (24 * 60 * 60);
    return TimeToFormatString(delta);
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

function GetTimeZone() {
    return - (new Date()).getTimezoneOffset() / 60;
}

export { GetTime, GetDate, TimeToFormatString,
    RoundToQuarter, GetMidnightTime, GetAge,
    GetDurations, GetTimeToTomorrow, GetDaysUntil,
    GetTimeZone
};