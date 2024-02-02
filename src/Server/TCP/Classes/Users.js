import WebSocket from 'websocket';

import { Request_Async } from '../Utils/Request.js';
import { GetFriend, GetUserFriends } from '../Utils/Friends.js';
import { StrIsJson } from '../Utils/Functions.js';

/**
 * @typedef {import('../Classes/Sql.js').default} SQL
 * @typedef {import('../../../Types/Friend.js').Friend} Friend
 */

class User {
    token = '';
    deviceID = 0;
    accountID = 0;
    /** @type {Array<Friend>} */
    friends = [];
    /** @type {WebSocket.connection} */
    connection = null;
}

class Users {
    /** @param {SQL} database */
    constructor(database) {
        /** @type {Array<User>} */
        this.AllUsers = [];
        this.db = database;
    }

    /**
     * @param {WebSocket.connection} connection
     * @param {string} token
     * @returns {Promise<User | null>} User if success or null
     */
    Add = async (connection, token) => {
        const settings = { 'action': 'checkToken', 'token': token };
        const response = await Request_Async(settings);
        if (response.status !== 200 || response.content.status !== 'ok') {
            console.error('Token error:', response);
            return null;
        }

        const { deviceID, accountID } = response.content.data;

        const user = new User();
        user.token = token;
        user.deviceID = deviceID;
        user.accountID = accountID;
        user.connection = connection;
        user.friends = await GetUserFriends(this, user);

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

        console.log(`User added (${accountID} - ${deviceID})`);

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

        const data = JSON.parse(message.utf8Data);
        if (!data.hasOwnProperty('action')) {
            return;
        }

        switch (data.action) {
            case 'add-friend':
                await this.AddFriend(user, data.username);
                user.connection.send(JSON.stringify({ status: 'connected', friends: user.friends }));
                break;
            default:
                break;
        }
    }

    /**
     * @param {User} user
     * @param {string} username
     * @returns {Promise<boolean>} Whether the friend was added successfully
     */
    AddFriend = async (user, username) => {
        // Get friend ID
        const command = `SELECT \`ID\` FROM \`Accounts\` WHERE Username = '${username}'`;
        const requestFriendID = await this.db.ExecQuery(command);
        if (requestFriendID === null || requestFriendID.length === 0) {
            return false;
        }
        const friendID = requestFriendID[0]['ID'];

        // Check if the friendship already exists
        const commandCheck = `SELECT \`ID\` FROM \`Friends\` WHERE (AccountID = ${user.accountID} AND TargetID = ${friendID}) OR (AccountID = ${friendID} AND TargetID = ${user.accountID})`;
        const requestCheck = await this.db.ExecQuery(commandCheck);
        if (requestCheck === null || requestCheck.length > 0) {
            return false;
        }

        // Add the friendship
        const commandAdd = `INSERT INTO \`Friends\` (\`AccountID\`, \`TargetID\`) VALUES (${user.accountID}, ${friendID})`;
        const added = await this.db.ExecQuery(commandAdd);
        if (added === null) {
            return false;
        }

        // Add the friend to the user
        const newFriend = await GetFriend(this, user, friendID);
        user.friends.push(newFriend);

        return true;
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
                console.log(`User removed (${deleted.accountID} - ${deleted.deviceID})`);
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
                console.log(`User removed (${deleted.accountID} - ${deleted.deviceID})`);
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
                const data = { status: 'connected', friends: user.friends };
                user.connection.send(JSON.stringify(data));
            }
        }
    }
}

export { User };
export default Users;
