import WebSocket from 'websocket';

import { GetUserFriends } from './Friends/GetFriends.js';
import { AcceptFriend, AddFriend, DeclineFriend, RemoveFriend, CancelFriend } from './Friends/Manager.js';
import { GetFriendNotifications } from './Friends/NotificationsInApp.js';

import GPT from './Utils/GPT.js';
import { StrIsJson } from './Utils/Functions.js';
import { Request_Async } from './Utils/Request.js';

/**
 * @typedef {import('./Sql.js').default} SQL
 * @typedef {import('../../../Types/UserOnline.js').Friend} Friend
 * @typedef {import('../../../Types/TCP.js').TCPServerRequest} TCPServerRequest
 * @typedef {import('../../../Types/TCP.js').TCPClientRequest} TCPClientRequest
 * @typedef {import('../../../Types/NotificationInApp.js').NotificationInApp} NotificationInApp
 */

class User {
    token = '';
    deviceID = 0;
    accountID = 0;
    username = '';
    /** @type {Array<Friend>} */
    friends = [];
    /** @type {Array<NotificationInApp>} */
    notificationsInApp = [];
    /** @type {WebSocket.connection} */
    connection = null;
}

class Users {
    /** @param {SQL} database */
    constructor(database) {
        /** @type {Array<User>} */
        this.AllUsers = [];
        this.db = database;
        this.gpt = new GPT();
    }

    /**
     * @param {WebSocket.connection} connection
     * @param {string} token
     * @returns {Promise<User | null>} User if success or null
     */
    Add = async (connection, token) => {
        const settings = { 'action': 'checkToken', 'token': token };
        const response = await Request_Async(settings);
        if (response.status !== 200) {
            connection.send(JSON.stringify({
                status: 'error',
                message: 'Auth error'
            }));
            return null;
        }

        // Token error
        if (response.content.status !== 'ok') {
            const IP = connection.socket.remoteAddress;
            const command = 'INSERT INTO `Logs` (`AccountID`, `DeviceID`, `IP`, `Type`, `Data`, `Server`) VALUES (?, ?, ?, ?, ?, "tcp")';
            const args = [ 0, 0, IP, 'cheatSuspicion', `Token error: ${response.status} - ${response.content.status}` ];
            this.db.QueryPrepare(command, args);
            connection.send(JSON.stringify({
                status: 'error',
                message: '[Auth] Token error'
            }));
            return null;
        }

        const { deviceID, accountID, username } = response.content.data;

        const user = new User();
        user.token = token;
        user.deviceID = deviceID;
        user.accountID = accountID;
        user.username = username;
        user.connection = connection;

        user.friends = await GetUserFriends(this, user);
        if (user.friends === null) {
            connection.send(JSON.stringify({
                status: 'error',
                message: '[Auth] Friends error'
            }));
            return null;
        }

        user.notificationsInApp = await GetFriendNotifications(this, user);
        if (user.notificationsInApp === null) {
            connection.send(JSON.stringify({
                status: 'error',
                message: '[Auth] Notifications error'
            }));
            return null;
        }

        // Avoid multiple connections with the same account or device
        this.RemoveByAccountID(accountID);
        this.RemoveByDeviceID(deviceID);

        // Add user & send "connected" message
        this.AllUsers.push(user);
        this.handleConnections(accountID, true);

        // Add events
        connection.removeAllListeners('message');
        connection.on('message', (message) => {
            this.onMessage(user, message);
        });

        connection.send(JSON.stringify({ status: 'connected' }));
        this.SendAllData(user);

        return user;
    }

    /**
     * @param {User} user
     * @param {WebSocket.Message} message
     */
    onMessage = async (user, message) => {
        if (message.type !== 'utf8' || !StrIsJson(message.utf8Data)) {
            return;
        }

        /** @type {TCPClientRequest} */
        const data = JSON.parse(message.utf8Data);
        if (!data.hasOwnProperty('action')) {
            return;
        }

        let result = '';
        switch (data.action) {
            case 'add-friend':
                result = await AddFriend(this, user, data.username);
                break;

            case 'accept-friend':
                result = await AcceptFriend(this, user, data.accountID);
                break;

            case 'decline-friend':
                result = await DeclineFriend(this, user, data.accountID, false);
                break;

            case 'cancel-friend':
                result = await CancelFriend(this, user, data.accountID);
                break;

            case 'remove-friend':
                result = await RemoveFriend(this, user, data.accountID);
                break;

            case 'block-friend':
                result = await DeclineFriend(this, user, data.accountID, true);
                break;

            case 'zap-gpt':
                result = await this.gpt.PromptToActivities(data.prompt);
                break;

            default:
                break;
        }

        if (data.hasOwnProperty('callbackID')) {
            this.Send(user, {
                status: 'callback',
                callbackID: data.callbackID,
                result: result
            });
        }
    }

    /**
     * @param {User} user
     * @param {TCPServerRequest} data
     */
    Send = (user, data) => {
        user.connection.send(JSON.stringify(data));
    }

    /**
     * @param {User} user
     */
    SendAllData = (user) => {
        this.Send(user, { status: 'update-friends', friends: user.friends });
        this.Send(user, { status: 'update-notifications', notifications: user.notificationsInApp });
    }

    /**
     * @param {number} accountID
     */
    RemoveByAccountID = (accountID) => {
        let index = -1;
        do {
            index = this.AllUsers.findIndex(user => user.accountID === accountID);
            if (index !== -1) {
                const deleted = this.AllUsers.splice(index, 1)[0];
                this.handleConnections(deleted.accountID, false);
            }
        } while (index !== -1);
    }

    /**
     * @param {number} deviceID
     */
    RemoveByDeviceID = (deviceID) => {
        let index = -1;
        do {
            index = this.AllUsers.findIndex(user => user.deviceID === deviceID);
            if (index !== -1) {
                const deleted = this.AllUsers.splice(index, 1)[0];
                this.handleConnections(deleted.accountID, false);
            }
        } while (index !== -1);
    }

    /**
     * @description Send a message to all friends to notify them that the user is connected or disconnected
     * @param {number} accountID
     * @param {boolean} connected
     */
    handleConnections = (accountID, connected) => {
        for (let i = 0; i < this.AllUsers.length; i++) {
            const user = this.AllUsers[i];

            const userFriendIndex = user.friends.findIndex(friend => friend.accountID === accountID);
            if (userFriendIndex !== -1) {
                // Change target status of the user
                user.friends[userFriendIndex].status = connected ? 'online' : 'offline';

                // Send new status to the user
                this.Send(user, { status: 'update-friends', friends: user.friends });
            }
        }
    }
}

export { User };
export default Users;
