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
        await AsyncStorage.getItem(storageKey, (err, t) => {
            if (!err && t != null) json = JSON.parse(t);
        });

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
                        json[key] = onlineJson[key];
                    }
                }
            }
        }

        return json;
    }
}

export { STORAGE };
export default DataManager;