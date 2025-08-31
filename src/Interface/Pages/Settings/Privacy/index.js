import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackSettingsPrivacy from './back';
import langManager from 'Managers/LangManager';

import { Text, Switch, Button } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class SettingsPrivacy extends BackSettingsPrivacy {
    render = () => {
        const { switchStatisticsEnabled, waitingConsentPopup } = this.state;

        const lang = langManager.curr['settings'];

        return (
            <View style={styles.page}>
                <PageHeader title={lang['section-privacy']} onBackPress={this.onBack} />

                <Text style={styles.title}>{lang['section-privacy-analytics']}</Text>

                {/* Statistics: Sending enabled */}
                <View style={styles.inline}>
                    <Text style={styles.inlineText}>{lang['input-statistics-enabled']}</Text>
                    <Switch value={switchStatisticsEnabled} onChangeValue={this.onChangeStatisticsEnabled} />
                </View>

                <Text style={styles.description} color='secondary'>
                    {lang['input-statistics-description']}
                </Text>

                <Text style={styles.title}>{lang['section-advertising-consent']}</Text>

                {/* Consent popup */}
                <Button
                    style={styles.button}
                    appearance='outline'
                    icon='arrow-left'
                    iconAngle={180}
                    onPress={this.openConsentPopup}
                    loading={waitingConsentPopup}
                >
                    {lang['input-ad-consent']}
                </Button>

                <Text style={styles.description} color='secondary'>
                    {lang['input-ad-consent-description']}
                </Text>
            </View>
        );
    };
}

export default SettingsPrivacy;
