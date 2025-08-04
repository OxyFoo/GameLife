import user from 'Managers/UserManager';

import PageBase from 'Interface/FlowEngine/PageBase';
import themeManager from 'Managers/ThemeManager';
import AppControl from 'react-native-app-control';

// TODO: TEMP
import { GetIntegrityToken } from 'Class/Server/Integrity';
import { RandomString } from 'Utils/Functions';

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

    // TODO: TEMP
    getIntegrityCode = async () => {
        const length = 32;

        const randomChallenge = RandomString(length);

        const integrityCode = await GetIntegrityToken(randomChallenge);

        if (integrityCode === 'unsupported' || integrityCode === 'error') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: 'Test - Intégrité',
                    message:
                        "La vérification d'intégrité n'est pas supportée sur cet appareil.\n\nOuverture de la console pour plus de détails."
                }
            });
            user.interface.console?.Enable();
            return;
        }

        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: 'Test - Intégrité',
                message: `Challenge: ${randomChallenge}
                
Type: ${integrityCode.type}
Token: ${integrityCode.token.slice(0, 8) + '...' + integrityCode.token.slice(-8)}`
            }
        });
    };

    restartApp = () => {
        AppControl.Restart();
    };

    onBack = () => user.interface.BackHandle();
}

export default BackSettingsBeta;
