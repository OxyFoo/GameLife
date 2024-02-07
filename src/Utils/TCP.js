import DynamicVar from 'Utils/DynamicVar';
import Config from 'react-native-config';

const settings = {
    host: Config.VPS_IP,
    port: Config.VPS_PORT
};

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * 
 * @typedef {import('Types/TCP').ConnectionState} ConnectionState
 * @typedef {import('Types/TCP').TCPServerRequest} ReceiveRequest
 * @typedef {import('Types/TCP').TCPClientRequest} TCPClientRequest
 */

class TCP {
    /**
     * @param {UserManager} user Used to get the token & print logs
     */
    constructor(user) {
        this.user = user;
    }

    /** @type {WebSocket | null} */
    socket = null;

    /** @type {DynamicVar<ConnectionState>} */
    state = new DynamicVar('idle');

    callbacks = {};

    /**
     * @returns {boolean} Whether the connection was successful, or if it was already connected
     */
    Connect = () => {
        if (this.IsConnected()) {
            return false;
        }
        const url = `ws://${settings.host}:${settings.port}`;
        const socket = new WebSocket(url, 'server-multiplayer');
        socket.addEventListener('open', this.onOpen);
        socket.addEventListener('message', this.onMessage);
        socket.addEventListener('error', this.onError);
        socket.addEventListener('close', this.onClose);
        this.socket = socket;
    }

    Disconnect = () => {
        if (this.IsConnected()) {
            this.socket.close();
        }
        this.socket = null;
    }

    IsConnected = () => {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }

    /** @param {Event} event */
    onOpen = (event) => {
        const data = { token: this.user.server.token };
        this.socket.send(JSON.stringify(data));
    }

    /** @param {MessageEvent} event */
    onMessage = (event) => {
        /** @type {ReceiveRequest} */
        const data = JSON.parse(event.data);

        const { status } = data;
        if (status === 'connected' || status === 'disconnected' || status === 'error') {
            this.state.Set(status);
            if (status === 'error') {
                this.user.interface.console.AddLog('error', 'Server error:', event.data.message);
            }
        }

        if (status === 'update-friends' || status === 'update-notifications') {
            this.user.multiplayer.onMessage(data);
        }

        if (status === 'callback') {
            const callbackID = data.callbackID;
            const callback = this.callbacks[callbackID];
            if (typeof(callback) === 'function') {
                callback(data);
                delete this.callbacks[callbackID];
            } else {
                this.user.interface.console.AddLog('warn', 'Callback not found:', callbackID);
            }
        }
    }

    /** @param {Event} event */
    onError = (event) => {
        this.user.interface.console.AddLog('error', 'TCP server:', event);
        this.state.Set('error');
        this.Disconnect();
    }

    /** @param {CloseEvent} event */
    onClose = (event) => {
        this.state.Set('disconnected');
    }

    /**
     * @param {TCPClientRequest} message
     * @returns {boolean} Whether the message was sent successfully
     */
    Send = (message) => {
        if (typeof(message) !== 'object') {
            this.user.interface.console.AddLog('warn', 'Send socket: Invalid message type.');
            return false;
        }

        if (this.IsConnected() === false) {
            this.user.interface.console.AddLog('warn', 'Send socket: Not connected.');
            return false;
        }

        this.socket.send(JSON.stringify(message));
        return true;
    }

    /**
     * @param {string} callbackID
     * @param {number} [timeout] in milliseconds
     * @returns {Promise<'timeout' | any>} The result of the callback or 'timeout' if it took too long
     */
    WaitCallback = (callbackID, timeout = 5000) => {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                resolve('timeout');
            }, timeout);
            this.callbacks[callbackID] = (data) => {
                clearTimeout(timer);
                resolve(data);
            };
        });
    }
}

export default TCP;
