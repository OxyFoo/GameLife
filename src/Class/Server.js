import { BackHandler } from 'react-native';

import langManager from '../Managers/LangManager';

import { Request_Async } from '../Utils/Request';
import { GetDeviceInformations } from '../Utils/Device';

const STATUS = {
    OFFLINE     : 'offline',
    CONNECTED   : 'ok',
    FREE        : 'free',
    WAITMAIL    : 'waitMailConfirmation',
    BANNED      : 'ban',
    NEWDEVICE   : 'newDevice',
    REMDEVICE   : 'remDevice',
    MAINTENANCE : 'maintenance',
    ERROR       : 'error',
    LIMITDEVICE : 'limitDevice'
};

/**
 * @typedef {'ping'|'login'|'signin'|'getUserData'|'addUserData'|'setUsername'|'buyTitle'|'buyItem'|'sellStuff'|'adWatched'|'report'|'giftCode'|'disconnect'|'deleteAccount'} RequestTypes
 */

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
        const debugIndex = this.user.interface.console.AddLog('info', 'Request: ping...');
        const response = await this.Request('ping', GetDeviceInformations(true, true));

        if (response === null) {
            this.user.interface.console.AddLog('error', 'Request: ping error');
            this.online = false;
            return;
        }

        const status = response['status'];
        const devMode = response['devMode'];

        // Return status & popup out of this class
        if (status === 'update') {
            const title = langManager.curr['home']['alert-update-title'];
            const text = langManager.curr['home']['alert-update-text'];
            this.user.interface.popup.Open('ok', [ title, text ], BackHandler.exitApp, false);
        } else if (status === 'downdate') {
            this.online = false;
            const title = langManager.curr['home']['alert-newversion-title'];
            const text = langManager.curr['home']['alert-newversion-text'];
            this.user.interface.popup.Open('ok', [ title, text ], undefined, false);
        } else if (status === STATUS.MAINTENANCE) {
            this.online = false;
            // TODO - Gérer la maintenance
        } else if (status === 'ok') {
            this.online = true;
            if (devMode) this.user.interface.console.Enable();
            this.user.interface.console.EditLog(debugIndex, 'Request: ping - OK');
        }
    }

    /**
     * Try to connect to the server, with email (and device informations)
     * @param {string} email Email of the user
     * @returns {Promise<{status: 'free'|'ban'|'ok'|'newDevice'|'remDevice'|'waitMailConfirmation'|'limitDevice', remainMailTime: number?}>} Status of the user connection
     */
    Connect = async (email) => {
        let status = null;
        let remainMailTime = null;

        const lang = langManager.currentLangageKey;
        const device = GetDeviceInformations();
        const result_connect = await this.Request('login', { email, lang, ...device });

        if (result_connect === null) {
            this.user.interface.console.AddLog('error', 'Request - connect failed:', result_connect);
            return STATUS.ERROR;
        }

        if (Object.values(STATUS).includes(result_connect['status'])) {
            status = result_connect['status'];
            this.status = status;
            if (result_connect.hasOwnProperty('remainMailTime')) {
                remainMailTime = result_connect['remainMailTime'];
            }
        }

        if (status === STATUS.BANNED) {
            this.user.interface.console.AddLog('warn', 'Request: connect - BANNED');
        }
        if (status === STATUS.CONNECTED || status === STATUS.BANNED) {
            const token = result_connect['token'];
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
     * @param {string} email Email of the user
     * @param {string} username Pseudo of the user
     * @returns {Promise<'ok'|'pseudoUsed'|'pseudoIncorrect'|'limitAccount'?>} Status of the user signin
     */
    Signin = async (email, username) => {
        const device = GetDeviceInformations();
        const response = await this.Request('signin', { email, username, ...device });
        if (response === null) return null;

        const status = response['status'];
        const allStatus = [ 'ok', 'pseudoUsed', 'pseudoIncorrect', 'limitAccount' ];
        if (!allStatus.includes(status)) return null;

        return status;
    }

    /**
     * Send data unsaved on server
     * @param {Array} data Data to add to server
     * @returns {Promise<boolean>} Return success of online save
     */
    async SaveUserData(data) {
        const _data = {
            'data': data,
            'dataToken': this.dataToken
        };
        const response = await this.Request('addUserData', _data);
        if (response === null) return false;

        const status = response['status'];
        if (status !== 'ok') return false;

        if (response.hasOwnProperty('dataToken')) {
            this.dataToken = response['dataToken'];
        }

        return true;
    }

    /**
     * Load all user data
     * @param {boolean} [force=false] Force to load data from server (use empty dataToken)
     * @returns {Promise<object?>} Return all online data or null if failed
     */
    async LoadUserData(force = false) {
        const _data = { 'dataToken': force ? '' : this.dataToken };
        const response = await this.Request('getUserData', _data);
        if (response === null) return null;

        const { status, data } = response;
        if (status !== 'ok' || typeof(data) !== 'object') {
            return null;
        }

        return data;
    }

    /**
     * Save username on server
     * @param {string} username
     * @returns {Promise<'ok'|'alreadyUsed'|'alreadyChanged'|'incorrect'|'error'>}
     */
    async SaveUsername(username) {
        const _data = {
            'username': username,
            'dataToken': this.dataToken
        };
        const response = await this.Request('setUsername', _data);
        if (response === null) return 'error';

        const { status, usernameChangeState } = response;
        return usernameChangeState;
    }

    /**
     * Send report
     * @param {'activity'|'suggest'|'bug'|'message'|'error'} type Type of report to send
     * @param {object} data Data to send
     * @returns {Promise<boolean>} Return success of report
     */
    async SendReport(type, data) {
        const _data = {
            'type': type,
            'data': JSON.stringify(data)
        };
        const response = this.Request('report', _data);
        if (response === null) return false;

        const status = response['status'];
        if (status !== 'ok') return false

        return true;
    }

    TokenExpired() {
        this.user.interface.console.AddLog('warn', 'Request: token expired');
        const title = langManager.curr['server']['alert-tokenexpired-title'];
        const text = langManager.curr['server']['alert-tokenexpired-text'];
        this.user.interface.popup.ForceOpen('ok', [ title, text ], BackHandler.exitApp, false);
    }

    /**
     * @param {RequestTypes} type Type of request
     * @param {object} [data={}] Data to send
     * @param {boolean} [force=false] Force to send data to server (use empty dataToken)
     * @returns {Promise<{ status: string, content: string }|null>} Return response from server or null if failed
     */
    async Request(type, data = {}, force = false) {
        let reqData = { 'action': type, ...data };
        if (this.token || force) {
            reqData['token'] = this.token;
        }

        const response = await Request_Async(reqData);
        if (response.status !== 200) {
            // Request failed
            this.user.interface.console.AddLog('warn', 'Request: error - ', response);
            const title = langManager.curr['server']['alert-error-title'];
            const text = langManager.curr['server']['alert-errorr-text'];
            this.user.interface.popup.ForceOpen('ok', [ title, text ], null, false);
            return null;
        }

        if (response.content['status'] === 'tokenExpired') {
            // Token expired
            this.TokenExpired();
            return null;
        }

        return response.content;
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