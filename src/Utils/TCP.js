import Config from 'react-native-config';
import DynamicVar from 'Utils/DynamicVar';
import { RandomString } from 'Utils/Functions';

/**
 * @typedef {import('Types/TCP/GameLife/Request').ConnectionState} ConnectionState
 * @typedef {import('Types/TCP/GameLife/Request').TCPServerRequest} TCPServerRequest
 * @typedef {import('Types/TCP/GameLife/Request').TCPClientRequest} TCPClientRequest
 */

const TCP_SETTINGS = {
    protocol: Config.VPS_PROTOCOL,
    host: Config.VPS_IP,
    port: Config.VPS_PORT
};

const SERVER_TIMEOUT_MS = __DEV__ ? 10000 : 5000;

class TCP {
    /** @type {WebSocket | null} */
    socket = null;

    /** @type {DynamicVar<ConnectionState>} */
    state = new DynamicVar(/** @type {ConnectionState} */ ('idle'));

    /** @type {string | null} */
    #lastError = null;

    /**
     * @description Callback => If True is returned, the callback will be removed
     * @type {Record<string, (data: TCPServerRequest) => boolean | Promise<boolean>>}
     */
    #callbacks = {};

    /**
     * @description Callback => If True is returned, the callback will be removed
     * @type {Partial<{ [key in TCPServerRequest['status']]: (data: Extract<TCPServerRequest, { 'status': key }>) => boolean | Promise<boolean> }>}
     */
    #callbacksActions = {};

    /**
     * @param {boolean} [connectAsNewUser] Whether to connect as a new user
     * @returns {Promise<boolean>} Whether the connection was successful, or if it was already connected
     */
    Connect = async (connectAsNewUser = false) => {
        if (this.IsConnected()) {
            return false;
        }

        const url = `${TCP_SETTINGS.protocol}://${TCP_SETTINGS.host}:${TCP_SETTINGS.port}`;
        const protocol = !connectAsNewUser ? 'gamelife-client' : 'gamelife-client-new';

        const socket = new WebSocket(url, protocol);
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
            }, SERVER_TIMEOUT_MS);

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
    };

    GetLastError = () => {
        return this.#lastError;
    };

    /** @param {Event} _event */
    #onOpen = (_event) => {
        this.state.Set('connected');
    };

    /** @param {MessageEvent} event */
    #onMessage = async (event) => {
        /** @type {TCPServerRequest} */
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
        if (data.status in this.#callbacksActions) {
            const callback = this.#callbacksActions[data.status];
            if (typeof callback === 'function') {
                // @ts-ignore
                const removeCallback = await callback(data);
                if (removeCallback) {
                    delete this.#callbacksActions[data.status];
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
        // @ts-ignore - The error message is a string (why is not referenced?)
        this.#lastError = event?.message || 'Unknown error';

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
            return false;
        }

        if (this.socket === null) {
            return false;
        }

        if (this.socket.readyState !== WebSocket.OPEN) {
            return false;
        }

        this.socket.send(JSON.stringify(message));
        return true;
    };

    /**
     * @param {TCPClientRequest} message
     * @param {(data: TCPServerRequest) => boolean | Promise<boolean>} [callback] The callback to call when the response is received, return true to remove the callback and send the response to the promise
     * @param {number} [timeout] in milliseconds
     * @returns {Promise<'timeout' | 'interrupted' | 'not-sent' | TCPServerRequest>} The result of the callback or 'timeout' if it took too long
     */
    SendAndWait = async (message, callback = undefined, timeout = SERVER_TIMEOUT_MS) => {
        // Define random callback ID
        let ID;
        while (!ID || ID in this.#callbacks) {
            ID = RandomString(8);
        }

        if (this.Send({ ...message, callbackID: ID })) {
            return this.WaitForCallback(ID, callback, timeout);
        }

        return 'not-sent';
    };

    /**
     * @template {TCPClientRequest} T
     * @param {T} message
     * @param {(data: TCPServerRequest) => boolean | Promise<boolean>} [callback] The callback to call when the response is received, return true to remove the callback and send the response to the promise
     * @param {number} [timeout] in milliseconds
     * @param {AbortSignal} [signal] Optional abort signal to cancel the wait
     * @returns {Promise<'timeout' | 'interrupted' | 'not-sent' | 'alreadyExist' | TCPServerRequest>} The result of the callback or 'timeout' if it took too long
     */
    SendAndWaitWithoutCallback = async (
        message,
        callback = undefined,
        timeout = SERVER_TIMEOUT_MS,
        signal = undefined
    ) => {
        if (this.Send({ ...message })) {
            return this.WaitForAction(message.action, callback, timeout, signal);
        }

        return 'not-sent';
    };

    /**
     * @param {string} callbackID The callback ID to wait for (or the action if useCallbackID is false)
     * @param {(data: TCPServerRequest) => boolean | Promise<boolean>} callback The callback to call when the response is received, return true to remove the callback and send the response to the promise
     * @param {number} [timeout] in milliseconds, -1 to disable
     * @returns {Promise<'timeout' | 'interrupted' | TCPServerRequest>} The result of the callback or 'timeout' if it took too long
     */
    WaitForCallback = (callbackID, callback = () => true, timeout = SERVER_TIMEOUT_MS) => {
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

    /**
     * @template {TCPServerRequest['status']} T
     * @param {T} action The action to wait for
     * @param {(data: Extract<TCPServerRequest, { 'status': T }>) => boolean | Promise<boolean>} callback The callback to call when the response is received, return true to remove the callback and send the response to the promise
     * @param {number} [timeout] in milliseconds, -1 to disable
     * @param {AbortSignal} [signal] Optional abort signal to cancel the wait
     * @returns {Promise<'timeout' | 'interrupted' | 'alreadyExist' | TCPServerRequest>} The result of the callback or 'timeout' if it took too long
     */
    WaitForAction = (action, callback = () => true, timeout = SERVER_TIMEOUT_MS, signal = undefined) => {
        return new Promise((resolve, _reject) => {
            if (action in this.#callbacksActions) {
                resolve('alreadyExist');
                return;
            }

            // Initialize the timeout timer
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

            // Set up the callback
            this.#callbacksActions[action] = async (/** @type {TCPServerRequest} */ data) => {
                if (timer !== null) {
                    clearTimeout(timer);
                }

                // @ts-ignore
                const finished = await callback(data); // Get result from caller
                if (finished) {
                    resolve(data); // Send response to promise
                    return true; // Remove callback
                }

                resetTimeout(); // Reset timer if still waiting
                return false; // Keep callback if not finished
            };

            // Handle cancellation
            if (signal) {
                signal.addEventListener('abort', () => {
                    if (timer !== null) {
                        clearTimeout(timer); // Clear timeout
                    }
                    delete this.#callbacksActions[action]; // Clean up callback
                    resolve('interrupted'); // Resolve as 'interrupted'
                });
            }
        });
    };
}

export default TCP;
