import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { PageBase } from 'Interface/Global';
import { GetGlobalTime } from 'Utils/Time';
import Notifications from 'Utils/Notifications';

/**
 * @typedef {import('Types/TCP').ConnectionState} ConnectionState
 * @typedef {import('Managers/ThemeManager').ThemeName} ThemeName
 * @typedef {import('Interface/OldComponents/ComboBox').ComboBoxItem} ComboBoxItem
 */

class BackSettings extends PageBase {
    /** @type {ComboBoxItem[]} */
    availableLangs = langManager.GetLangsKeys().map(lang => ({
        key: lang,
        value: langManager.GetAllLangs()[lang]['name']
    }));

    state = {
        /** @type {ComboBoxItem} */
        cbSelectedLang: {
            key: langManager.currentLangageKey,
            value: langManager.curr['name']
        },

        switchMorningNotifs: user.settings.morningNotifications,
        switchEveningNotifs: user.settings.eveningNotifications,
        waitingConsentPopup: false,
        sendingMail: false,
        devicesLoading: false,

        /** @param {ConnectionState} state */
        serverTCPState: user.tcp.state.Get()
    }

    intervalConsentChecking = null;

    componentDidMount() {
        if (user.consent.loading) {
            this.setState({ waitingConsentPopup: true });
            this.intervalConsentChecking = setInterval(() => {
                if (!user.consent.loading) {
                    this.setState({ waitingConsentPopup: false });
                    clearInterval(this.intervalConsentChecking);
                }
            }, 100);
        }
        this.listenerTCP = user.tcp.state.AddListener(this.onTCPStateChange);
    }

    componentWillUnmount() {
        if (this.intervalConsentChecking !== null) {
            clearInterval(this.intervalConsentChecking);
        }
        user.tcp.state.RemoveListener(this.listenerTCP);
    }

    /** @param {ConnectionState} state */
    onTCPStateChange = (state) => {
        this.setState({ serverTCPState: state });
    }

    onBack = () => user.interface.BackHandle();
    openAbout = () => user.interface.ChangePage('about', undefined, true);
    openReport = () => user.interface.ChangePage('report', undefined, true);

    openConsentPopup = async () => {
        this.setState({ waitingConsentPopup: true });
        await user.consent.ShowTrackingPopup(true);
        this.setState({ waitingConsentPopup: false });
    }

    /** @param {ComboBoxItem} lang */
    onChangeLang = (lang) => {
        this.setState({ cbSelectedLang: lang });
        langManager.SetLangage(/** @type {'fr' | 'en'} */ (lang.key));
        user.settings.Save();
    }

    /** @param {number} themeIndex */
    onChangeTheme = (themeIndex) => {
        /** @type {ThemeName[]} */
        const themes = [ 'Main', 'Light' ];
        const newTheme = themes[themeIndex];
        if (themeManager.SetTheme(newTheme)) {
            user.interface.SetTheme(themeIndex);
            user.interface.forceUpdate();
            user.settings.Save();
        }
    }

    /** @param {boolean} enabled */
    onChangeMorningNotifications = (enabled) => {
        if (enabled) Notifications.Morning.Enable();
        else Notifications.Morning.Disable();
        this.setState({ switchMorningNotifs: enabled });
        user.settings.morningNotifications = enabled;
        user.settings.Save();
    }

    /** @param {boolean} enabled */
    onChangeEveningNotifications = (enabled) => {
        if (enabled) Notifications.Evening.Enable();
        else Notifications.Evening.Disable();
        this.setState({ switchEveningNotifs: enabled });
        user.settings.eveningNotifications = enabled;
        user.settings.Save();
    }

    restartTuto = () => {
        user.interface.ChangePage('home', { tuto: 1 }, true);
    }

    disconnect = () => {
        const event = async (button) => {
            if (button === 'yes' && !await user.Disconnect(true)) {
                const title = langManager.curr['settings']['alert-disconnecterror-title'];
                const text = langManager.curr['settings']['alert-disconnecterror-text'];
                user.interface.popup.Open('ok', [ title, text ], undefined, false);
            }
        };
        const title = langManager.curr['settings']['alert-disconnect-title'];
        const text = langManager.curr['settings']['alert-disconnect-text'];
        user.interface.popup.Open('yesno', [ title, text ], event);
    }

    disconnectAll = async () => {
        const event = async (button) => {
            if (button === 'yes' && !await user.Disconnect(true, true)) {
                const title = langManager.curr['settings']['alert-disconnecterrortitle'];
                const text = langManager.curr['settings']['alert-disconnecterror-text'];
                user.interface.popup.Open('ok', [ title, text ], undefined, false);
            }
        };

        this.setState({ devicesLoading: true });
        const title = langManager.curr['settings']['alert-disconnectall-title'];
        const text = langManager.curr['settings']['alert-disconnectall-text'];
        const devices = await user.GetDevices();
        const textDevices = devices === null ? 'Error' : '- ' + devices.join(' - \n- ') + ' -\n';
        user.interface.popup.Open('yesno', [ title, text.replace('{}', textDevices) ], event);
        this.setState({ devicesLoading: false });
    }

    reconnectTCP = () => {
        user.tcp.Connect();
        this.setState({ serverTCPState: 'idle' });
    }

    deleteAccount = () => {
        /** @param {'yes' | 'no'} button */
        const event = async (button) => {
            if (button !== 'yes')
                return;

            this.setState({ sendingMail: true });

            const data = {
                email: user.settings.email,
                lang: langManager.currentLangageKey
            }

            // Send mail
            const result = await user.server.Request('deleteAccount', data);
            if (result === null) return;

            if (result['status'] === 'ok') {
                // Mail sent
                const title = langManager.curr['settings']['alert-deletedmailsent-title'];
                const text = langManager.curr['settings']['alert-deletedmailsent-text'];
                user.interface.popup.ForceOpen('ok', [ title, text ], () => {
                    this.setState({ sendingMail: false }, () => {
                        user.Disconnect(true);
                    });
                }, false);
                user.tempMailSent = now;
            } else {
                // Mail sent failed
                const title = langManager.curr['settings']['alert-deletedfailed-title'];
                const text = langManager.curr['settings']['alert-deletedfailed-text'];
                user.interface.popup.ForceOpen('ok', [ title, text ], () => {
                    this.setState({ sendingMail: false })
                }, false);
            }
        };

        const now = GetGlobalTime();
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
