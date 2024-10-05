import Config from 'react-native-config';
import DynamicVar from 'Utils/DynamicVar';
import { RandomString } from 'Utils/Functions';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 *
 * @typedef {import('Types/TCP/Request').ConnectionState} ConnectionState
 * @typedef {import('Types/TCP/Request').TCPServerRequest} ReceiveRequest
 * @typedef {import('Types/TCP/Request').TCPClientRequest} TCPClientRequest
 */

const TCP_SETTINGS = {
    protocol: Config.VPS_PROTOCOL,
    host: Config.VPS_IP,
    port: Config.VPS_PORT
};

/** @type {ConnectionState} */
const INITIAL_STATE = 'idle';

class TCP {
    /** @type {UserManager} */
    #user;

    /**
     * @param {UserManager} user Used to get the token & print logs
     */
    constructor(user) {
        this.#user = user;
    }

    /** @type {WebSocket | null} */
    socket = null;

    /** @type {DynamicVar<ConnectionState>} */
    state = new DynamicVar(INITIAL_STATE);

    isTrusted = false;

    /**
     * @description Callback => If True is returned, the callback will be removed
     * @type {Record<string, (data: ReceiveRequest) => boolean | Promise<boolean>>}
     */
    #callbacks = {};

    /**
     * @param {number} [timeout] in milliseconds
     * @returns {Promise<boolean>} Whether the connection was successful, or if it was already connected
     */
    Connect = async (timeout = 10000) => {
        const url = `${TCP_SETTINGS.protocol}://${TCP_SETTINGS.host}:${TCP_SETTINGS.port}`;
        const socket = new WebSocket(url, 'gamelife-client');
        socket.addEventListener('open', this.#onOpen);
        socket.addEventListener('message', this.#onMessage);
        socket.addEventListener('error', this.#onError);
        socket.addEventListener('close', this.#onClose);
        this.socket = socket;

        this.state.Set('connecting');
        return new Promise(async (resolve) => {
            /** @param {boolean} bool */
            const finish = (bool) => {
                clearTimeout(_timeout);
                this.state.RemoveListener(id);
                resolve(bool);
            };

            // Timeout
            const _timeout = setTimeout(() => {
                finish(false);
            }, timeout);

            // Listen for the connection
            const id = this.state.AddListener((state) => {
                finish(state === 'connected');
            });
        });
    };

    IsConnected = () => {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    };

    Disconnect = () => {
        if (this.IsConnected()) {
            this.socket?.close();
        }
        this.socket = null;
        this.#user.multiplayer.notifications.Set([]);
    };

    /** @param {Event} _event */
    #onOpen = (_event) => {
        this.state.Set('connected');
    };

    /** @param {MessageEvent} event */
    #onMessage = async (event) => {
        /** @type {ReceiveRequest} */
        const data = JSON.parse(event.data);

        // Callbacks
        if (data.callbackID && data.callbackID in this.#callbacks) {
            const callbackID = data.callbackID;
            const callback = this.#callbacks[callbackID];
            if (typeof callback === 'function') {
                const removeCallback = await callback(data);
                if (removeCallback) {
                    delete this.#callbacks[callbackID];
                }
                return;
            }
        }

        // Callbacks from status
        if (data.status in this.#callbacks) {
            const callback = this.#callbacks[data.status];
            if (typeof callback === 'function') {
                const removeCallback = await callback(data);
                if (removeCallback) {
                    delete this.#callbacks[data.status];
                }
                return;
            }
        }

        // TODO: Implement global listeners
        // const { status } = data;
        // if (status.startsWith('update-')) {
        //     this.#user.multiplayer.onMessage(data);
        // }
    };

    /** @param {Event} event */
    #onError = (event) => {
        this.#user.interface.console?.AddLog('warn', 'TCP server:', event);
        this.state.Set('error');
        this.Disconnect();
    };

    /** @param {CloseEvent} _event */
    #onClose = (_event) => {
        this.state.Set('disconnected');
        this.Disconnect();
    };

    /**
     * @param {TCPClientRequest} message
     * @returns {boolean} Whether the message was sent successfully
     */
    Send = (message) => {
        if (typeof message !== 'object') {
            this.#user.interface.console?.AddLog('warn', 'Send socket: Invalid message type.');
            return false;
        }

        if (this.socket === null) {
            this.#user.interface.console?.AddLog('warn', 'Send socket: Not connected.');
            return false;
        }

        this.socket.send(JSON.stringify(message));
        return true;
    };

    /**
     * @param {TCPClientRequest} message
     * @param {(data: ReceiveRequest) => boolean | Promise<boolean>} [callback] The callback to call when the response is received, return true to remove the callback and send the response to the promise
     * @param {number} [timeout] in milliseconds
     * @returns {Promise<'timeout' | 'interrupted' | 'not-sent' | ReceiveRequest>} The result of the callback or 'timeout' if it took too long
     */
    SendAndWait = async (message, callback = undefined, timeout = 10000, useCallbackID = true) => {
        let ID;

        if (useCallbackID) {
            // Define random callback ID
            while (!ID || ID in this.#callbacks) {
                ID = RandomString(8);
            }
        } else {
            // Use the action as callback ID
            ID = message.action;
        }

        if (this.Send({ ...message, callbackID: ID })) {
            return this.WaitForCallback(ID, callback, timeout);
        }
        return 'not-sent';
    };

    /**
     * @param {string} callbackID The callback ID to wait for (or the action if useCallbackID is false)
     * @param {(data: ReceiveRequest) => boolean | Promise<boolean>} callback The callback to call when the response is received, return true to remove the callback and send the response to the promise
     * @param {number} [timeout] in milliseconds, -1 to disable
     * @returns {Promise<'timeout' | 'interrupted' | ReceiveRequest>} The result of the callback or 'timeout' if it took too long
     */
    WaitForCallback = (callbackID, callback = () => true, timeout = 10000) => {
        return new Promise((resolve, _reject) => {
            // Init the timeout timer
            /** @type {NodeJS.Timeout | null} */
            let timer = null;
            if (timeout !== -1) {
                timer = setTimeout(() => {
                    resolve('timeout');
                }, timeout);
            }

            // Reset the timeout timer
            const resetTimeout = () => {
                if (timeout === -1 || timer === null) {
                    return;
                }
                clearTimeout(timer);
                timer = setTimeout(() => {
                    resolve('timeout');
                }, timeout);
            };

            // Set the callback
            this.#callbacks[callbackID] = async (data) => {
                if (timer !== null) {
                    clearTimeout(timer);
                }
                const finished = await callback(data); // Result from caller
                if (finished) {
                    resolve(data); // Send the response to the promise
                    return true; // Remove the callback
                }
                resetTimeout(); // Reset the timer
                return false; // Keep the callback
            };
        });
    };
}

export default TCP;
