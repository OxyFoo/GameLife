import PageBase from 'Interface/FlowEngine/PageBase';
import { Linking } from 'react-native';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

const { versionName } = require('../../../../package.json');

class BackAbout extends PageBase {
    /** @param {any} props */
    constructor(props) {
        super(props);

        const allContributors = dataManager.contributors.contributors;

        this.contributors = allContributors
            .reverse()
            .map((contrib) => contrib.Name)
            .join(', ');
        this.versionText = langManager.curr['about']['text-version'].replace('{}', versionName);
    }

    TiktokPress = () => Linking.openURL('https://www.tiktok.com/@pierre_mrsaaaaa');
    InstaPress = () => Linking.openURL('https://www.instagram.com/pierre_mrsaaaa/');
    DiscordPress = () => Linking.openURL('https://discord.com/invite/FfJRxjNAwS');
    GamelifePress = () => {
        const websiteAvailableLang = ['fr', 'en'];
        let langKey = 'fr';
        if (!websiteAvailableLang.includes(langManager.currentLangageKey)) {
            langKey = langManager.currentLangageKey;
        }
        Linking.openURL(`https://${langKey}.oxyfoo.com`);
    };

    onBackPress = () => user.interface.BackHandle();
}

export default BackAbout;
