import * as React from 'react';
import { View, Button, TextInput, StyleSheet } from 'react-native';

import BackLogin from '../back/login';
import { GLHeader, GLText } from '../Components';

import langManager from '../../Managers/LangManager';

class Login extends BackLogin {
    render() {
        const pageTitle = langManager.curr['login']['page-title'];

        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader title={pageTitle} />

                {/* Content */}
                <View style={styles.container}>
                    <GLText style={styles.wait} title={langManager.curr['shop']['wait']} />
                    <TextInput
                        style={styles.input}
                        onChangeText={this.onChangeText}
                        value={this.state.email}
                        placeholder={"Email"}
                        placeholderTextColor='#C2C2C2'
                        textContentType='emailAddress'
                    />
                    <Button
                        title="Login"
                        onPress={this.onLogin}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: '5%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        color: '#FFFFFF'
    }
});

export default Login;