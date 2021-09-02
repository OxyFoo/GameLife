import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { GLDropDown, GLHeader, GLIconButton, GLText } from '../Components/GL-Components';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.initLang = langManager.currentLangageKey;
    }
    back = () => {
        if (this.initLang !== langManager.currentLangageKey) {
            user.loadInternalData();
        }
        user.backPage();
    }
    reset = () => {
        const event = (button) => {
            if (button === 'yes') {
                user.activities = [];
                user.saveData();
            }
        }
        const title = langManager.curr['settings']['alert-reset-title'];
        const text = langManager.curr['settings']['alert-reset-text'];
        user.openPopup('yesno', [ title, text ], event);
    }
    deconnect = () => {
        const event = (button) => {
            if (button === 'yes') {
                user.disconnect();
            }
        }
        const title = langManager.curr['settings']['alert-disconnect-title'];
        const text = langManager.curr['settings']['alert-disconnect-text'];
        user.openPopup('yesno', [ title, text ], event);
    }
    changeLang = (lang) => {
        langManager.setLangage(lang);
        user.changePage();
        user.saveData(false);
    }

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

                    {/* Disconnect */}
                    <TouchableOpacity style={styles.button} activeOpacity={.5} onPress={this.reset}>
                        <GLText style={styles.title} title={langManager.curr['settings']['input-reset'].toUpperCase()} />
                        <GLIconButton icon='trash' />
                    </TouchableOpacity>

                    {/* Disconnect */}
                    {user.isConnected() && (
                        <TouchableOpacity style={styles.button} activeOpacity={.5} onPress={this.deconnect}>
                            <GLText style={styles.title} title={langManager.curr['settings']['input-disconnect'].toUpperCase()} />
                            <GLIconButton icon='signout' />
                        </TouchableOpacity>
                    )}

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

export default Settings;