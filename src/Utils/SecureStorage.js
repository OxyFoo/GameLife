import * as Keychain from 'react-native-keychain';
import DeviceInfo from 'react-native-device-info';

import { SECURE_STORAGE_KEYS } from 'Constants/StorageKeys';

class SecureStorage {
    /**
     * @description Get the service name for the keychain for the given key
     * @param {string} key
     */
    static #getServiceName(key) {
        const bundleId = DeviceInfo.getBundleId();
        return `${bundleId}.${key}`;
    }

    /**
     * @description Check if the key is valid
     * @param {string} key
     * @returns {key is keyof SECURE_STORAGE_KEYS}
     */
    static #checkKey(key) {
        if (!SECURE_STORAGE_KEYS.hasOwnProperty(key)) {
            console.error(`[SecureStorage] Invalid storage key: ${key}`);
            return false;
        }
        return true;
    }

    /**
     * @description Save a value in the keychain
     * @param {keyof SECURE_STORAGE_KEYS} key
     * @param {object|string} data
     * @returns {Promise<boolean>}
     */
    static async Save(key, data) {
        // Check if the key is valid
        if (!SecureStorage.#checkKey(key) || data === undefined) {
            return false;
        }

        try {
            const service = SecureStorage.#getServiceName(key);

            // The API demands a "username", but we use it as a simple key
            const value = typeof data === 'string' ? data : JSON.stringify(data);
            const result = await Keychain.setGenericPassword(key, value, { service });
            return result !== false;
        } catch (err) {
            console.error(`[SecureStorage.save/${key}]`, err);
            return false;
        }
    }

    /**
     * @description Load a value from the keychain.
     * @template T
     * @param {keyof SECURE_STORAGE_KEYS} key
     * @returns {Promise<T|null>}
     */
    static async Load(key) {
        // Check if the key is valid
        if (!SecureStorage.#checkKey(key)) {
            return null;
        }

        try {
            const service = SecureStorage.#getServiceName(key);

            const creds = await Keychain.getGenericPassword({ service });
            if (!creds) return null;

            const raw = creds.password;
            try {
                return /** @type {T} */ (JSON.parse(raw));
            } catch {
                return /** @type {T} */ (raw);
            }
        } catch (err) {
            console.error(`[SecureStorage.load/${key}]`, err);
            return null;
        }
    }

    /**
     * @description Remove a value from the keychain.
     * @param {keyof SECURE_STORAGE_KEYS} key
     * @returns {Promise<boolean>}
     */
    static async Remove(key) {
        // Check if the key is valid
        if (!SecureStorage.#checkKey(key)) {
            return false;
        }

        try {
            const service = SecureStorage.#getServiceName(key);
            await Keychain.resetGenericPassword({ service });
            return true;
        } catch (err) {
            console.error(`[SecureStorage.remove/${key}]`, err);
            return false;
        }
    }

    /**
     * @description Clear all secure storage entries.
     * @returns {Promise<void>}
     */
    static async ClearAll() {
        const keys = Object.values(SECURE_STORAGE_KEYS);
        for (const key of keys) {
            if (!SecureStorage.#checkKey(key)) {
                continue;
            }
            await SecureStorage.Remove(key);
        }
    }
}

export default SecureStorage;
