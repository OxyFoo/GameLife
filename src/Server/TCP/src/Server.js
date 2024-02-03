import WebSocket from 'websocket';
import { createServer } from 'http';

import Users from './Users.js';
import { StrIsJson } from './Utils/Functions.js';

/**
 * @typedef {import('./Sql.js').default} SQL
 * @typedef {import('./Users.js').User} User
 */

const debugMode = true;
const Log = (msg, ...items) => debugMode && console.log(msg, ...items);

class Server {
    /** @param {SQL} database */
    constructor(database) {
        this.server = createServer();
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
            console.log('WebSocket server listening on port', port);
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
            Log('Connection closed:', reason, desc);
        }
    }

    /** @param {WebSocket.connection} connection */
    onConnect = (connection) => {
        /** @type {User | null} */
        let user = null;

        Log('User connected');

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
            if (user === null) {
                const response = { status: 'error', message: 'Invalid token.' };
                connection.send(JSON.stringify(response));
                return;
            }

            const response = { status: 'connected', friends: user.friends };
            connection.send(JSON.stringify(response));
        });

        connection.on('close', () => {
            Log('User disconnected');
            if (user !== null) {
                this.users.RemoveByDeviceID(user.deviceID);
            }
        });

        connection.on('error', (err) => {
            console.error('Connection error:', err);
        });
    }
}

export default Server;