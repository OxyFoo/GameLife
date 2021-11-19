import AsyncStorage from "@react-native-async-storage/async-storage";

import { strIsJSON } from "./Functions";
import { Request_Async } from "./Request";

/**
 * @typedef {Object} DataStorage_Data
 */
const STORAGE_KEYS = {
    USER: '@data/user',
    SETTINGS: '@data/settings',
    INTERNAL: '@data/internal',

    INTERNAL_HASH: '@settings/internal_hash',
    ONBOARDING: '@settings/onboarding',
    DATE: '@tools/date'
};

class DataStorage {
    /**
     * 
     * @param {String} storageKey - Storage key
     * @param {Object} data - Data to save (JSON object)
     * @param {Boolean} online - If true, data will be saved online
     *  (data will be saved locally in any case)
     * @param {String} token - Token for online saving
     * 
     * @returns {Promise<Boolean>} - True if data was saved
     */
    static async Save(storageKey, data, online, token) {
        let success = false;

        // Local save
        success = true;
        const strData = JSON.stringify(data);
        await AsyncStorage.setItem(storageKey, strData, (err) => {
            if (err) {
                console.error(err);
                success = false;
            }
        });

        // Online save
        if (online && success) {
            const _data = {
                'action': 'setUserData',
                'token': token,
                'data': data
            };

            const response = await Request_Async(_data);
            if (response.status === 200) {
                success = true;
            }
        }

        return success;
    }

    /**
     * 
     * @param {String} storageKey - Storage key
     * @param {Boolean} online - If true, data will be loaded online
     * @param {String} token - Token for online loading
     * 
     * @returns {Promise<Object>} - Data (JSON object) or null if an error occurred
     */
    static async Load(storageKey, online = false, token = '') {
        let json = null;

        // Local load
        if (!online) {
            const localData = await AsyncStorage.getItem(storageKey);
            if (strIsJSON(localData)) {
                json = JSON.parse(localData);
            }
        }

        // TODO
        // Online load
        else {
            const data = {
                'action': 'getUserData',
                'token': token
            };
            const blocks = [ 'solvedAchievements' ];
            const response = await Request_Async(data);
            if (response.status === 200) {
                if (strIsJSON(response.data)) {
                    const onlineJson = JSON.parse(response.data);
                    for (const currKey in onlineJson) {
                        const currValue = onlineJson[currKey];
                        if (typeof(json[currKey]) !== 'undefined') {
                            if (typeof(currValue) === 'object') {
                                if (!blocks.includes(currKey)) {
                                    for (const childKey in currValue) {
                                        const currChildValue = currValue[childKey];
                                        json[currKey][childKey] = currChildValue;
                                    }
                                } else {
                                    json[currKey] = currValue;
                                }
                            } else {
                                json[currKey] = currValue;
                            }
                        } else {
                            json[currKey] = currValue;
                        }
                    }
                }
            }
        }

        return json;
    }

    static async clearAll() {
        await AsyncStorage.clear();
    }
}

export { STORAGE_KEYS as STORAGE };
export default DataStorage;