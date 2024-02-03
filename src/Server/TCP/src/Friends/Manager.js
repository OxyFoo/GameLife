import { GetFriend } from './GetFriends.js';

/**
 * @typedef {import('../Users.js').User} User
 * @typedef {import('../Users.js').default} Users
 * @typedef {import('Types/Friend.js').Friend} Friend
 * @typedef {import('Types/Friend.js').ConnectionState} ConnectionState
 * @typedef {import('Types/Friend.js').FriendshipState} FriendshipState
 */

/**
 * @param {Users} users
 * @param {User} user
 * @param {string} username
 * @returns {Promise<boolean>} Whether the friend was added successfully
 */
async function AddFriend(users, user, username) {
    // Get friend ID
    const command = `SELECT \`ID\` FROM \`Accounts\` WHERE Username = '${username}'`;
    const requestFriendID = await users.db.ExecQuery(command);
    if (requestFriendID === null || requestFriendID.length === 0) {
        return false;
    }
    const friendID = requestFriendID[0]['ID'];

    // Check if the friendship already exists
    const commandCheck = `SELECT \`ID\` FROM \`Friends\` WHERE (AccountID = ${user.accountID} AND TargetID = ${friendID}) OR (AccountID = ${friendID} AND TargetID = ${user.accountID})`;
    const requestCheck = await users.db.ExecQuery(commandCheck);
    if (requestCheck === null || requestCheck.length > 0) {
        return false;
    }

    // Add the friendship
    const commandAdd = `INSERT INTO \`Friends\` (\`AccountID\`, \`TargetID\`) VALUES (${user.accountID}, ${friendID})`;
    const added = await users.db.ExecQuery(commandAdd);
    if (added === null) {
        return false;
    }

    // Add the friend to the user
    const newFriend = await GetFriend(users, user, friendID);
    user.friends.push(newFriend);

    return true;
}

/**
 * @param {Users} users
 * @param {User} user
 * @param {number} accountID
 * @returns {Promise<boolean>} Whether the friend was removed successfully
 */
async function RemoveFriend(users, user, accountID) {
    const command = `DELETE FROM \`Friends\` WHERE (AccountID = ${user.accountID} AND TargetID = ${accountID}) OR (AccountID = ${accountID} AND TargetID = ${user.accountID})`;
    const removed = await users.db.ExecQuery(command);
    if (removed === null) {
        return false;
    }

    // Remove the friend from the user
    const index = user.friends.findIndex(friend => friend.accountID === accountID);
    if (index !== -1) {
        user.friends.splice(index, 1);
    }

    // If target is connected, send new status
    const targetIndex = users.AllUsers.findIndex(u => u.accountID === accountID);
    if (targetIndex !== -1) {
        const target = users.AllUsers[targetIndex];
        const userIndex = target.friends.findIndex(friend => friend.accountID === user.accountID);
        if (userIndex !== -1) {
            target.friends.splice(userIndex, 1);
            target.connection.send(JSON.stringify({ status: 'connected', friends: target.friends }));
        }
    }

    return true;
}

export { AddFriend, RemoveFriend };
