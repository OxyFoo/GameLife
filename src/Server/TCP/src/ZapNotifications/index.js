import { EscapeString, IsInt } from '../Utils/Functions.js';
import { AddLogRaw } from '../Utils/Logs.js';

/**
 * @typedef {import('websocket').connection} connection
 * @typedef {import('../Users.js').default} Users
 * @typedef {import('Types/NotificationInApp.js').NIA_GlobalMessage} NIA_GlobalMessage
 * 
 * @typedef {Object} ReceiveDiscordZapNotificationRequest
 * @property {string} token Simple authentication to prevent unauthorized requests
 * @property {'send-global-request'} command
 * @property {string} userID
 * @property {string} ids Ids of the accounts to notify, separated by commas (or "all").
 * @property {string} message_fr
 * @property {string} message_en
 * @property {'none' | 'can-respond' | 'must-respond' | 'open-page' | 'open-link' | 'reward-chest' | 'reward-ox'} action
 * @property {string} page GameLife pagename to open
 * @property {string} link URL to open
 * @property {number} rewardOx Number of OX
 * @property {'common' | 'rare' | 'epic' | 'legendary'} rewardChest
 * @property {string} [callbackID]
 * 
 * @typedef {Object} SendDiscordZapNotificationRequest
 * @property {'sent' | 'incorrect-values' | 'query-error1' | 'query-error2' | 'query-error3'} status
 * @property {number} notificationsSent
 * @property {string} [callbackID]
 */

/**
 * @param {Users} users
 * @param {connection} connection
 * @param {ReceiveDiscordZapNotificationRequest} data
 * @returns {Promise<boolean>}
 */
async function ZapCommand(users, connection, data) {
    if (data.command === 'send-global-request') {
        // Add request in logs
        const rawData = EscapeString(JSON.stringify(data));
        AddLogRaw(users, connection, 'global-notification-request', rawData);

        const ids = [];
        const idsToUpdate = [];

        if (data.ids === 'all') {
            const command = 'SELECT ID FROM Accounts';
            const result = await users.db.ExecQuery(command);
            if (result === null) {
                SendCallback(connection, {
                    status: 'query-error1',
                    notificationsSent: 0,
                    callbackID: data.callbackID
                });
                return false;
            }
            ids.push(...result.map(row => row.ID));
        } else {
            ids.push(...data.ids.split(',').map(id => parseInt(id)));
        }

        let sqlAddAll = 'INSERT INTO GlobalNotifications (AccountID, Action, Message, Data) VALUES ';

        let value = null;
        if (data.action === 'reward-chest' && ['common', 'rare', 'epic', 'legendary'].includes(data.rewardChest)) {
            value = data.rewardChest;
        } else if (data.action === 'reward-ox' && typeof data.rewardOx === 'number') {
            value = data.rewardOx;
        } else if ((data.action === 'open-page' && typeof data.page === 'string') ||
                    (data.action === 'open-link' && typeof data.link === 'string')) {
            value = data.action === 'open-page' ? data.page : data.link;
        } else if (data.action === 'none' || data.action === 'can-respond' || data.action === 'must-respond') {
            value = '';
        }

        if (value === null) {
            SendCallback(connection, {
                status: 'incorrect-values',
                notificationsSent: 0,
                callbackID: data.callbackID
            });
            return false;
        }

        for (const id of ids) {
            const user = users.AllUsers.find(u => u.accountID === id);
            if (user !== undefined) {
                idsToUpdate.push(user.accountID);
            }

            // Escape single quotes and double quotes to prevent SQL injection & JSON.parse errors
            const message = {
                fr: data.message_fr,
                en: data.message_en
            };
            const messageText = EscapeString(JSON.stringify(message));

            sqlAddAll += `(${id}, '${data.action}', '${messageText}', '${value}'),`;
        }

        sqlAddAll = sqlAddAll.slice(0, -1);

        const result = await users.db.ExecQuery(sqlAddAll);
        if (result === null) {
            SendCallback(connection, {
                status: 'query-error2',
                notificationsSent: 0,
                callbackID: data.callbackID
            });
            return false;
        }

        // Get all added rows from idsToUpdate
        if (idsToUpdate.length === 0) {
            SendCallback(connection, {
                status: 'sent',
                notificationsSent: result.affectedRows,
                callbackID: data.callbackID
            });
            return true;
        }

        const commandUpdate = `SELECT ID, AccountID, Action, Message, Data, Date FROM GlobalNotifications WHERE AccountID IN (${idsToUpdate.join(',')})`;
        const resultUpdate = await users.db.ExecQuery(commandUpdate);
        if (resultUpdate === null) {
            SendCallback(connection, {
                status: 'query-error3',
                notificationsSent: 0,
                callbackID: data.callbackID
            });
            return false;
        }

        for (const id of idsToUpdate) {
            const user = users.AllUsers.find(u => u.accountID === id);
            if (user !== undefined && resultUpdate.length > 0) {
                const notifsRaw = resultUpdate.at(-1);
                const timezone = new Date().getTimezoneOffset() * 60;
                const timestamp = Math.floor(new Date(notifsRaw.Date).getTime() / 1000) - timezone;

                /** @type {NIA_GlobalMessage} */
                const notification = {
                    ID: notifsRaw.ID,
                    action: notifsRaw.Action,
                    message: JSON.parse(notifsRaw.Message),
                    data: IsInt(notifsRaw.Data) ? parseInt(notifsRaw.Data) : notifsRaw.Data
                };
                user.notificationsInApp.push({
                    type: 'global-message',
                    data: notification,
                    timestamp: timestamp
                });
                users.Send(user, { status: 'update-notifications', notifications: user.notificationsInApp });
            }
        }

        SendCallback(connection, {
            status: 'sent',
            notificationsSent: result.affectedRows,
            callbackID: data.callbackID
        });

        return true;
    }

    return false;
}

/**
 * @param {connection} connection
 * @param {SendDiscordZapNotificationRequest} data
 */
function SendCallback(connection, data) {
    connection.send(JSON.stringify(data));
}

export { ZapCommand };
