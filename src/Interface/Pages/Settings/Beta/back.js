import user from 'Managers/UserManager';

import PageBase from 'Interface/FlowEngine/PageBase';
import themeManager from 'Managers/ThemeManager';
import AppControl from 'react-native-app-control';

/**
 * @typedef {import('Interface/Components/ComboBox').ComboBoxItem} ComboBoxItem
 */

class BackSettingsBeta extends PageBase {
    state = {
        themeVariant: user.settings.themeVariant
    };

    /** @param {ComboBoxItem | null} themeItem */
    onSelectVariantTheme = async (themeItem) => {
        if (themeItem === null || typeof themeItem.key !== 'number') {
            return;
        }

        themeManager.SetVariant(themeItem.key);
        user.settings.themeVariant = themeItem.key;
        await user.settings.IndependentSave();

        this.setState({ themeVariant: themeItem.key }, () => {
            user.interface.Reload();
        });
    };

    restartApp = () => {
        AppControl.Restart();
    };

    onBack = () => user.interface.BackHandle();
}

export default BackSettingsBeta;
