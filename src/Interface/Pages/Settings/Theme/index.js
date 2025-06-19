import { View } from 'react-native';

import styles from './style';
import BackSettingsTheme from './back';

import { PageHeader } from 'Interface/Widgets';
import SelectTheme from 'Interface/Components/SelectTheme';

import langManager from 'Managers/LangManager';

export default class SettingsTheme extends BackSettingsTheme {
    render() {
        const lang = langManager.curr['settings'];

        return (
            <View style={styles.page}>
                <PageHeader title={lang['input-theme']} onBackPress={this.onBack} isBeta={true} />

                <SelectTheme onSelect={this.onSelectVariantTheme} />
            </View>
        );
    }
}
