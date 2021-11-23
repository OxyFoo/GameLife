import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';

import BackSettings from '../back/settings';
import { GLDropDown, GLHeader, GLIconButton, GLText } from '../Components';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

class Settings extends BackSettings {
    render() {
        return (
            <View style={{flex: 1}}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['settings']['page-title']}
                    leftIcon='back'
                    onPressLeft={this.back}
                />

                {/* Content */}
                <View style={styles.content}>
                    {/* Langages */}
                    <GLText style={styles.title} title={langManager.curr['settings']['input-langage'].toUpperCase()} />
                    <GLDropDown
                        value={langManager.curr['name']}
                        data={langManager.getOtherLangs()}
                        onSelect={this.changeLang}
                    />

                    {/* Themes */}
                    <GLText style={styles.title} title={langManager.curr['settings']['input-theme'].toUpperCase()} />
                    <GLDropDown
                        value={langManager.curr['themes'][this.currentTheme] || ''}
                        data={this.selectableThemes}
                        onSelect={this.changeTheme}
                    />

                    {/* Morning notifications */}
                    {Platform.OS === "android" && (
                        <>
                            <GLText style={styles.title} title={langManager.curr['settings']['input-morningnotifications'].toUpperCase()} />
                            <GLDropDown
                                value={this.enabledOrNot[user.settings.morningNotifications ? 1 : 0].value || ''}
                                data={this.enabledOrNot}
                                onSelect={this.changeMorningNotifications}
                            />
                        </>
                    )}

                    {/* Reset activities
                    <TouchableOpacity style={styles.button} activeOpacity={.5} onPress={this.reset}>
                        <GLText style={styles.title} title={langManager.curr['settings']['input-reset'].toUpperCase()} />
                        <GLIconButton icon='trash' />
                    </TouchableOpacity> */}

                    {/* Disconnect */}
                    <TouchableOpacity style={styles.button} activeOpacity={.5} onPress={this.disconnect}>
                        <GLText style={styles.title} title={langManager.curr['settings']['input-disconnect'].toUpperCase()} />
                        <GLIconButton icon='signout' />
                    </TouchableOpacity>

                    {/* Reset all
                    <TouchableOpacity style={styles.button} activeOpacity={.5} onPress={this.clear}>
                        <GLText style={styles.title} title={langManager.curr['settings']['input-clear'].toUpperCase()} />
                        <GLIconButton icon='trash' />
                    </TouchableOpacity> */}

                </View>
            </View>
        )
    }
}

const ww = Dimensions.get('window').width ; 
const wh = Dimensions.get('window').height ;

const styles = StyleSheet.create({
    content: {
        paddingVertical: "15%",
        paddingHorizontal: "8%"
    },
    title: {
        textAlign: 'left',
        fontSize: ww * 58 / 1000
    },
    button: {
        marginVertical: "3%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export default Settings;