import Config from 'react-native-config';
import DynamicVar from 'Utils/DynamicVar';
import { RandomString, Sleep } from 'Utils/Functions';

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
     * TODO: Reimplement selfCallback in a better way
     * @type {(success: boolean) => void}
     * @private
     */
    selfCallback = (a) => {
        console.log(a);
    };

    /**
     * @returns {Promise<boolean>} Whether the connection was successful, or if it was already connected
     */
    Connect = async () => {
        const url = `${TCP_SETTINGS.protocol}://${TCP_SETTINGS.host}:${TCP_SETTINGS.port}`;
        const socket = new WebSocket(url, 'gamelife-client');
        socket.addEventListener('open', this.onOpen);
        socket.addEventListener('message', this.onMessage);
        socket.addEventListener('error', this.onError);
        socket.addEventListener('close', this.onClose);
        this.socket = socket;

        this.state.Set('connecting');
        return new Promise(async (resolve) => {
            while (this.state.Get() === 'connecting') {
                await Sleep(100);
            }
            resolve(this.state.Get() === 'connected');
        });
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
        this.state.Set('connected');
        this.selfCallback(true);
    };

    /** @param {MessageEvent} event */
    onMessage = (event) => {
        /** @type {ReceiveRequest} */
        const data = JSON.parse(event.data);

        if (data.callbackID && data.callbackID in this.callbacks) {
            const callbackID = data.callbackID;
            const callback = this.callbacks[callbackID];
            if (typeof callback === 'function') {
                callback(data);
                delete this.callbacks[callbackID];
                return;
            }
        }

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
    };

    /** @param {Event} event */
    onError = (event) => {
        this.user.interface.console?.AddLog('warn', 'TCP server:', event);
        this.state.Set('error');
        this.Disconnect();
        this.selfCallback(false);
    };

    /** @param {CloseEvent} _event */
    onClose = (_event) => {
        this.state.Set('disconnected');
        this.Disconnect();
        this.selfCallback(false);
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

        if (this.socket === null) {
            this.user.interface.console?.AddLog('warn', 'Send socket: Not connected.');
            return false;
        }

        this.socket.send(JSON.stringify(message));
        return true;
    };

    /**
     * @param {string} callbackID
     * @param {number} [timeout] in milliseconds
     * @returns {Promise<'timeout' | ReceiveRequest>} The result of the callback or 'timeout' if it took too long
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

    /**
     * @param {TCPClientRequest} message
     * @param {number} [timeout] in milliseconds
     * @returns {Promise<'timeout' | 'not-sent' | ReceiveRequest>} The result of the callback or 'timeout' if it took too long
     */
    SendAndWait = async (message, timeout = 10000) => {
        const randomID = RandomString(8);
        if (this.Send({ ...message, callbackID: randomID })) {
            return this.WaitForCallback(randomID, timeout);
        }
        return 'not-sent';
    };
}

export default TCP;
