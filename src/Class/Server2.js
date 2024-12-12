import RNExitApp from 'react-native-exit-app';

import { IUserClass } from 'Types/Interface/IUserClass';
import langManager from 'Managers/LangManager';

import TCP from 'Utils/TCP';
import { CheckDate } from 'Utils/DateCheck';
import { GetDeviceIdentifiers } from 'Utils/Device';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 */

class Server2 extends IUserClass {
    /** @type {UserManager} */
    #user;
    #listenerTCP;
    #isTrusted = false;
    devMode = false;

    /** @param {UserManager} user */
    constructor(user) {
        super('server2');

        this.#user = user;
        this.tcp = new TCP();
        this.#listenerTCP = this.tcp.state.AddListener((state) => {
            if (this.#isTrusted && state !== 'connected' && state !== 'authenticated') {
                this.#isTrusted = false;
            }
        });
    }

    Clear = () => {
        this.#isTrusted = false;
        this.devMode = false;
        this.isBanned = false;
    };

    Disconnect = () => {
        this.tcp.state.RemoveListener(this.#listenerTCP);
        this.tcp.Disconnect();
    };

    /**
     * Client is connected to the server and device is authenticated to the server
     */
    IsConnected = () =>
        this.tcp.IsConnected() &&
        (this.tcp.state.Get() === 'connected' || this.tcp.state.Get() === 'authenticated') &&
        this.#isTrusted;

    /**
     * User is logged to an account \
     * ⚠️ Not necessarily connected to the server
     */
    IsLogged = () => this.#user.settings.email !== '' && this.#user.settings.token !== '';

    /**
     * User is logged to an account and device is authenticated to the server
     */
    IsAuthenticated = () => this.IsConnected() && this.IsLogged();

    /**
     * @param {boolean} [connectAsNewUser]
     * @returns {Promise<'success' | 'already-connected' | 'not-connected' | 'maintenance' | 'error'>}
     */
    Connect = async (connectAsNewUser = false) => {
        if (this.tcp.IsConnected()) {
            return 'already-connected';
        }

        const connected = await this.tcp.Connect(connectAsNewUser);
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
            this.#user.interface.console?.AddLog('error', `[Server2/Connect] Server connection failed (${response})`);
            return 'not-connected';
        }

        if (response.status !== 'connect' || response.result === 'error') {
            this.#user.interface.console?.AddLog('error', 'Server connection failed (invalid response)');
            return 'error';
        }

        if (response.result === 'maintenance') {
            this.#user.interface.console?.AddLog('warn', 'Server is in maintenance');
            this.Disconnect();
            return 'maintenance';
        }

        this.#isTrusted = true;
        return 'success';
    };

    /**
     * @param {string} email
     * @returns {Promise<'ok' | 'free' | 'mailNotSent' | 'deviceLimitReached' | 'waitMailConfirmation' | 'error' | false>}
     * - `false` if the request failed
     * - `ok` if the login is successful
     * - `free` if the account does not exist
     * - `mailNotSent` if the mail was not sent
     * - `waitMailConfirmation` if the mail was sent but not yet confirmed
     * - `error` if an error occurred
     */
    Login = async (email) => {
        const response = await this.tcp.SendAndWait({
            action: 'login',
            email,
            token: this.#user.settings.token
        });
        if (response === 'timeout' || response === 'not-sent' || response === 'interrupted') {
            this.#user.interface.console?.AddLog('error', `[Server2/Login] Server connection failed (${response})`);
            return false;
        }

        if (response.status !== 'login') {
            this.#user.interface.console?.AddLog('error', '[Server2/Login] Server connection failed');
            return 'error';
        }

        if (
            response.result === 'free' ||
            response.result === 'mailNotSent' ||
            response.result === 'deviceLimitReached' ||
            response.result === 'waitMailConfirmation' ||
            response.result === 'error'
        ) {
            return response.result;
        }

        this.devMode = response.result.devMode ?? false;
        this.isBanned = response.result.banned ?? false;
        if (typeof response.result.token === 'string') {
            this.#user.settings.token = response.result.token;
            await this.#user.settings.IndependentSave();
        }

        if (this.devMode) {
            await this.#user.interface.console?.Enable();
        }

        if (this.tcp.state.Get() === 'connected') {
            this.tcp.state.Set('authenticated');
        }

        // Check current date
        const dateIsOk = await CheckDate(this.tcp);
        if (dateIsOk === false) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: langManager.curr['home']['alert-dateerror-title'],
                    message: langManager.curr['home']['alert-dateerror-text']
                },
                callback: RNExitApp.exitApp,
                cancelable: false
            });
            return 'error';
        }

        return 'ok';
    };

    /**
     * @param {string} username
     * @param {string} email
     */
    Signin = async (username, email) => {
        const response = await this.tcp.SendAndWait({
            action: 'signin',
            username,
            email,
            lang: langManager.currentLangageKey
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

    Reconnect = async () => {
        const email = this.#user.settings.email;

        if (!email) {
            return false;
        }

        const connected = await this.Connect(false);
        if (connected !== 'success' && connected !== 'already-connected') {
            return false;
        }

        const logged = await this.Login(email);
        if (logged !== 'ok') {
            return false;
        }

        return true;
    };
}

export default Server2;
