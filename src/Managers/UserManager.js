import DeviceInfo from 'react-native-device-info';

import langManager from "./LangManager";
import ServManager from "./ServManager";
import DataStorage from './DataStorage';

class UserManager {
    constructor() {
        // this.changePage(pageName, argument);
        // Change page with animation and arg
        // Function loaded in componentDidMount of PageManager (in App.js)
        this.changePage;

        // User informations
        this.pseudo = 'Player-XXXX';
        this.title = 'Titre';
        this.birth = '';
        this.email = 'Aucun';
        this.xp = 0;

        this.stats = {
            'sag': 0,
            'int': 2,
            'conf': 5,
            'for': 6,
            'end': 8,
            'agil': 9,
            'dex': 10
        };

        this.skills = [
            //new Skill('skill1', 10, 'DD/MM/YY')
        ];

        // Device informations
        const DeviceID = DeviceInfo.getUniqueId();
        const DeviceName = DeviceInfo.getDeviceNameSync();
        const BuildID = DeviceInfo.getBuildIdSync();
        const deviceInformations = {
            'DeviceID': DeviceID,
            'DeviceName': DeviceName,
            'BuildID': BuildID
        };

        // Internet
        this.conn = new ServManager();
        this.conn.getToken(deviceInformations);

        // Data storage
        this.storage = new DataStorage();
    }
}

class Stat {
    constructor(key, xp) {
        this.key = key;
        this.xp = xp;
    }
}

class Skill {
    constructor(key, xp, lastTime) {
        this.key = key;
        this.title = '';
        this.cat = '';
        this.xp = xp;
        this.lastTime = lastTime;
        this.caracs = {
            'sag': 0,
            'int': 0,
            'conf': 0,
            'for': 0,
            'end': 0,
            'agil': 0,
            'dex': 0
        };
    }

    /*getSkillName = (key) => {
        return langManager.currentLangage[key]['name'];
    }
    getCatName = (key) => {
        return langManager.currentLangage[key]['cat'];
    }

    getCarac = (key, carac) => {
        return langManager.currentLangage[key][carac];
    }*/
}

const user = new UserManager();

export default user;