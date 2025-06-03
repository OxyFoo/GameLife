import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import PageBase from 'Interface/FlowEngine/PageBase';
import { GetGlobalTime } from 'Utils/Time';

/**
 * @typedef {import('Class/Server/TCP').TCPState} TCPState
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

        /** @param {TCPState} state */
        serverTCPState: user.server2.tcp.state.Get(),

        waitingConsentPopup: false
    };

    /** @type {ComboBoxItem[]} */
    availableLangs = langManager.GetLangsKeys().map((lang) => ({
        key: lang,
        value: langManager.GetAllLangs()[lang]['name']
    }));

    /** @type {Symbol | null} */
    listenerTCP = null;

    /** @type {NodeJS.Timeout | null} Manage consent popup loading */
    intervalConsentChecking = null;

    componentDidMount() {
        // Listen to TCP state
        this.listenerTCP = user.server2.tcp.state.AddListener(this.onTCPStateChange);

        // Check if consent popup is loading
        if (user.consent.loading) {
            this.setState({ waitingConsentPopup: true });
            this.intervalConsentChecking = setInterval(() => {
                if (!user.consent.loading) {
                    this.setState({ waitingConsentPopup: false });
                    if (this.intervalConsentChecking !== null) {
                        clearInterval(this.intervalConsentChecking);
                    }
                }
            }, 100);
        }
    }

    componentWillUnmount() {
        user.server2.tcp.state.RemoveListener(this.listenerTCP);
        if (this.intervalConsentChecking !== null) {
            clearInterval(this.intervalConsentChecking);
        }
    }

    /** @param {TCPState} state */
    onTCPStateChange = (state) => {
        this.setState({ serverTCPState: state });
    };

    onBack = () => user.interface.BackHandle();
    openAbout = () => user.interface.ChangePage('about', { storeInHistory: false });
    openReport = () => user.interface.ChangePage('report', { storeInHistory: false });
    openBeta = () => user.interface.ChangePage('settings_beta', { storeInHistory: false });
    openNotifications = () => user.interface.ChangePage('settings_notifications', { storeInHistory: false });

    /** @param {ComboBoxItem | null} lang */
    onChangeLang = async (lang) => {
        if (lang === null || typeof lang.key !== 'string') return;
        this.setState({ cbSelectedLang: lang });

        const key = langManager.IsLangAvailable(lang.key);
        if (key === null) return;

        await user.settings.SetLang(key);
    };

    /** @param {number} themeIndex */
    onChangeTheme = (themeIndex) => {
        /** @type {ThemeName[]} */
        const themes = ['Main', 'Light'];
        const newTheme = themes[themeIndex];
        if (themeManager.SetTheme(newTheme)) {
            user.settings.IndependentSave();
        }
    };

    openConsentPopup = async () => {
        const lang = langManager.curr['settings'];

        this.setState({ waitingConsentPopup: true });
        const consentStatus = await user.consent.ShowTrackingPopup(true);
        this.setState({ waitingConsentPopup: false });

        if (consentStatus === 'error') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-consent-error-title'],
                    message: lang['alert-consent-error-message']
                }
            });
        } else if (consentStatus === 'not-available') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-consent-not-available-title'],
                    message: lang['alert-consent-not-available-message']
                }
            });
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
                if (button === 'yes' && !(await user.Disconnect())) {
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

        // Not connected to the server
        if (!user.server2.IsAuthenticated()) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-disconnecterror-title'],
                    message: lang['alert-disconnecterror-message']
                }
            });
            return;
        }

        this.setState({ devicesLoading: true });
        const devicesStatus = await user.server2.tcp.SendAndWait({ action: 'get-devices' });
        this.setState({ devicesLoading: false });

        // Error while getting devices
        if (
            devicesStatus === 'interrupted' ||
            devicesStatus === 'not-sent' ||
            devicesStatus === 'timeout' ||
            devicesStatus.status !== 'get-devices'
        ) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-disconnecterror-title'],
                    message: lang['alert-disconnecterror-message']
                }
            });
            return;
        }

        // Format devices list
        const { devices } = devicesStatus;
        const textDevices =
            typeof devices === 'undefined' || devices.length === 0
                ? 'Error'
                : devices.map((device) => `- ${device.deviceName} -\n`).join('');

        user.interface.popup?.OpenT({
            type: 'yesno',
            data: {
                title: lang['alert-disconnectall-title'],
                message: lang['alert-disconnectall-message'].replace('{}', textDevices)
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

        this.setState({ devicesLoading: false });
    };

    reconnectTCP = () => {
        user.server2.Initialize();
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
        const lang = langManager.curr['settings'];
        if (button !== 'yes') {
            return;
        }

        // Send mail
        this.setState({ sendingMail: true });
        const response = await user.server2.tcp.SendAndWait({ action: 'delete-account' });

        // Mail sent failed
        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'delete-account' ||
            response.result !== 'ok'
        ) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-deletedfailed-title'],
                    message: lang['alert-deletedfailed-message']
                },
                callback: () => {
                    this.setState({ sendingMail: false });
                }
            });
            return;
        }

        // Mail sent
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-deletedmailsent-title'],
                message: lang['alert-deletedmailsent-message']
            },
            callback: () => {
                this.setState({ sendingMail: false }, () => {
                    user.Disconnect();
                });
            }
        });
        user.tempMailSent = GetGlobalTime();
    };
}

export default BackSettings;
