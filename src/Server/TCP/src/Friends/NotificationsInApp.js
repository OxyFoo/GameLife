import { EscapeString, IsInt } from '../Utils/Functions.js';

/**
 * @typedef {import('../Users.js').User} User
 * @typedef {import('../Users.js').default} Users
 * @typedef {import('Types/NotificationInApp.js').NotificationInApp<'friend-pending'>} NotificationInAppAchievements
 * @typedef {import('Types/NotificationInApp.js').NotificationInApp<'global-message'>} NotificationInAppGlobalMessage
 */

/**
 * @param {Users} users
 * @param {User} user
 * @returns {Promise<Array<NotificationInAppAchievements> | null>}
 */
async function GetUserNotifications(users, user) {
    const commandFriends = `
        SELECT f.AccountID, f.TargetID, f.Date, a.Username 
        FROM Friends f
        JOIN Accounts a ON f.AccountID = a.ID
        WHERE f.TargetID = ${user.accountID} AND f.State = 'pending'
    `;
    const commandGlobalNotifications = `
        SELECT ID, Action, Message, Data, Date
        FROM GlobalNotifications
        WHERE AccountID = ${user.accountID} AND Readed = 0
    `;

    const [ friends, globalNotifications ] = await Promise.all([
        users.db.ExecQuery(commandFriends),
        users.db.ExecQuery(commandGlobalNotifications)
    ]);

    const notificationsFriend = friends.map(row => {
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

    const notificationsGlobal = globalNotifications.map(row => {
        const timezone = new Date().getTimezoneOffset() * 60;
        const timestamp = Math.floor(new Date(row.Date).getTime() / 1000) - timezone;

        /** @type {NotificationInAppGlobalMessage} */
        const notification = {
            type: 'global-message',
            data: {
                ID: row.ID,
                action: row.Action,
                message: JSON.parse(row.Message),
                data: IsInt(row.Data) ? parseInt(row.Data) : row.Data
            },
            timestamp: timestamp
        };
        return notification;
    });

    return [ ...notificationsFriend, ...notificationsGlobal ];
}

/**
 * @param {Users} users
 * @param {User} user
 * @param {number} notificationID
 * @param {string} [response]
 * @returns {Promise<string>}
 */
async function RespondToGlobalMessage(users, user, notificationID, response) {
    let command = `
        UPDATE GlobalNotifications
        SET Readed = 1, DateReaded = CURRENT_TIMESTAMP
        WHERE ID = ? AND AccountID = ?
    `;

    /** @type {Array<string | number>} */
    let args = [ notificationID, user.accountID ];

    if (typeof response === 'string') {
        command = `
            UPDATE GlobalNotifications
            SET Response = ?, Readed = 1, DateReaded = CURRENT_TIMESTAMP
            WHERE ID = ? AND AccountID = ?
        `;
        args = [ EscapeString(response), notificationID, user.accountID ];
    }

    const result = await users.db.QueryPrepare(command, args);
    if (result === null) {
        return 'error';
    }

    // Remove notification from the list
    const index = user.notificationsInApp.findIndex(n => n.type === 'global-message' && n.data.ID === notificationID);
    if (index !== -1) {
        user.notificationsInApp.splice(index, 1);
    }
    users.Send(user, { status: 'update-notifications', notifications: user.notificationsInApp });

    return 'ok';
}

export { GetUserNotifications, RespondToGlobalMessage };
