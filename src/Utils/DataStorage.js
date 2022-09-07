import AsyncStorage from "@react-native-async-storage/async-storage";

import { StrIsJSON } from "./String";

/**
 * @typedef {object} DataStorage_Data
 */
const STORAGE_KEYS = {
    LOGIN: '@data/login',
    USER: '@data/user',
    INTERNAL: '@data/internal',

    INTERNAL_HASHES: '@settings/internal_hashes',
    DATE: '@tools/date'
};

class DataStorage {
    /**
     * @param {DataStorage_Data} storageKey Storage key
     * @param {object} data Data to save (JSON object)
     * @returns {Promise<boolean>} True if data was saved
     */
    static async Save(storageKey, data) {
        let success = true;
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
     * @param {DataStorage_Data} storageKey Storage key
     * @returns {Promise<object?>} Data (JSON object) or null if an error occurred
     */
    static async Load(storageKey) {
        let json = null;

        const localData = await AsyncStorage.getItem(storageKey);
        if (StrIsJSON(localData)) {
            json = JSON.parse(localData);
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