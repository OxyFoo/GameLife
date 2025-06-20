import * as React from 'react';
import { Animated, View } from 'react-native';

import BackLogin from './back';
import styles from './style';
import GoogleSignIn from 'App/GoogleSignIn';
import langManager from 'Managers/LangManager';

import { Text, Button, InputText, CheckBox, ComboBox, Icon } from 'Interface/Components';

class Login extends BackLogin {
    render() {
        const lang = langManager.curr['login'];
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
            errorUsername,
            cbSelectedLang
        } = this.state;

        const cguTexts = lang['input-cgu-text'].split('%');

        const btnLoginX = Animated.multiply(84, animSignin);
        const btnBackX = Animated.add(-128, Animated.multiply(128, animSignin));
        const bisPointerEvents = signinMode ? 'auto' : 'none';

        return (
            <View style={styles.page}>
                <View style={styles.form}>
                    {/* Title */}
                    <View>
                        <Text style={styles.title} color='primary'>
                            {lang['page-title']}
                        </Text>

                        <Text style={styles.text} color='secondary'>
                            {lang['page-text']}
                        </Text>
                    </View>

                    {/* Email */}
                    <InputText
                        containerStyle={styles.input}
                        type='email'
                        error={!!errorEmail}
                        label={lang['input-email-title']}
                        value={email}
                        onChangeText={this.onChangeEmail}
                        enabled={!signinMode}
                    />
                    <Text style={styles.error} color={'error'}>
                        {errorEmail || ' '}
                    </Text>

                    {/* Username */}
                    <Animated.View style={[styles.input, { opacity: animSignin }]} pointerEvents={bisPointerEvents}>
                        <InputText
                            error={!!errorUsername}
                            type='name'
                            label={lang['input-username-title']}
                            value={username}
                            onChangeText={this.onChangeUsername}
                            enabled={signinMode}
                        />
                        <Text style={styles.error} color={'error'}>
                            {errorUsername || ' '}
                        </Text>
                    </Animated.View>

                    {/* CGU */}
                    <Animated.View style={{ opacity: animSigninBis }} pointerEvents={bisPointerEvents}>
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
                                {cguTexts[0]}
                                <Text fontSize={16} color='main1'>
                                    {cguTexts[1]}
                                </Text>
                                {cguTexts[2]}
                            </Text>
                        </View>
                        <Text style={styles.error} color={'error'}>
                            {errorCgu || ' '}
                        </Text>
                    </Animated.View>
                </View>

                {/* Separator */}
                <View />

                {/* Language */}
                <ComboBox
                    style={styles.cbLang}
                    inputStyle={styles.cbLangInput}
                    title=''
                    data={this.availableLangs}
                    selectedValue={cbSelectedLang.value}
                    onSelect={this.onChangeLang}
                    hideChevron
                />

                {/* Google Sign-In Button - Only show when not in signin mode and when configured */}
                {GoogleSignIn.shouldShowButton() && !signinMode && (
                    <Button
                        style={styles.buttonGoogleSignin}
                        styleContent={styles.buttonGoogleContent}
                        appearance='outline'
                        fontColor='white'
                        onPress={this.googleSignIn}
                        loading={loading}
                    >
                        <Icon icon='google' color='main1' size={20} />
                        <Text color='white' fontSize={16}>
                            {lang['button-google-signin']}
                        </Text>
                        <Icon icon='google' color='main1' size={20} show={false} />
                    </Button>
                )}

                {/* Buttons */}
                <Button
                    style={styles.buttonLoginSignin}
                    styleAnimation={{ left: btnLoginX }}
                    onPress={signinMode ? this.signin : this.loginOrGoToSignin}
                    loading={loading}
                >
                    {signinMode ? lang['button-signin-text'] : lang['button-login-text']}
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
