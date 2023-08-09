import { TwoDigit } from './Functions';

/**
 * Get absolute UTC time in seconds
 * @param {Date} [date] (now default)
 * @param {'global'|'local'} [UTC] [default: 'global']
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
 * Convert local UTC time in seconds to Date object
 * @param {number|null} [time] in seconds [default: now]
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
 * @param {number} time in seconds
 * @param {'near'|'prev'|'next'} [type] [default: 'near']
 * @returns {number} time rounded to quarters in seconds
 */
function RoundToQuarter(time, type = 'near') {
    let mod = time % 900;
    if (type === 'near' && mod > 450)   mod -= 900;
    else if (type === 'next')           mod -= 900;
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
    const age = delta / (60 * 60 * 24 * 365);
    return Math.floor(age)
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
    const today = GetTime(undefined, 'local');
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