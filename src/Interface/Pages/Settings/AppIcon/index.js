import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackSettingsBeta from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, ComboBox, Button } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class SettingsBeta extends BackSettingsBeta {
    render() {
        const { themeVariant } = this.state;

        const lang = langManager.curr['settings'];

        const variants = themeManager.variants;
        const selectedVariantText = variants.find((item) => item.key === themeVariant)?.value;

        return (
            <View style={styles.page}>
                <PageHeader title={lang['input-app-icon']} onBackPress={this.onBack} />

                <Text style={styles.title}>[Thème des couleurs principales]</Text>

                <ComboBox
                    title='[Variation du thème]'
                    data={variants}
                    selectedValue={selectedVariantText}
                    onSelect={this.onSelectVariantTheme}
                />

                <Button style={styles.button} onPress={this.restartApp}>
                    [Redémarrer l'application pour appliquer entièrement le thème]
                </Button>
            </View>
        );
    };
}

export default SettingsBeta;
