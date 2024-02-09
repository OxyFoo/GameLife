import { GetFriend } from './GetFriends.js';
import { AddLog } from '../Utils/Logs.js';
import { GetTime } from '../Utils/Functions.js';

/**
 * @typedef {import('../Users.js').User} User
 * @typedef {import('../Users.js').default} Users
 * @typedef {import('Types/NotificationInApp.js').NotificationInApp<'friend-pending'>} NotificationInAppFriendPending
 */

/**
 * @param {Users} users
 * @param {User} user
 * @param {string} username
 * @returns {Promise<string>} Whether the friend was added successfully
 */
async function AddFriend(users, user, username) {
    // Get friend ID
    const command = `SELECT \`ID\` FROM \`Accounts\` WHERE Username = '${username}'`;
    const requestFriendID = await users.db.ExecQuery(command);
    if (requestFriendID === null || requestFriendID.length === 0) {
        return 'not-found';
    }
    const friendID = requestFriendID[0]['ID'];

    if (friendID === user.accountID) {
        return 'self';
    }

    // Check if the friendship already exists
    const commandCheck = `SELECT \`ID\` FROM \`Friends\` WHERE (AccountID = ${user.accountID} AND TargetID = ${friendID}) OR (AccountID = ${friendID} AND TargetID = ${user.accountID})`;
    const requestCheck = await users.db.ExecQuery(commandCheck);
    if (requestCheck === null || requestCheck.length > 0) {
        return 'already-friend';
    }

    // Add the friendship
    const commandAdd = `INSERT INTO \`Friends\` (\`AccountID\`, \`TargetID\`) VALUES (${user.accountID}, ${friendID})`;
    const added = await users.db.ExecQuery(commandAdd);
    if (added === null) {
        return 'sql-error';
    }

    // Add the friend to the user
    const newFriend = await GetFriend(users, user, friendID);
    if (newFriend === null) {
        return 'get-friend-error';
    }

    user.friends.push(newFriend);

    // If target is connected, add request in notifications
    const targetIndex = users.AllUsers.findIndex(u => u.accountID === friendID);
    if (targetIndex !== -1) {
        const target = users.AllUsers[targetIndex];

        /** @type {NotificationInAppFriendPending} */
        const notif = {
            type: 'friend-pending',
            data: {
                accountID: user.accountID,
                username: user.username
            },
            timestamp: GetTime()
        };
        target.notificationsInApp.push(notif);
        users.Send(target, { status: 'update-notifications', notifications: target.notificationsInApp });
    }

    // Add log
    AddLog(users, user, 'friend-request', `Friend request: ${friendID}`);

    // Send new status
    users.Send(user, { status: 'update-friends', friends: user.friends });

    return 'ok';
}

/**
 * @param {Users} users
 * @param {User} user
 * @param {number} accountID
 * @returns {Promise<string>} Whether the friend was removed successfully
 */
async function RemoveFriend(users, user, accountID) {
    const command = `DELETE FROM \`Friends\` WHERE (AccountID = ${user.accountID} AND TargetID = ${accountID}) OR (AccountID = ${accountID} AND TargetID = ${user.accountID})`;
    const removed = await users.db.ExecQuery(command);
    if (removed === null) {
        return 'sql-error';
    }

    // Remove the friend from the user
    const index = user.friends.findIndex(friend => friend.accountID === accountID);
    if (index !== -1) {
        user.friends.splice(index, 1);
        users.Send(user, { status: 'update-friends', friends: user.friends });
    }

    // If target is connected, send new status
    const targetIndex = users.AllUsers.findIndex(u => u.accountID === accountID);
    if (targetIndex !== -1) {
        const target = users.AllUsers[targetIndex];
        const userIndex = target.friends.findIndex(friend => friend.accountID === user.accountID);
        if (userIndex !== -1) {
            target.friends.splice(userIndex, 1);
            users.Send(target, { status: 'update-friends', friends: target.friends });
        }
    }

    // Add log
    AddLog(users, user, 'friend-removed', `Friend removed: ${accountID}`);

    return 'ok';
}

/**
 * @param {Users} users
 * @param {User} user
 * @param {number} accountID
 * @returns {Promise<string>} Whether the friend was added successfully
 */
async function AcceptFriend(users, user, accountID) {
    // Update the friendship
    const command = `UPDATE \`Friends\` SET \`State\` = 'accepted' WHERE AccountID = ${accountID} AND TargetID = ${user.accountID}`;
    const accepted = await users.db.ExecQuery(command);
    if (accepted === null) {
        return 'sql-error';
    }

    // Add the friend to the user
    const newFriend = await GetFriend(users, user, accountID);
    if (newFriend === null) {
        return 'get-friend-error';
    }

    user.friends.push(newFriend);
    users.Send(user, { status: 'update-friends', friends: user.friends });

    // Remove notification
    const notifIndex = user.notificationsInApp.findIndex(notif => notif.type === 'friend-pending' && notif.data.accountID === accountID);
    if (notifIndex !== -1) {
        user.notificationsInApp.splice(notifIndex, 1);
        users.Send(user, { status: 'update-notifications', notifications: user.notificationsInApp });
    }

    // If target is connected, send new status
    const targetIndex = users.AllUsers.findIndex(u => u.accountID === accountID);
    if (targetIndex !== -1) {
        const target = users.AllUsers[targetIndex];
        const userIndex = target.friends.findIndex(friend => friend.accountID === user.accountID);
        if (userIndex !== -1) {
            target.friends[userIndex].status = 'online';
            target.friends[userIndex].friendshipState = 'accepted';
            users.Send(target, { status: 'update-friends', friends: target.friends });
        }
    }

    // Add log
    AddLog(users, user, 'friend-accepted', `Friend accepted: ${accountID}`);

    return 'ok';
}

/**
 * @param {Users} users
 * @param {User} user
 * @param {number} accountID
 * @param {boolean} block
 * @returns {Promise<string>} Whether the friend was added successfully
 */
async function DeclineFriend(users, user, accountID, block = false) {
    // Update the friendship
    if (block) {
        const command = `UPDATE \`Friends\` SET \`State\` = 'blocked' WHERE AccountID = ${accountID} AND TargetID = ${user.accountID}`;
        const declined = await users.db.ExecQuery(command);
        if (declined === null) {
            return 'sql-error1';
        }
    } else {
        const command = `DELETE FROM \`Friends\` WHERE AccountID = ${accountID} AND TargetID = ${user.accountID}`;
        const declined = await users.db.ExecQuery(command);
        if (declined === null) {
            return 'sql-error2';
        }
    }

    // Remove notification
    const notifIndex = user.notificationsInApp.findIndex(notif => notif.type === 'friend-pending' && notif.data.accountID === accountID);
    if (notifIndex !== -1) {
        user.notificationsInApp.splice(notifIndex, 1);
        users.Send(user, { status: 'update-notifications', notifications: user.notificationsInApp });
    }

    // If target is connected, send new status
    const targetIndex = users.AllUsers.findIndex(u => u.accountID === accountID);
    if (targetIndex !== -1) {
        const target = users.AllUsers[targetIndex];
        const userIndex = target.friends.findIndex(friend => friend.accountID === user.accountID);
        if (userIndex !== -1) {
            target.friends.splice(userIndex, 1);
            users.Send(target, { status: 'update-friends', friends: target.friends });
        }
    }

    // Add log
    if (block) {
        AddLog(users, user, 'friend-blocked', `Friend blocked: ${accountID}`);
    } else {
        AddLog(users, user, 'friend-declined', `Friend declined: ${accountID}`);
    }

    return 'ok';
}

export { AddFriend, RemoveFriend, AcceptFriend, DeclineFriend };
