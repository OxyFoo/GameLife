/**
 * @typedef {import('Types/Data/User/Activities').Activity} Activity
 */

/**
 * @param {Activity} activityA
 * @param {Activity} activityB
 * @returns {boolean}
 */
function ActivitiesAreEquals(activityA, activityB) {
    const sameSkillID = activityA.skillID === activityB.skillID;
    const sameStartTime = activityA.startTime === activityB.startTime;
    const sameDuration = activityA.duration === activityB.duration;
    return sameSkillID && sameStartTime && sameDuration;
}

/**
 * @param {number} time Time in seconds (unix timestamp, UTC)
 * @param {number} duration Duration in minutes
 * @param {Array<Activity>} activities
 * @param {Array<Activity>} exceptActivities Activities to exclude from check
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
 * @param {Array<Activity>} arr
 * @param {Activity} activity
 * @returns {number | null} Index of activity or null if not found
 */
function GetActivityIndex(arr, activity) {
    for (let i = 0; i < arr.length; i++) {
        const equals = ActivitiesAreEquals(arr[i], activity);
        if (equals) return i;
    }
    return null;
}

export { ActivitiesAreEquals, TimeIsFree, GetActivityIndex };
