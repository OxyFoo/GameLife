/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').Activity} Activity
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').ActivitySaved} ActivitySaved
 */

/**
 * @param {Activity} activityA
 * @param {Activity} activityB
 * @returns {boolean}
 */
function ActivitiesAreEquals(activityA, activityB) {
    return activityA.addedTime === activityB.addedTime;
}

/**
 * Local day index of an activity: days since epoch, in the activity's own timezone
 * (rounded like the database column; stable even if the device timezone changes). Same helper on the server side.
 * @param {Pick<Activity, 'startTime' | 'timezone'>} activity
 * @returns {number}
 */
function GetLocalDayIndex(activity) {
    return Math.floor((activity.startTime + Math.round(activity.timezone) * 3600) / (24 * 60 * 60));
}

/**
 * @param {number} time Time in seconds (unix timestamp, UTC)
 * @param {number} duration Duration in minutes
 * @param {Activity[]} activities
 * @param {Activity[]} exceptActivities Activities to exclude from check
 * @returns {boolean} True if time is free
 */
function TimeIsFree(time, duration, activities, exceptActivities = []) {
    let output = true;
    const startTime = time;
    const endTime = time + duration * 60;

    for (let a = 0; a < activities.length; a++) {
        const activity = activities[a];

        let except = false;
        for (let exceptActivity of exceptActivities) {
            if (ActivitiesAreEquals(activity, exceptActivity)) {
                except = true;
                break;
            }
        }
        if (except) continue;

        const compareStartTime = activity.startTime;
        const compareEndTime = activity.startTime + activity.duration * 60;

        const startDuringActivity = startTime >= compareStartTime && startTime < compareEndTime;
        const endDuringActivity = endTime > compareStartTime && endTime <= compareEndTime;
        const aroundActivity = startTime <= compareStartTime && endTime >= compareEndTime;

        if (startDuringActivity || endDuringActivity || aroundActivity) {
            output = false;
            break;
        }
    }
    return output;
}

/**
 * @param {(Activity | ActivitySaved)[]} arr
 * @param {Activity | ActivitySaved} activity
 * @returns {number | null} Index of activity or null if not found
 */
function GetActivityIndex(arr, activity) {
    for (let i = 0; i < arr.length; i++) {
        const equals = ActivitiesAreEquals(arr[i], activity);
        if (equals) return i;
    }
    return null;
}

/**
 * Get the timestamp of the Monday at 00:00:00 UTC for a given timestamp
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {number} - Timestamp of Monday 00:00:00 UTC
 */
function GetMondayTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    const dayOfWeek = date.getUTCDay(); // 0 = Sunday, 1 = Monday, ...
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(date);
    monday.setUTCDate(date.getUTCDate() - daysSinceMonday);
    monday.setUTCHours(0, 0, 0, 0);
    return Math.floor(monday.getTime() / 1000);
}

/**
 * Get the timestamp of the first day of the month at 00:00:00 UTC for a given timestamp
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {number} - Timestamp of 1st of month 00:00:00 UTC
 */
function GetMonthStartTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    const firstOfMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));
    return Math.floor(firstOfMonth.getTime() / 1000);
}

/**
 * Get the timestamp of the first day of the year at 00:00:00 UTC for a given timestamp
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {number} - Timestamp of 1st of year 00:00:00 UTC
 */
function GetYearStartTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    const firstOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
    return Math.floor(firstOfYear.getTime() / 1000);
}

export {
    ActivitiesAreEquals,
    GetLocalDayIndex,
    TimeIsFree,
    GetActivityIndex,
    GetMondayTimestamp,
    GetMonthStartTimestamp,
    GetYearStartTimestamp
};
