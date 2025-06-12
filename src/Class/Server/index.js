import { IUserClass } from '@oxyfoo/gamelife-types/Interface/IUserClass';

import TCP from './TCP';
import DeviceAuthService from './DeviceAuthService';
import UserAuthService from './UserAuthService';
import { env } from 'Utils/Env';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 *
 * @typedef {{
 *   status: 'not-connected' | 'up-to-date' | 'maintenance' | 'update' | 'update-optional' | 'downdate',
 *   version: string | null
 * }} ServerState
 */

class Server extends IUserClass {
    /** @type {UserManager} */
    #user;

    /**
     * @description TCP connection to the server, used for device and user authentication
     * @type {TCP}
     */
    tcp;

    /**
     * @description Device authentication service
     * @type {DeviceAuthService}
     */
    deviceAuth;

    /**
     * @description User authentication service
     * @type {UserAuthService}
     */
    userAuth;

    /** @type {Symbol | null} */
    #listenerTCP = null;

    /**
     * Defined in the handshake in deviceAuthService
     * @type {ServerState}
     */
    serverState = {
        status: 'not-connected',
        version: null
    };

    /** @param {UserManager} user */
    constructor(user) {
        super('server2');

        this.#user = user;

        this.tcp = new TCP(
            env.VPS_PROTOCOL === 'none' || typeof env.VPS_HOST === 'undefined' || typeof env.VPS_PORT === 'undefined'
                ? null
                : {
                      protocol: env.VPS_PROTOCOL,
                      host: env.VPS_HOST,
                      port: env.VPS_PORT
                  }
        );
        this.deviceAuth = new DeviceAuthService(this.#user, this.tcp);
        this.userAuth = new UserAuthService(this.#user, this.tcp);

        this.#listenerTCP = this.tcp.state.AddListener((state) => {
            if (state === 'disconnected' || state === 'error') {
                this.serverState.status = 'not-connected';
                this.serverState.version = null;
            }
        });
    }

    /**
     * @description Initialize the server connection and device authentication
     * @returns {Promise<'authenticated' | 'already-authenticated' | 'ssl-pinning-failed' | 'authenticated-failed' | 'not-connected' | 'maintenance' | 'update'>}
     */
    Initialize = async () => {
        if (
            this.tcp.IsConnected() &&
            this.deviceAuth.GetAuthenticationState() !== 'not-authenticated' &&
            this.userAuth.IsLogged()
        ) {
            return 'already-authenticated';
        }

        // Mount services
        await this.deviceAuth.Mount();
        await this.userAuth.Mount();

        // 1. Connect to the server
        if (env.VPS_PROTOCOL === 'none') {
            this.#user.interface.console?.AddLog('warn', 'Server connection is disabled, using local mode');
        } else if (!this.tcp.IsConnected()) {
            const isNewUser = !this.userAuth.email;
            const connectionStatus = await this.tcp.Connect(isNewUser);
            if (connectionStatus === 'ssl-pinning-error') {
                this.#user.interface.console?.AddLog('error', '[Server] SSL Pinning error, check your configuration');
                return 'ssl-pinning-failed';
            } else if (connectionStatus === 'error' || connectionStatus === 'timeout') {
                this.#user.interface.console?.AddLog('error', `[Server] Connection failed: ${connectionStatus}`);
                return 'not-connected';
            } else if (connectionStatus !== 'connected' && connectionStatus !== 'already-connected') {
                this.#user.interface.console?.AddLog(
                    'error',
                    `[Server] Unexpected connection status: ${connectionStatus}`
                );
                return 'not-connected';
            }
        }

        // 2. Authenticate the device
        if (this.deviceAuth.GetAuthenticationState() === 'not-authenticated') {
            const deviceAuthenticated = await this.deviceAuth.Authenticate();
            if (!deviceAuthenticated) {
                this.#user.interface.console?.AddLog('error', '[Server] Device authentication failed');
                this.tcp.Disconnect();
                return 'authenticated-failed';
            }
        }

        // 3. Manage server state
        if (this.serverState.status === 'maintenance') {
            this.#user.interface.console?.AddLog('warn', 'Server is in maintenance');
            this.tcp.Disconnect();
            return 'maintenance';
        }

        if (this.serverState.status === 'update') {
            this.#user.interface.console?.AddLog('warn', 'App update required');
            this.tcp.Disconnect();
            return 'update';
        }

        // Version is too recent, but the server is still probably compatible
        // Generally for the validation of Google/Apple which test the app before its publication in prod
        if (this.serverState.status === 'downdate') {
            this.#user.interface.console?.AddLog('warn', 'App downgrade required');
        }

        if (this.serverState.status === 'update-optional') {
            if (this.serverState.version !== null) {
                this.#user.interface.console?.AddLog('warn', 'Optional update available');
            } else {
                this.#user.interface.console?.AddLog('error', 'Optional update available but no version provided');
            }
        }

        return 'authenticated';
    };

    Unmount = () => {
        if (this.#listenerTCP) {
            this.tcp.state.RemoveListener(this.#listenerTCP);
            this.#listenerTCP = null;
        }
        this.userAuth.Unmount();
        this.deviceAuth.Unmount();
        this.tcp.Disconnect();
    };

    Clear = async () => {
        this.devMode = false;
        this.isBanned = false;
        this.serverState.status = 'not-connected';
        this.serverState.version = null;
        await this.userAuth.Clear();
        await this.deviceAuth.Clear();
    };

    /**
     * User is logged to an account and device is authenticated to the server
     */
    IsAuthenticated = () => this.deviceAuth.IsAuthenticated() && this.userAuth.IsLogged();

    // Reconnect = async () => {
    //     if (this.IsAuthenticated()) {
    //         return;
    //     }

    //     const email = this.#user.settings.email;

    //     if (!email) {
    //         return false;
    //     }

    //     this.#user.interface.console?.AddLog('info', 'Reconnecting to the server');

    //     const connected = await this.Connect();
    //     if (connected !== 'success' && connected !== 'already-connected') {
    //         return false;
    //     }

    //     const logged = await this.Login(email);
    //     if (logged !== 'ok') {
    //         return false;
    //     }

    //     return true;
    // };
}

export default Server;
