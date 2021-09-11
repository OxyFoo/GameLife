import * as React from 'react';
import { BackHandler } from 'react-native';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.initLang = langManager.currentLangageKey;
    }
    back = () => {
        if (this.initLang !== langManager.currentLangageKey) {
            user.loadInternalData();
        }
        user.saveData();
        user.backPage();
    }
    reset = () => {
        const event = (button) => {
            if (button === 'yes') {
                user.activities = [];
                user.saveData();
            }
        }
        const title = langManager.curr['settings']['alert-reset-title'];
        const text = langManager.curr['settings']['alert-reset-text'];
        user.openPopup('yesno', [ title, text ], event);
    }
    deconnect = () => {
        const event = (button) => {
            if (button === 'yes') {
                user.disconnect();
            }
        }
        const title = langManager.curr['settings']['alert-disconnect-title'];
        const text = langManager.curr['settings']['alert-disconnect-text'];
        user.openPopup('yesno', [ title, text ], event);
    }
    clear = () => {
        const event = (button) => {
            if (button === 'yes') {
                user.clear();
                setTimeout(BackHandler.exitApp, 200);
            }
        }
        const title = langManager.curr['settings']['alert-clear-title'];
        const text = langManager.curr['settings']['alert-clear-text'];
        user.openPopup('yesno', [ title, text ], event);
    }
    changeLang = (lang) => {
        langManager.setLangage(lang);
        user.changePage();
        user.saveData(false);
    }
}

export default Settings;