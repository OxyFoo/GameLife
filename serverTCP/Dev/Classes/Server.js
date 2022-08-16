import WebSocket from 'websocket';
import { createServer } from 'http';

import Users from './Users.js';
import { StrIsJson } from '../Utils/Functions.js';

const debugMode = true;
const Log = (msg, ...items) => debugMode && console.log(msg, ...items);

class Server {
    constructor() {
        this.server = createServer();
        this.server.on('error', this.onError);
        this.users = new Users();
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
        }
    }

    Stop = () => {
        if (this.server.listening) {
            this.wsServer.shutDown();
            this.server.close();
        }
    }

    /** @param {Error} error */
    onError = (error) => {
        console.error('WebSocket server:', error);
        return;

        if (error.code === 'EADDRINUSE') {
            console.log('Address in use, retrying...');
            setTimeout(WebSocket.server.close, 1000);
        }
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
        let deviceID = null;

        Log('User connected');

        connection.on('message', async (message) => {
            Log('Data:', message.utf8Data);
            if (StrIsJson(message.utf8Data)) {
                const data = JSON.parse(message.utf8Data);
                if (data.hasOwnProperty('token')) {
                    deviceID = await this.users.Add(connection, data.token);
                    connection.send(deviceID !== null ? 'connected' : 'failed');
                }
            }
        });

        connection.on('close', () => {
            Log('User disconnected');
            if (deviceID !== null) {
                this.users.Rem(deviceID);
            }
        });

        connection.on('error', (err) => {
            console.error('Connection error:', err);
        });
    }
}

export default Server;