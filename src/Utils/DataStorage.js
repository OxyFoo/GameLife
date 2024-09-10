import AsyncStorage from '@react-native-async-storage/async-storage';

import { StrIsJSON } from './String';

const STORAGE_KEYS = {
    LOGIN: '@data/login',
    USER: '@data/user',
    INTERNAL: '@data/internal',

    INTERNAL_HASHES: '@settings/internal_hashes',
    DATE: '@tools/date'
};

class DataStorage {
    /**
     * @param {string} storageKey Storage key
     * @param {object | null} data Data to save (JSON object)
     * @returns {Promise<boolean>} True if data was saved
     */
    static async Save(storageKey, data) {
        let success = true;

        // If data is null, reset the storage
        if (data === null) {
            await AsyncStorage.removeItem(storageKey, (err) => {
                if (err) {
                    console.error(err);
                    success = false;
                }
            });
            return success;
        }

        const strData = JSON.stringify(data);
        await AsyncStorage.setItem(storageKey, strData, (err) => {
            if (err) {
                console.error(err);
                success = false;
            }
        });
        return success;
    }

    /**
     * @param {string} storageKey Storage key
     * @returns {Promise<object?>} Data (JSON object) or null if an error occurred
     */
    static async Load(storageKey) {
        let json = null;

        try {
            const localData = await AsyncStorage.getItem(storageKey);
            if (localData !== null && StrIsJSON(localData)) {
                json = JSON.parse(localData);
            }
        } catch (error) {
            console.error(error);
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

export { STORAGE_KEYS as STORAGE };
export default DataStorage;
