import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import Settings from '../../Pages/settings';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import { GLDropDown, GLHeader, GLIconButton, GLText } from './Components/GL-Components';

class T0Settings extends Settings {
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

                    {/* Reset activities
                    <TouchableOpacity style={styles.button} activeOpacity={.5} onPress={this.reset}>
                        <GLText style={styles.title} title={langManager.curr['settings']['input-reset'].toUpperCase()} />
                        <GLIconButton icon='trash' />
                    </TouchableOpacity> */}

                    {/* Disconnect */}
                    {user.isConnected() && (
                        <TouchableOpacity style={styles.button} activeOpacity={.5} onPress={this.deconnect}>
                            <GLText style={styles.title} title={langManager.curr['settings']['input-disconnect'].toUpperCase()} />
                            <GLIconButton icon='signout' />
                        </TouchableOpacity>
                    )}

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

const styles = StyleSheet.create({
    content: {
        paddingVertical: 72,
        paddingHorizontal: 36
    },
    title: {
        textAlign: 'left',
        fontSize: 22
    },
    button: {
        marginVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export { T0Settings };