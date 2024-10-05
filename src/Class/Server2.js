import TCP from './TCP';

import { GetDeviceIdentifiers } from 'Utils/Device';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/TCP/Request_ServerToClient').ServerRequestLogin} ServerRequestLogin
 */

class Server {
    /** @type {UserManager} */
    #user;
    #listenerTCP;
    #isTrusted = false;

    /** @param {UserManager} user */
    constructor(user) {
        this.#user = user;
        this.tcp = new TCP(user);
        this.#listenerTCP = this.tcp.state.AddListener((state) => {
            if (this.#isTrusted && state !== 'connected') {
                this.#isTrusted = false;
            }
        });
    }

    Disconnect = () => {
        this.tcp.state.RemoveListener(this.#listenerTCP);
        this.tcp.Disconnect();
    };

    /**
     * Client is connected to the server
     */
    IsConnected = () => this.tcp.IsConnected() && this.tcp.state.Get() === 'connected';

    /**
     * Client is authenticated to the server
     */
    IsTrusted = () => this.IsConnected() && this.#isTrusted;

    /**
     * User is logged to an account \
     * ⚠️ Not necessarily connected to the server
     */
    IsLogged = () => this.#user.settings.email !== '' && this.#user.settings.token !== '';

    /**
     * User is logged to an account and device is authenticated to the server
     */
    IsAuthenticated = () => this.IsTrusted() && this.#user.settings.token !== '';

    /** @returns {Promise<'success' | 'already-connected' | 'not-connected' | 'error'>} */
    Connect = async () => {
        if (this.tcp.IsConnected()) {
            this.#user.interface.console?.AddLog('warn', 'Already logged to the server');
            return 'already-connected';
        }

        const connected = await this.tcp.Connect();
        if (!connected) {
            this.#user.interface.console?.AddLog('error', 'Server connection failed');
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
            this.#user.interface.console?.AddLog('error', `Server connection failed (${response})`);
            return 'not-connected';
        }

        if (response.status !== 'connect' || response.result !== 'ok') {
            this.#user.interface.console?.AddLog('error', 'Server connection failed (invalid response)');
            return 'error';
        }

        this.#isTrusted = true;
        return 'success';
    };

    /**
     * @param {string} email
     * @returns {Promise<ServerRequestLogin['result'] | false>}
     * - `false` if the connection failed
     * - `ServerRequestLogin['result']` if the connection succeeded
     */
    Login = async (email) => {
        const response = await this.tcp.SendAndWait({
            action: 'login',
            email,
            token: this.#user.settings.token
        });
        if (response === 'timeout' || response === 'not-sent' || response === 'interrupted') {
            this.#user.interface.console?.AddLog('error', `Server connection failed (${response})`);
            return false;
        }

        if (response.status !== 'login') {
            this.#user.interface.console?.AddLog('error', 'Server connection failed');
            return 'error';
        }

        this.isBanned = response.banned ?? false;
        if (typeof response.token === 'string') {
            this.#user.settings.token = response.token;
            await this.#user.settings.Save();
        }
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
            this.#user.interface.console?.AddLog('error', `Server connection failed (${response})`);
            return false;
        }

        if (response.status !== 'signin') {
            this.#user.interface.console?.AddLog('error', 'Server connection failed');
            return false;
        }

        return response.result;
    };

    /** @returns {Promise<boolean>} */
    LoadInternalData = async () => {
        const response = await this.tcp.SendAndWait({
            action: 'get-internal-data',
            tableHashes: {} // TODO: Fill with hashes
        });
        if (response === 'timeout' || response === 'not-sent') {
            this.#user.interface.console?.AddLog('error', `Server connection failed (${response})`);
            return false;
        }

        if (response.status !== 'internal-data') {
            this.#user.interface.console?.AddLog('error', 'Server connection failed');
            return false;
        }

        // TODO: Load internal data

        return true;
    };
}

export default Server;
