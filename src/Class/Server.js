import { BackHandler } from 'react-native';

import langManager from '../Managers/LangManager';

import { Request_Async } from '../Functions/Request';
import { GetDeviceInformations } from '../Functions/Functions';

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
         * @typedef {import('../Managers/UserManager').default} UserManager
         * @type {UserManager}
         */
        this.user = user;

        this.token = '';
        this.dataToken = '';
        this.online = false;
        this.status = STATUS.OFFLINE;
    }

    Clear = () => {
        this.token = '';
        this.dataToken = '';
        this.online = false;
        this.status = STATUS.OFFLINE;
    }

    IsConnected = () => {
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
                this.user.interface.console.AddLog('info', 'Request: ping - OK');
            }
        } else {
            const error = result_ping.status + '-' + result_ping.content;
            this.user.interface.console.AddLog('error', 'Request: ping failed (' + error + ')');
        }
        this.online = online;
    }

    /**
     * Try to connect to the server, with email (and device informations)
     * @param {string} email - Email of the user
     * @returns {Promise<{status: String, remainMailTime: Number}>} - Status of the user connection
     */
    Connect = async (email) => {
        let status = null;
        let remainMailTime = null;

        const result_connect = await this.__reqConnect(email);
        const content = result_connect.content;

        if (result_connect.status !== 200) {
            const error = result_connect.status + ' - ' + content['error'];
            this.user.interface.console.AddLog('error', 'Request: connect failed (' + error + ')');
            return STATUS.ERROR;
        }

        if (Object.values(STATUS).includes(content['status'])) {
            status = content['status'];
            this.status = status;
            if (content.hasOwnProperty('remainMailTime')) {
                remainMailTime = content['remainMailTime'];
            }
        }

        if (status === STATUS.CONNECTED || status === STATUS.BANNED) {
            const token = content['token'];
            if (typeof(token) !== 'undefined' && token.length) {
                this.token = token;
            } else {
                status = STATUS.ERROR;
            }
        }

        const output = {
            status: status,
            remainMailTime: remainMailTime
        };
        return output;
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
    async SaveUserData(data) {
        let success = false;
        const _data = {
            'action': 'addUserData',
            'token': this.token,
            'data': data,
            'dataToken': this.dataToken
        };

        const response = await Request_Async(_data);
        if (response.status === 200) {
            const content = response.content;
            const status = content['status'];

            if (status === 'ok') {
                success = true;
                if (content.hasOwnProperty('dataToken')) {
                    this.dataToken = content['dataToken'];
                }
            } else if (status === 'tokenExpired') {
                success = false;
                this.TokenExpired();
            }
        }

        return success;
    }

    /**
     * Load all user data
     * @returns {Promise<?Object>} - Return all online data or null if failed
     */
    async LoadUserData() {
        let json = null;
        const data = {
            'action': 'getUserData',
            'token': this.token,
            'dataToken': this.dataToken
        };
        const response = await Request_Async(data);

        if (response.status === 200) {
            const content = response.content;
            const status = content['status'];
            const data = content['data'];

            if (status === 'ok' && typeof(data) === 'object') {
                json = data;
            }
        }
        return json;
    }

    /**
     * Save username on server
     * @param {String} username 
     * @returns {Promise<'ok'|'alreadyUsed'|'alreadyChanged'|'incorrect'|'error'>}
     */
    async SaveUsername(username) {
        let output = 'error';
        const _data = {
            'action': 'setUsername',
            'token': this.token,
            'username': username,
            'dataToken': this.dataToken
        };

        const response = await Request_Async(_data);
        if (response.status === 200) {
            const content = response.content;
            const status = content['status'];
            const usernameChangeState = content['usernameChangeState'];

            if (status === 'tokenExpired') {
                this.TokenExpired();
            } else {
                output = usernameChangeState;
            }
        }

        return output;
    }

    /**
     * Send report
     * @param {'activity'|'suggest'|'bug'|'message'} type - Type of report to send
     * @param {Object} data - Data to send
     * @returns {Promise<Boolean>} - Return success of report
     */
    async SendReport(type, data) {
        let output = false;
        const _data = {
            'action': 'addReport',
            'token': this.token,
            'type': type,
            'data': JSON.stringify(data)
        };

        const response = await Request_Async(_data);
        if (response.status === 200) {
            const content = response.content;
            const contentStatus = content['status'];

            if (contentStatus === 'ok') {
                output = true;
            } else if (contentStatus === 'tokenExpired') {
                this.TokenExpired();
            }
        }

        return output;
    }

    async Disconnect() {
        let output = false;
        const _data = {
            'action': 'disconnect',
            'token': this.token
        };

        const response = await Request_Async(_data);
        if (response.status === 200) {
            const contentStatus = response.content['status'];
            if (contentStatus === 'ok') {
                output = true;
            } else if (contentStatus === 'tokenExpired') {
                this.TokenExpired();
            }
        }

        return output;
    }

    // TODO - Popup + restart
    TokenExpired() {
        this.user.interface.console.AddLog('warn', 'Request: token expired');
    }

    __reqPing() {
        const data = {
            'action': 'ping',
            ...GetDeviceInformations(true, true)
        };
        return Request_Async(data);
    }

    __reqConnect(email) {
        const data = {
            'action': 'login',
            'email': email,
            'lang': langManager.currentLangageKey,
            ...GetDeviceInformations()
        };
        return Request_Async(data);
    }

    __reqSignin(email, username) {
        const data = {
            'action': 'signin',
            'email': email,
            'username': username,
            'lang': langManager.currentLangageKey,
            ...GetDeviceInformations()
        };
        return Request_Async(data);
    }

    GetLeaderboard(week = false) {
        let data = {
            'action': 'getLeaderboard',
            'token': this.token
        }
        if (week) data['time'] = 'week';
        return Request_Async(data);
    }
}

export default Server;