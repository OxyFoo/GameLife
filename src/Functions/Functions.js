function twoDigit(n) {
    return ('00' + n).slice(-2);
}

function sum(arr) {
    return arr.reduce((partial_sum, a) => partial_sum + parseInt(a), 0);
}

function isUndefined(el) {
    return typeof(el) === 'undefined';
}

/**
 * 
 * @param {Number} days_number
 * @param {Number} step_minutes
 * @returns {Array} Array of dict : { key: k, value: dd HH:MM, fulldate: date } over a period of days_number each step_minutes
 */
function getDates(days_number = 2, step_minutes = 15) {
    let dates = [];

    let date = new Date();
    date.setMinutes(parseInt(date.getMinutes()/step_minutes)*step_minutes, 0, 0);
    for (let i = 0; i < (60 / step_minutes) * 24 * days_number; i++) {
        const HH = twoDigit(date.getHours());
        const MM = twoDigit(date.getMinutes());
        const newDate = date.getDate() + ' ' + HH + ':' + MM;
        const newDict = { key: dates.length, value: newDate, fulldate: date.toString() };
        dates.push(newDict);
        date.setMinutes(date.getMinutes() - step_minutes);
    }

    return dates;
}

/**
 * 
 * @param {Number} max_hour
 * @param {Number} step_minutes
 * @returns {Array} Array of dict : { key: k, value: HH:MM, duration: minutes } over a period of max_hour each step_minutes
 */
function getDurations(max_hour = 4, step_minutes = 15) {
    let durations = [];

    let date = new Date();
    date.setHours(0, step_minutes, 0, 0);
    const count = max_hour * (60 / step_minutes);
    for (let i = 0; i < count; i++) {
        const textDuration = twoDigit(date.getHours()) + ':' + twoDigit(date.getMinutes());
        const totalDuration = date.getHours() * 60 + date.getMinutes();
        const newDuration = { key: durations.length, value: textDuration, duration: totalDuration };
        durations.push(newDuration);
        date.setMinutes(date.getMinutes() + step_minutes);
    }

    return durations;
}

/**
 * Return date with format : dd/mm/yyyy
 * @param {Date} date
 * @returns {String} dd/mm/yyyy
 */
function dateToFormatString(date) {
    const _date = new Date(date);
    const dd = twoDigit(_date.getDate());
    const mm = twoDigit(_date.getMonth() + 1);
    const yyyy = _date.getFullYear();
    return [ dd, mm, yyyy ].join('/');
}

function range(length) {
    return Array.from({ length: length+1 }, (_, i) => i);
}

function GetTimeToTomorrow() {
    const today = new Date();
    const delta = 24 - (today.getHours() + today.getMinutes()/60);
    const HH = twoDigit(parseInt(delta));
    const MM = twoDigit(parseInt((delta - parseInt(delta)) * 60));
    return HH + ':' + MM;
}

export { twoDigit, sum, range,
    getDates, getDurations,
    isUndefined, dateToFormatString,
    GetTimeToTomorrow };