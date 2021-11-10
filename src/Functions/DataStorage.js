import AsyncStorage from "@react-native-async-storage/async-storage";
import { strIsJSON } from "./Functions";
import { Request_Async } from "./Request";

const STORAGE = {
    USER: '@params/user',
    SETTINGS: '@params/settings',
    INTERNAL: '@params/internal',
    INTERNAL_HASH: '@params/internal_hash',
    ONBOARDING: '@params/onboarding',
    THEME: '@params/theme',
    DATE: '@params/date'
}

class DataStorage {
    static async Save(storageKey, data, online, token, pseudoCallback) {
        // Local save
        AsyncStorage.setItem(storageKey, JSON.stringify(data));

        if (online) {
            // Online save
            const _data = {
                'action': 'setUserData',
                'token': token,
                'data': JSON.stringify(data)
            };

            // TODO - Tej ce bout de code
            const response = await Request_Async(_data);
            if (typeof(pseudoCallback) === 'function' && response.status === 'ok') {
                pseudoCallback(response.data);
            }
            /*Request_Async(_data).then(response => {
                if (typeof(pseudoCallback) === 'function') {
                    const status = response.hasOwnProperty('status') ? response['status'] : '';
                    pseudoCallback(status);
                }
            });*/
        }
    }
    
    static async Load(storageKey, online = false, token = '') {
        let json;
        // Local load
        const localData = await AsyncStorage.getItem(storageKey);
        if (typeof(localData) !== 'undefined' && localData != null) json = JSON.parse(localData);

        if (online) {
            // Online load
            const data = {
                'action': 'getUserData',
                'token': token
            };
            const blocks = [ 'solvedAchievements' ];
            const response = await Request_Async(data);
            if (response.status === 'ok') {
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

export { STORAGE };
export default DataStorage;