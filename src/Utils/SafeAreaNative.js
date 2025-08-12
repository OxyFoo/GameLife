import { NativeModules, Platform } from 'react-native';
import SafeArea from 'react-native-safe-area';

/**
 * @typedef {object} SafeAreaInsets
 * @property {number} top - Top inset
 * @property {number} left - Left inset
 * @property {number} right - Right inset
 * @property {number} bottom - Bottom inset
 */

/** @type {SafeAreaInsets} */
const DEFAULT_INSETS = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
};

/**
 * Native module to retrieve safe area insets on Android
 */
class SafeAreaNative {
    constructor() {
        this.module = NativeModules.SafeAreaModule;
    }

    /**
     * Checks if the native module is available
     * @returns {boolean} True if the module is available
     */
    isAvailable() {
        // OS incompatible
        if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
            return false;
        }

        // Module not available
        if (!this.module) {
            console.warn('SafeAreaNative module is not available');
            return false;
        }

        // Check if the module has the required method
        if (typeof this.module.getSafeAreaInsets !== 'function') {
            console.warn('SafeAreaNative module does not have getSafeAreaInsets method');
            return false;
        }

        return true;
    }

    /**
     * Retrieves detailed safe area insets from the Android native module
     * @returns {Promise<SafeAreaInsets>} Promise containing detailed insets
     */
    async getSafeAreaInsets() {
        if (!this.isAvailable()) {
            return DEFAULT_INSETS;
        }

        /** @type {SafeAreaInsets | null} */
        let insets = null;

        // Fetch insets based android native module
        if (Platform.OS === 'android') {
            insets = await this.#fetchSafeAreaInsetsFromAndroid();
        }

        // Fetch insets based on library for iOS or android fallback
        else if (Platform.OS === 'ios' || insets === null) {
            insets = await this.#fetchSafeAreaInsetsFromLib();
        }

        // Fallback to default insets if null
        return insets ?? DEFAULT_INSETS;
    }

    /** @returns {Promise<SafeAreaInsets | null>} */
    async #fetchSafeAreaInsetsFromAndroid() {
        try {
            if (!this.module) {
                throw new Error('SafeAreaModule not available');
            }

            const insets = await this.module.getSafeAreaInsets();
            return insets;
        } catch (error) {
            console.warn('Failed to get native safe area insets:', error);
            return null;
        }
    }

    /** @returns {Promise<SafeAreaInsets | null>} */
    async #fetchSafeAreaInsetsFromLib() {
        try {
            if (!this.module) {
                throw new Error('SafeAreaModule not available');
            }

            const insets = await SafeArea.getSafeAreaInsetsForRootView();
            return insets.safeAreaInsets;
        } catch (error) {
            console.warn('Failed to get native safe area insets:', error);
            return null;
        }
    }
}

const safeAreaNative = new SafeAreaNative();
export default safeAreaNative;
export { SafeAreaNative, DEFAULT_INSETS };
