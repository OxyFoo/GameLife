import DynamicVar from 'Utils/DynamicVar';
import Config from 'react-native-config';

const settings = {
    host: Config.VPS_IP,
    port: Config.VPS_PORT
};

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/Friend').Friend} Friend
 * @typedef {import('Types/NotificationInApp').NotificationInApp} NotificationInApp
 * 
 * @typedef {'idle' | 'connected' | 'disconnected' | 'error'} ConnectionState
 * @typedef {'connected' | 'disconnected' | 'error' | 'update-friends' | 'update-notifications'} RequestType
 */

class Multiplayer {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;
    }

    /** @type {WebSocket | null} */
    socket = null;

    /** @type {DynamicVar<ConnectionState>} */
    state = new DynamicVar('idle');

    /** @type {DynamicVar<Array<Friend>>} */
    friends = new DynamicVar([]);

    /** @type {DynamicVar<Array<NotificationInApp>>} */
    notifications = new DynamicVar([]);

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

        /** @type {RequestType} */
        const status = data.status;

        if (status === 'update-friends') {
            this.friends.Set(data.friends);
        }
        if (status === 'update-notifications') {
            this.notifications.Set(data.notifications);
        }

        if (status === 'connected' || status === 'disconnected' || status === 'error') {
            this.state.Set(status);
            if (status === 'error') {
                this.user.interface.console.AddLog('error', 'Server error:', event.data.message);
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

    /** @param {string} username */
    AddFriend = (username) => {
        this.Send({ action: 'add-friend', username });
    }
    /** @param {number} accountID */
    RemoveFriend = (accountID) => {
        this.Send({ action: 'remove-friend', accountID });
    }
    /** @param {number} accountID */
    AcceptFriend = (accountID) => {
        this.Send({ action: 'accept-friend', accountID });
    }
    /** @param {number} accountID */
    DeclineFriend = (accountID) => {
        this.Send({ action: 'decline-friend', accountID });
    }
}

export default Multiplayer;
