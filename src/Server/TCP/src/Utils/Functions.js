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
function GetGlobalTime() {
    const offset = (new Date()).getTimezoneOffset() * 60;
    return Math.floor(Date.now() / 1000) - offset;
}

/**
 * Escape a string
 * @param {string} val
 * @returns {string}
 * @see https://stackoverflow.com/questions/7744912/making-a-javascript-string-sql-friendly
 */
function EscapeString(val) {
    return val.replace(/[\0\n\r\b\t\\'"\x1a]/g, function (s) {
        switch (s) {
        case "\0":
            return "\\0";
        case "\n":
            return "\\n";
        case "\r":
            return "\\r";
        case "\b":
            return "\\b";
        case "\t":
            return "\\t";
        case "\x1a":
            return "\\Z";
        case "'":
            return "\\'";
        case '"':
            return '\\"';
        default:
            return "\\" + s;
        }
    });
}

export { StrIsJson, IsInt, GetLocalIP, GetGlobalTime, EscapeString };
