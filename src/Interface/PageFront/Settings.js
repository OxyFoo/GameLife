import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackSettings from '../PageBack/Settings';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

import { PageHeader } from '../Widgets';
import { Page, Text, Button, Switch, TextSwitch, ComboBox, Container } from '../Components';
import themeManager from '../../Managers/ThemeManager';

class Settings extends BackSettings {
    render() {
        const langThemes = langManager.curr['themes'];
        const lang = langManager.curr['settings'];
        const WAITPLZ = () => console.log('NON ce n\'est pas un bug !!!!!! C\'est juste pas terminé, MERCI de ne pas tout prendre pour des bugs MERCI BIEEEEN !!!!!!!!!!');

        return (
            <Page ref={ref => { if (ref !== null) this.pageRef = ref; }} bottomOffset={0}>
                <PageHeader onBackPress={user.interface.BackPage} />

                <Button style={styles.margin} color='main2' borderRadius={16} onPress={this.openAbout}>{lang['input-about']}</Button>

                <ComboBox
                    style={styles.margin}
                    title={lang['input-langage']}
                    pageRef={this.pageRef}
                    data={this.state.dataLangs}
                    selectedValue={this.state.selectedLang.value}
                    onSelect={this.onChangeLang}
                />

                <Text style={{ textAlign: 'left', marginBottom: 6 }}>{lang['input-theme']}</Text>
                <TextSwitch
                    style={styles.margin}
                    onChange={this.onChangeTheme}
                    textLeft={langThemes['Dark']}
                    textRight={langThemes['Light']}
                    startRight={themeManager.selectedTheme === 'Light'}
                />

                <View style={{ marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ textAlign: 'left' }}>[{lang['input-start-sound']}]</Text>
                    <Switch
                        value={this.state.switchStartAudio}
                        onValueChanged={(value) => {
                            WAITPLZ();
                            this.setState({ switchStartAudio: value });
                        }}
                    />
                </View>

                <Button style={styles.margin} onPress={this.openReport} color='main2'>{lang['input-report']}</Button>
                <Button style={styles.margin} onPress={this.disconnect} color='main2'>{lang['input-disconnect']}</Button>

                <Container style={styles.margin} text={'[Suppressions]'} opened={false} type='rollable'>
                    <Button style={styles.margin} onPress={this.resetActivities} color='danger'>{lang['input-delete-activities']}</Button>
                    <Button onPress={WAITPLZ} color='danger'>[{lang['input-delete-account']}]</Button>
                </Container>

                <Button style={styles.margin} onPress={WAITPLZ} color='main1' borderRadius={16}>[{lang['input-tuto-again']}]</Button>
            </Page>
        )
    }
}

const styles = StyleSheet.create({
    margin: {
        marginBottom: 24
    }
});

export default Settings;