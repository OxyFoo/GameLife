import AsyncStorage from "@react-native-async-storage/async-storage";
import { Request_Async } from "../Functions/Request";

const STORAGE = {
    USER: '@params/user',
    SETTINGS: '@params/settings',
    INTERNAL: '@params/internal',
    INTERNAL_HASH: '@params/internal_hash',
    APPSTATE: '@params/appstate',
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
            await Request_Async(_data).then(response => {
                if (typeof(pseudoCallback) === 'function') {
                    const status = response.hasOwnProperty('status') ? response['status'] : '';
                    pseudoCallback(status);
                }
            });
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
            const result = await Request_Async(data);
            const blocks = [ 'solvedAchievements' ];
            if (result.hasOwnProperty('status') && result['status'] === 'ok') {
                if (result.hasOwnProperty('data') && result['data'] !== '') {
                    const onlineJson = JSON.parse(result['data']);
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