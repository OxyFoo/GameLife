import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackSettings from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { PageHeader } from 'Interface/Widgets';
import { Page, Text, Button, Switch, TextSwitch, ComboBox } from 'Interface/Components';

class Settings extends BackSettings {
    render = () => {
        const {
            cbSelectedLang,
            switchEveningNotifs,
            switchMorningNotifs,
            waitingConsentPopup,
            sendingMail,
            devicesLoading
        } = this.state;
        const langThemes = langManager.curr['themes'];
        const lang = langManager.curr['settings'];

        return (
            <Page ref={ref => this.refPage = ref}>
                <PageHeader onBackPress={this.onBack} />

                <Button style={styles.margin} color='main2' borderRadius={16} onPress={this.openAbout}>{lang['input-about']}</Button>

                <ComboBox
                    style={styles.margin}
                    title={lang['input-langage']}
                    data={this.availableLangs}
                    selectedValue={cbSelectedLang.value}
                    onSelect={this.onChangeLang}
                />

                {/*
                <Text style={{ textAlign: 'left', marginBottom: 6 }}>{lang['input-theme']}</Text>
                <TextSwitch
                    // TODO - Finish themes
                    style={styles.margin}
                    texts={[ langThemes['Main'], langThemes['Light'] ]}
                    onChange={this.onChangeTheme}
                    start={themeManager.selectedTheme === 'Main' ? 0 : 1}
                />
                */}

                <View style={styles.inline}>
                    <Text style={styles.inlineText}>{lang['input-notif-morning']}</Text>
                    <Switch
                        value={switchMorningNotifs}
                        onValueChanged={this.onChangeMorningNotifications}
                    />
                </View>

                <View style={styles.inline}>
                    <Text style={styles.inlineText}>{lang['input-notif-evening']}</Text>
                    <Switch
                        value={switchEveningNotifs}
                        onValueChanged={this.onChangeEveningNotifications}
                    />
                </View>

                <Button style={styles.margin} onPress={this.openReport} color='main2'>{lang['input-report']}</Button>
                <Button style={styles.margin} onPress={this.openConsentPopup} color='main2' loading={waitingConsentPopup}>{lang['input-consent']}</Button>
                <Button style={styles.margin} onPress={this.disconnect} color='main2'>{lang['input-disconnect']}</Button>
                <Button style={styles.margin} onPress={this.disconnectAll} color='main2' loading={devicesLoading}>{lang['input-disconnect-all']}</Button>
                <Button style={styles.margin} onPress={this.restartTuto} color='main1' borderRadius={16}>{lang['input-tuto-again']}</Button>
                <Button style={styles.margin} onPress={this.deleteAccount} color='danger' loading={sendingMail}>{lang['input-delete-account']}</Button>
            </Page>
        )
    }
}

const styles = StyleSheet.create({
    margin: {
        marginBottom: 24
    },
    inline: {
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    inlineText: {
        textAlign: 'left'
    }
});

export default Settings;
