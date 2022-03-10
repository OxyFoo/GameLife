const settings = { host: '45.82.73.154', port: 7121 };

/**
 * TCP server state change event
 * @callback onChangeCallback
 * @param {'connected'|'disconnected'|'error'} state
 */

class Multiplayer {
    constructor(user) {
        /**
         * @typedef {import('../Managers/UserManager').default} UserManager
         * @type {UserManager}
         */
        this.user = user;
        
        /** @type {WebSocket?} */
        this.socket = null;

        /** @type {onChangeCallback} */
        this.onChangeState = (state) => {};
    }

    Connect = () => {
        if (this.isConnected()) {
            this.user.interface.console.AddLog('warn', 'Already connected to the node server.');
            return;
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
        if (this.isConnected()) {
            this.socket.close();
        }
        this.socket = null;
    }
    isConnected = () => {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }

    /** @param {Event} event */
    onOpen = (event) => {
        this.Send({ token: this.user.server.token });
    }
    /** @param {MessageEvent} event */
    onMessage = (event) => {
        if (event.data === 'connected') {
            this.onChangeState('connected');
        } else if (event.data === 'failed') {
            this.onError('Server closed connection.');
        }
    }
    /** @param {Event} event */
    onError = (event) => {
        this.user.interface.console.AddLog('error', 'TCP server:', event);
        this.onChangeState('error');
        this.Disconnect();
    }
    /** @param {CloseEvent} event */
    onClose = (event) => {
        if (event.code !== 1000) {
            this.user.interface.console.AddLog('error', 'Disconnected:', event);
            this.onChangeState('disconnected');
        }
    }

    /**
     * @param {String|Object} message
     * @returns {Boolean} Whether the message was sent successfully
     */
    Send = (message) => {
        if (typeof(message) === 'object') message = JSON.stringify(message);
        if (typeof(message) !== 'string') {
            this.user.interface.console.AddLog('warn', 'Send socket: Invalid message type.');
        } else {
            if (this.isConnected()) {
                this.socket.send(message);
                return true;
            }
        }
        return false;
    }
}

export default Multiplayer;