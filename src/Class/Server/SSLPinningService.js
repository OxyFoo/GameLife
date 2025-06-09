import {
    initializeSslPinning,
    disableSslPinning,
    addSslPinningErrorListener,
    isSslPinningAvailable
} from 'react-native-ssl-public-key-pinning';

/**
 * @typedef {import('react-native').EmitterSubscription} EmitterSubscription
 * @typedef {import('react-native-ssl-public-key-pinning').PinningOptions} PinningOptions
 * @typedef {import('react-native-ssl-public-key-pinning').PinningError} PinningError
 * @typedef {'info' | 'warn' | 'error'} LogType
 */

/**
 * @typedef {function(LogType, string, ...any): void} LoggerFunction
 */

/**
 * Service for managing SSL Public Key Pinning
 * Handles initialization, cleanup, and error monitoring
 */
class SSLPinningService {
    /** @type {EmitterSubscription | null} */
    #errorListener = null;

    /** @type {boolean} */
    #isInitialized = false;

    /** @type {LoggerFunction | null} */
    #logger = null;

    /**
     * Set the logger function for SSL pinning events
     * @param {LoggerFunction} logger - Function that accepts (level, message, ...args)
     */
    setLogger(logger) {
        this.#logger = logger;
    }

    /**
     * Log a message if logger is available
     * @param {LogType} level - Log level ('info', 'error', 'warn')
     * @param {string} message - Message to log
     * @param {...any} args - Additional arguments
     */
    #log(level, message, ...args) {
        if (this.#logger !== null) {
            this.#logger(level, `[SSL Pinning] ${message}`, ...args);
        }
    }

    /**
     * Handle SSL pinning errors
     * @param {PinningError} error - The pinning error
     */
    #handlePinningError = (error) => {
        this.#log('error', `🚨 SSL PINNING FAILED! 🚨 Host: ${error.serverHostname}`, error.message);
        this.#log('error', 'SSL Pinning validation failed - this should cause connection failure');

        // Can add additional error handling here:
        // - Send telemetry
        // - Show user notification
        // - Implement fallback behavior
    };

    /**
     * Check if SSL pinning is available and should be enabled
     * @returns {boolean}
     */
    shouldEnablePinning() {
        // Check if the native module is available
        if (!isSslPinningAvailable()) {
            this.#log('warn', 'SSL Pinning not available on this platform');
            return false;
        }

        return true;
    }

    /**
     * Initialize SSL pinning with the configured public key
     * @param {string} host - The server hostname (not used, but kept for compatibility)
     * @param {string} primaryKey - Primary public key in base64 format
     * @param {string | undefined} backupKey - Backup public key in base64 format
     * @returns {Promise<boolean>} Success status
     */
    async initialize(host = '*', primaryKey, backupKey) {
        if (this.#isInitialized) {
            this.#log('warn', 'SSL Pinning already initialized');
            return true;
        }

        if (!this.shouldEnablePinning()) {
            this.#log('info', 'SSL Pinning not enabled - conditions not met');
            return false;
        }

        this.#log('info', 'Initializing SSL Pinning for WSS connections');

        try {
            // Set up error listener before initialization
            this.#errorListener = addSslPinningErrorListener(this.#handlePinningError);

            // Configure SSL Pinning with the server's public key from environment
            /** @type {PinningOptions} */
            const pinningConfig = {};
            const hostname = host || '*'; // Fallback to wildcard if host is undefined

            // Get SSL keys from environment variables
            if (!primaryKey) {
                this.#log('error', 'SSL Pinning keys not found in environment variables');
                throw new Error('SSL Pinning keys not configured');
            }

            // Validate key format - should not contain sha256/ prefix
            if (primaryKey.includes('sha256/') || (backupKey && backupKey.includes('sha256/'))) {
                this.#log('error', 'SSL Pinning keys should not contain sha256/ prefix - use base64 format only');
                throw new Error('SSL Pinning keys have incorrect format');
            }

            // Prepare pinning configuration
            pinningConfig[hostname] = {
                publicKeyHashes: [primaryKey],
                includeSubdomains: true
            };

            // Add backup key if provided
            if (backupKey) {
                pinningConfig[hostname].publicKeyHashes.push(backupKey);
            }

            this.#log('info', `SSL Pinning configured for ${hostname} with keys from environment`);

            await initializeSslPinning(pinningConfig);

            this.#isInitialized = true;
            this.#log('info', `SSL Pinning initialized successfully for ${hostname}`);
            return true;
        } catch (error) {
            this.#log('error', 'Failed to initialize SSL Pinning', error);

            // Clean up error listener if initialization failed
            if (this.#errorListener) {
                this.#errorListener.remove();
                this.#errorListener = null;
            }

            return false;
        }
    }

    /**
     * Disable SSL pinning and clean up resources
     * @returns {Promise<void>}
     */
    async cleanup() {
        if (!this.#isInitialized) {
            return;
        }

        try {
            // Remove error listener first
            if (this.#errorListener) {
                this.#errorListener.remove();
                this.#errorListener = null;
            }

            // Disable SSL pinning
            await disableSslPinning();
            this.#isInitialized = false;
            this.#log('info', 'SSL Pinning disabled successfully');
        } catch (error) {
            this.#log('error', 'Failed to disable SSL Pinning', error);
        }
    }

    /**
     * Get the current initialization status
     * @returns {boolean}
     */
    isInitialized() {
        return this.#isInitialized;
    }
}

// Export a singleton instance
export default new SSLPinningService();
