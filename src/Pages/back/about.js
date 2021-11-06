import * as React from 'react';
import { Linking } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

class BackAbout extends React.Component {
    constructor(props) {
        super(props);

        this.staff = [];
        this.tipeee = [];
        for (let i = 0; i < user.contributors.length; i++) {
            const contributor = user.contributors[i];
            if (contributor.Type === 'Tipeee') this.tipeee.push(contributor);
            else this.staff.push(contributor);
        }
        this.tipeee.reverse();
    }

    TiktokPress  = () => { Linking.openURL('https://vm.tiktok.com/ZMdcNpCvu/'); }
    InstaPress   = () => { Linking.openURL('https://www.instagram.com/p/CTUlsU2jP51'); }
    DiscordPress = () => { Linking.openURL('https://discord.gg/QDfsXCCq')}
    GamelifePress = () => { Linking.openURL('https://oxyfoo.com'); }

    openInfo = () => {
        const version = require('../../../package.json').versionName;
        const title = langManager.curr['about']['alert-info-title'];
        const text = langManager.curr['about']['alert-info-text'].replace('{}', version);
        user.openPopup('ok', [ title, text ]);
    }
}

export default BackAbout;