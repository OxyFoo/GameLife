import { BackHandler } from 'react-native';

import { UserManager } from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { Request_Async } from '../Functions/Request';
import { getDeviceInformations, strIsJSON } from '../Functions/Functions';

const STATUS = {
    OFFLINE     : 'offline',
    CONNECTED   : 'ok',
    FREE        : 'free',
    WAITMAIL    : 'waitMailConfirmation',
    BANNED      : 'ban',
    NEWDEVICE   : 'newDevice',
    MAINTENANCE : 'maintenance',
    ERROR       : 'error'
};

class Server {
    constructor(user) {
        /**
         * @type {UserManager}
         */
        this.user = user;
        this.token = '';
        this.online = false;
        this.status = STATUS.OFFLINE;
    }

    Clear = () => {
        this.token = '';
        this.online = false;
        this.status = STATUS.OFFLINE;
    }

    isConnected() {
        return this.status === STATUS.CONNECTED || this.status === STATUS.BANNED;
    }

    Ping = async () => {
        let online = false;
        const result_ping = await this.__reqPing();
        if (result_ping.status === 200) {
            const status = result_ping.content['status'];
            // Return status & popup out of this class
            if (status === 'update') {
                const title = langManager.curr['home']['alert-update-title'];
                const text = langManager.curr['home']['alert-update-text'];
                this.user.interface.popup.Open('ok', [ title, text ], BackHandler.exitApp, false);
            } else if (status === 'downdate') {
                const title = langManager.curr['home']['alert-newversion-title'];
                const text = langManager.curr['home']['alert-newversion-text'];
                this.user.interface.popup.Open('ok', [ title, text ], undefined, false);
            } else if (status === STATUS.MAINTENANCE) {
                // TODO - Gérer la maintenance
            } else if (status === 'ok') {
                online = true;
            }
        } else {
            console.error('Ping failed:', result_ping.status, '-', result_ping.content);
        }
        this.online = online;
    }

    /**
     * Try to connect to the server, with email (and device informations)
     * @param {string} email - Email of the user
     * @returns {Promise<String>} - Status of the user connection
     */
    Connect = async (email) => {
        let status = null;
        const result_connect = await this.__reqConnect(email);

        if (result_connect.status !== 200) {
            console.error('Get token failed: ' + result_connect.status + ' - ' + result_connect.content['error']);
            return STATUS.ERROR;
        }

        if (Object.values(STATUS).includes(result_connect.content['status'])) {
            status = result_connect.content['status'];
            this.status = status;
        }

        if (status === STATUS.CONNECTED || status === STATUS.BANNED) {
            const token = result_connect.content['token'];
            if (typeof(token) !== 'undefined' && token.length) {
                this.token = token;
            } else {
                status = STATUS.ERROR;
            }
        }

        return status;
    }

    /**
     * Send a request to the server to create a new user account
     * @param {String} email - Email of the user
     * @param {String} username - Pseudo of the user
     * @returns {Promise<String>} - Status of the user signin
     */
    Signin = async (email, username) => {
        let signin = null;
        const result = await this.__reqSignin(email, username);
        if (result.status === 200) {
            const status = result.content['status'];
            if (status === 'ok' || status === 'pseudoUsed') {
                signin = status;
            }
        }
        return signin;
    }

    /**
     * Send data unsaved on server
     * @param {Array} data - Data to add to server
     * @returns {Promise<Boolean>} - Return success of online save
     */
    async SaveData(data) {
        let success = false;
        const _data = {
            'action': 'addUserData',
            'token': this.token,
            'data': data
        };

        const response = await Request_Async(_data);
        if (response.status === 200) {
            if (response.content['status'] === 'ok') {
                // TODO - Add "Data Token"
                success = true;
            }
        }

        return success;
    }

    /**
     * Load all user data
     * @returns {Promise<?Object>} - Return all online data or null if failed
     */
    async LoadData() {
        let json = null;
        const data = {
            'action': 'getUserData',
            'token': this.token
        };
        const response = await Request_Async(data);
        if (response.status === 200) {
            let content = response.content;
            if (content['status'] === 'ok') {
                if (strIsJSON(content['data'])) {
                    // TODO - Add "Data Token"
                    json = JSON.parse(content['data']);
                }
            }
        }
        return json;
    }

    __reqPing() {
        const data = {
            'action': 'ping',
            ...getDeviceInformations(true, true)
        };
        return Request_Async(data);
    }

    __reqConnect(email) {
        const data = {
            'action': 'login',
            'email': email,
            'lang': langManager.currentLangageKey,
            ...getDeviceInformations()
        };
        return Request_Async(data);
    }

    __reqSignin(email, username) {
        const data = {
            'action': 'signin',
            'email': email,
            'username': username,
            'lang': langManager.currentLangageKey,
            ...getDeviceInformations()
        };
        return Request_Async(data);
    }

    getLeaderboard(week = false) {
        let data = {
            'action': 'getLeaderboard',
            'token': this.token
        }
        if (week) data['time'] = 'week';
        return Request_Async(data);
    }
}

export default Server;