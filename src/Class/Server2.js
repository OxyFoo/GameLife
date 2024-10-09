import TCP from './TCP';

import { GetDeviceHash } from 'Utils/Device';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 */

class Server {
    /** @param {UserManager} user */
    constructor(user) {
        /** @private */
        this.user = user;

        /** @private */
        this.tcp = new TCP(user);
    }

    logged = false;

    IsConnected = this.tcp.IsConnected;
    IsLogged = () => this.logged && this.tcp.IsConnected();

    /** @returns {Promise<boolean>} */
    Connect = async () => {
        if (this.logged) {
            this.user.interface.console?.AddLog('warn', 'Already logged to the server');
            return true;
        }

        if (!this.tcp.IsConnected()) {
            const connected = await this.tcp.Connect();
            if (!connected) return false;
        }

        const response = await this.tcp.SendAndWait({
            action: 'login',
            email: this.user.settings.email,
            hashID: GetDeviceHash(),
            token: this.user.settings.token
        });

        if (response === 'timeout' || response === 'not-sent') {
            this.user.interface.console?.AddLog('error', `Server connection failed (${response})`);
            return false;
        }

        if (response.status !== 'connected') {
            this.user.interface.console?.AddLog('error', 'Server connection failed');
            return false;
        }

        this.logged = true;
        return true;
    };

    Disconnect = () => {
        this.tcp.Disconnect();
        this.logged = false;
    };

    /** @returns {Promise<boolean>} */
    LoadInternalData = async () => {
        const response = await this.tcp.SendAndWait({
            action: 'get-internal-data',
            tableHashes: {} // TODO: Fill with hashes
        });
        if (response === 'timeout' || response === 'not-sent') {
            this.user.interface.console?.AddLog('error', `Server connection failed (${response})`);
            return false;
        }

        if (response.status !== 'internal-data') {
            this.user.interface.console?.AddLog('error', 'Server connection failed');
            return false;
        }

        // TODO: Load internal data

        return true;
    };
}

export default Server;
