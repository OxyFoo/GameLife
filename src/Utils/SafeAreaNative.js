import { NativeModules } from 'react-native';

/**
 * @typedef {object} SafeAreaInsets
 * @property {number} top - Top inset
 * @property {number} left - Left inset
 * @property {number} right - Right inset
 * @property {number} bottom - Bottom inset
 */

/**
 * @typedef {object} DetailedSafeAreaInsets
 * @property {number} top - Top inset (system bars combined)
 * @property {number} left - Left inset (system bars combined)
 * @property {number} right - Right inset (system bars combined)
 * @property {number} bottom - Bottom inset (system bars combined)
 * @property {SafeAreaInsets} navigationBars - Navigation bar specific insets
 * @property {SafeAreaInsets} statusBars - Status bar specific insets
 * @property {SafeAreaInsets} displayCutout - Display cutout specific insets
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
        return !!this.module;
    }

    /**
     * Retrieves detailed safe area insets from the Android native module
     * @returns {Promise<DetailedSafeAreaInsets>} Promise containing detailed insets
     */
    async getSafeAreaInsets() {
        try {
            if (!this.module) {
                throw new Error('SafeAreaModule not available');
            }

            const insets = await this.module.getSafeAreaInsets();
            return insets;
        } catch (error) {
            console.warn('Failed to get native safe area insets:', error);

            // Return default values in case of error
            return {
                ...DEFAULT_INSETS,
                navigationBars: DEFAULT_INSETS,
                statusBars: DEFAULT_INSETS,
                displayCutout: DEFAULT_INSETS
            };
        }
    }
}

const safeAreaNative = new SafeAreaNative();
export default safeAreaNative;
export { SafeAreaNative, DEFAULT_INSETS };
