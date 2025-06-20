import { GoogleSignin } from '@react-native-google-signin/google-signin';

import user from 'Managers/UserManager';

import { env } from 'Utils/Env';

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
        user.interface.console?.AddLog('warn', 'Google Sign-In: No CLIENT_ID configured, skipping initialization');
        return;
    }

    GoogleSignin.configure({
        webClientId: env.GOOGLE_WEB_CLIENT_ID,
        offlineAccess: false
    });

    user.interface.console?.AddLog('info', 'Google Sign-In: Configuration completed');
}

/**
 * Perform Google Sign-In
 * @returns {Promise<{ success: true, email: string } | { success: false, error: string, errorType: string }>}
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

        user.interface.console?.AddLog('info', 'Google Sign-In Success:', userInfo);

        if (userInfo && userInfo.user && userInfo.user.email) {
            return {
                success: true,
                email: userInfo.user.email
            };
        } else {
            return {
                success: false,
                error: 'Google sign-in failed - no email returned',
                errorType: 'no_email'
            };
        }
    } catch (error) {
        let errorMessage = 'Google sign-in failed';
        let errorType = 'unknown';

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
            user.interface.console?.AddLog('info', 'Google Sign-In: User signed out');
        }
    } catch (error) {
        user.interface.console?.AddLog('error', 'Google Sign-In: Error during sign out:', error);
    }
}

/**
 * Check if user is signed in to Google
 * @returns {Promise<boolean>}
 */
async function isSignedInToGoogle() {
    try {
        if (!isGoogleSignInConfigured()) {
            return false;
        }
        return await GoogleSignin.isSignedIn();
    } catch (error) {
        user.interface.console?.AddLog('error', 'Google Sign-In: Error checking sign in status:', error);
        return false;
    }
}

export default {
    Configure: configureGoogleSignIn,
    SignIn: performGoogleSignIn,
    SignOut: signOutGoogle,
    isConfigured: isGoogleSignInConfigured,
    shouldShowButton: shouldShowGoogleSignInButton,
    isSignedIn: isSignedInToGoogle
};
