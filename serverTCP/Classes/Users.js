import WebSocket from 'websocket';

import { Request_Async } from '../Utils/Request.js';

class User {
    token = '';
    deviceID = 0;
    accountID = 0;
    friendsID = {
        /** @type {Array<Number>} Account IDs */
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
     * @param {String} token
     * @returns {Promise<Number?>} - User ID (if success)
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
     * @param {Number} deviceID
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
     * @param {Number} accountID 
     * @returns {User?} - User with the account ID
     */
    GetByAccountID = (accountID) => {
        return this.AllUsers.find(user => user.accountID === accountID) || null;
    }

    /**
     * @description Send a message to all friends to notify them that the user is connected or disconnected
     * @param {Number} accountID
     * @param {Boolean} mode - true: connect, false: disconnect
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