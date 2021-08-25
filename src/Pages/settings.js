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
    deconnect = user.disconnect;
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
                    <GLText style={styles.title} title={langManager.curr['settings']['input-langage'].toUpperCase()} />
                    <GLDropDown
                        value={langManager.curr['name']}
                        data={langManager.getOtherLangs()}
                        onSelect={this.changeLang}
                    />
                    {user.isConnected() && (
                        <TouchableOpacity style={styles.button} activeOpacity={.5} onPress={this.deconnect}>
                            <GLText style={styles.title} title={langManager.curr['settings']['input-disconnect'].toUpperCase()} />
                            <GLIconButton icon='signout' />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.button} activeOpacity={.5} onPress={user.clear}>
                        <GLText style={styles.title} title='[Test] Clear data' />
                        <GLIconButton icon='trash' />
                    </TouchableOpacity>
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