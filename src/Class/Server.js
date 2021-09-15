import DeviceInfo from 'react-native-device-info';

import { Request_Async } from '../Functions/Request';
import langManager from '../Managers/LangManager';

//import { NativeModules } from 'react-native';
//const AES = NativeModules.Aes;

const TIMER_LONG = 60 * 1000;
const TIMER_SHORT = 10 * 1000;

const STATUS = {
    OFFLINE  : 'offline',
    CONNECTED: 'ok',
    BLACKLIST: 'blacklist',
    WAITMAIL : 'waitMailConfirmation',
    BANNED   : 'ban',
    SIGNIN   : 'signin'
};

class ServManager {
    constructor(user) {
        this.user = user;
        this.online = false;    // Server ping
        this.status = STATUS.OFFLINE;

        this.iv = '20c3f6cb9dc45ee7524d2b252bac7d5e';
        this.token = '';

        // Device informations
        this.deviceID = DeviceInfo.getUniqueId();
        this.deviceName = DeviceInfo.getDeviceNameSync();

        this.timeout;
    }

    destructor() {
        clearTimeout(this.timeout);
    }

    isConnected = () => {
        return this.status === STATUS.CONNECTED;
    }

    async AsyncRefreshAccount() {
        clearTimeout(this.timeout);

        // Ping
        const data = {
            'action': 'ping',
            'deviceID': this.deviceID,
            'deviceName': this.deviceName
        };
        const result_ping = await Request_Async(data);
        this.online = typeof(result_ping['status']) !== 'undefined' && result_ping['status'] === 'ok';

        // Connection
        if (this.online) {
            if (!this.isConnected() && this.user.email !== '') {
                const result_connect = await this.Connect();
                const status = result_connect['status'];
                const token = result_connect['token'];

                if (typeof(status) === 'undefined') {
                    console.error('Invalid response');
                    return;
                }
                
                const index_status = Object.values(STATUS).indexOf(status);
                if (index_status !== -1) this.status = STATUS[Object.keys(STATUS)[index_status]];
    
                if (this.status === STATUS.CONNECTED) {
                    if (typeof(token) === 'undefined' || token.length === 0) {
                        console.error('Invalid key length');
                        return;
                    } else {
                        this.token = token;
                        this.user.loadData(true);
                    }
                } else if (this.status === STATUS.BLACKLIST) {
                    const title = langManager.curr['identity']['alert-blacklist-title'];
                    const text = langManager.curr['identity']['alert-blacklist-text'];
                    this.user.openPopup('ok', [ title, text ], this.user.disconnect, false);
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

    async Connect() {
        const data = {
            'action': 'getToken',
            'deviceID': this.deviceID,
            'deviceName': this.deviceName,
            'email': this.user.email,
            'lang': langManager.currentLangageKey
        };
        return await Request_Async(data);
    }

    async getInternalData(hash) {
        if (!this.online) {
            return;
        }
        const data = {
            'action': 'getInternalData',
            'hash': hash || '',
            'lang': langManager.currentLangageKey
        };
        return await Request_Async(data);
    }

    async getLeaderboard() {
        const data = {
            'action': 'getLeaderboard',
            'token': this.token
        }
        return await Request_Async(data);
    }

    disconnect = () => {
        this.token = '';
        this.status = STATUS.OFFLINE;
    }

    /*encryptData = (text, key) => AES.encrypt(text, key, this.iv).then(cipher => cipher);
    decryptData = (text, key) => AES.decrypt(text, key, this.iv).then(cipher => cipher);
    stringToHex = (text) => {
        return Array.from(text).map(c =>
            c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16) :
            encodeURIComponent(c).replace(/\%/g,'').toLowerCase()
        ).join('');
    }*/
}

export default ServManager;