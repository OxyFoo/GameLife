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
 * @returns {string} Local IP address
 */
function GetLocalIP() {
    const ifaces = os.networkInterfaces();
    let localIP = '';

    Object.keys(ifaces).forEach((ifname) => {
        ifaces[ifname].forEach((iface) => {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                return;
            }

            localIP = iface.address;
        });
    });

    return localIP;
}

export { StrIsJson, GetLocalIP };
