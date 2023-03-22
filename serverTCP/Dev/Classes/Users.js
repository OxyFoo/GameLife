import WebSocket from 'websocket';

import { Request_Async } from '../Utils/Request.js';

class User {
    token = '';
    deviceID = 0;
    accountID = 0;
    friendsID = {
        /** @type {Array<number>} Account IDs */
        all: []
    };
    /** @type {WebSocket.connection} */
    connection = null;
}

class Users {
    constructor() {
        /** @type {Array<User>} */
        this.AllUsers = [];
    }

    /**
     * @param {WebSocket.connection} connection
     * @param {string} token
     * @returns {Promise<number?>} - User ID (if success)
     */
    Add = async (connection, token) => {
        const settings = { 'action': 'checkToken', 'token': token };
        const response = await Request_Async(settings);
        if (response.status !== 200 || response.content.status !== 'ok') {
            console.error('Token error:', response);
            return null;
        }

        const { deviceID, accountID, friends } = response.content.data;

        const user = new User();
        user.token = token;
        user.deviceID = deviceID;
        user.accountID = accountID;
        user.friendsID = JSON.parse(friends);

        this.checkEvents(true);
        this.Rem(deviceID);

        console.log('User added:', deviceID);
        user.connection = connection;
        this.AllUsers.push(user);

        return deviceID;
    }

    /**
     * @param {number} deviceID
     */
    Rem = (deviceID) => {
        const index = this.AllUsers.findIndex(user => user.deviceID === deviceID);
        if (index !== -1) {
            this.checkEvents(false);
            this.AllUsers.splice(index, 1);
            console.log('User removed:', deviceID);
        }
    }

    /**
     * @param {number} accountID 
     * @returns {User?} - User with the account ID
     */
    GetByAccountID = (accountID) => {
        return this.AllUsers.find(user => user.accountID === accountID) || null;
    }

    /**
     * @description Send a message to all friends to notify them that the user is connected or disconnected
     * @param {number} accountID
     * @param {boolean} mode - true: connect, false: disconnect
     */
    checkEvents = (accountID, mode) => {
        for (let i = 0; i < this.AllUsers.length; i++) {
            const user = this.AllUsers[i];
            if (user.friendsID.all.includes(accountID)) {
                const data = JSON.stringify({
                    'type': mode ? 'userConnected' : 'userDisconnected',
                    'accountID': accountID
                });
                user.connection.send(data);
            }
        }
    }
}

export default Users;