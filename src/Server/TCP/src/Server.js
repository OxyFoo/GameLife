import fs from 'fs';
import WebSocket from 'websocket';
import { createServer as createHTTPServer } from 'http';
import { createServer } from 'https';

import Users from './Users.js';
import { StrIsJson, GetLocalIP } from './Utils/Functions.js';
import { AddLogRaw } from './Utils/Logs.js';
import { ZapCommand } from './ZapNotifications/index.js';

/**
 * @typedef {import('./Sql.js').default} SQL
 * @typedef {import('./Users.js').User} User
 */

class Server {
    /** @param {SQL} database */
    constructor(database) {
        const ENV = process.env.ENV;

        if (ENV === 'dev') {
            this.server = createHTTPServer({});
        } else {
            this.server = createServer({
                key: fs.readFileSync('/etc/letsencrypt/live/www.oxyfoo.com/privkey.pem'),
                cert: fs.readFileSync('/etc/letsencrypt/live/www.oxyfoo.com/cert.pem')
            });
        }

        this.server.on('error', this.onError);

        this.db = database;
        this.users = new Users(database);
    }

    /**
     * @param {number} port
     */
    Listen = (port) => {
        if (!this.server.listening) {
            this.server.listen(port);

            this.wsServer = new WebSocket.server({ httpServer: this.server });
            this.wsServer.addListener('connect', this.onConnect);
            this.wsServer.addListener('request', this.onRequest);
            this.wsServer.addListener('close', this.onClose);

            console.log('WebSocket server listening on', GetLocalIP() + ':' + port);
        }
    }

    Stop = () => {
        if (this.server.listening) {
            this.wsServer.shutDown();
            this.server.close();
            console.log('WebSocket server closed');
        }
    }

    /** @param {Error} error */
    onError = (error) => {
        console.error('WebSocket server:', error);
    }

    /** @param {WebSocket.request} request */
    onRequest = (request) => {
        const protocol = request.requestedProtocols;

        // Accept the server-multiplayer protocol
        if (protocol.indexOf('server-multiplayer') !== -1) {
            request.accept('server-multiplayer', request.origin);
        }

        // Accept the zap protocol
        else if (protocol.indexOf('zap') !== -1) {
            console.log('Zap connected:', request.origin);
            request.accept('zap', request.origin);
        }

        // Reject all other protocols
        else {
            request.reject(400, 'Invalid protocol');
        }
    }

    /**
     * @param {WebSocket.connection} connection 
     * @param {number} reason 
     * @param {string} desc 
     */
    onClose = (connection, reason, desc) => {
        if (reason !== 1000) {
            console.log('Connection closed:', reason, desc);
        }
    }

    /** @param {WebSocket.connection} connection */
    onConnect = (connection) => {
        const protocol = connection.protocol;
        if (protocol === 'server-multiplayer') {
            this.onConnectUser(connection);
        } else if (protocol === 'zap') {
            this.onConnectZap(connection);
            console.log('Zap connected:', connection.remoteAddress);
        }
    }

    /** @param {WebSocket.connection} connection */
    onConnectUser = (connection) => {
        /** @type {User | null} */
        let user = null;

        connection.on('message', async (message) => {
            if (message.type !== 'utf8') {
                return;
            }

            const rawData = message.type === 'utf8' ? message.utf8Data : null;
            if (!StrIsJson(rawData)) {
                return;
            }

            const data = JSON.parse(rawData);
            if (!data.hasOwnProperty('token')) {
                return;
            }

            user = await this.users.Add(connection, data.token);
            if (user !== null) {
                console.log('User connected:', user.username, `(${user.accountID} - ${user.deviceID})`);
            } else {
                AddLogRaw(this.users, connection, 'cheatSuspicion', `Try to connect from GL with invalid token ${data.token}`);
            }
        });

        connection.on('close', () => {
            if (user !== null) {
                this.users.RemoveByDeviceID(user.deviceID);
                user = null;
            }
        });

        connection.on('error', (err) => {
            console.error('Connection error:', err);
            if (user !== null) {
                this.users.RemoveByDeviceID(user.deviceID);
                user = null;
            }
        });
    }

    /** @param {WebSocket.connection} connection */
    onConnectZap = (connection) => {
        connection.on('message', async (message) => {
            if (message.type !== 'utf8') {
                return;
            }

            const rawData = message.type === 'utf8' ? message.utf8Data : null;
            if (!StrIsJson(rawData)) {
                return;
            }

            const data = JSON.parse(rawData);
            if (!data.hasOwnProperty('token') || data.token !== 'P(QYE1iGqFtEv[qCT(E]x[YrPl#)Q997') {
                AddLogRaw(this.users, connection, 'cheatSuspicion', `Try to connect from GL with invalid token (${data.token})`);
                connection.close();
                return;
            }

            ZapCommand(this.users, connection, data);
        });
    }
}

export default Server;
