import Config from 'react-native-config';
import DynamicVar from 'Utils/DynamicVar';

const TCP_SETTINGS = {
    protocol: Config.VPS_PROTOCOL,
    host: Config.VPS_IP,
    port: Config.VPS_PORT
};

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 *
 * @typedef {import('Types/TCP/Request').ConnectionState} ConnectionState
 * @typedef {import('Types/TCP/Request').TCPServerRequest} ReceiveRequest
 * @typedef {import('Types/TCP/Request').TCPClientRequest} TCPClientRequest
 */

/** @type {ConnectionState} */
const INITIAL_STATE = 'idle';

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
    state = new DynamicVar(INITIAL_STATE);

    /** @type {Record<string, (data: ReceiveRequest) => void>} */
    callbacks = {};

    /**
     * @returns {boolean} Whether the connection was successful, or if it was already connected
     */
    Connect = () => {
        // If already connected, or if the user is not connected to the server
        if (this.IsConnected() || !this.user.server.IsConnected(false)) {
            return false;
        }

        const url = `${TCP_SETTINGS.protocol}://${TCP_SETTINGS.host}:${TCP_SETTINGS.port}`;
        const socket = new WebSocket(url, 'gamelife-client');
        socket.addEventListener('open', this.onOpen);
        socket.addEventListener('message', this.onMessage);
        socket.addEventListener('error', this.onError);
        socket.addEventListener('close', this.onClose);
        this.socket = socket;
        return true;
    };

    Disconnect = () => {
        if (this.IsConnected()) {
            this.socket?.close();
        }
        this.socket = null;
        this.user.multiplayer.notifications.Set([]);
    };

    IsConnected = () => {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    };

    /** @param {Event} _event */
    onOpen = (_event) => {
        // TODO: Real connection
        this.Send({
            action: 'login',
            email: this.user.settings.email,
            hashID: 'hDaIhs',
            callbackID: 'test'
        });
    };

    /** @param {MessageEvent} event */
    onMessage = (event) => {
        /** @type {ReceiveRequest} */
        const data = JSON.parse(event.data);

        const { status } = data;
        if (status === 'connected' || status === 'disconnected' || status === 'error') {
            this.state.Set(status);
            if (status === 'error') {
                this.user.interface.console?.AddLog('error', 'Server error:', event.data.message);
            }
            if (status !== 'connected') {
                this.Disconnect();
            }
        }

        if (status.startsWith('update-')) {
            this.user.multiplayer.onMessage(data);
        }

        if (status === 'callback') {
            const callbackID = data.callbackID;
            const callback = this.callbacks[callbackID];
            if (typeof callback === 'function') {
                callback(data);
                delete this.callbacks[callbackID];
            } else {
                this.user.interface.console?.AddLog('warn', 'Callback not found:', callbackID);
            }
        }
    };

    /** @param {Event} event */
    onError = (event) => {
        this.user.interface.console?.AddLog('warn', 'TCP server:', event);
        this.state.Set('error');
        this.Disconnect();
    };

    /** @param {CloseEvent} _event */
    onClose = (_event) => {
        this.state.Set('disconnected');
        this.Disconnect();
    };

    /**
     * @param {TCPClientRequest} message
     * @returns {boolean} Whether the message was sent successfully
     */
    Send = (message) => {
        if (typeof message !== 'object') {
            this.user.interface.console?.AddLog('warn', 'Send socket: Invalid message type.');
            return false;
        }

        if (this.socket === null || this.IsConnected() === false) {
            this.user.interface.console?.AddLog('warn', 'Send socket: Not connected.');
            return false;
        }

        this.socket.send(JSON.stringify(message));
        return true;
    };

    /**
     * @param {string} callbackID
     * @param {number} [timeout] in milliseconds
     * @returns {Promise<'timeout' | any>} The result of the callback or 'timeout' if it took too long
     */
    WaitForCallback = (callbackID, timeout = 10000) => {
        return new Promise((resolve, _reject) => {
            const timer = setTimeout(() => {
                resolve('timeout');
            }, timeout);
            this.callbacks[callbackID] = (data) => {
                clearTimeout(timer);
                resolve(data);
            };
        });
    };
}

export default TCP;
