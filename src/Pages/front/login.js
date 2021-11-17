import * as React from 'react';
import { View, Image, Button, TextInput, StyleSheet, Animated } from 'react-native';

import BackLogin from '../back/login';
import { GLText } from '../Components';

import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';

class Login extends BackLogin {
    render() {
        const pageTitle = langManager.curr['login']['page-title'];
        const pageText = langManager.curr['login']['page-text'];
        const emailTitle = langManager.curr['login']['input-email-title'];
        const PseudoTitle = langManager.curr['login']['input-pseudo-title'];
        const CGUTitle = langManager.curr['login']['input-cgu-text'];
        const btnLogin = langManager.curr['login']['button-login-text'];
        const btnSignin = langManager.curr['login']['button-signin-text'];

        return (
            <View style={styles.body}>
                <View style={styles.backgroundCircles}>
                    <Image source={require('../../../res/logo/login_circles.png')} />
                </View>
                <View style={styles.backgroundImage}>
                    <Image style={{width: 196, height: 196}} source={require('../../../res/logo/login_hand.png')} />
                </View>

                <GLText style={styles.title} title={pageTitle} />
                <GLText style={styles.text} title={pageText} color='secondary' />

                {/* Content */}
                <Animated.View
                    style={[
                        styles.container,
                        { height: Animated.add(86, Animated.multiply(154, this.state.animSignin)) }
                    ]}
                >
                    <GLText title={emailTitle} color='secondary' />
                    <TextInput
                        style={[styles.input, { borderColor: themeManager.colors['text']['secondary'] }]}
                        onChangeText={this.onChangeEmail}
                        value={this.state.email}
                        placeholder={emailTitle}
                        placeholderTextColor='#C2C2C2'
                        textContentType='emailAddress'
                        editable={!this.state.signinMode}
                    />
                    <GLText title={PseudoTitle} color='secondary' />
                    <TextInput
                        style={[styles.input, { borderColor: themeManager.colors['text']['secondary'] }]}
                        onChangeText={this.onChangePseudo}
                        value={this.state.pseudo}
                        placeholder={PseudoTitle}
                        placeholderTextColor='#C2C2C2'
                        textContentType='emailAddress'
                    />
                    <GLText title={CGUTitle} color='secondary' />
                </Animated.View>
                <Animated.View
                    style={[
                        styles.button,
                        { left: Animated.multiply(72, this.state.animSignin) }
                    ]}
                >
                    <Button
                        title={this.state.signinMode ? btnSignin : btnLogin}
                        onPress={this.onLogin}
                    />
                </Animated.View>
                <Animated.View
                    style={[
                        styles.backButton,
                        //{ left: Animated.multiply(64, this.state.animSignin) }
                        { transform: [{ translateX: Animated.add(-72, Animated.multiply(72, this.state.animSignin)) }] }
                    ]}
                >
                    <Button
                        title={'<-'}
                        onPress={this.onBack}
                    />
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        padding: '5%',
        display: 'flex',
        alignItems: 'center'
    },
    container: {
        width: '100%',
        // height: 86 - 240 : 86+154*anim
        marginTop: '5%',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
    },
    input: {
        width: '90%',
        marginBottom: 24,
        color: '#FFFFFF',
        borderWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 18
    },
    backgroundImage: {
        width: '100%',
        marginTop: '30%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    backgroundCircles: {
        position: 'absolute',
        top: 0,
        right: 0
    },
    title: {
        fontSize: 64,
        textDecorationLine: 'underline'
    },
    text: {
        width: '90%',
        marginVertical: '5%',
        fontSize: 20
    },
    button: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        margin: 24
    },
    backButton: {
        position: 'absolute',
        width: 48,
        left: 24,
        bottom: 24
    }
});

export default Login;