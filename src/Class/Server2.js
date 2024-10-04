import TCP from './TCP';

import { GetDeviceIdentifiers } from 'Utils/Device';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 */

class Server {
    /** @param {UserManager} user */
    constructor(user) {
        /** @private */
        this.user = user;
        this.tcp = new TCP(user);
    }

    IsConnected = () => this.tcp.IsConnected();
    /** @deprecated */
    IsLogged = () => this.user.settings.token !== '' && this.tcp.IsConnected();

    /** @returns {Promise<'success' | 'already-connected' | 'not-connected' | 'error'>} */
    Connect = async () => {
        if (this.tcp.IsConnected()) {
            this.user.interface.console?.AddLog('warn', 'Already logged to the server');
            return 'already-connected';
        }

        const connected = await this.tcp.Connect();
        if (!connected) {
            this.user.interface.console?.AddLog('error', 'Server connection failed');
            return 'not-connected';
        }

        const device = GetDeviceIdentifiers();
        const response = await this.tcp.SendAndWait({
            action: 'connect',
            deviceName: device.deviceName,
            OSName: device.OSName,
            OSVersion: device.OSVersion,
            deviceIdentifier: device.identifier
        });

        if (response === 'timeout' || response === 'not-sent' || response === 'interrupted') {
            this.user.interface.console?.AddLog('error', `Server connection failed (${response})`);
            return 'not-connected';
        }

        if (response.status !== 'connect' || response.result !== 'ok') {
            this.user.interface.console?.AddLog('error', 'Server connection failed (invalid response)');
            return 'error';
        }

        return 'success';
    };

    /**
     * @param {string} email
     */
    Login = async (email) => {
        const response = await this.tcp.SendAndWait({
            action: 'login',
            email,
            token: this.user.settings.token
        });
        if (response === 'timeout' || response === 'not-sent' || response === 'interrupted') {
            this.user.interface.console?.AddLog('error', `Server connection failed (${response})`);
            return false;
        }

        if (response.status !== 'login') {
            this.user.interface.console?.AddLog('error', 'Server connection failed');
            return false;
        }

        this.isLogged = response.result === 'ok';
        this.isBanned = response.banned ?? false;
        return response.result;
    };

    /**
     * @param {string} username
     * @param {string} email
     */
    Signin = async (username, email) => {
        const response = await this.tcp.SendAndWait({
            action: 'signin',
            username,
            email
        });
        if (response === 'timeout' || response === 'not-sent' || response === 'interrupted') {
            this.user.interface.console?.AddLog('error', `Server connection failed (${response})`);
            return false;
        }

        if (response.status !== 'signin') {
            this.user.interface.console?.AddLog('error', 'Server connection failed');
            return false;
        }

        return response.result;
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
