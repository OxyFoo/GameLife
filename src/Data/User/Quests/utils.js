/**
 * @param {number} timestamp
 * @returns {number} Timestamp of the start of the week (Monday 00:00 UTC) for the given timestamp.
 */
function getStartOfWeek(timestamp) {
    const monday = new Date(timestamp * 1000);
    monday.setUTCDate(monday.getUTCDate() - monday.getUTCDay() + 1);
    monday.setUTCHours(0, 0, 0, 0);
    return Math.floor(monday.getTime() / 1000);
}

/**
 * @param {number} timestamp
 * @returns {number} Timestamp of the start of the month (1st day 00:00 UTC) for the given timestamp.
 */
function getStartOfMonth(timestamp) {
    const d = new Date(timestamp * 1000);
    d.setUTCDate(1);
    d.setUTCHours(0, 0, 0, 0);
    return Math.floor(d.getTime() / 1000);
}

export { getStartOfWeek, getStartOfMonth };
