import SecureStorage from 'Utils/SecureStorage';
import { GetDeviceInformations } from 'Utils/Device';
import { GetIntegrityToken } from 'Utils/Integrity';

/**
 * @typedef {import('./TCP').default} TCP
 * @typedef {import('Managers/UserManager').UserManager} UserManager
 * @typedef {import('Utils/Integrity').IntegrityToken} IntegrityToken
 */

class DeviceAuthService {
    /** @type {UserManager} */
    #user;

    /** @type {TCP} */
    #tcp;

    /** @type {Symbol | null} */
    #listenerTCP = null;

    /** @param {string | null} tcp */
    #authenticated = false;

    /** @type {boolean} */
    #banned = false;

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
                if (this.#authenticated && state !== 'connected') {
                    this.#authenticated = false;
                }
            });
        }
    };

    Unmount = () => {
        this.#banned = false;
        this.#authenticated = false;
        this.#tcp.state.RemoveListener(this.#listenerTCP);
        this.#listenerTCP = null;
    };

    Clear = async () => {
        this.#banned = false;
        this.#authenticated = false;
        await SecureStorage.Remove('SESSION_TOKEN');
        await SecureStorage.Remove('INTEGRITY_TOKEN');
    };

    /**
     * @description Check if the device is authenticated
     * @returns {'authenticated' | 'banned' | 'not-authenticated' | 'not-connected'}
     */
    IsAuthenticated = () => {
        if (!this.#tcp.IsConnected()) {
            return 'not-connected';
        }
        if (this.#banned) {
            return 'banned';
        }
        if (this.#authenticated) {
            return 'authenticated';
        }
        return 'not-authenticated';
    };

    /**
     * @description Authenticate the device with the server & define the server state (in server class)
     * @returns {Promise<boolean>}
     */
    Authenticate = async () => {
        // Step 1: Do the handshake
        const handshakeResult = await this.#handshake();
        if (handshakeResult === 'already-authenticated') {
            return true;
        }

        if (handshakeResult === 'not-connected' || handshakeResult === 'error') {
            return false;
        }

        // Step 2: Get the integrity token if needed
        if (handshakeResult === 'ok') {
            const integrityToken = await this.#checkIntegrityAndGenerateIfNeeded();
            if (integrityToken === null) {
                return false;
            }

            // Verify the integrity token on the server
            const integrityIsValid = await this.#verifyAppIntegrityOnServer(integrityToken);
            if (!integrityIsValid) {
                return false;
            }

            // Save the integrity token in the secure storage
            const saveResult = await this.#saveIntegrityToken(integrityToken);
            if (!saveResult) {
                return false;
            }
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
     * @returns {Promise<'ok' | 'already-authenticated' | 'not-connected' | 'error'>}
     */
    #handshake = async () => {
        if (!this.#tcp.IsConnected()) {
            return 'not-connected';
        }

        if (this.#authenticated) {
            return 'already-authenticated';
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
     * @description Verify the integrity token on the server
     * @param {IntegrityToken} integrityToken
     * @returns {Promise<boolean>}
     */
    #verifyAppIntegrityOnServer = async (integrityToken) => {
        const response = await this.#tcp.SendAndWait({
            action: 'check-integrity',
            integrityToken: integrityToken
        });

        if (
            response === 'not-sent' ||
            response === 'timeout' ||
            response === 'interrupted' ||
            response.status !== 'check-integrity' ||
            response.result !== 'ok'
        ) {
            this.#user.interface.console?.AddLog('error', '[DeviceAuthService] Integrity check failed');
            return false;
        }

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
            response.status !== 'authenticate' ||
            response.result === 'error'
        ) {
            this.#user.interface.console?.AddLog('error', '[DeviceAuthService] Authentication failed');
            return null;
        }

        if (response.result === 'banned') {
            this.#banned = true;
            this.#user.interface.console?.AddLog('warn', '[DeviceAuthService] Device banned');
            return null;
        } else if (response.result !== 'ok') {
            this.#user.interface.console?.AddLog(
                'error',
                `[DeviceAuthService] Authentication failed, invalid response (${response.result})`
            );
            return null;
        }

        if (response.newUuid) {
            this.#user.interface.console?.AddLog('info', '[DeviceAuthService] UUID assigned');
        }

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
