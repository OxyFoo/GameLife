import * as React from 'react';
import { ScrollView } from 'react-native';

import styles from './style';
import BackSettings from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Button, /*SwitchText,*/ ComboBox } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class Settings extends BackSettings {
    render = () => {
        const { cbSelectedLang, sendingMail, devicesLoading, waitingConsentPopup } = this.state;

        //const langThemes = langManager.curr['themes'];
        const lang = langManager.curr['settings'];

        return (
            <ScrollView style={styles.page}>
                <PageHeader title={lang['title']} onBackPress={this.onBack} />

                <Text style={styles.title} color='border'>
                    {lang['section-informations-preferences']}
                </Text>

                {/* About page */}
                <Button style={styles.margin} icon='arrow-left' iconAngle={180} onPress={this.openAbout}>
                    {lang['input-about']}
                </Button>

                {/* Language */}
                <ComboBox
                    style={styles.margin}
                    title={lang['input-langage']}
                    data={this.availableLangs}
                    selectedValue={cbSelectedLang.value}
                    onSelect={this.onChangeLang}
                />

                {
                    // TODO: Finish themes
                }
                {/*
                <Text style={{ textAlign: 'left', marginBottom: 6 }}>{lang['input-theme']}</Text>
                <SwitchText
                    // TODO - Finish themes
                    style={styles.margin}
                    texts={[ langThemes['Main'], langThemes['Light'] ]}
                    onChange={this.onChangeTheme}
                    start={themeManager.selectedTheme === 'Main' ? 0 : 1}
                />
                */}

                <Text style={styles.title} color='border'>
                    {lang['section-notifications-consents']}
                </Text>

                {/* Notifications page */}
                <Button
                    style={styles.margin}
                    appearance='outline'
                    icon='arrow-left'
                    iconAngle={180}
                    onPress={this.openNotifications}
                >
                    {lang['input-notifications']}
                </Button>

                {/* Consent popup */}
                <Button
                    style={styles.margin}
                    appearance='outline'
                    iconAngle={180}
                    onPress={this.openConsentPopup}
                    loading={waitingConsentPopup}
                >
                    {lang['input-ad-consent']}
                </Button>

                <Text style={styles.title} color='border'>
                    {lang['section-support-feedback']}
                </Text>

                {/* Reports page */}
                <Button
                    style={styles.margin}
                    appearance='outline'
                    icon='arrow-left'
                    iconAngle={180}
                    onPress={this.openReport}
                >
                    {lang['input-report']}
                </Button>

                <Text style={styles.title} color='border'>
                    {lang['section-security-privacy']}
                </Text>

                {/* Disconnect / Disconnect all */}
                <Button style={styles.margin} onPress={this.disconnect}>
                    {lang['input-disconnect']}
                </Button>
                <Button
                    style={styles.margin}
                    appearance='outline'
                    onPress={this.disconnectAll}
                    loading={devicesLoading}
                >
                    {lang['input-disconnect-all']}
                </Button>

                {
                    // TODO: Add this button in multiplayer page ?
                }
                {/* Reconnect TCP */}
                {/* {user.server.IsConnected() &&
                    this.state.serverTCPState !== 'connected' &&
                    this.state.serverTCPState !== 'idle' && (
                        <Button style={styles.margin} onPress={this.reconnectTCP}>
                            {lang['input-reconnect-tcp']}
                        </Button>
                    )} */}

                {
                    // TODO: Restart tutorial (keep or remove ?)
                }
                {/* <Button style={styles.margin} onPress={this.restartTuto}>
                    {lang['input-tuto-again']}
                </Button> */}

                {/* Delete account */}
                <Button
                    style={styles.margin}
                    onPress={this.deleteAccount}
                    appearance='uniform'
                    color='danger'
                    loading={sendingMail}
                >
                    {lang['input-delete-account']}
                </Button>
            </ScrollView>
        );
    };
}

export default Settings;
