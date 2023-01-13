import { PageBack } from '../../Components';
import { Linking } from 'react-native';

import dataManager from '../../../Managers/DataManager';

class BackAbout extends PageBack {
    constructor(props) {
        super(props);
        const GetContributors = (contrib) => ({ id: contrib.ID, value: contrib.Name });
        this.contributors = dataManager.contributors.contributors.reverse().map(GetContributors);
        this.version = require('../../../../package.json').versionName;
        this.var = Array(4).fill(0);
    }

    OpenLink = (index, link) => {
        const after = () => {
            const sum = this.var.reduce((a, b) => a + b, 0);
            if (sum === this.var.length) console.log('TODO');
            else Linking.openURL(link); this.var.fill(0);
        }
        if (this.var[0] === 0 && index === 3) { this.var[0] = 1; this.timeout = setTimeout(after, 500); }
        else if (this.var[0] === 0 || this.var[index+1] === 1) { Linking.openURL(link); }
        else { this.var[index+1] = 1; clearTimeout(this.timeout); this.timeout = setTimeout(after, 1000); }
    }

    TiktokPress   = () => this.OpenLink(0, 'https://vm.tiktok.com/ZMdcNpCvu/');
    InstaPress    = () => this.OpenLink(1, 'https://www.instagram.com/p/CTUlsU2jP51');
    DiscordPress  = () => this.OpenLink(2, 'https://discord.gg/QDfsXCCq');
    GamelifePress = () => this.OpenLink(3, 'https://oxyfoo.com');
}

export default BackAbout;