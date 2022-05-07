import { TwoDigit } from "./Functions";

/**
 * Get absolute time in seconds
 * @param {Date} date (now default)
 * @returns {Number} time in seconds
 */
function GetTime(date = new Date()) {
    // Convert to UTC
    const utc = date.getTime() - (date.getTimezoneOffset() * 60 * 1000);
    return Math.floor(utc / 1000);
}

/**
 * Return date with format : HH:MM
 * @param {Number} time
 * @param {Boolean} withOffset
 * @returns {String} HH:MM
 */
function TimeToFormatString(time, withOffset = false) {
    const offset = withOffset ? new Date().getTimezoneOffset() : 0;
    const minutesInDay = (time - offset) % 1440;
    const HH = Math.floor(minutesInDay / 60);
    const MM = Math.floor(minutesInDay - HH * 60);
    return [ HH, MM ].map(TwoDigit).join(':');
}

/**
 * @param {Number} time in seconds
 * @returns {Number} time rounded to quarters in seconds
 */
function RoundToQuarter(time) {
    const date = new Date(time * 1000);
    date.setMinutes(Math.round(date.getMinutes() / 15) * 15, 0, 0);
    return GetTime(date);
}

/**
 * @param {Number} time in seconds 
 * @returns {Number} Time in seconds
 */
function GetMidnightTime(time) {
    time -= time % (24 * 60 * 60);
    return time;
}

/**
 * @param {Number} time in seconds
 * @returns {Number} Return age in years
 */
function GetAge(time) {
    if (time === null) return null;
    const birthDay = new Date(time * 1000);
    const today = new Date().getTime();
    return new Date(today - birthDay).getUTCFullYear() - 1970;
}

/**
 * 
 * @param {Number} max_hour
 * @param {Number} step_minutes
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
 * 
 * @returns {String} Time (format: HH:MM) until tomorrow midnight
 */
function GetTimeToTomorrow() {
    const today = new Date();
    const delta = 24 - (today.getHours() + today.getMinutes()/60);
    const HH = TwoDigit(parseInt(delta));
    const MM = TwoDigit(parseInt((delta - parseInt(delta)) * 60));
    return HH + ':' + MM;
}

/**
 * @param {Number} time in seconds
 * @returns {Number?} time rounded to hours in days until now
 */
function GetDaysUntil(time) {
    if (time === null) return null;
    const today = GetTime();
    const _date = GetTime(new Date(time * 1000));
    const delta = today - _date;
    const days = delta / (60 * 60 * 24);
    return days;
}

export { GetTime, TimeToFormatString, RoundToQuarter, GetMidnightTime, GetAge,
    GetDurations, GetTimeToTomorrow, GetDaysUntil };