import os from 'os';

/**
 * Check if a string is a valid json
 * @param {string} str 
 * @returns {boolean}
 */
function StrIsJson(str) {
    try { JSON.parse(str); }
    catch (e) { return false; }
    return true;
}

/**
 * Check if a string is an integer
 * @param {*} value
 * @returns {boolean}
 */
function IsInt(value) {
    try { parseInt(value); }
    catch (e) { return false; }
    return !isNaN(parseInt(value));
}

/**
 * @returns {string} Local IP address
 */
function GetLocalIP() {
    const ifaces = os.networkInterfaces();
    let localIP = '';

    Object.keys(ifaces).forEach((ifname) => {
        ifaces[ifname].forEach((iface) => {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                return '';
            }

            localIP = iface.address;
        });
    });

    return localIP;
}

/**
 * @returns {number} Unix timestamp in seconds (UTC)
 */
function GetTime() {
    const offset = (new Date()).getTimezoneOffset() * 60;
    return Math.floor(Date.now() / 1000) - offset;
}

export { StrIsJson, IsInt, GetLocalIP, GetTime };
