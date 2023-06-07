import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { PageBack } from 'Interface/Components';
import { GetTime } from 'Utils/Time';
import Notifications from 'Utils/Notifications';

/**
 * @typedef {import('Managers/ThemeManager').Theme} Theme
 * @typedef {import('Interface/Components/ComboBox').ComboBoxItem} ComboBoxItem
 */

class BackSettings extends PageBack {
    /** @type {ComboBoxItem[]} */
    availableLangs = Object.keys(langManager.langages).map(lang => ({
        key: lang,
        value: langManager.langages[lang]['name']
    }));

    state = {
        /** @type {ComboBoxItem} */
        cbSelectedLang: {
            key: langManager.currentLangageKey,
            value: langManager.langages[langManager.currentLangageKey]['name']
        },

        switchMorningNotifs: user.settings.morningNotifications,
        switchEveningNotifs: user.settings.eveningNotifications,
        sendingMail: false
    }

    openAbout = () => user.interface.ChangePage('about', undefined, true);
    openReport = () => user.interface.ChangePage('report', undefined, true);

    /** @param {ComboBoxItem} lang */
    onChangeLang = (lang) => {
        this.setState({ cbSelectedLang: lang });
        langManager.SetLangage(lang.key);
        user.settings.Save();
    }

    /**
     * @param {number} themeIndex
     */
    onChangeTheme = (themeIndex) => {
        /** @type {Theme[]} */
        const themes = [ 'Dark', 'Light' ];
        const newTheme = themes[themeIndex];
        if (themeManager.SetTheme(newTheme)) {
            user.interface.SetTheme(themeIndex);
            user.interface.forceUpdate();
            user.settings.Save();
        }
    }
    onChangeMorningNotifications = (enabled) => {
        if (enabled) Notifications.Morning.Enable();
        else Notifications.Morning.Disable();
        this.setState({ switchMorningNotifs: enabled });
        user.settings.morningNotifications = enabled;
        user.settings.Save();
    }
    onChangeEveningNotifications = (enabled) => {
        if (enabled) Notifications.Evening.Enable();
        else Notifications.Evening.Disable();
        this.setState({ switchEveningNotifs: enabled });
        user.settings.eveningNotifications = enabled;
        user.settings.Save();
    }

    disconnect = () => {
        const event = async (button) => {
            if (button === 'yes' && !await user.Disconnect()) {
                const title = langManager.curr['settings']['alert-disconnecterror-title'];
                const text = langManager.curr['settings']['alert-disconnecterror-text'];
                user.interface.popup.Open('ok', [ title, text ], undefined, false);
            }
        };
        const title = langManager.curr['settings']['alert-disconnect-title'];
        const text = langManager.curr['settings']['alert-disconnect-text'];
        user.interface.popup.Open('yesno', [ title, text ], event);
    }

    deleteAccount = () => {
        const event = async (button) => {
            if (button === 'yes') {
                const end = () => this.setState({ sendingMail: false });
                this.setState({ sendingMail: true });

                const data = {
                    email: user.settings.email,
                    lang: langManager.currentLangageKey
                }
                const result = await user.server.Request('deleteAccount', data);
                if (result === null) return;

                if (result['status'] === 'ok') {
                    // Mail sent
                    const title = langManager.curr['settings']['alert-deletedmailsent-title'];
                    const text = langManager.curr['settings']['alert-deletedmailsent-text'];
                    user.interface.popup.ForceOpen('ok', [ title, text ], end, false);
                    user.tempMailSent = now;
                } else {
                    // Mail sent failed
                    const title = langManager.curr['settings']['alert-deletedfailed-title'];
                    const text = langManager.curr['settings']['alert-deletedfailed-text'];
                    user.interface.popup.ForceOpen('ok', [ title, text ], end, false);
                }
            }
        };
        const now = GetTime();
        if (user.tempMailSent === null || now - user.tempMailSent > 1 * 60) {
            // Confirmation popup
            const title = langManager.curr['settings']['alert-deleteaccount-title'];
            const text = langManager.curr['settings']['alert-deleteaccount-text'];
            user.interface.popup.Open('yesno', [ title, text ], event);
        } else {
            // Too early
            const title = langManager.curr['settings']['alert-deletedmailtooearly-title'];
            const text = langManager.curr['settings']['alert-deletedmailtooearly-text'];
            user.interface.popup.Open('ok', [ title, text ]);
        }
    }
}

export default BackSettings;