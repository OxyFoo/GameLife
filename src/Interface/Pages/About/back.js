import PageBase from 'Interface/FlowEngine/PageBase';
import { Linking } from 'react-native';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import { env } from 'Utils/Env';

const { versionName } = require('../../../../package.json');

class BackAbout extends PageBase {
    /** @param {any} props */
    constructor(props) {
        super(props);

        const allContributors = dataManager.contributors.contributors;

        this.contributors = allContributors
            .reverse()
            .map((contrib) => contrib.Name)
            .filter((name) => !!name)
            .join(', ');
        this.versionText = langManager.curr['about']['text-version'].replace('{}', versionName);
    }

    TiktokPress = () => this.OpenLink('https://www.tiktok.com/@pierre_mrsaaaaa');
    InstaPress = () => this.OpenLink('https://www.instagram.com/pierre_mrsaaaa/');
    DiscordPress = () => this.OpenLink(env.LINK_DISCORD);
    GamelifePress = () => {
        // TODO: Manage langages for the website
        // const websiteAvailableLang = ['fr', 'en'];
        // let langKey = 'fr';
        // if (!websiteAvailableLang.includes(langManager.currentLangageKey)) {
        //     langKey = langManager.currentLangageKey;
        // }

        this.OpenLink(env.LINK_WEBSITE);
    };

    /** @param {string} link */
    OpenLink = (link) => {
        Linking.openURL(link)
            .catch((err) => {
                const lang = langManager.curr['app'];

                user.interface.console?.AddLog('error', `[BackAbout] Failed to open link: ${err}`);

                user.interface.popup?.OpenT({
                    type: 'ok',
                    data: {
                        title: lang['alert-link-error-title'],
                        message: lang['alert-link-error-message']
                    },
                    priority: true
                });
            })
            .then(() => {
                user.statistics.RecordLinkClick(link);
            });
    };

    onBackPress = () => user.interface.BackHandle();
}

export default BackAbout;
