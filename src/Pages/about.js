import * as React from 'react';
import { Linking } from 'react-native';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';

class About extends React.Component {
    TiktokPress  = () => { Linking.openURL('https://vm.tiktok.com/ZMdcNpCvu/'); }
    InstaPress   = () => { Linking.openURL('https://www.instagram.com/p/CTUlsU2jP51'); }
    DiscordPress = () => { Linking.openURL('https://discord.gg/QDfsXCCq')}
    GamelifePress = () => {
        const title = langManager.curr['about']['alert-unavailable-title'];
        const text = langManager.curr['about']['alert-unavailable-text'];
        user.openPopup('ok', [ title, text ]);
        //Linking.openURL('https://oxyfoo.com');
    }

    openInfo = () => {
        const version = require('../../package.json').versionName;
        const title = langManager.curr['about']['alert-info-title'];
        const text = langManager.curr['about']['alert-info-text'].replace('{}', version);
        user.openPopup('ok', [ title, text ]);
    }
}

export default About;