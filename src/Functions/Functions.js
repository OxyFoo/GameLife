import DeviceInfo from 'react-native-device-info';

function twoDigit(n) {
    return ('00' + n).slice(-2);
}

function sum(arr) {
    return arr.reduce((partial_sum, a) => partial_sum + parseInt(a), 0);
}

function isUndefined(el) {
    return typeof(el) === 'undefined';
}

function strIsJSON(str) {
    let isJSON = true;
    try { JSON.parse(str); }
    catch (e) { isJSON = false; }
    return isJSON;
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

export { twoDigit, sum, range, strIsJSON, isEmail,
    getDeviceInformations, isUndefined,
    sleep, random };