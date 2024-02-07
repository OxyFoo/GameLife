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
    const command = `
        SELECT f.AccountID, f.TargetID, f.Date, a.Username 
        FROM Friends f
        JOIN Accounts a ON f.AccountID = a.ID
        WHERE f.TargetID = ${user.accountID} AND f.State = 'pending'
    `;
    const results = await users.db.ExecQuery(command);
    if (results === null) {
        throw new Error('Database error');
    }

    const notifications = results.map(row => {
        const timezone = new Date().getTimezoneOffset() * 60;
        const timestamp = Math.floor(new Date(row.Date).getTime() / 1000) - timezone;

        /** @type {NotificationInAppAchievements} */
        const notification = {
            type: 'friend-pending',
            data: {
                accountID: row.AccountID,
                username: row.Username
            },
            timestamp: timestamp
        };
        return notification;
    });

    return notifications;
}

export { GetFriendNotifications };
