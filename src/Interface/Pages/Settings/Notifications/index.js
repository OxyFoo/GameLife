import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackSettings from './back';
import langManager from 'Managers/LangManager';

import { Text, Switch } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class SettingsNotifications extends BackSettings {
    render = () => {
        const { switchEveningNotifs, switchMorningNotifs, switchOptionalUpdatesNotifs } = this.state;

        const lang = langManager.curr['settings'];
        const langNotifs = langManager.curr['notifications'];

        return (
            <View style={styles.page}>
                <PageHeader title={lang['input-notifications']} onBackPress={this.onBack} />

                {/* Section: Push Notifications */}
                <Text style={styles.title}>{langNotifs['regular']['name']}</Text>

                {/* Notifications: Morning */}
                <View style={styles.inline}>
                    <Text style={styles.inlineText}>{lang['input-notif-morning']}</Text>
                    <Switch value={switchMorningNotifs} onChangeValue={this.onChangeMorningNotifications} />
                </View>

                {/* Notifications: Evening */}
                <View style={styles.inline}>
                    <Text style={styles.inlineText}>{lang['input-notif-evening']}</Text>
                    <Switch value={switchEveningNotifs} onChangeValue={this.onChangeEveningNotifications} />
                </View>

                {/* Section: In-App Notifications */}
                <Text style={styles.title}>{langNotifs['in-app']['name']}</Text>

                {/* Notifications: Optional Updates */}
                <View style={styles.inline}>
                    <Text style={styles.inlineText}>{lang['input-notif-optional-updates']}</Text>
                    <Switch
                        value={switchOptionalUpdatesNotifs}
                        onChangeValue={this.onChangeOptionalUpdatesNotifications}
                    />
                </View>

                {/* <Text style={styles.title}>{langNotifs['notif-user']}</Text> */}

                {/* Notifications: Evening */}
                {/* <View style={styles.inline}>
                    <Text style={styles.inlineText}>Activités</Text>
                    <Switch value={switchEveningNotifs} onChangeValue={this.onChangeEveningNotifications} />
                </View> */}
            </View>
        );
    };
}

export default SettingsNotifications;
