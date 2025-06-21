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
     * Independent of the user authentication, just to check if the server is reachable
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
     * @returns {Promise<'authenticated' | 'already-authenticated' | 'wrong-ssl-pinning' | 'authenticated-failed' | 'not-connected' | 'maintenance' | 'update'>}
     */
    Initialize = async () => {
        if (env.VPS_PROTOCOL === 'none') {
            this.#user.interface.console?.AddLog('warn', 'Server connection is disabled, using local mode');
            this.serverState.status = 'not-connected';
            return 'not-connected';
        }

        if (this.IsAuthenticated()) {
            return 'already-authenticated';
        }

        // Mount services
        await this.deviceAuth.Mount();
        await this.userAuth.Mount();

        // 1. Connect to the server
        if (!this.tcp.IsConnected()) {
            const isNewUser = this.userAuth.GetEmail() === null;
            const connectionStatus = await this.tcp.Connect(isNewUser);
            if (connectionStatus === 'wrong-ssl-pinning') {
                this.#user.interface.console?.AddLog('error', '[Server] SSL Pinning error, check your configuration');
                return 'wrong-ssl-pinning';
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
        if (!this.deviceAuth.IsAuthenticated()) {
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

    Reconnect = this.Initialize;

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
        await this.userAuth.Clear();
        await this.deviceAuth.Clear();

        // Don't reset `this.serverState.version` to keep the last known version
        // Keep last known server version for reconnection scenarios to avoid re-fetching
    };

    /**
     * User is logged to an account and device is authenticated to the server
     */
    IsAuthenticated = () => this.tcp.IsConnected() && this.deviceAuth.IsAuthenticated() && this.userAuth.IsLogged();
}

export default Server;
