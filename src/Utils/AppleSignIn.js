import { Platform } from 'react-native';
import appleAuth from '@invertase/react-native-apple-authentication';

/**
 * @typedef {'cancelled' | 'no_email_or_token' | 'unknown' | 'unavailable' | 'failed' | 'invalid_response'} AppleSignInErrorType
 */

/**
 * @typedef {Object} AppleSignInSuccess
 * @property {true} success - Indicates successful sign-in
 * @property {string} email - User's email address
 * @property {string} identityToken - Identity token for server-side verification
 */

/**
 * @typedef {Object} AppleSignInError
 * @property {false} success - Indicates failed sign-in
 * @property {Error | unknown | null} error - Error
 * @property {string} errorMessage - Error message
 * @property {AppleSignInErrorType} errorType - Error type for handling different scenarios
 */

/**
 * @typedef {Function} LoggerFunction
 * @param {('info' | 'warn' | 'error')} level - Log level
 * @param {string} message - Log message
 * @param {...any} args - Additional arguments for logging
 * @returns {void}
 */

/**
 * Logger function to be set from outside
 * @type {LoggerFunction | null}
 */
let loggerFunction = null;

/**
 * Set the logger function to handle logs
 * @param {LoggerFunction | null} logFn - Function to handle logs, or null to disable logging
 * @returns {void}
 */
function setLogger(logFn) {
    loggerFunction = logFn;
}

/**
 * Internal logging function
 * @param {('info' | 'warn' | 'error')} level - Log level
 * @param {string} message - Log message
 * @param {...any} args - Additional arguments for logging
 * @returns {void}
 */
function log(level, message, ...args) {
    if (loggerFunction && typeof loggerFunction === 'function') {
        loggerFunction(level, message, ...args);
    }
}

/**
 * Check if Apple Sign-In is available on the device
 * Apple Sign-In is only available on iOS 13+ and requires proper configuration
 * @returns {Promise<boolean>} True if available, false otherwise
 */
async function isAppleSignInAvailable() {
    if (Platform.OS !== 'ios') {
        log('info', 'Apple Sign-In: Not available on Android');
        return false;
    }

    try {
        const isSupported = await appleAuth.isSupported;
        if (!isSupported) {
            log('warn', 'Apple Sign-In: Not supported on this iOS version (requires iOS 13+)');
            return false;
        }
        return true;
    } catch (error) {
        log('error', 'Apple Sign-In: Error checking availability:', error);
        return false;
    }
}

/**
 * Check if Apple Sign-In button should be displayed
 * @returns {Promise<boolean>} True if button should be shown, false otherwise
 */
async function shouldShowAppleSignInButton() {
    return await isAppleSignInAvailable();
}

/**
 * Perform Apple Sign-In
 * @returns {Promise<AppleSignInSuccess | AppleSignInError>}
 */
async function performAppleSignIn() {
    try {
        // Check if Apple Sign-In is available
        const isAvailable = await isAppleSignInAvailable();
        if (!isAvailable) {
            return {
                success: false,
                error: null,
                errorType: 'unavailable',
                errorMessage: 'Apple Sign-In is not available on this device'
            };
        }

        // Perform the sign-in request
        log('info', 'Apple Sign-In: Starting sign-in request');

        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
        });

        // Check if the sign-in was successful
        if (!appleAuthRequestResponse) {
            return {
                success: false,
                error: null,
                errorType: 'invalid_response',
                errorMessage: 'No response from Apple Sign-In'
            };
        }

        // Extract user data
        const { identityToken, email } = appleAuthRequestResponse;

        // Verify we have the required data
        if (!identityToken) {
            log('error', 'Apple Sign-In: No identity token received');
            return {
                success: false,
                error: null,
                errorType: 'no_email_or_token',
                errorMessage: 'No identity token received from Apple'
            };
        }

        if (!email) {
            log('error', 'Apple Sign-In: No email received');
            return {
                success: false,
                error: null,
                errorType: 'no_email_or_token',
                errorMessage: 'No email received from Apple'
            };
        }

        log('info', 'Apple Sign-In: Successfully signed in', { email });

        return {
            success: true,
            email,
            identityToken
        };
    } catch (error) {
        /** @type {AppleSignInErrorType} */
        let errorType = 'unknown';
        let errorMessage = 'Apple sign-in failed';

        if (error && typeof error === 'object' && 'code' in error) {
            if (error.code === appleAuth.Error.CANCELED) {
                errorMessage = 'Sign-in cancelled';
                errorType = 'cancelled';
            } else if (error.code === appleAuth.Error.FAILED) {
                errorMessage = 'Sign-in failed';
                errorType = 'failed';
            } else if (error.code === appleAuth.Error.INVALID_RESPONSE) {
                errorMessage = 'Invalid response from Apple';
                errorType = 'invalid_response';
            } else if (error.code === appleAuth.Error.NOT_HANDLED) {
                errorMessage = 'Sign-in not handled';
                errorType = 'failed';
            } else if (error.code === appleAuth.Error.UNKNOWN) {
                errorMessage = 'Unknown error occurred';
                errorType = 'unknown';
            }
        }

        log('error', 'Apple Sign-In: Error during sign-in:', errorMessage, error);

        return {
            success: false,
            error: error,
            errorType,
            errorMessage: errorMessage
        };
    }
}

export default {
    SetLogger: setLogger,
    SignIn: performAppleSignIn,
    isAvailable: isAppleSignInAvailable,
    shouldShowButton: shouldShowAppleSignInButton
};
