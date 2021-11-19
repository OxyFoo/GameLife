import { BackHandler } from 'react-native';

import { UserManager } from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { Request_Async } from '../Functions/Request';
import { getDeviceInformations } from '../Functions/Functions';

const TIMER_LONG = 60 * 1000;
const TIMER_SHORT = 10 * 1000;

const STATUS = {
    OFFLINE   : 'offline',
    CONNECTED : 'ok',
    FREE      : 'free',
    WAITMAIL  : 'waitMailConfirmation',
    BANNED    : 'ban',
    NEWDEVICE : 'newDevice',
    ERROR     : 'error'
};

class Server {
    constructor(user) {
        /**
         * @type {UserManager}
         */
        this.user = user;
        this.online = false;
        this.status = STATUS.OFFLINE;
        this.token = '';
    }

    destructor() {
        this.online = false;
        this.status = STATUS.OFFLINE;
        this.token = '';
    }

    isConnected() {
        return this.status === STATUS.CONNECTED;
    }

    Ping = async () => {
        let online = false;
        const result_ping = await this.__reqPing();
        if (result_ping.status === 200) {
            const status = result_ping.data['status'];
            // Return status & popup out of this class
            if (status === 'update') {
                const title = langManager.curr['home']['alert-update-title'];
                const text = langManager.curr['home']['alert-update-text'];
                this.user.openPopup('ok', [ title, text ], BackHandler.exitApp, false);
            } else if (status === 'downdate') {
                const title = langManager.curr['home']['alert-newversion-title'];
                const text = langManager.curr['home']['alert-newversion-text'];
                this.user.openPopup('ok', [ title, text ], undefined, false);
            } else if (status === 'ok') {
                online = true;
            }
        } else {
            console.error('Ping failed: ' + result_ping.status + ' - ' + result_ping.data['error']);
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
            console.error('Get token failed: ' + result_connect.status + ' - ' + result_connect.data['error']);
            return STATUS.ERROR;
        }

        if (Object.values(STATUS).includes(result_connect.data['status'])) {
            status = result_connect.data['status'];
            this.status = status;
        }

        if (status === STATUS.CONNECTED) {
            const token = result_connect.data['token'];
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
     * @param {String} pseudo - Pseudo of the user
     * @returns {Promise<String>} - Status of the user signin
     */
    Signin = async (email, pseudo) => {
        let signin = null;
        const result = await this.__reqSignin(email, pseudo);
        if (result.status === 200) {
            const status = result.data['status'];
            if (status === 'ok' || status === 'pseudoUsed') {
                signin = status;
            }
        }
        return signin;
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

    __reqSignin(email, pseudo) {
        const data = {
            'action': 'signin',
            'email': email,
            'pseudo': pseudo,
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

    disconnect = () => {
        this.token = '';
        this.status = STATUS.OFFLINE;
    }
}

export default Server;