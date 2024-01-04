import * as React from 'react';
import { View, Image, Animated } from 'react-native';

import BackLogin from './back';
import styles from './style';
import user from 'Managers/UserManager';

import { Page, Text, Button, Input, Checkbox } from 'Interface/Components';

class Login extends BackLogin {
    render() {
        const { langs } = this;
        const contentHeight = Animated.add(100, Animated.multiply(160, this.state.animSignin));
        const btnLoginX = Animated.multiply(84, this.state.animSignin);
        const btnBackX = Animated.add(-128, Animated.multiply(128, this.state.animSignin));
        const imageAnim = {
            transform: [
                { scale: this.state.animImage },
                { translateY: Animated.multiply(this.state.animFocus, -250) }
            ]
        };
        const contentAnim = {
            transform: [
                { translateY: Animated.multiply(this.state.animFocus, -250) }
            ]
        };
        const contentNoAnim = { opacity: Animated.subtract(1, this.state.animFocus) };

        const smallScreen = user.interface.screenHeight < 600;

        return (
            <Page ref={ref => this.refPage = ref} style={styles.body} scrollable={false}>
                {/* Background images */}
                {smallScreen ? null : (
                    <Image style={styles.backgroundCircles} source={this.imageBackground} />
                )}

                {/* Main image */}
                {smallScreen ? null : (
                    <Animated.View
                        style={[styles.mainImageContainer, imageAnim]}
                        onTouchStart={this.onPressImageIn}
                        onTouchEnd={this.onPressImageOut}
                    >
                        <Image
                            style={styles.mainImage}
                            resizeMode='contain'
                            source={this.imageMain}
                        />
                    </Animated.View>
                )}

                {/* Title */}
                <Animated.View style={contentNoAnim}>
                    <Text
                        style={smallScreen ? styles.smallTitle : styles.title}
                        color='primary'
                    >
                        {langs.pageTitle}
                    </Text>

                    <Text
                        style={styles.text}
                        color='secondary'
                    >
                        {langs.pageText}
                    </Text>
                </Animated.View>

                {/* Content */}
                <Animated.View style={[
                    styles.container,
                    contentAnim,
                    { height: contentHeight }
                ]}>

                    {/* Email */}
                    <Input
                        ref={ref => this.refInputEmail = ref}
                        style={styles.input}
                        label={langs.titleEmail}
                        text={this.state.email}
                        onChangeText={this.onChangeEmail}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        textContentType='email'
                        enabled={!this.state.signinMode}
                    />
                    <Text style={styles.error} color={'error'}>{this.state.errorEmail}</Text>

                    {/* Username */}
                    <Input
                        ref={ref => this.refInputUsername = ref}
                        style={styles.input}
                        label={langs.titleUsername}
                        text={this.state.username}
                        onChangeText={this.onChangeUsername}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        textContentType='name'
                        enabled={this.state.signinMode}
                    />
                    <Text style={styles.error} color={'error'}>{this.state.errorUsername}</Text>

                    {/* CGU */}
                    <View style={styles.cgu}>
                        <Checkbox
                            style={{ marginRight: 4 }}
                            checked={this.state.cguAccepted}
                            onChange={this.onCGUToggle}
                        />
                        <Text onPress={this.onCGUToggle} fontSize={14} color='secondary'>{langs.cguTexts[0]}</Text>
                        <Text onPress={this.onCGURedirect} fontSize={12} color='main1'>{langs.cguTexts[1]}</Text>
                        <Text onPress={this.onCGUToggle} fontSize={14} color='secondary'>{langs.cguTexts[2]}</Text>
                    </View>
                    <Text style={styles.error} color={'error'}>{this.state.errorCgu}</Text>
                </Animated.View>

                <Button
                    style={styles.button}
                    styleAnimation={{ left: btnLoginX }}
                    color='main1'
                    onPress={this.onLoginOrSignin}
                    loading={this.state.loading}
                >
                    {this.state.signinMode ? langs.btnSignin : langs.btnLogin}
                </Button>
                <Button
                    style={styles.backButton}
                    styleAnimation={{transform: [{ translateX: btnBackX }] }}
                    color='main1'
                    icon='arrowLeft'
                    onPress={this.setSigninMode}
                />
            </Page>
        );
    }
}

export default Login;
