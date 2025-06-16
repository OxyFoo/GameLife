import AppControl from 'react-native-app-control';

import { CheckDate } from './DateCheck';
import langManager from 'Managers/LangManager';
import DynamicVar from 'Utils/DynamicVar';
import SecureStorage from 'Utils/SecureStorage';

/**
 * @typedef {import('./TCP').default} TCP
 * @typedef {import('Managers/UserManager').UserManager} UserManager
 */

class UserAuthService {
    /** @type {UserManager} user */
    #user;

    /** @type {TCP} */
    #tcp;

    /** @type {DynamicVar<string | null>} */
    email = new DynamicVar(/** @type {string | null} */ (null));

    /** @type {boolean} */
    devMode = false;

    /** @type {boolean} */
    isBanned = false;

    /**
     * @param {UserManager} user
     * @param {TCP} tcp
     */
    constructor(user, tcp) {
        this.#user = user;
        this.#tcp = tcp;
    }

    Mount = async () => {
        const email = await SecureStorage.Load('ACCOUNT_EMAIL');
        this.email.Set(email);
    };

    Unmount = () => {
        this.email.Set(null);
    };

    Clear = async () => {
        await this.ResetEmail();
    };

    /**
     * @description Check if the user is logged
     * @returns {boolean}
     */
    IsLogged = () => {
        return this.email.Get() !== null;
    };

    /**
     * @description Get the email of the logged user
     * @returns {string | null}
     */
    GetEmail = () => {
        return this.email.Get();
    };

    /**
     * @param {string} email The email to set
     * @returns {Promise<boolean>} Returns true if the email was set successfully
     */
    SetEmail = async (email) => {
        const isEmailSaved = await SecureStorage.Save('ACCOUNT_EMAIL', email);
        if (!isEmailSaved) {
            this.#user.interface.console?.AddLog('error', '[Server2/UserAuthService/SetEmail] Failed to save email');
            return false;
        }

        this.email.Set(email);
        return true;
    };

    ResetEmail = async () => {
        const isEmailRemoved = await SecureStorage.Remove('ACCOUNT_EMAIL');
        if (!isEmailRemoved) {
            this.#user.interface.console?.AddLog(
                'error',
                '[Server2/UserAuthService/ResetEmail] Failed to remove email'
            );
            return false;
        }

        this.email.Set(null);
        return true;
    };

    /**
     * @param {string | null} email
     * @returns {Promise<'authenticated' | 'authenticated-offline' | 'free' | 'mailNotSent' | 'deviceLimitReached' | 'waitMailConfirmation' | 'error'>}
     * - `false` if the request failed
     * - `ok` if the login is successful
     * - `free` if the account does not exist
     * - `mailNotSent` if the mail was not sent
     * - `waitMailConfirmation` if the mail was sent but not yet confirmed
     * - `error` if an error occurred
     */
    Login = async (email) => {
        if (email === null) {
            this.#user.interface.console?.AddLog('error', '[Server2/Login] No email provided');
            return 'error';
        }

        if (!this.#user.server2.deviceAuth.IsAuthenticated()) {
            if (this.IsLogged()) {
                this.#user.interface.console?.AddLog('error', '[Server2/Login] Device not authenticated but logged');
                return 'authenticated-offline';
            }
            this.#user.interface.console?.AddLog('error', '[Server2/Login] Device not authenticated');
            return 'error';
        }

        const response = await this.#tcp.SendAndWait({
            action: 'login',
            email
        });

        if (response === 'timeout' || response === 'not-sent' || response === 'interrupted') {
            this.#user.interface.console?.AddLog('error', `[Server2/Login] Server connection failed (${response})`);
            return 'error';
        }

        if (response.status !== 'login') {
            this.#user.interface.console?.AddLog(
                'error',
                `[Server2/Login] Server connection failed (${response.status})`
            );
            return 'error';
        }

        if (
            response.result === 'free' ||
            response.result === 'mailNotSent' ||
            response.result === 'deviceLimitReached' ||
            response.result === 'waitMailConfirmation' ||
            response.result === 'error'
        ) {
            this.#user.interface.console?.AddLog('info', `[Server2/Login] Login status: ${response.result}`);
            return response.result;
        }

        this.devMode = response.result.devMode ?? false;
        this.isBanned = response.result.banned ?? false;

        if (this.devMode) {
            await this.#user.interface.console?.Enable();
        }

        // Check current date
        const dateIsOk = await CheckDate(this.#tcp);
        if (dateIsOk === false) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: langManager.curr['home']['alert-dateerror-title'],
                    message: langManager.curr['home']['alert-dateerror-text']
                },
                callback: AppControl.Exit,
                cancelable: false
            });
            return 'error';
        }

        // Save email
        const isEmailSet = await this.SetEmail(email);
        if (!isEmailSet) {
            this.#user.interface.console?.AddLog('error', '[Server2/Login] Failed to save email');
            return 'error';
        }

        return 'authenticated';
    };

    /**
     * @param {string} username
     * @param {string} email
     */
    Signin = async (username, email) => {
        const response = await this.#tcp.SendAndWait({
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
}

export default UserAuthService;
