import WebSocket from 'websocket';

import { Request_Async } from '../Utils/Request.js';

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
     * TODO: Remove - Unused ?
     * @param {number} accountID 
     * @returns {User | null} User with the account ID
     */
    GetByAccountID = (accountID) => {
        const index = this.AllUsers.findIndex(user => user.accountID === accountID);
        if (index === -1) {
            return null;
        }
        return this.AllUsers[index];
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
        user.friends = await this.GetFriends(accountID);

        // Avoid multiple connections with the same account or device
        this.RemoveByAccountID(accountID);
        this.RemoveByDeviceID(deviceID);

        // Add user & send "connected" message
        this.AllUsers.push(user);
        this.handleConnections(accountID, true);

        console.log(`User added (${accountID} - ${deviceID})`);

        return user;
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

            if (user.accountID === accountID) {
                const data = {
                    'type': connected ? 'connected' : 'disconnected',
                    'accountID': accountID
                };
                user.connection.send(JSON.stringify(data));
            }

            else if (user.friends.findIndex(friend => friend.accountID === accountID) !== -1) {
                const data = {
                    'type': connected ? 'userConnected' : 'userDisconnected',
                    'accountID': accountID
                };
                user.connection.send(JSON.stringify(data));
            }
        }
    }

    /**
     * @param {number} accountID
     * @returns {Promise<Array<Friend>>} Friends of the account
     */
    async GetFriends(accountID) {
        const command = `SELECT \`AccountID\`, \`TargetID\`, \`State\` FROM \`Friends\` WHERE AccountID = ${accountID} OR TargetID = ${accountID}`;
        const friendships = await this.db.ExecQuery(command);
        if (friendships === null) {
            throw new Error(`Friendships not found: ${accountID}`);
        }

        /** @type {Array<Friend>} */
        const friends = [];
        for (let i = 0; i < friendships.length; i++) {
            const friendID = friendships[i].AccountID === accountID ? friendships[i].TargetID : friendships[i].AccountID;

            // Get informations
            const commandInfo = `SELECT \`Username\` FROM \`Accounts\` WHERE ID = ${friendID}`;
            const friendInfo = await this.db.ExecQuery(commandInfo);
            if (friendInfo === null || friendInfo.length === 0) {
                throw new Error(`Account not found: ${friendID}`);
            }

            // Get avatar
            const commandAvatar = `SELECT \`Sexe\`, \`Skin\`, \`SkinColor\`, \`Hair\`, \`Top\`, \`Bottom\`, \`Shoes\` FROM \`Avatars\` WHERE ID = ${friendID}`;
            const friendAvatar = await this.db.ExecQuery(commandAvatar);
            if (friendAvatar === null || friendAvatar.length === 0) {
                throw new Error(`Avatar not found for account ${friendID}`);
            }

            const stuffKeys = [ 'Hair', 'Top', 'Bottom', 'Shoes' ];
            for (const key of stuffKeys) {
                // Get stuff by ItemID
                const commandItemID = `SELECT \`ItemID\` FROM \`Inventories\` WHERE ID = ${friendAvatar[0][key]}`;
                const itemID = await this.db.ExecQuery(commandItemID);
                if (itemID === null || itemID.length === 0) {
                    throw new Error(`ItemID not found for account ${friendID}`);
                }
                friendAvatar[0][key] = itemID[0]['ItemID'];
            };

            /** @type {Friend} */
            const newFriend = {
                status: this.GetByAccountID(friendID) !== null ? 'online' : 'offline',
                accountID: friendID,
                username: friendInfo[0]['Username'],
                avatar: friendAvatar[0],
                friendshipState: friendships[i].State
            };

            friends.push(newFriend);
        }
        return friends;
    }
}

export { User };
export default Users;
