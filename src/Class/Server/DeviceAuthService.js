import { GetIntegrityToken } from './Integrity';
import DynamicVar from 'Utils/DynamicVar';
import SecureStorage from 'Utils/SecureStorage';
import { GetDeviceInformations } from 'Utils/Device';

/**
 * @typedef {import('./TCP').default} TCP
 * @typedef {import('./Integrity').IntegrityToken} IntegrityToken
 * @typedef {import('Managers/UserManager').UserManager} UserManager
 *
 * @typedef {'authenticated' | 'banned' | 'not-authenticated'} DeviceAuthState
 */

class DeviceAuthService {
    /** @type {UserManager} */
    #user;

    /** @type {TCP} */
    #tcp;

    /** @type {Symbol | null} */
    #listenerTCP = null;

    /** @type {DynamicVar<DeviceAuthState>} */
    state = new DynamicVar(/** @type {DeviceAuthState} */ ('not-connected'));

    /**
     * @param {UserManager} user
     * @param {TCP} tcp
     */
    constructor(user, tcp) {
        this.#user = user;
        this.#tcp = tcp;
    }

    Mount = async () => {
        // Add the listener to reset the authentication state if the TCP connection is lost
        if (this.#listenerTCP === null) {
            this.#listenerTCP = this.#tcp.state.AddListener((state) => {
                if (this.IsAuthenticated() && state !== 'connected') {
                    this.state.Set('not-authenticated');
                }
            });
        }
    };

    Unmount = () => {
        this.state.Set('not-authenticated');
        this.#tcp.state.RemoveListener(this.#listenerTCP);
        this.#listenerTCP = null;
    };

    Clear = async () => {
        await SecureStorage.Remove('INTEGRITY_TOKEN');

        // The credentials (DEVICE_UUID & SESSION_TOKEN) not removed
        // Device authentication is persistent and not tied to the user authentication
    };

    HardReset = async () => {
        await SecureStorage.Remove('DEVICE_UUID');
        await SecureStorage.Remove('SESSION_TOKEN');
        await SecureStorage.Remove('INTEGRITY_TOKEN');
    };

    /**
     * @description Check if the device is authenticated
     * @returns {DeviceAuthState}
     */
    GetAuthenticationState = () => {
        return this.state.Get();
    };

    IsAuthenticated = () => {
        const state = this.state.Get();
        return state === 'authenticated' || state === 'banned';
    };

    /**
     * @description Authenticate the device with the server & define the server state (in server class)
     * @returns {Promise<boolean>}
     */
    Authenticate = async () => {
        // If the device is already authenticated, return true
        if (this.IsAuthenticated()) {
            return true;
        }

        // Step 1: Do the handshake
        const handshakeResult = await this.#handshake();
        if (handshakeResult === 'not-connected' || handshakeResult === 'error') {
            return false;
        }

        // Step 2: Get the integrity token if needed
        const integrityToken = await this.#checkIntegrityAndGenerateIfNeeded();

        // Save the integrity token in the secure storage
        if (integrityToken !== null) {
            const saveResult = await this.#saveIntegrityToken(integrityToken);
            if (!saveResult) {
                return false;
            }
        } else {
            this.#user.interface.console?.AddLog(
                'warn',
                '[DeviceAuthService] Integrity token generation failed, cannot authenticate'
            );
        }

        // Step 3: Authenticate the device
        const authenticateResult = await this.#authenticate();
        if (authenticateResult === null) {
            return false;
        }

        // Step 4: Save the session token in the secure storage
        const saveCredentialsResult = await this.#saveCredentials(
            authenticateResult.uuid,
            authenticateResult.sessionToken
        );
        if (!saveCredentialsResult) {
            return false;
        }

        return true;
    };

    /**
     * @returns {Promise<'ok' | 'not-connected' | 'error'>}
     */
    #handshake = async () => {
        if (!this.#tcp.IsConnected()) {
            return 'not-connected';
        }

        // Load app version & UUID from the secure storage
        const appVersion = require('../../../package.json').version;

        // Handshake the server
        const response = await this.#tcp.SendAndWait({
            action: 'handshake',
            appVersion
        });

        // The server didn't respond or the response is invalid
        if (
            response === 'timeout' ||
            response === 'not-sent' ||
            response === 'interrupted' ||
            response.status !== 'handshake'
        ) {
            this.#user.interface.console?.AddLog(
                'error',
                '[DeviceAuthService] Handshake failed',
                typeof response === 'string' ? response : response.status
            );
            return 'error';
        }

        // Update the server state
        if (response.result === 'ok') {
            this.#user.server2.serverState.status = 'up-to-date';
        } else if (
            response.result === 'update' ||
            response.result === 'update-optional' ||
            response.result === 'maintenance' ||
            response.result === 'downdate'
        ) {
            this.#user.server2.serverState.status = response.result;
            if (typeof response.serverVersion === 'string') {
                this.#user.server2.serverState.version = response.serverVersion;
            }
        } else {
            this.#user.interface.console?.AddLog(
                'error',
                '[DeviceAuthService] Handshake failed, invalid response:',
                response.result
            );
            return 'error';
        }

        this.#user.interface.console?.AddLog('info', '[DeviceAuthService] Handshake succeeded');
        return 'ok';
    };

    /**
     * @description Check the integrity of the device using the Play Integrity API (Android) or App Attest (iOS)
     * @returns {Promise<IntegrityToken | null>}
     */
    #checkIntegrityAndGenerateIfNeeded = async () => {
        /** @type {IntegrityToken | null} */
        const integrityToken = await SecureStorage.Load('INTEGRITY_TOKEN');

        const response = await this.#tcp.SendAndWait({
            action: 'check-integrity',
            integrityToken: integrityToken
        });

        // Error handling for the integrity check response
        if (
            response === 'not-sent' ||
            response === 'timeout' ||
            response === 'interrupted' ||
            response.status !== 'check-integrity'
        ) {
            const errorMessage = typeof response === 'string' ? response : response.status;
            this.#user.interface.console?.AddLog(
                'error',
                `[DeviceAuthService] Integrity check failed, invalid response (${errorMessage})`
            );
            return null;
        }

        // Integrity is valid, no need to generate a new token
        else if (response.result === 'ok') {
            this.#user.interface.console?.AddLog('info', '[DeviceAuthService] Integrity check succeeded');
            this.#user.interface.console?.AddLog(
                'info',
                `[DeviceAuthService] Integrity token is valid, using existing token`
            );
            return integrityToken;
        }

        // Integrity is not valid, we need to generate a new token
        else if (response.result === 'new-integrity-token-needed') {
            // Integrity token needed but no challenge provided
            if (typeof response.challenge !== 'string') {
                this.#user.interface.console?.AddLog(
                    'error',
                    '[DeviceAuthService] Integrity check failed, challenge not provided for new integrity token'
                );
                return null;
            }

            // Generate a new integrity token using the challenge provided by the server
            const newIntegrityToken = await this.#generateNewIntegrityToken(response.challenge);
            if (newIntegrityToken === null) {
                this.#user.interface.console?.AddLog(
                    'error',
                    '[DeviceAuthService] Integrity check failed, unable to generate new integrity token'
                );
                return null;
            }

            const response2 = await this.#tcp.SendAndWait({
                action: 'check-integrity',
                integrityToken: newIntegrityToken
            });

            if (
                response2 === 'not-sent' ||
                response2 === 'timeout' ||
                response2 === 'interrupted' ||
                response2.status !== 'check-integrity' ||
                response2.result !== 'ok'
            ) {
                const error = typeof response2 === 'string' ? response2 : response2.status;
                this.#user.interface.console?.AddLog(
                    'error',
                    `[DeviceAuthService] Integrity check failed after generating new token: ${error}`
                );
                return null;
            }

            return newIntegrityToken;
        } else {
            this.#user.interface.console?.AddLog(
                'error',
                `[DeviceAuthService] Integrity check failed, invalid response: ${response.result}`
            );
            return null;
        }
    };

    /**
     * @description Generate a new integrity token using the challenge provided by the server
     * @param {string} challenge
     * @returns {Promise<IntegrityToken | null>}
     */
    #generateNewIntegrityToken = async (challenge) => {
        const logId = this.#user.interface.console?.AddLog(
            'info',
            '[DeviceAuthService] Generating new integrity token'
        );
        const newIntegrityToken = await GetIntegrityToken(challenge);

        if (newIntegrityToken === 'unsupported') {
            this.#user.interface.console?.EditLog(logId, 'error', '[DeviceAuthService] Integrity token not supported');
            return null;
        }

        if (newIntegrityToken === 'error') {
            this.#user.interface.console?.EditLog(
                logId,
                'error',
                '[DeviceAuthService] Integrity token generation failed'
            );
            return null;
        }

        this.#user.interface.console?.EditLog(logId, 'info', '[DeviceAuthService] New integrity token generated');

        return newIntegrityToken;
    };

    /**
     * @description Save the integrity token in the secure storage
     * @param {IntegrityToken} newIntegrityToken
     * @returns {Promise<boolean>}
     */
    #saveIntegrityToken = async (newIntegrityToken) => {
        // Save the integrity token in the secure storage
        const saved = await SecureStorage.Save('INTEGRITY_TOKEN', newIntegrityToken);
        if (!saved) {
            this.#user.interface.console?.AddLog('error', '[DeviceAuthService] Integrity token not saved');
            return false;
        }

        this.#user.interface.console?.AddLog('info', '[DeviceAuthService] Integrity token saved');
        return true;
    };

    /**
     * @description Authenticate the device with the server
     * @returns {Promise<{ uuid: string | undefined, sessionToken: string | undefined } | null>}
     */
    #authenticate = async () => {
        const device = GetDeviceInformations();
        /** @type {string | null} */
        const sessionToken = await SecureStorage.Load('SESSION_TOKEN');

        /** @type {string | null} */
        const uuid = await SecureStorage.Load('DEVICE_UUID');

        const response = await this.#tcp.SendAndWait({
            action: 'authenticate',
            credentials: {
                UUID: uuid,
                sessionToken
            },
            informations: {
                deviceName: device.deviceName,
                OSName: device.OSName,
                OSVersion: device.OSVersion
            }
        });

        if (
            response === 'not-sent' ||
            response === 'timeout' ||
            response === 'interrupted' ||
            response.status !== 'authenticate'
        ) {
            this.#user.interface.console?.AddLog('error', '[DeviceAuthService] Authentication failed');
            return null;
        }

        if (response.result === 'error') {
            this.#user.interface.console?.AddLog(
                'error',
                `[DeviceAuthService] Authentication failed, reset credentials`
            );
            await this.HardReset();
            return null;
        }

        if (response.result === 'banned') {
            this.state.Set('banned');
            this.#user.interface.console?.AddLog('warn', '[DeviceAuthService] Device banned');
            return null;
        } else if (response.result !== 'ok') {
            this.#user.interface.console?.AddLog(
                'error',
                `[DeviceAuthService] Authentication failed, invalid response (${response.result})`
            );
            return null;
        }

        this.state.Set('authenticated');

        return {
            uuid: response.newUuid,
            sessionToken: response.newSessionToken
        };
    };

    /**
     * @description Save the credentials in the secure storage
     * @param {string} [uuid]
     * @param {string} [sessionToken]
     * @returns {Promise<boolean>}
     */
    #saveCredentials = async (uuid, sessionToken) => {
        if (typeof uuid === 'string') {
            const saved = await SecureStorage.Save('DEVICE_UUID', uuid);
            if (!saved) {
                this.#user.interface.console?.AddLog('error', '[DeviceAuthService] UUID not saved');
                return false;
            }
            this.#user.interface.console?.AddLog('info', '[DeviceAuthService] New UUID assigned');
        }

        if (typeof sessionToken === 'string') {
            const saved = await SecureStorage.Save('SESSION_TOKEN', sessionToken);
            if (!saved) {
                this.#user.interface.console?.AddLog('error', '[DeviceAuthService] Session token not saved');
                return false;
            }
        }

        return true;
    };
}

export default DeviceAuthService;
