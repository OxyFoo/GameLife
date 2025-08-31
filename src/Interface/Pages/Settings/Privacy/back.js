import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import PageBase from 'Interface/FlowEngine/PageBase';

/**
 * @typedef {object} BackSettingsPrivacyState
 * @property {boolean} switchStatisticsEnabled - Indicates if statistics tracking is enabled
 * @property {boolean} waitingConsentPopup - Indicates if a consent popup is currently being displayed
 */

class BackSettingsPrivacy extends PageBase {
    /** @type {BackSettingsPrivacyState} */
    state = {
        switchStatisticsEnabled: user.settings.statisticsEnabled,
        waitingConsentPopup: false
    };

    onBack = () => user.interface.BackHandle();

    /**
     * @param {Partial<BackSettingsPrivacyState>} state
     * @return {Promise<void>} Resolves when the state is set
     */
    setStateSync = (state) => {
        return new Promise((resolve) => {
            this.setState(state, resolve);
        });
    };

    /** @param {boolean} enabled */
    onChangeStatisticsEnabled = (enabled) => {
        if (!enabled) {
            // Show confirmation dialog when disabling
            const lang = langManager.curr['settings'];
            user.interface.popup?.OpenT({
                type: 'yesno',
                data: {
                    title: lang['alert-disable-statistics-title'],
                    message: lang['alert-disable-statistics-message']
                },
                callback: (button) => {
                    if (button === 'yes') {
                        this.setState({ switchStatisticsEnabled: false });
                        user.settings.statisticsEnabled = false;
                        user.settings.IndependentSave();
                    }
                }
            });
        } else {
            // Enable without confirmation
            this.setState({ switchStatisticsEnabled: true });
            user.settings.statisticsEnabled = true;
            user.settings.IndependentSave();
        }
    };

    openConsentPopup = async () => {
        const lang = langManager.curr['settings'];

        this.setStateSync({ waitingConsentPopup: true });
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
}

export default BackSettingsPrivacy;
