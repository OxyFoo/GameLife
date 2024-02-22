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
 * @param {User | UserOnline} user
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

        // Update the friend's current activity
        const friendCurrentActivity = GetCurrentActivity(users, friend);
        if (friendCurrentActivity !== null &&
            friendCurrentActivity.friendsIDs.indexOf(user.accountID) === -1 &&
            friendCurrentActivity.skillID === activity.skillID
        ) {
            friendCurrentActivity.friendsIDs.push(user.accountID);
            users.Send(friend, { status: 'update-current-activity', activity: friendCurrentActivity });
        }

        // Update the friend's friends list
        friend.friends[userIndexInFriend].currentActivity = activity;
        users.Send(friend, { status: 'update-friends', friends: friend.friends });
    }

    // Update the user's current activity to refresh the friends list
    users.currentActivities[user.accountID] = activity;
    const newFiendsIDs = user.friends
        .filter(f => f.friendshipState === 'accepted')
        .filter(f => f.currentActivity !== null && f.currentActivity.skillID === activity.skillID)
        .map(f => f.accountID);

    if (activity.friendsIDs.length !== newFiendsIDs.length) {
        activity.friendsIDs = newFiendsIDs;
        users.Send(user, { status: 'update-current-activity', activity });
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
