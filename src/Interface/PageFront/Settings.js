import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

import BackSettings from '../PageBack/settings';
import { Page, Text, Button, Switch, TextSwitch, ComboBox } from '../Components';
import { PageHeader } from '../Widgets';

class Settings extends BackSettings {
    render() {
        const langThemes = langManager.curr['themes'];
        const lang = langManager.curr['settings'];

        return (
            <Page ref={ref => { if (ref !== null) this.pageRef = ref; }} bottomOffset={0}>
                <PageHeader onBackPress={user.interface.BackPage} />

                <Button style={styles.margin} color='main2' borderRadius={16}>{lang['input-about']}</Button>

                <ComboBox
                    style={styles.margin}
                    title={lang['input-langage']}
                    pageRef={this.pageRef}
                    data={this.state.dataLangs}
                    selectedValue={this.state.selectedLang.value}
                    onSelect={this.onChangeLang}
                />

                <Text style={{ textAlign: 'left', marginBottom: 6 }}>{lang['input-theme']}</Text>
                <TextSwitch style={styles.margin} textLeft={langThemes['Dark']} textRight={langThemes['Light']} />

                <View style={{ marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ textAlign: 'left' }}>{lang['input-start-sound']}</Text>
                    <Switch
                        value={this.state.switchStartAudio}
                        onValueChanged={(value) => { this.setState({ switchStartAudio: value }); }}
                    />
                </View>

                <Button style={styles.margin} color='main2' borderRadius={16}>{lang['input-report']}</Button>
                <Button style={styles.margin} color='main2' borderRadius={16}>{lang['input-disconnect']}</Button>
                <Button style={styles.margin} color='danger' borderRadius={16}>{lang['input-delete-activities']}</Button>
                <Button style={styles.margin} color='danger' borderRadius={16}>{lang['input-delete-account']}</Button>
                <Button style={styles.margin} color='main2' borderRadius={16}>{lang['input-tuto-again']}</Button>
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