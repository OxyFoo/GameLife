/**
 * @typedef {import('websocket').connection} connection
 * @typedef {import('../Users.js').User} User
 * @typedef {import('../Users.js').default} Users
 * @typedef {import('Types/Logs.js').LogType} LogType
 */

/**
 * @param {Users} users
 * @param {User} user
 * @param {LogType} type
 * @param {string} data
 * @returns {Promise<boolean>} Whether the friend was added successfully
 */
async function AddLog(users, user, type, data) {
    const IP = user.connection.socket.remoteAddress;
    const command = 'INSERT INTO `Logs` (`AccountID`, `DeviceID`, `IP`, `Type`, `Data`, `Server`) VALUES (?, ?, ?, ?, ?, "tcp")';
    const args = [ user.accountID, user.deviceID, IP, type, data ];
    const result = users.db.QueryPrepare(command, args);

    if (result === null) {
        return false;
    }

    return true;
}

/**
 * @param {Users} users
 * @param {connection} connection
 * @param {LogType} type
 * @param {string} data
 * @returns {Promise<boolean>} Whether the friend was added successfully
 */
async function AddLogRaw(users, connection, type, data) {
    const IP = connection.socket.remoteAddress;
    const command = 'INSERT INTO `Logs` (`AccountID`, `DeviceID`, `IP`, `Type`, `Data`, `Server`) VALUES (?, ?, ?, ?, ?, "tcp")';
    const args = [ 0, 0, IP, type, data ];
    const result = users.db.QueryPrepare(command, args);

    if (result === null) {
        return false;
    }

    return true;
}

export { AddLog, AddLogRaw };
