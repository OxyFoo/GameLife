import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE = {
    USER: '@params/user'
}

class DataManager {
    static Save(storageKey, data, online) {
        // Local save
        AsyncStorage.setItem(storageKey, JSON.stringify(data));
        //console.log('Local save');

        if (online) {
            // Online save
            //console.log('Online save');
        }
    }
    
    static async Load(storageKey, online = false) {
        let json;
        // Local load
        await AsyncStorage.getItem(storageKey, (err, t) => {
            if (!err && t != null) json = JSON.parse(t);
        });
        //console.log('Local load');

        if (online) {
            // Online load
            //console.log('Online load');
        }

        return json;
    }
}

export { STORAGE };
export default DataManager;