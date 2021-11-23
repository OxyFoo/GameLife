import * as React from 'react';
import { View, Text, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { Button as OldButton, HelperText, TextInput, Checkbox } from 'react-native-paper';

import BackLogin from '../back/login';

import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';
import { Button, BottomBar, GLIconButton } from '../Components';

class Login extends BackLogin {
    render() {
        const pageTitle = langManager.curr['login']['page-title'];
        const pageText = langManager.curr['login']['page-text'];
        const emailTitle = langManager.curr['login']['input-email-title'];
        const PseudoTitle = langManager.curr['login']['input-pseudo-title'];
        const btnLogin = langManager.curr['login']['button-login-text'];
        const btnSignin = langManager.curr['login']['button-signin-text'];

        const CGUTitle = langManager.curr['login']['input-cgu-text'];
        const cguTexts = CGUTitle.split('%');
        const cguClick = langManager.curr['login']['input-cgu-click'];

        return (
            <View style={styles.body}>
                <View style={styles.backgroundCircles}>
                    <Image source={require('../../../res/logo/login_circles.png')} />
                </View>
                <View style={styles.backgroundImage}>
                    <Image style={{width: 196, height: 196}} source={require('../../../res/logo/login_hand.png')} />
                </View>

                <Text style={[styles.title, { color: themeManager.colors['text']['main'] }]}>{pageTitle}</Text>
                <Text style={[styles.text, { color: themeManager.colors['text']['secondary'] }]}>{pageText}</Text>

                {/* Content */}
                <Animated.View
                    style={[
                        styles.container,
                        { height: Animated.add(86, Animated.multiply(154, this.state.animSignin)) }
                    ]}
                >
                    {/* Email */}
                    <TextInput
                        mode='outlined'
                        theme={theme}
                        outlineColor={'#808080'}
                        activeOutlineColor={'#9095FF'}
                        style={styles.input}
                        label={emailTitle}
                        textContentType='emailAddress'
                        value={this.state.email}
                        onChangeText={this.onChangeEmail}
                        disabled={this.state.signinMode}
                    />
                    <HelperText
                        type="error"
                        style={styles.helperText}
                        visible={this.state.errorEmail.length}
                    >
                        {this.state.errorEmail}
                    </HelperText>

                    {/* Pseudo */}
                    <TextInput
                        mode='outlined'
                        theme={theme}
                        outlineColor={'#808080'}
                        activeOutlineColor={'#9095FF'}
                        style={styles.input}
                        onChangeText={this.onChangePseudo}
                        value={this.state.pseudo}
                        label={PseudoTitle}
                        textContentType='emailAddress'
                    />
                    <HelperText
                        type="error"
                        style={styles.helperText}
                        visible={this.state.errorPseudo.length}
                    >
                        {this.state.errorPseudo}
                    </HelperText>

                    {/* CGU */}
                    <View style={styles.cgu}>
                        <Checkbox
                            color={'#9095FF'}
                            status={this.state.cguAccepted ? 'checked' : 'unchecked'}
                            onPress={this.onChangeCGU}
                        />
                        <Text style={{ color: themeManager.colors['text']['secondary'] }}>
                            <Text>{cguTexts[0]}</Text>
                            <Text style={styles.hypertext} onPress={this.CGURedirect}>{cguClick}</Text>
                            <Text>{cguTexts[1]}</Text>
                        </Text>
                    </View>
                    <HelperText
                        type="error"
                        style={styles.helperText}
                        visible={this.state.errorCgu.length}
                    >
                        {this.state.errorCgu}
                    </HelperText>
                </Animated.View>
                <Animated.View
                    style={[
                        styles.button,
                        { left: Animated.multiply(84, this.state.animSignin) }
                    ]}
                >
                    <Button
                        color="#9095FF"
                        style={{ width: '100%' }}
                        //loading={this.state.loading}
                        onPress={this.onLogin}
                    >
                        {this.state.signinMode ? btnSignin : btnLogin}
                    </Button>
                    {/*<OldButton
                        mode="contained"
                        color="#9095FF"
                        contentStyle={{ height: '100%' }}
                        labelStyle={{ color: '#FFFFFF' }}
                        compact={false}
                        loading={this.state.loading}
                        onPress={this.onLogin}
                    >
                        {this.state.signinMode ? btnSignin : btnLogin}
                    </OldButton>*/}
                </Animated.View>
                <Animated.View
                    style={[
                        styles.backButton,
                        //{ left: Animated.multiply(64, this.state.animSignin) }
                        { transform: [{ translateX: Animated.add(-128, Animated.multiply(128, this.state.animSignin)) }] }
                    ]}
                >
                    <Button
                        color="#9095FF"
                        style={{ width: '100%', height: '100%' }}
                        //loading={this.state.loading}
                        onPress={this.onBack}
                    >
                        <GLIconButton icon='back' size={16} />
                    </Button>
                    {/*<Button
                        mode="contained"
                        color="#9095FF"
                        contentStyle={{ height: '100%' }}
                        labelStyle={{ fontSize: 12, marginRight: -1, color: '#FFFFFF' }}
                        icon={require('../../../res/icons/back.png')}
                        onPress={this.onBack}
                    ></Button>*/}
                </Animated.View>
                {/*<BottomBar />*/}
            </View>
        )
    }
}

const theme = {
    colors: {
        placeholder: 'white', text: 'white', primary: 'white',
        underlineColor: 'transparent', background: '#0E1247'
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
        width: '80%',
    },
    helperText: {
        marginBottom: 4
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
        fontSize: 58,
        textDecorationLine: 'underline'
    },
    text: {
        width: '90%',
        marginVertical: '4%',
        textAlign: 'center',
        fontSize: 16
    },
    button: {
        position: 'absolute',
        height: 56,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 24,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden'
    },
    backButton: {
        position: 'absolute',
        height: 56,
        width: 64,
        left: 24,
        bottom: 24,
        borderRadius: 20,
        overflow: 'hidden'
    },
    cgu: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: -12
    },
    hypertext: {
        color: '#9095FF'
    }
});

export default Login;