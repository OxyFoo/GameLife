import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackSettings from './back';
import langManager from 'Managers/LangManager';

import { Text, Button, Switch } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class SettingsNotifications extends BackSettings {
    render = () => {
        const lang = langManager.curr['settings'];
        const { switchShareData, waitingConsentPopup } = this.state;

        return (
            <View style={styles.page}>
                <PageHeader title={lang['input-consent']} onBackPress={this.onBack} />

                <Text style={styles.title}>[Ads]</Text>

                {
                    // TODO: Force show consent popup on iOS
                }
                <View style={styles.inline}>
                    <Button
                        //style={styles.margin}
                        onPress={this.openConsentPopup}
                        appearance='outline'
                        loading={waitingConsentPopup}
                    >
                        {lang['input-ad-consent']}
                    </Button>
                </View>

                {/* Consents */}
                <Text style={styles.title}>[Consents]</Text>

                <View style={styles.inline}>
                    <Text style={styles.inlineText}>[Autoriser le partage de données]</Text>
                    <Switch value={switchShareData} onChangeValue={this.changeShareData} />
                </View>
            </View>
        );
    };
}

export default SettingsNotifications;
