import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import PageBase from 'Interface/FlowEngine/PageBase';
import { GetGlobalTime } from 'Utils/Time';

/**
 * @typedef {import('Types/TCP/GameLife/Request').ConnectionState} ConnectionState
 * @typedef {import('Managers/LangManager').LangKey} LangKey
 * @typedef {import('Managers/ThemeManager').ThemeName} ThemeName
 * @typedef {import('Interface/Components/ComboBox').ComboBoxItem} ComboBoxItem
 */

class BackSettings extends PageBase {
    state = {
        /** @type {ComboBoxItem} */
        cbSelectedLang: {
            key: langManager.currentLangageKey,
            value: langManager.curr['name']
        },

        sendingMail: false,
        devicesLoading: false,

        /** @param {ConnectionState} state */
        serverTCPState: user.tcp.state.Get()
    };

    /** @type {ComboBoxItem[]} */
    availableLangs = langManager.GetLangsKeys().map((lang) => ({
        key: lang,
        value: langManager.GetAllLangs()[lang]['name']
    }));

    /** @type {Symbol | null} */
    listenerTCP = null;

    componentDidMount() {
        this.listenerTCP = user.tcp.state.AddListener(this.onTCPStateChange);
    }

    componentWillUnmount() {
        user.tcp.state.RemoveListener(this.listenerTCP);
    }

    /** @param {ConnectionState} state */
    onTCPStateChange = (state) => {
        this.setState({ serverTCPState: state });
    };

    onBack = () => user.interface.BackHandle();
    openAbout = () => user.interface.ChangePage('about', { storeInHistory: false });
    openReport = () => user.interface.ChangePage('report', { storeInHistory: false });
    openNotifications = () => user.interface.ChangePage('settings_notifications', { storeInHistory: false });
    openConsents = () => user.interface.ChangePage('settings_consents', { storeInHistory: false });

    /** @param {ComboBoxItem | null} lang */
    onChangeLang = (lang) => {
        if (lang === null || typeof lang.key !== 'string') return;
        this.setState({ cbSelectedLang: lang });

        const key = langManager.IsLangAvailable(lang.key);
        langManager.SetLangage(key);
        user.settings.Save();
    };

    /** @param {number} themeIndex */
    onChangeTheme = (themeIndex) => {
        /** @type {ThemeName[]} */
        const themes = ['Main', 'Light'];
        const newTheme = themes[themeIndex];
        if (themeManager.SetTheme(newTheme)) {
            user.settings.Save();
        }
    };

    restartTuto = () => {
        user.interface.ChangePage('home', { args: { tuto: 1 }, storeInHistory: false });
    };

    disconnect = () => {
        const lang = langManager.curr['settings'];

        user.interface.popup?.OpenT({
            type: 'yesno',
            data: {
                title: lang['alert-disconnect-title'],
                message: lang['alert-disconnect-message']
            },
            callback: async (button) => {
                if (button === 'yes' && !(await user.Disconnect(true))) {
                    user.interface.popup?.OpenT({
                        type: 'ok',
                        data: {
                            title: lang['alert-disconnecterror-title'],
                            message: lang['alert-disconnecterror-message']
                        }
                    });
                }
            }
        });
    };

    disconnectAll = async () => {
        const lang = langManager.curr['settings'];

        this.setState({ devicesLoading: true });

        const devices = await user.GetDevices();
        const textDevices = devices === null ? 'Error' : '- ' + devices.join(' - \n- ') + ' -\n';
        user.interface.popup?.OpenT({
            type: 'yesno',
            data: {
                title: lang['alert-disconnectall-title'],
                message: lang['alert-disconnectall-message'].replace('{}', textDevices)
            },
            callback: async (button) => {
                if (button === 'yes' && !(await user.Disconnect(true, true))) {
                    user.interface.popup?.OpenT({
                        type: 'ok',
                        data: {
                            title: lang['alert-disconnecterror-title'],
                            message: lang['alert-disconnecterror-message']
                        }
                    });
                }
            }
        });

        this.setState({ devicesLoading: false });
    };

    reconnectTCP = () => {
        user.tcp.Connect();
        this.setState({ serverTCPState: 'idle' });
    };

    deleteAccount = () => {
        const now = GetGlobalTime();
        if (user.tempMailSent === null || now - user.tempMailSent > 1 * 60) {
            // Confirmation popup
            const title = langManager.curr['settings']['alert-deleteaccount-title'];
            const message = langManager.curr['settings']['alert-deleteaccount-message'];
            user.interface.popup?.OpenT({
                type: 'yesno',
                data: { title, message },
                callback: this.DeleteAccount
            });
        } else {
            // Too early
            const title = langManager.curr['settings']['alert-deletedmailtooearly-title'];
            const message = langManager.curr['settings']['alert-deletedmailtooearly-message'];
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title, message }
            });
        }
    };

    /**
     * @param {'yes' | 'no' | 'closed'} button
     * @private
     */
    DeleteAccount = async (button) => {
        if (button !== 'yes') {
            return;
        }

        this.setState({ sendingMail: true });

        const data = {
            email: user.settings.email,
            lang: langManager.currentLangageKey
        };

        // Send mail
        const result = await user.server.Request('deleteAccount', data);
        if (result === null) return;

        if (result['status'] === 'ok') {
            // Mail sent
            const title = langManager.curr['settings']['alert-deletedmailsent-title'];
            const message = langManager.curr['settings']['alert-deletedmailsent-message'];
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title, message },
                callback: () => {
                    this.setState({ sendingMail: false }, () => {
                        user.Disconnect(true);
                    });
                }
            });
            user.tempMailSent = GetGlobalTime();
        } else {
            // Mail sent failed
            const title = langManager.curr['settings']['alert-deletedfailed-title'];
            const message = langManager.curr['settings']['alert-deletedfailed-message'];
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title, message },
                callback: () => {
                    this.setState({ sendingMail: false });
                }
            });
        }
    };
}

export default BackSettings;
