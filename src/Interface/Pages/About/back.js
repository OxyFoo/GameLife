import { PageBack } from 'Interface/Components';
import { Linking } from 'react-native';

import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

const { versionName } = require('../../../../package.json');

class BackAbout extends PageBack {
    constructor(props) {
        super(props);

        const allContributors = dataManager.contributors.contributors;
        const GetContributors = (contrib) => ({ id: contrib.ID, value: contrib.Name });
        this.contributors = allContributors.reverse().map(GetContributors);

        this.versionText = langManager.curr['about']['text-version'].replace('{}', versionName);
    }

    TiktokPress   = () => Linking.openURL('https://vm.tiktok.com/ZMdcNpCvu/');
    InstaPress    = () => Linking.openURL('https://www.instagram.com/p/CTUlsU2jP51');
    DiscordPress  = () => Linking.openURL('https://discord.gg/QDfsXCCq');
    GamelifePress = () => Linking.openURL('https://oxyfoo.com');
}

export default BackAbout;