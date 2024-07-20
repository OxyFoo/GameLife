import * as React from 'react';
import { View, Platform } from 'react-native';

import styles from './style';
import BackSettings from './back';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Button, Switch, /*SwitchText,*/ ComboBox } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class Settings extends BackSettings {
    render = () => {
        const { cbSelectedLang, waitingConsentPopup, sendingMail, devicesLoading } = this.state;

        //const langThemes = langManager.curr['themes'];
        const lang = langManager.curr['settings'];

        return (
            <View style={styles.page}>
                <PageHeader onBackPress={this.onBack} />

                <Button style={styles.margin} onPress={this.openAbout}>
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

                {/* TODO: Finish themes */}
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

                {/* Reports page */}
                <Button style={styles.margin} appearance='outline' onPress={this.openReport}>
                    {lang['input-report']}
                </Button>

                {/** TODO: Force consent popup on iOS */}
                {Platform.OS === 'android' && (
                    <Button
                        style={styles.margin}
                        onPress={this.openConsentPopup}
                        appearance='outline'
                        loading={waitingConsentPopup}
                    >
                        {lang['input-consent']}
                    </Button>
                )}

                {/* Disconnect / Disconnect all */}
                <Button style={styles.margin} onPress={this.disconnect}>
                    {lang['input-disconnect']}
                </Button>
                <Button style={styles.margin} onPress={this.disconnectAll} loading={devicesLoading}>
                    {lang['input-disconnect-all']}
                </Button>

                {/* TODO: Add this button in multiplayer page ? */}
                {/* Reconnect TCP */}
                {/* {user.server.IsConnected() &&
                    this.state.serverTCPState !== 'connected' &&
                    this.state.serverTCPState !== 'idle' && (
                        <Button style={styles.margin} onPress={this.reconnectTCP}>
                            {lang['input-reconnect-tcp']}
                        </Button>
                    )} */}

                {/* TODO: Restart tutorial (keep or remove ?) */}
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
            </View>
        );
    };
}

export default Settings;
