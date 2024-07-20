import user from 'Managers/UserManager';

import PageBase from 'Interface/FlowEngine/PageBase';
import Notifications from 'Utils/Notifications';

/**
 * @typedef {import('Types/TCP').ConnectionState} ConnectionState
 * @typedef {import('Managers/ThemeManager').ThemeName} ThemeName
 * @typedef {import('Interface/Components/ComboBox').ComboBoxItem} ComboBoxItem
 */

class BackSettingsNotifications extends PageBase {
    state = {
        switchMorningNotifs: user.settings.morningNotifications,
        switchEveningNotifs: user.settings.eveningNotifications
    };

    onBack = () => user.interface.BackHandle();

    /** @param {boolean} enabled */
    onChangeMorningNotifications = (enabled) => {
        if (enabled) Notifications.Morning.Enable();
        else Notifications.Morning.Disable();
        this.setState({ switchMorningNotifs: enabled });
        user.settings.morningNotifications = enabled;
        user.settings.Save();
    };

    /** @param {boolean} enabled */
    onChangeEveningNotifications = (enabled) => {
        if (enabled) Notifications.Evening.Enable();
        else Notifications.Evening.Disable();
        this.setState({ switchEveningNotifs: enabled });
        user.settings.eveningNotifications = enabled;
        user.settings.Save();
    };
}

export default BackSettingsNotifications;
