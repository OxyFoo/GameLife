import { NativeModules } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const AES = NativeModules.Aes;
const URL = 'https://oxyfoo.com/App/GameLife/app.php';

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
        this.key = '';

        // Device informations
        this.deviceID = DeviceInfo.getUniqueId();
        this.deviceName = DeviceInfo.getDeviceNameSync();

        this.timeout;
    }

    isConnected = () => {
        return this.key.length === 64;
    }

    refreshAccount = () => {
        const pingResult = () => {
            if (!this.online) {
                loop(TIMER_LONG);
            } else {
                if (!this.isConnected()) {
                    this.connect(connectResult);
                }
            }
        };

        const connectResult = (status, key) => {
            if (typeof(status) === 'undefined') {
                loop(TIMER_SHORT, 'Invalid response');
                return;
            }
            
            const index_status = Object.values(STATUS).indexOf(status);
            if (index_status !== -1) this.status = STATUS[Object.keys(STATUS)[index_status]];

            if (this.status === STATUS.CONNECTED) {
                if (typeof(key) === 'undefined' || key.length !== 32) {
                    loop(TIMER_SHORT, 'Invalid key length');
                    return;
                } else {
                    this.key = this.stringToHex(key);
                    // Online load
                }
            } else {
                this.key = '';
            }
            this.user.changePage();
        };

        const loop = (duration, error) => {
            if (typeof(error) !== 'undefined') {
                console.error(error);
            }
            if (typeof(duration) === 'number') {
                this.timeout = setTimeout(this.refreshAccount, duration);
            }
        }

        clearTimeout(this.timeout);
        if (this.user.email) {
            this.checkConnectivity(pingResult);
        } else if (this.status !== STATUS.OFFLINE) {
            this.status = STATUS.OFFLINE;
        }
    }

    checkConnectivity = (callback) => {
        const pingResponse = (result) => {
            const status = result['status'];
            if (typeof(status) === 'undefined' || status != 'OK') {
                console.log('Server not found');
                this.online = false;
                if (typeof(callback) !== 'undefined') {
                    callback();
                }
                return;
            }
            console.log('ping ok');
            this.online = true;
            if (typeof(callback) !== 'undefined') {
                callback();
            }
        }
        const pingError = () => {
            console.log('Server not found');
            if (typeof(callback) !== 'undefined') {
                callback();
            }
        }

        let data = {
            'action': 'ping'
        }
        this.Request(URL, data, pingResponse, pingError);
    }

    connect = (callback) => {
        const tokenResponse = (result) => {
            console.log(result);
            const status = result['status'];
            const key = result['key'];
            if (typeof(callback) !== 'undefined') {
                callback(status, key);
            }
        }

        let data = {
            'action': 'gettoken',
            'deviceID': this.deviceID,
            'deviceName': this.deviceName,
            'email': this.user.email
        }
        this.Request(URL, data, tokenResponse);
    }

    disconnect = () => {
        this.key = '';
        this.status = STATUS.OFFLINE;
    }

    Request = (url, data, callback, errorCallback, method, headers) => {
        defaultHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        const header = {
            method: method || 'POST',
            headers: headers || defaultHeaders,
            body: JSON.stringify(data)
        }
        fetch(url, header).then((response) => {
            if (response.status != 200) {
                console.error(response.status);
                if (typeof(errorCallback) === 'function') {
                    errorCallback(error);
                }
                return null;
            }
            return response.json();
        }).then((json) => {
            if (json && typeof(callback) === 'function') {
                callback(json);
            }
        }).catch((error) => {
            this.online = false;
            console.error(error);
            if (typeof(errorCallback) === 'function') {
                errorCallback(error);
            }
        });
    }

    encryptData = (text, key) => AES.encrypt(text, key, this.iv).then(cipher => cipher);
    decryptData = (text, key) => AES.decrypt(text, key, this.iv).then(cipher => cipher);
    stringToHex = (text) => {
        return Array.from(text).map(c =>
            c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16) :
            encodeURIComponent(c).replace(/\%/g,'').toLowerCase()
        ).join('');
    }
}

export default ServManager;