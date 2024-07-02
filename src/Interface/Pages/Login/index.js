import * as React from 'react';
import { View, Animated } from 'react-native';

import BackLogin from './back';
import styles from './style';

import { Text, Button, InputText, CheckBox } from 'Interface/Components';

class Login extends BackLogin {
    render() {
        const { langs } = this;
        const {
            signinMode,
            animSignin,
            animSigninBis,
            loading,
            email,
            username,
            cguAccepted,
            errorCgu,
            errorEmail,
            errorUsername
        } = this.state;

        const btnLoginX = Animated.multiply(84, animSignin);
        const btnBackX = Animated.add(-128, Animated.multiply(128, animSignin));

        return (
            <View style={styles.page}>
                <View style={styles.form}>
                    {/* Title */}
                    <View>
                        <Text style={styles.title} color='primary'>
                            {langs.pageTitle}
                        </Text>

                        <Text style={styles.text} color='secondary'>
                            {langs.pageText}
                        </Text>
                    </View>

                    {/* Email */}
                    <InputText
                        containerStyle={styles.input}
                        type='email'
                        error={!!errorEmail}
                        label={langs.titleEmail}
                        value={email}
                        onChangeText={this.onChangeEmail}
                        enabled={!signinMode}
                    />
                    <Text style={styles.error} color={'error'}>
                        {errorEmail || ' '}
                    </Text>

                    {/* Username */}
                    <Animated.View style={[styles.input, { opacity: animSignin }]}>
                        <InputText
                            error={!!errorUsername}
                            type='name'
                            label={langs.titleUsername}
                            value={username}
                            onChangeText={this.onChangeUsername}
                            enabled={signinMode}
                        />
                        <Text style={styles.error} color={'error'}>
                            {errorUsername || ' '}
                        </Text>
                    </Animated.View>

                    {/* CGU */}
                    <Animated.View style={{ opacity: animSigninBis }}>
                        <View style={styles.cgu}>
                            <CheckBox
                                style={styles.cguCheckBox}
                                color='white'
                                value={cguAccepted}
                                onPress={this.onCGUToggle}
                            />
                            <Text
                                containerStyle={styles.cguTextContainer}
                                style={styles.cguText}
                                onPress={this.onCGURedirect}
                                fontSize={14}
                                color='secondary'
                            >
                                {langs.cguTexts[0]}
                                <Text fontSize={16} color='main1'>
                                    {langs.cguTexts[1]}
                                </Text>
                                {langs.cguTexts[2]}
                            </Text>
                        </View>
                        <Text style={styles.error} color={'error'}>
                            {errorCgu || ' '}
                        </Text>
                    </Animated.View>
                </View>

                {/* Separator */}
                <View />

                {/* Buttons */}
                <Button
                    style={styles.buttonLoginSignin}
                    styleAnimation={{ left: btnLoginX }}
                    onPress={signinMode ? this.signin : this.loginOrGoToSignin}
                    loading={loading}
                >
                    {signinMode ? langs.btnSignin : langs.btnLogin}
                </Button>
                <Button
                    style={styles.buttonBack}
                    styleAnimation={{ transform: [{ translateX: btnBackX }] }}
                    appearance='outline'
                    icon='arrow-left'
                    onPress={this.backToLogin}
                />
            </View>
        );
    }
}

export default Login;
