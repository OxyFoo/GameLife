import * as React from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

import BackLogin from '../PageBack/Login';
import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';

import { Text, Button, Input, Checkbox, GLIconButton } from '../Components';

class Login extends BackLogin {
    render() {
        const pageTitle = langManager.curr['login']['page-title'];
        const pageText = langManager.curr['login']['page-text'];
        const titleEmail = langManager.curr['login']['input-email-title'];
        const titleUsername = langManager.curr['login']['input-username-title'];
        const btnLogin = langManager.curr['login']['button-login-text'];
        const btnSignin = langManager.curr['login']['button-signin-text'];

        const CGUTitle = langManager.curr['login']['input-cgu-text'];
        const cguTexts = CGUTitle.split('%');
        const cguClick = langManager.curr['login']['input-cgu-click'];
        const cguColor = themeManager.GetColor('main1');

        return (
            <View style={{ flex: 1 }}>
                <View style={styles.body}>
                    <Image style={styles.backgroundCircles} source={require('../../../res/logo/login_circles.png')} />
                    <Image style={styles.backgroundImage} source={require('../../../res/logo/login_hand.png')} />

                    <Text style={styles.title} color='primary'>{pageTitle}</Text>
                    <Text style={styles.text} color='secondary'>{pageText}</Text>

                    {/* Content */}
                    <Animated.View
                        style={[
                            styles.container,
                            { height: Animated.add(86, Animated.multiply(160, this.state.animSignin)) }
                        ]}
                    >
                        {/* Email */}
                        <Input
                            style={styles.input}
                            label={titleEmail}
                            text={this.state.email}
                            onChangeText={this.onChangeEmail}
                            textContentType='email'
                            enabled={!this.state.signinMode}
                        />
                        <Text style={styles.error} color={'error'}>{this.state.errorEmail}</Text>

                        {/* Username */}
                        <Input
                            style={styles.input}
                            label={titleUsername}
                            text={this.state.username}
                            onChangeText={this.onChangeUsername}
                            textContentType='name'
                            enabled={this.state.signinMode}
                        />
                        <Text style={styles.error} color={'error'}>{this.state.errorUsername}</Text>

                        {/* CGU */}
                        <View style={styles.cgu}>
                            <Checkbox
                                style={{ marginRight: 4 }}
                                checked={this.state.cguAccepted}
                                onChange={this.onChangeCGU}
                            />
                            <Text onPress={this.onChangeCGU} fontSize={14} color='secondary'>{cguTexts[0]}</Text>
                            <Text onPress={this.CGURedirect} fontSize={12} color={cguColor}>{cguClick}</Text>
                            <Text onPress={this.onChangeCGU} fontSize={14} color='secondary'>{cguTexts[1]}</Text>
                        </View>
                        <Text style={styles.error} color={'error'}>{this.state.errorCgu}</Text>
                    </Animated.View>

                </View>
                <Button
                    style={styles.button}
                    styleAnimation={{ left: Animated.multiply(84, this.state.animSignin) }}
                    color="main1"
                    onPress={this.onLogin}
                    loading={this.state.loading}
                >
                    {this.state.signinMode ? btnSignin : btnLogin}
                </Button>
                <Button
                    style={styles.backButton}
                    styleAnimation={{transform: [{ translateX: Animated.add(-128, Animated.multiply(128, this.state.animSignin)) }] }}
                    color="main1"
                    //rippleColor='main1'
                    onPress={this.onBack}
                >
                    <GLIconButton icon='back' size={16} />
                </Button>
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
        paddingVertical: '5%',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
    },
    backgroundImage: {
        width: 196,
        height: 196,
        marginTop: '30%'
    },
    backgroundCircles: {
        position: 'absolute',
        top: 0,
        right: 0
    },
    title: {
        fontSize: 58,
        textDecorationLine: 'underline'
    },
    text: {
        margin: '5%',
        textAlign: 'center',
        fontSize: 16
    },
    input: {
        width: '80%'
    },
    button: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        margin: 24
    },
    backButton: {
        position: 'absolute',
        width: 64,
        left: 24,
        bottom: 24
    },
    cgu: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: -8
    },
    error: {
        margin: 2,
        fontSize: 12
    }
});

export default Login;