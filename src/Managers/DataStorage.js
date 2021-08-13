import user from "./UserManager";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_USER = '@params/user';
const STORAGE_DATA = '@params/data';

class DataStorage {
    constructor() {
    }

    Save() {
        const online = user.isConnected();
        const json = {
            'pseudo': user.pseudo,
            'title': user.title,
            'birth': user.birth,
            'email': user.email,
            'xp': user.xp,
            'stats': user.stats,
            'skills': user.skills
        };

        // Local save
        AsyncStorage.setItem(STORAGE_USER, JSON.stringify(json));

        if (online) {
            // Online save
        }
    }
    
    async Load() {
        const online = user.isConnected();
        let json;

        // Local load
        await AsyncStorage.getItem(STORAGE_USER, (err, t) => {
            if (!err && t != null) json = JSON.parse(t);
        });

        user.pseudo = json['pseudo'];
        user.title = json['title'];
        user.birth = json['birth'];
        user.email = json['email'];
        user.xp = json['xp'];
        user.stats = json['stats'];
        user.skills = json['skills'];

        if (online) {
            // Online load
        }
    }
}

export default DataStorage;