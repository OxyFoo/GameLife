import AsyncStorage from "@react-native-async-storage/async-storage";
import langManager from "./LangManager";

const STORAGE_USER = '@params/user';
const STORAGE_DATA = '@params/data';

class DataStorage {
    constructor(user) {
        this.user = user;
    }

    Save() {
        const online = this.user.isConnected();
        const json = {
            'lang': langManager.currentLangageKey,
            'pseudo': this.user.pseudo,
            'title': this.user.title,
            'birth': this.user.birth,
            'email': this.user.email,
            'xp': this.user.xp,
            'stats': this.user.stats,
            'skills': this.user.skills
        };

        // Local save
        AsyncStorage.setItem(STORAGE_USER, JSON.stringify(json));
        console.log('Local save');

        if (online) {
            // Online save
            console.log('Online save');
        }
    }
    
    async Load(callback) {
        const online = this.user.isConnected();
        let json;

        // Local load
        await AsyncStorage.getItem(STORAGE_USER, (err, t) => {
            if (!err && t != null) json = JSON.parse(t);
        });

        langManager.setLangage(json['lang']);
        this.user.pseudo = json['pseudo'];
        this.user.title = json['title'];
        this.user.birth = json['birth'];
        this.user.email = json['email'];
        this.user.xp = json['xp'];
        this.user.stats = json['stats'];
        this.user.skills = json['skills'];
        console.log('Local load');

        if (online) {
            // Online load
            console.log('Online load');
        }

        if (typeof(callback) !== 'undefined') {
            callback();
        }
    }
}

export default DataStorage;