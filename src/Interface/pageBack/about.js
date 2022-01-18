import * as React from 'react';
import { Linking } from 'react-native';

import dataManager from '../../Managers/DataManager';

class BackAbout extends React.Component {
    constructor(props) {
        super(props);
        const GetContributors = (contrib) => ({ id: contrib.ID, value: contrib.Name });
        this.contributors = dataManager.contributors.contributors.reverse().map(GetContributors);
        this.version = require('../../../package.json').versionName;
    }

    TiktokPress  = () => { Linking.openURL('https://vm.tiktok.com/ZMdcNpCvu/'); }
    InstaPress   = () => { Linking.openURL('https://www.instagram.com/p/CTUlsU2jP51'); }
    DiscordPress = () => { Linking.openURL('https://discord.gg/QDfsXCCq')}
    GamelifePress = () => { Linking.openURL('https://oxyfoo.com'); }
}

export default BackAbout;