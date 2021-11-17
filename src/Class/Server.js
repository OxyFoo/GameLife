import { BackHandler } from 'react-native';

import { UserManager } from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { Request_Async } from '../Functions/Request';
import { getDeviceInformations } from '../Functions/Functions';

const TIMER_LONG = 60 * 1000;
const TIMER_SHORT = 10 * 1000;

const STATUS = {
    OFFLINE  : 'offline',
    CONNECTED: 'ok',
    FREE     : 'free',
    WAITMAIL : 'waitMailConfirmation',
    BANNED   : 'ban',
    SIGNIN   : 'signin',
    ERROR    : 'error'
};

class Server {
    constructor(user) {
        /**
         * @type {UserManager}
         */
        this.user = user;
        /**
         * @deprecated - Unused variable
         */
        this.online = false;    // Server ping
        this.status = STATUS.OFFLINE;

        this.iv = '20c3f6cb9dc45ee7524d2b252bac7d5e';
        this.token = '';

        this.timeout;
    }

    destructor() {
        this.online = false;
        this.status = STATUS.OFFLINE;
        this.token = '';
        clearTimeout(this.timeout);
    }

    isConnected() {
        return this.status === STATUS.CONNECTED;
    }

    Ping = async () => {
        const result_ping = await this.reqPing();
        if (result_ping.status === 200) {
            const status = result_ping.data['status'];
            if (status === 'update') {
                const title = langManager.curr['home']['alert-update-title'];
                const text = langManager.curr['home']['alert-update-text'];
                this.user.openPopup('ok', [ title, text ], BackHandler.exitApp, false);
            } else if (status === 'downdate') {
                this.online = false;
                const title = langManager.curr['home']['alert-newversion-title'];
                const text = langManager.curr['home']['alert-newversion-text'];
                this.user.openPopup('ok', [ title, text ], undefined, false);
            }
        } else {
            console.error('Ping failed: ' + result_ping.status + ' - ' + result_ping.data['error']);
        }
    }

    /**
     * Try to connect to the server, with email (and device informations)
     * @param {string} email - Email of the user
     * @returns {Promise<String>} - Status of the user connection
     */
    Connect = async (email) => {
        let status = null;
        const result_connect = await this.reqConnect(email);

        if (result_connect.status !== 200) {
            console.error('Get token failed: ' + result_connect.status + ' - ' + result_connect.data['error']);
            return STATUS.ERROR;
        }

        if (Object.values(STATUS).includes(result_connect.data['status'])) {
            status = result_connect.data['status'];
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

    // TODO - Old function, remove it
    async AsyncRefreshAccount() {
        clearTimeout(this.timeout);

        // Ping
        const result_ping = await this.reqPing();
        if (result_ping.status === 'ok') {
            this.online = true;
            const state = result_ping.data['state'];
            if (state === 'update') {
                const title = langManager.curr['home']['alert-update-title'];
                const text = langManager.curr['home']['alert-update-text'];
                this.user.openPopup('ok', [ title, text ], BackHandler.exitApp, false);
            } else if (state === 'nextUpdate') {
                this.online = false;
                const title = langManager.curr['home']['alert-newversion-title'];
                const text = langManager.curr['home']['alert-newversion-text'];
                this.user.openPopup('ok', [ title, text ], undefined, false);
            }
        } else {
            console.error('Ping failed: ' + result_ping.error);
        }

        // Connection
        if (this.online) {
            if (!this.isConnected() && this.user.email !== '') {
                const result_connect = await this.reqConnect(this.user.email);

                if (result_connect.status === 'err') {
                    console.error('Get token failed: ' + result_connect.error);
                    return;
                }

                const state = result_connect.data['state'];
                const index_status = Object.values(STATUS).indexOf(state);
                if (index_status !== -1) this.status = STATUS[Object.keys(STATUS)[index_status]];
    
                if (this.status === STATUS.CONNECTED) {
                    const token = result_connect.data['token'];
                    if (typeof(token) === 'undefined' || token.length === 0) {
                        console.error('Invalid key length');
                        return;
                    } else {
                        this.token = token;
                        await this.user.loadData(true);
                    }
                } else {
                    this.token = '';
                    const time = [ STATUS.SIGNIN, STATUS.WAITMAIL ].includes(this.status) ? TIMER_SHORT : TIMER_LONG;
                    this.timeout = setTimeout(this.AsyncRefreshAccount.bind(this), time);

                    if (this.status === STATUS.SIGNIN) {
                        const title = langManager.curr['identity']['alert-sendemail-title'];
                        const text = langManager.curr['identity']['alert-sendemail-text'];
                        this.user.openPopup('ok', [ title, text ], undefined, false);
                    }
                }
                this.user.changePage();
            }
        }
    }

    reqPing() {
        const data = {
            'action': 'ping',
            ...getDeviceInformations(true, true)
        };
        return Request_Async(data);
    }

    reqConnect(email) {
        const data = {
            //'action': 'getToken',
            'action': 'login',
            'email': email,
            'lang': langManager.currentLangageKey,
            ...getDeviceInformations()
        };
        return Request_Async(data);
    }

    reqGetInternalData(hash) {
        const data = {
            'action': 'getInternalData',
            'hash': hash || '',
            'lang': langManager.currentLangageKey
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