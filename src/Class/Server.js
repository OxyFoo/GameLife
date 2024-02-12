import RNExitApp from 'react-native-exit-app';

import langManager from 'Managers/LangManager';

import { OpenStore } from 'Utils/Store';
import { Request_Async } from 'Utils/Request';
import { GetDeviceInformations } from 'Utils/Device';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {'offline'|'ok'|'free'|'waitMailConfirmation'|'ban'|'newDevice'|'remDevice'|'maintenance'|'update'|'downdate'|'limitDevice'|'error'} ServerStatus
 * @typedef {'ok'|'free'|'waitMailConfirmation'|'ban'|'newDevice'|'remDevice'|'limitDevice'|'error'} LoginStatus
 * @typedef {'ok'|'pseudoUsed'|'pseudoIncorrect'|'limitAccount'|'error'} SigninStatus
 * @typedef {'ping'|'login'|'signin'|'getUserData'|'addUserData'|'addAchievements'|'claimAchievement'|'setUsername'|'getDailyDeals'|'buyDailyDeals'|'buyRandomChest'|'buyTargetedChest'|'buyDye'|'sellStuff'|'claimNonZeroDays'|'adWatched'|'report'|'getDate'|'giftCode'|'getDevices'|'disconnect'|'deleteAccount'} RequestTypes
 * @typedef {'activity'|'suggest'|'bug'|'message'|'error'} ReportTypes
*/

/** @type {ServerStatus[]} */
const STATUS = [ 'offline', 'ok', 'free', 'waitMailConfirmation', 'ban', 'newDevice', 'remDevice', 'maintenance', 'update', 'downdate', 'limitDevice', 'error' ];

class Server {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;
    }

    token = '';
    dataToken = '';

    /** @type {boolean} True if the server is online */
    online = false;

    /** @type {ServerStatus} */
    status = 'offline';

    /**
     * @private
     * @type {boolean} True if the popup is showed
     */
    popupDowndateShowed = false;

    Clear = () => {
        this.token = '';
        this.dataToken = '';
        this.online = false;
        this.status = 'offline';
    }

    /**
     * Return true if the server is connected & user is connected to the server
     * @param {boolean} [keepBanOrDowndate=true] Consider ban or downdate as connected
     * @returns {boolean}
     */
    IsConnected = (keepBanOrDowndate = true) => {
        if (this.online === false) {
            return false;
        }

        if (this.status === 'ok') {
            return true;
        }

        if (keepBanOrDowndate && this.status === 'ban') {
            return true;
        }

        if (keepBanOrDowndate && this.status === 'downdate') {
            return true;
        }

        return false;
    }

    Ping = async (resetConnections = false) => {
        const debugIndex = this.user.interface.console.AddLog('info', 'Request: ping...');

        let data = { ...GetDeviceInformations(true, true) };
        if (resetConnections) data['reset'] = 1;
        const response = await this.Request('ping', data);

        if (response === null) {
            this.user.interface.console.AddLog('error', 'Request: ping error');
            this.online = false;
            return;
        }

        /** @type {ServerStatus} */
        const status = response['status'];
        const devMode = response['devMode'];

        this.status = status;
        if (devMode) {
            this.user.interface.console.Enable();
        }

        // Return status & popup out of this class
        if (status === 'update') {
            const update = async () => {
                await OpenStore();
                RNExitApp.exitApp();
            };
            const title = langManager.curr['home']['alert-update-title'];
            const text = langManager.curr['home']['alert-update-text'];
            this.user.interface.popup.Open('ok', [ title, text ], update, false);
        } else if (status === 'downdate') {
            this.online = true;
            if (this.popupDowndateShowed === false) {
                this.popupDowndateShowed = true;
                const title = langManager.curr['home']['alert-newversion-title'];
                const text = langManager.curr['home']['alert-newversion-text'];
                this.user.interface.popup.Open('ok', [ title, text ], undefined, false);
            }
        } else if (status === 'maintenance' && this.status !== 'maintenance') {
            this.online = false;
        } else if (status === 'error') {
            this.online = false;
            const title = langManager.curr['home']['alert-error-title'];
            const text = langManager.curr['home']['alert-error-text'];
            this.user.interface.popup.Open('ok', [ title, text ], undefined, false);
        } else if (status === 'ok') {
            this.online = true;
            this.user.interface.console.EditLog(debugIndex, 'same', 'Request: ping - OK');
        }
    }

    /**
     * Try to connect to the server, with email (and device informations)
     * @param {string} email Email of the user
     * @returns {Promise<{status: LoginStatus, remainMailTime: number | null}>} Status of the user connection
     */
    Connect = async (email) => {
        /** @type {LoginStatus | null} */
        let status = null;
        let remainMailTime = null;

        const lang = langManager.currentLangageKey;
        const device = GetDeviceInformations();
        const result_connect = await this.Request('login', { email, lang, ...device });

        if (result_connect === null) {
            this.user.interface.console.AddLog('error', 'Request - connect failed:', result_connect);
            return { status: 'error', remainMailTime: null };
        }

        /** @type {LoginStatus} */
        const s = result_connect['status'];
        if (STATUS.includes(s)) {
            status = s;
            this.status = status;
            if (result_connect.hasOwnProperty('remainMailTime')) {
                remainMailTime = result_connect['remainMailTime'];
            }
        }

        if (status === 'ban') {
            this.user.interface.console.AddLog('warn', 'Request: connect - BANNED');
        }
        if (status === 'ok' || status === 'ban') {
            const token = result_connect['token'];
            if (typeof(token) !== 'undefined' && token.length) {
                this.token = token;
            } else {
                status = 'error';
            }
        }

        const output = {
            status: status,
            remainMailTime: parseInt(remainMailTime)
        };
        return output;
    }

    /**
     * Send a request to the server to create a new user account
     * @param {string} email Email of the user
     * @param {string} username Pseudo of the user
     * @returns {Promise<SigninStatus>} Status of the user signin
     */
    Signin = async (email, username) => {
        const device = GetDeviceInformations();
        const response = await this.Request('signin', { email, username, ...device });
        if (response === null) return 'error';

        /** @type {SigninStatus} */
        const status = response['status'];
        const allStatus = [ 'ok', 'pseudoUsed', 'pseudoIncorrect', 'limitAccount' ];
        if (!allStatus.includes(status)) return 'error';

        return status;
    }

    /**
     * Send data unsaved on server
     * @param {object} data Data to add to server
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
     * Send achievements unsaved on server (don't reload dataToken or inventory)
     * @param {Array<number>} achievementsID Data to add to server
     * @returns {Promise<Array<number> | false>} Return list of achievements ID added
     */
    async AddAchievements(achievementsID) {
        const _data = { achievementsID };
        const response = await this.Request('addAchievements', _data);
        if (response === null) return false;

        const status = response['status'];
        if (status !== 'ok') return false;

        return response['newAchievements'];
    }

    /**
     * Send achievements unsaved on server (don't reload dataToken or inventory)
     * @param {number} achievementID Data to add to server
     * @returns {Promise<string | false>} Return rewards string or false if failed
     */
    async ClaimAchievement(achievementID) {
        const _data = { achievementID };
        const response = await this.Request('claimAchievement', _data);
        if (response === null) return false;

        const status = response['status'];
        if (status !== 'ok') return false;

        if (!response.hasOwnProperty('rewards')) {
            return false;
        }

        return response['rewards'];
    }

    /**
     * Load all user data
     * @param {boolean} [force=false] Force to load data from server (use empty dataToken)
     * @returns {Promise<object | null>} Return all online data or null if failed
     */
    async LoadUserData(force = false) {
        const _data = { 'dataToken': force ? '' : this.dataToken };
        const response = await this.Request('getUserData', _data);
        if (response === null) return null;

        const data = response['data'];
        if (response['status'] !== 'ok' || typeof(data) !== 'object') {
            return null;
        }

        return data;
    }

    /**
     * Save username on server
     * @param {string} username
     * @returns {Promise<'ok' | 'alreadyUsed' | 'alreadyChanged' | 'incorrect' | 'error'>}
     */
    async SaveUsername(username) {
        const _data = {
            'username': username,
            'dataToken': this.dataToken
        };
        const response = await this.Request('setUsername', _data);
        if (response === null) return 'error';

        return response['usernameChangeState'];
    }

    /**
     * Save username on server
     * @returns {Promise<Array<string> | null>} Return array of item ID
     */
    async GetDailyDeals() {
        const _data = {
            'dataToken': this.dataToken
        };

        const response = await this.Request('getDailyDeals', _data);
        if (response === null) return null;

        const status = response['status'];
        if (status !== 'ok') return null;

        const items = response['dailyDeals'];
        if (!Array.isArray(items)) return null;

        return items;
    }

    /**
     * Send report
     * @param {ReportTypes} type Type of report to send
     * @param {object} data Data to send
     * @returns {Promise<boolean>} Return success of report
     */
    async SendReport(type, data) {
        const _data = {
            'type': type,
            'data': JSON.stringify(data)
        };
        const response = await this.Request('report', _data);
        if (response === null) return false;

        const status = response['status'];
        if (status !== 'ok') return false

        return true;
    }

    TokenExpired() {
        this.user.interface.console.AddLog('warn', 'Request: token expired');
        const title = langManager.curr['server']['alert-tokenexpired-title'];
        const text = langManager.curr['server']['alert-tokenexpired-text'];
        this.user.interface.popup.ForceOpen('ok', [ title, text ], RNExitApp.exitApp, false);
    }

    /**
     * @param {RequestTypes} type Type of request
     * @param {object} [data={}] Data to send
     * @param {boolean} [force=false] Force to send data to server (use empty dataToken)
     * @returns {Promise<object | null>} Return response from server or null if failed
     */
    async Request(type, data = {}, force = false) {
        let reqData = { 'action': type, ...data };
        if (this.token || force) {
            reqData['token'] = this.token;
        }

        const response = await Request_Async(reqData);
        if (response.status !== 200) {
            // Request failed
            if (this.online) { // Don't show popup if not connected to server
                this.user.interface.console.AddLog('warn', 'Request: error -', response);
                const title = langManager.curr['server']['alert-error-title'];
                const text = langManager.curr['server']['alert-error-text'];
                this.user.interface.popup.ForceOpen('ok', [ title, text ], null, false);
            }
            return null;
        }

        // Print error in console
        if (response.content['status'] === 'error' && response.content.hasOwnProperty('error')) {
            this.user.interface.console.AddLog('warn', 'Request: error -', response.content['error']);
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
