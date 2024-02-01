import DynamicVar from 'Utils/DynamicVar';
import Config from 'react-native-config';

const settings = {
    host: Config.VPS_IP,
    port: Config.VPS_PORT
};

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/Friend').Friend} Friend
 * 
 * @typedef {'waiting' | 'connected' | 'disconnected' | 'error'} ConnectionState
 */

class Multiplayer {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;
    }

    /** @type {Array<Friend>} */
    friends = [];

    /** @type {WebSocket | null} */
    socket = null;

    /** @type {DynamicVar<ConnectionState>} */
    state = new DynamicVar('disconnected');

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
        const data = JSON.parse(event.data);

        if (data.status === 'error') {
            console.error('Server error:', event.data.message);
            return;
        }

        if (data.status === 'connected') {
            this.friends = data.friends;
            this.state.Set('connected');
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
        if (event.code !== 1000) {
            this.user.interface.console.AddLog('error', 'Disconnected:', event);
            this.state.Set('disconnected');
        }
    }

    /**
     * @param {string | object} message
     * @returns {boolean} Whether the message was sent successfully
     */
    Send = (message) => {
        if (typeof(message) === 'object') message = JSON.stringify(message);
        if (typeof(message) !== 'string') {
            this.user.interface.console.AddLog('warn', 'Send socket: Invalid message type.');
            return false;
        }

        if (this.isConnected() === false) {
            return false;
        }

        this.socket.send(message);
        return true;
    }
}

export default Multiplayer;
