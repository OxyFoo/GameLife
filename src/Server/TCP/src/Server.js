import fs from 'fs';
import WebSocket from 'websocket';
import { createServer as createHTTPServer } from 'http';
import { createServer } from 'https';

import Users from './Users.js';
import { StrIsJson, GetLocalIP } from './Utils/Functions.js';

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
        request.accept('server-multiplayer', request.origin);
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
}

export default Server;
