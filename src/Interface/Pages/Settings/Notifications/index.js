import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackSettings from './back';
import langManager from 'Managers/LangManager';

import { Text, Switch } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class SettingsNotifications extends BackSettings {
    render = () => {
        const { switchEveningNotifs, switchMorningNotifs } = this.state;

        const lang = langManager.curr['settings'];
        const langNotifs = langManager.curr['notifications'];

        return (
            <View style={styles.page}>
                <PageHeader title={lang['input-notifications']} onBackPress={this.onBack} />

                <Text style={styles.title}>{langNotifs['title']}</Text>

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
