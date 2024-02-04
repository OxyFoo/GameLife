/**
 * @typedef {import('../Users.js').User} User
 * @typedef {import('../Users.js').default} Users
 * @typedef {import('Types/NotificationInApp.js').NotificationInApp<'friend-pending'>} NotificationInAppAchievements
 */

/**
 * @param {Users} users
 * @param {User} user
 * @returns {Promise<Array<NotificationInAppAchievements>>}
 */
async function GetFriendNotifications(users, user) {
    const userID = user.accountID;
    const commandState = `SELECT \`AccountID\`, \`TargetID\`, \`State\` FROM \`Friends\` WHERE (TargetID = ${userID}) AND \`State\` = 'pending'`;
    const requestState = await users.db.ExecQuery(commandState);
    if (requestState === null) {
        throw new Error('Database error');
    }

    const notifications = [];
    for (const row of requestState) {
        const friendID = row.AccountID === userID ? row.TargetID : row.AccountID;
        const commandName = `SELECT \`Username\` FROM \`Accounts\` WHERE ID = ${friendID}`;
        const requestName = await users.db.ExecQuery(commandName);
        if (requestName === null) {
            throw new Error('Database error');
        }

        const friendName = requestName[0].Username;

        /** @type {NotificationInAppAchievements} */
        const notification = {
            type: 'friend-pending',
            data: {
                accountID: friendID,
                username: friendName
            },
            timestamp: 0,
            read: false
        };
        notifications.push(notification);
    }
    return notifications;
}

export { GetFriendNotifications };
