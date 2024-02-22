import { GetTime } from './Functions.js';
import { AddLog } from './Logs.js';

/**
 * @typedef {import('../Users.js').User} User
 * @typedef {import('../Users.js').default} Users
 * @typedef {import('Types/UserOnline.js').UserOnline} UserOnline
 * @typedef {import('Types/UserOnline.js').CurrentActivity} CurrentActivity
 */

/**
 * @param {Users} users
 * @param {UserOnline} user
 * @returns {CurrentActivity | null} Current activity of the user
 */
function GetCurrentActivity(users, user) {
    if (!users.currentActivities.hasOwnProperty(user.accountID)) {
        return null;
    }

    const now = GetTime();

    // Check if the activity exceeds the limit (4h)
    const currentActivity = users.currentActivities[user.accountID];
    const endTime = currentActivity.startTime +
                    currentActivity.timezone * 3600 +
                    4 * 3600;

    if (now > endTime) {
        delete users.currentActivities[user.accountID];
        return null;
    }

    return currentActivity;
}

/**
 * @param {Users} users
 * @param {User} user
 * @param {CurrentActivity} activity
 */
function StartActivity(users, user, activity) {
    // Check if the activity is valid
    if (typeof activity !== 'object' || activity === null ||
        typeof activity.skillID !== 'number' ||
        typeof activity.startTime !== 'number' ||
        typeof activity.timezone !== 'number')
    {
        const content = typeof activity === 'object' ? JSON.stringify(activity) : activity;
        AddLog(users, user, 'cheatSuspicion', `Invalid activity: ${JSON.stringify(content)}`);
        return;
    }

    users.currentActivities[user.accountID] = activity;

    // Send the activity to friends
    for (const userFriend of user.friends) {
        const friendIndex = users.AllUsers.findIndex(u => u.accountID === userFriend.accountID);
        if (friendIndex === -1) {
            continue;
        }

        const friend = users.AllUsers[friendIndex];
        const userIndexInFriend = friend.friends.findIndex(f => f.accountID === user.accountID);
        if (userIndexInFriend === -1) {
            continue;
        }

        friend.friends[userIndexInFriend].currentActivity = activity;
        users.Send(friend, { status: 'update-friends', friends: friend.friends });
    }
}

/**
 * @param {Users} users
 * @param {User} user
 */
function StopActivity(users, user) {
    if (users.currentActivities.hasOwnProperty(user.accountID)) {
        delete users.currentActivities[user.accountID];

        // Send the activity to friends
        for (const userFriend of user.friends) {
            const friendIndex = users.AllUsers.findIndex(u => u.accountID === userFriend.accountID);
            if (friendIndex === -1) {
                continue;
            }

            const friend = users.AllUsers[friendIndex];
            const userIndexInFriend = friend.friends.findIndex(f => f.accountID === user.accountID);
            if (userIndexInFriend === -1) {
                continue;
            }

            friend.friends[userIndexInFriend].currentActivity = null;
            users.Send(friend, { status: 'update-friends', friends: friend.friends });
        }
    }
}

export { GetCurrentActivity, StartActivity, StopActivity };
