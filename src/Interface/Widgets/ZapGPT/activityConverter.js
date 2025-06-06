import langManager from 'Managers/LangManager';

import { MinMax } from 'Utils/Functions';
import { GetLocalTime, GetTimeZone } from 'Utils/Time';

/**
 * @typedef {import('Data/User/Activities/index').Activity} Activity
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
        const realStartTime = GetLocalTime(startDate);

        /** @type {Activity} */
        const newActivity = {
            skillID,
            duration: MinMax(5, duration, 240),
            comment: lang['activity-zap-comment'],
            startTime: realStartTime,
            addedType: 'zap-gpt',
            addedTime: GetLocalTime(),
            timezone: GetTimeZone(),
            friends: []
        };

        return newActivity;
    })
    .filter(activity => activity !== null)
    .slice(0, 10);
}

export { CheckZapGPTActivities };
