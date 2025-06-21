import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { env } from 'Utils/Env';

/**
 * @typedef {'cancelled' | 'no_email_or_token' | 'unknown' | 'in_progress' | 'play_services_unavailable' | 'developer_error'} GoogleSignInErrorType
 */

/**
 * @typedef {Object} GoogleSignInSuccess
 * @property {true} success - Indicates successful sign-in
 * @property {string} email - User's email address
 * @property {string} idToken - ID token for server-side verification
 */

/**
 * @typedef {Object} GoogleSignInError
 * @property {false} success - Indicates failed sign-in
 * @property {string} error - Error message
 * @property {GoogleSignInErrorType} errorType - Error type for handling different scenarios
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
 * Check if Google Sign-In is properly configured
 * @returns {boolean} True if configured, false otherwise
 */
function isGoogleSignInConfigured() {
    return !!(env.GOOGLE_WEB_CLIENT_ID && env.GOOGLE_WEB_CLIENT_ID.trim() !== '');
}

/**
 * Check if Google Sign-In button should be displayed
 * @returns {boolean} True if button should be shown, false otherwise
 */
function shouldShowGoogleSignInButton() {
    return isGoogleSignInConfigured();
}

/**
 * Configure Google Sign-In if env.GOOGLE_WEB_CLIENT_ID is available
 * This should be called once during app initialization
 */
function configureGoogleSignIn() {
    if (!isGoogleSignInConfigured()) {
        log('warn', 'Google Sign-In: No CLIENT_ID configured, skipping initialization');
        return;
    }

    GoogleSignin.configure({
        webClientId: env.GOOGLE_WEB_CLIENT_ID,
        offlineAccess: false
    });

    log('info', 'Google Sign-In: Configuration completed');
}

/**
 * Perform Google Sign-In
 * @returns {Promise<GoogleSignInSuccess | GoogleSignInError>}
 */
async function performGoogleSignIn() {
    try {
        // Check if device supports Google Play Services
        await GoogleSignin.hasPlayServices();

        // Sign in with Google
        const userInfo = await GoogleSignin.signIn();

        if (userInfo.type === 'cancelled' || userInfo.type !== 'success') {
            return {
                success: false,
                error: `Google sign-in cancelled - ${userInfo.type}`,
                errorType: 'cancelled'
            };
        }

        if (userInfo && userInfo.data.user && userInfo.data.user.email && userInfo.data.idToken) {
            return {
                success: true,
                email: userInfo.data.user.email,
                idToken: userInfo.data.idToken
            };
        } else {
            return {
                success: false,
                error: 'Google sign-in failed - no email or token returned',
                errorType: 'no_email_or_token'
            };
        }
    } catch (error) {
        /** @type {GoogleSignInErrorType} */
        let errorType = 'unknown';
        let errorMessage = 'Google sign-in failed';

        if (error && typeof error === 'object' && 'code' in error) {
            if (error.code === 'SIGN_IN_CANCELLED') {
                errorMessage = 'Sign-in cancelled';
                errorType = 'cancelled';
            } else if (error.code === 'IN_PROGRESS') {
                errorMessage = 'Sign-in in progress';
                errorType = 'in_progress';
            } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
                errorMessage = 'Play Services not available';
                errorType = 'play_services_unavailable';
            } else if (error.code === 'DEVELOPER_ERROR') {
                errorMessage = 'Configuration error - SHA-1 fingerprint missing in Google Cloud Console';
                errorType = 'developer_error';
            }
        }

        return {
            success: false,
            error: errorMessage,
            errorType
        };
    }
}

/**
 * Sign out from Google
 * @returns {Promise<void>}
 */
async function signOutGoogle() {
    try {
        if (isGoogleSignInConfigured()) {
            await GoogleSignin.signOut();
            log('info', 'Google Sign-In: User signed out');
        }
    } catch (error) {
        log('error', 'Google Sign-In: Error during sign out:', error);
    }
}

export default {
    SetLogger: setLogger,
    Configure: configureGoogleSignIn,
    SignIn: performGoogleSignIn,
    SignOut: signOutGoogle,
    isConfigured: isGoogleSignInConfigured,
    shouldShowButton: shouldShowGoogleSignInButton
};
