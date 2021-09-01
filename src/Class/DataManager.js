import AsyncStorage from "@react-native-async-storage/async-storage";
import { Request_Async } from "../Functions/Request";

const STORAGE = {
    USER: '@params/user',
    INTERNAL: '@params/internal'
}

class DataManager {
    static Save(storageKey, data, online, token, pseudoCallback) {
        // Local save
        AsyncStorage.setItem(storageKey, JSON.stringify(data));

        if (online) {
            // Online save
            const _data = {
                'action': 'setUserData',
                'token': token,
                'data': JSON.stringify(data)
            };
            Request_Async(_data).then(response => {
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
        const localData = await AsyncStorage.getItem(storageKey);/*, (err, t) => {
            if (!err && t != null) json = JSON.parse(t);
        });*/
        if (typeof(localData) !== 'undefined' && localData != null) json = JSON.parse(localData);

        if (online) {
            // Online load
            const data = {
                'action': 'getUserData',
                'token': token
            };
            const result = await Request_Async(data);
            if (typeof(result['status']) !== 'undefined' && result['status'] === 'ok') {
                if (result['data'] != '') {
                    const onlineJson = JSON.parse(result['data']);
                    for (const key in onlineJson) {
                        const currValue = onlineJson[key];
                        if (typeof(currValue) === 'object') {
                            for (const childKey in currValue) {
                                const currChildValue = currValue[childKey];
                                json[key][childKey] = currChildValue;
                            }
                        } else {
                            json[key] = currValue;
                        }
                    }
                }
            }
        }

        return json;
    }
}

export { STORAGE };
export default DataManager;