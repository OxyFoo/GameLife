import * as React from 'react';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';

import { DisableMorningNotifications, EnableMorningNotifications } from '../../Functions/Notifications';

class BackSettings extends React.Component {
    constructor(props) {
        super(props);
        this.initLang = langManager.currentLangageKey;

        const langs = Object.keys(langManager.langages);
        const dataLangs = langs.map(lang => new Object({ key: lang, value: langManager.langages[lang]['name'] }));
        const current = dataLangs.find(lang => lang.key === langManager.currentLangageKey);

        this.state = {
            selectedLang: current,
            dataLangs: dataLangs,
            switchStartAudio: user.settings.startAudio,
            switchMorningNotifs: user.settings.morningNotifications
        }
    }

    openAbout = () => user.interface.ChangePage('about', undefined, true);
    openReport = () => user.interface.ChangePage('report', undefined, true);

    onChangeLang = (lang) => {
        this.setState({ selectedLang: lang });
        langManager.SetLangage(lang.key);
        user.settings.Save();
    }
    onChangeTheme = (themeIndex) => {
        const newTheme = [ 'Dark', 'Light' ][themeIndex];
        if (themeManager.SetTheme(newTheme)) {
            user.interface.SetTheme(themeIndex);
            user.interface.forceUpdate();
            user.settings.Save();
        }
    }
    onChangeStartAudio = (enabled) => {
        this.setState({ switchStartAudio: enabled });
        user.settings.startAudio = enabled;
        user.settings.Save();
    }
    onChangeMorningNotifications = (enabled) => {
        if (enabled) EnableMorningNotifications();
        else DisableMorningNotifications();
        this.setState({ switchMorningNotifs: enabled });
        user.settings.morningNotifications = enabled;
        user.settings.Save();
    }

    disconnect = () => {
        const event = async (button) => {
            if (button === 'yes' && !await user.Disconnect()) {
                const title = langManager.curr['settings']['alert-disconnecterror-title'];
                const text = langManager.curr['settings']['alert-disconnecterror-text'];
                user.interface.popup.DelayOpen('ok', [ title, text ], undefined, false);
            }
        };
        const title = langManager.curr['settings']['alert-disconnect-title'];
        const text = langManager.curr['settings']['alert-disconnect-text'];
        user.interface.popup.Open('yesno', [ title, text ], event);
    }
}

export default BackSettings;