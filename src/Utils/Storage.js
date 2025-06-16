import AsyncStorage from '@react-native-async-storage/async-storage';

import { StrIsJSON } from './String';
import { STORAGE_KEYS } from 'Constants/StorageKeys';

class Storage {
    /**
     * @param {keyof STORAGE_KEYS} storageKey Storage key
     * @param {object | null} data Data to save (JSON object)
     * @returns {Promise<boolean>} True if data was saved
     */
    static async Save(storageKey, data) {
        let success = true;

        // Check if the storage key is valid
        if (!STORAGE_KEYS.hasOwnProperty(storageKey)) {
            console.error(`[Storage] Invalid storage key: ${storageKey}`);
            return false;
        }

        // If data is null, reset the storage
        if (data === null) {
            await AsyncStorage.removeItem(storageKey, (err) => {
                if (err) {
                    console.error('[Storage]', err);
                    success = false;
                }
            });
            return success;
        }

        const strData = JSON.stringify(data);
        await AsyncStorage.setItem(storageKey, strData, (err) => {
            if (err) {
                console.error('[Storage]', err);
                success = false;
            }
        });
        return success;
    }

    /**
     * @template {object} T
     * @param {keyof STORAGE_KEYS} storageKey Storage key
     * @returns {Promise<T | null>} Data (JSON object) or null if an error occurred
     */
    static async Load(storageKey) {
        let json = null;

        // Check if the storage key is valid
        if (!STORAGE_KEYS.hasOwnProperty(storageKey)) {
            console.error(`[Storage] Invalid storage key: ${storageKey}`);
            return null;
        }

        try {
            const localData = await AsyncStorage.getItem(storageKey);
            if (localData !== null && StrIsJSON(localData)) {
                json = JSON.parse(localData);
            }
        } catch (error) {
            console.error('[Storage]', error);
        }

        return json;
    }

    /**
     * Clear all data from storage
     */
    static ClearAll() {
        return AsyncStorage.clear();
    }
}

export default Storage;
