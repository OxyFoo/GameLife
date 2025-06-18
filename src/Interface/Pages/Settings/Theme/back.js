import user from 'Managers/UserManager'

import PageBase from 'Interface/FlowEngine/PageBase'
import themeManager from 'Managers/ThemeManager'

/**
 * @typedef {import('Interface/Components/ComboBox').ComboBoxItem} ComboBoxItem
 */

export default class BackSettingsTheme extends PageBase {
    state = {
        themeVariant: user.settings.themeVariant
    };

    /** @param {string | null} themeItem */
    onSelectVariantTheme = async (themeItem) => {
        if (themeItem === null || typeof themeItem !== 'string') {
            return;
        }

        // @ts-ignore
        themeManager.setVariant(themeItem);
        // @ts-ignore
        user.settings.themeVariant = themeItem;
        await user.settings.IndependentSave();

        this.setState({ themeVariant: themeItem }, () => {
            user.interface.Reload();
        });
    };

    onBack = () => {
        user.interface.BackHandle()
    };
}