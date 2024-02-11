import langManager from 'Managers/LangManager';

import { MinMax } from 'Utils/Functions';
import { GetTime, GetTimeZone } from 'Utils/Time';

/**
 * @typedef {import('Class/Activities').Activity} Activity
 */

/**
 * @param {Array<{skillID: number, startTime: string, duration: number}>} activities
 * @returns {Array<Activity>}
 */
function CheckZapGPTActivities(activities) {
    const lang = langManager.curr['activity'];
    const activityKeys = [ 'skillID', 'startTime', 'duration' ];

    return activities.map(activity => {
        const keys = Object.keys(activity);
        if (!keys.every(key => activityKeys.includes(key))) {
            return null;
        }

        const { skillID, startTime, duration } = activity;

        // Convert date to unix timestamp (UTC)
        const parts = startTime.split(/\/|-|:/);
        const year = parseInt(parts[2]) + 2000;
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[0]);
        const hour = parseInt(parts[3]);
        const minute = parseInt(parts[4]);
        const startDate = new Date(year, month, day, hour, minute);
        const realStartTime = GetTime(startDate, 'local');

        /** @type {Activity} */
        const newActivity = {
            skillID,
            duration: MinMax(5, duration, 240),
            startTime: realStartTime,
            addedTime: GetTime(undefined, 'local'),
            comment: lang['activity-zap-comment'],
            // TODO: Add new activity add type ('normal', 'start-now', 'zap-gpt')
            startNow: false,
            timezone: GetTimeZone()
        };

        return newActivity;
    })
    .filter(activity => activity !== null);
}

export { CheckZapGPTActivities };
