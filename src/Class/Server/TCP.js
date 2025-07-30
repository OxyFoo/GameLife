import { SSLWebSocket, WebSocketReadyState } from 'react-native-pinned-ws';

import { env } from 'Utils/Env';
import DynamicVar from 'Utils/DynamicVar';
import { RandomString } from 'Utils/Functions';

/**
 * @typedef {import('react-native-pinned-ws').WebSocketConfig} WebSocketConfig
 * @typedef {import('react-native-pinned-ws').WebSocketOpenEvent} WebSocketOpenEvent
 * @typedef {import('react-native-pinned-ws').WebSocketMessageEvent} WebSocketMessageEvent
 * @typedef {import('react-native-pinned-ws').WebSocketErrorEvent} WebSocketErrorEvent
 * @typedef {import('react-native-pinned-ws').WebSocketCloseEvent} WebSocketCloseEvent
 * @typedef {import('@oxyfoo/gamelife-types/TCP/GameLife/Request').TCPServerRequest} TCPServerRequest
 * @typedef {import('@oxyfoo/gamelife-types/TCP/GameLife/Request').TCPClientRequest} TCPClientRequest
 * @typedef {import('@oxyfoo/gamelife-types/TCP/GameLife/Request_Types').ConnectionState} ConnectionState
 *
 * @typedef {{ protocol: string, host: string, port: number }} TCPSettings
 */

const SERVER_TIMEOUT_MS = __DEV__ ? 10000 : 5000;

class TCP {
    /** @type {SSLWebSocket | null} */
    socket = null;

    /** @type {DynamicVar<ConnectionState>} */
    state = new DynamicVar(/** @type {ConnectionState} */ ('idle'));

    /**
     * @type {TCPSettings | null}
     * @readonly
     */
    settings;

    /** @type {string | null} */
    #lastError = null;

    /** @type {boolean} */
    #connecting = false;

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
     * @param {TCPSettings | null} settings
     */
    constructor(settings = null) {
        this.settings = settings;
    }

    /**
     * @param {boolean} [connectAsNewUser] Whether to connect as a new user
     * @returns {Promise<'connected' | 'connecting' | 'already-connected' | 'wrong-ssl-pinning' | 'timeout' | 'error'>} Whether the connection was successful, or if it was already connected
     */
    Connect = async (connectAsNewUser = false) => {
        if (this.settings === null) {
            return 'error';
        }

        // If already connected, return immediately
        if (this.IsConnected()) {
            return 'already-connected';
        }

        // Prevent multiple simultaneous connection attempts only if we're actually connecting
        if (this.#connecting || this.state.Get() === 'connecting' || this.socket) {
            return 'connecting';
        }

        this.#connecting = true;

        const url = `${this.settings.protocol}://${this.settings.host}:${this.settings.port}`;
        const protocol = !connectAsNewUser ? 'gamelife-client' : 'gamelife-client-new';

        /** @type {WebSocketConfig} */
        const socketConfig = {
            url: url,
            protocols: protocol,
            connectionTimeout: SERVER_TIMEOUT_MS,
            options: {
                allowSelfSignedCerts: false
            }
        };

        if (this.settings.protocol === 'wss') {
            socketConfig.sslPinning = {
                hostname: this.settings.host,
                publicKeyHashes: [],
                includeSubdomains: true,
                timeout: SERVER_TIMEOUT_MS
            };

            if (env.SSL_PINNING_PRIMARY_KEY) {
                socketConfig.sslPinning?.publicKeyHashes.push(env.SSL_PINNING_PRIMARY_KEY);
                if (env.SSL_PINNING_BACKUP_KEY) {
                    socketConfig.sslPinning?.publicKeyHashes.push(env.SSL_PINNING_BACKUP_KEY);
                }
            }
        }

        const socket = new SSLWebSocket(socketConfig);

        socket.addEventListener('open', this.#onOpen);
        socket.addEventListener('message', this.#onMessage);
        socket.addEventListener('error', this.#onError);
        socket.addEventListener('close', this.#onClose);
        this.socket = socket;

        this.state.Set('connecting');

        return new Promise((resolve) => {
            /** @param {'connected' | 'wrong-ssl-pinning' | 'timeout' | 'error'} state */
            const finish = (state) => {
                clearTimeout(_timeout);
                this.state.RemoveListener(_listenerId);
                this.#connecting = false;
                resolve(state);
            };

            // Timeout
            const _timeout = setTimeout(() => {
                finish('timeout');
            }, SERVER_TIMEOUT_MS);

            // Listen for the connection
            const _listenerId = this.state.AddListener((state) => {
                if (state === 'idle' || state === 'connecting' || state === 'disconnected') {
                    return; // Ignore idle or connecting states
                }

                finish(state);
            });

            // Start the connection
            socket.connect();
        });
    };

    IsConnected = () => {
        return (
            this.socket !== null &&
            this.socket.readyState === WebSocketReadyState.OPEN &&
            this.state.Get() === 'connected'
        );
    };

    Disconnect = () => {
        // Reset connecting flag
        this.#connecting = false;

        if (this.socket) {
            // Remove event listeners to prevent memory leaks
            this.socket.removeEventListener('open', this.#onOpen);
            this.socket.removeEventListener('message', this.#onMessage);
            this.socket.removeEventListener('error', this.#onError);
            this.socket.removeEventListener('close', this.#onClose);

            // Close the connection if it's still open
            if (this.IsConnected()) {
                this.socket.close();
            }

            // Call cleanup to ensure proper resource disposal (especially for Android Release)
            this.socket.cleanup();
            this.socket = null;
        }

        // Clear any pending callbacks
        this.#callbacks = {};
        this.#callbacksActions = {};

        // Reset state
        this.state.Set('disconnected');
    };

    GetLastError = () => {
        return this.#lastError;
    };

    /** @param {WebSocketOpenEvent} _event */
    #onOpen = (_event) => {
        this.state.Set('connected');
    };

    /** @param {WebSocketMessageEvent} event */
    #onMessage = async (event) => {
        if (typeof event.data !== 'string' || event.type !== 'message') {
            this.#lastError = 'Received non-string data';
            this.state.Set('error');
            this.Disconnect();
            return;
        }

        /** @type {TCPServerRequest} */
        const parsedData = JSON.parse(event.data);

        // Callbacks
        if (parsedData.callbackID && parsedData.callbackID in this.#callbacks) {
            const callbackID = parsedData.callbackID;
            const callback = this.#callbacks[callbackID];
            if (typeof callback === 'function') {
                const removeCallback = await callback(parsedData);
                if (removeCallback) {
                    delete this.#callbacks[callbackID];
                }
                return;
            }
        }

        // Callbacks from status
        if (parsedData.status in this.#callbacksActions) {
            const callback = this.#callbacksActions[parsedData.status];
            if (typeof callback === 'function') {
                // @ts-ignore
                const removeCallback = await callback(parsedData);
                if (removeCallback) {
                    delete this.#callbacksActions[parsedData.status];
                }
                return;
            }
        }
    };

    /** @param {WebSocketErrorEvent} event */
    #onError = (event) => {
        this.#lastError = event?.message || 'Unknown error';

        // Check if this might be an SSL pinning error
        if (event?.errorType === 'ssl_pinning') {
            this.state.Set('wrong-ssl-pinning');
        } else {
            this.state.Set('error');
        }

        this.Disconnect();
    };

    /** @param {WebSocketCloseEvent} _event */
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

        if (this.socket.readyState !== WebSocketReadyState.OPEN) {
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
