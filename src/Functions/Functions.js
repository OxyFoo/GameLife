import DeviceInfo from 'react-native-device-info';

function twoDigit(n) {
    return ('00' + n).slice(-2);
}

/**
 * @param {Number} number 
 * @param {Number} decimal 
 * @returns {Number}
 */
function round(number, decimal = 0) {
    const dec = decimal.toString();
    return  +(Math.round(number + ('e+' + dec)) + ('e-' + dec));
}

function sum(arr) {
    return arr.reduce((partial_sum, a) => partial_sum + parseInt(a), 0);
}

function isUndefined(el) {
    return typeof(el) === 'undefined';
}

function minmax(min, value, max) {
    let output = null;
    if (typeof(value) === 'number') {
        output = value;
        if (output < min) output = min;
        else if (output > max) output = max;
    }
    return output;
}

function strIsJSON(str) {
    let isJSON = true;
    try { JSON.parse(str); }
    catch (e) { isJSON = false; }
    return isJSON;
}

/**
 * @param {Array} array 
 * @param {String} key - Key of array
 * @returns {Array} - Return sorted array
 */
function sortByKey(array, key) {
    const format = (value) => typeof(value) === 'string' ? value.toLowerCase() : value;
    const compare = (a, b) => format(a[key]) < format(b[key]) ? -1 : 1;
    return array.sort(compare);
}

/**
 * 
 * @param {Array} array 
 * @param {String} key 
 * @param {*} value 
 * @returns {?Object} Return object or null if didn't exists
 */
function getByKey(array, key, value) {
    const result = array.find((element) => element[key] == value);
    return !isUndefined(result) ? result : null;
}

/**
 * @param {String} email
 * @returns {Boolean} - true if str "email" is a valid email
 */
function isEmail(email) {
    let isEmail = false;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (typeof(email) === 'string' && email.length && reg.test(email)) {
        isEmail = true;
    }
    return isEmail;
}

/**
 * 
 * @param {Boolean} OS - true to get the name and the version of the OS
 * @param {Boolean} version - true to get the version of the app
 * @returns Dictionary of currect device
 */
function getDeviceInformations(OS = false, version = false) {
    let device = {};

    device.deviceID = DeviceInfo.getUniqueId();
    device.deviceName = DeviceInfo.getDeviceNameSync();

    if (OS) {
        device.deviceOSName = DeviceInfo.getSystemName();
        device.deviceOSVersion = DeviceInfo.getSystemVersion();
    }
    if (version) {
        const appVersion = require('../../package.json').version;
        device.version = appVersion;
    }

    return device;
}

function range(length) {
    return Array.from({ length: length+1 }, (_, i) => i);
}

function sleep(ms) {
    const T = Math.max(0, ms);
    return new Promise(resolve => setTimeout(resolve, T));
}

function random(min, max) {
    const m = min || 0;
    const M = max || 1;
    let R = Math.random() * (M - m) + m;
    return parseInt(R);
}

export { twoDigit, round, sum, range, strIsJSON,
    sortByKey, getByKey, isEmail,
    getDeviceInformations, isUndefined, minmax,
    sleep, random };