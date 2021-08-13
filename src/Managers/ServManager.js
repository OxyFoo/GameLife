import CryptoJS from "react-native-crypto-js";
import DeviceInfo from 'react-native-device-info';

import user from "./UserManager";

const URL = 'https://oxyfoo.com/App/GameLife/app.php';

class ServManager {
    constructor() {
        this.online = false;
        this.key = '';

        // Device informations
        this.deviceID = DeviceInfo.getUniqueId();
        this.deviceName = DeviceInfo.getDeviceNameSync();

        // Start
        this.refreshAccount();
    }

    isConnected = () => {
        return this.key.length === 16;
    }

    checkConnectivity = () => {
        const pingResponse = (result) => {
            const status = result['status'];
            if (typeof(status) === 'undefined' || status != 'OK') {
                console.log('Server not found');
                this.online = false;
                return;
            }
            this.online = true;
        }
        const pingError = () => {
            console.log('Server not found');
            this.online = false;
        }

        let data = {
            'action': 'ping'
        }
        this.Request(URL, data, pingResponse, pingError);
    }

    refreshAccount = () => {
        let loop = false;
        if (user.email) {
            if (!this.online) {
                this.checkConnectivity();
                loop = true;
            } else {
                if (!this.isConnected()) {
                    this.getKey();
                    loop = true;
                }
            }
        }
        if (loop) {
            setTimeout(this.refreshAccount, 10*1000);
        }
    }

    getKey = () => {
        const tokenResponse = (result) => {
            const status = result['status'];
            if (typeof(status) === 'undefined') {
                console.error('Invalid response');
                return;
            }

            const key = result['key'];
            if (key.length !== 16) {
                console.error('Invalid key length');
                return;
            }

            this.key = key;
            console.log('Key : ' + key);
            user.changePage('');
        }

        let data = {
            'action': 'gettoken',
            'deviceID': this.deviceID,
            'deviceName': this.deviceName,
            'email': user.email
        }
        this.Request(URL, data, tokenResponse);
    }

    Connect = () => {
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
            console.error(error);
            if (typeof(errorCallback) === 'function') {
                errorCallback(error);
            }
        });
    }
}

class Crypto {
    #iv = '20c3f6cb9dc45ee7524d2b252bac7d5e';
    #key =  'z9KbaqlO4T9wq71ze!_:{CW?icxYl?;}';
    /*constructor() {
        this.#key = this.#stringToHex(this.#key);
    }*/

    encryptData = (text) => { return CryptoJS.AES.encrypt(CryptoJS.algo.AES, this.#key, text).toString(); }
    decryptData = (text) => { return CryptoJS.AES.decrypt(CryptoJS.algo.AES, this.#key, text).toString(); }

    /*encryptData = (text) => AES.encrypt(text, this.#key, this.#iv).then(cipher => cipher);
    decryptData = (text) => AES.decrypt(text, this.#key, this.#iv).then(cipher => cipher);
    #stringToHex = (text) => {
        return Array.from(text).map(c =>
            c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16) :
            encodeURIComponent(c).replace(/\%/g,'').toLowerCase()
        ).join('');
    }*/
}

export default ServManager;