import * as React from 'react';
import { View, TouchableOpacity, Animated  } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import UserHeaderBack from './back';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Icon, Button, Frame } from 'Interface/Components';
import { NotificationsInAppButton } from 'Interface/Widgets';

/**
 * @typedef {import('Interface/OldComponents/Icon').Icons} Icons
 */

class UserHeader extends UserHeaderBack {
    renderInteraction = () => {
        const { editorMode } = this.props;
        const { showAvatar } = this.state;

        if (editorMode) {
            /** @type {Icons} */
            const icon = user.server.IsConnected() ? 'edit' : 'nowifi';

            return (
                <Icon icon={icon} color='border' />
            );
        }

        const openProfile = () => user.interface.ChangePage('profile');
        const frameSize = { x: 200, y: 0, width: 500, height: 450 };

        return (
            <Button
                ref={ref => this.refContainer = ref}
                style={styles.avatar}
                onPress={openProfile}
                rippleColor='white'
            >
                {showAvatar && (
                    <Frame
                        ref={ref => this.refFrame = ref}
                        characters={[ user.character ]}
                        size={frameSize}
                        delayTime={0}
                        loadingTime={0}
                        bodyView={'topHalf'}
                    />
                )}
            </Button>
        );
    }

    renderNotificationsInApp = () => {
        const { editorMode } = this.props;

        if (editorMode) {
            return null;
        }

        return (
            <NotificationsInAppButton style={styles.interactionsButton} />
        );
    }

    renderContent() {
        const { style, editorMode, onPress } = this.props;
        const { username, titleText } = this.state;

        let age = user.informations.GetAge();
        let ageText = '';
        if (age !== null) {
            ageText = langManager.curr['profile']['value-age']
                                .replace('{}', age.toString());
        }

        const activeOpacity = editorMode ? 0.6 : 1;

        return (
            <TouchableOpacity
                style={[styles.header, style]}
                onPress={() => onPress()}
                activeOpacity={activeOpacity}
            >
                <View style={styles.content}>
                    <View style={styles.usernameContainer}>

                        <Text style={styles.username} color='primary'>
                            {username}
                        </Text>

                        {editorMode && age !== null && (
                            <Text style={styles.age} color='secondary'>
                                {ageText}
                            </Text>
                        )}
                    </View>

                    {titleText !== '' && (
                        <Text style={styles.title} color='secondary'>
                            {titleText}
                        </Text>
                    )}
                </View>

                <View style={styles.interactions}>
                    {this.renderNotificationsInApp()}
                    {this.renderInteraction()}
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const { editorMode } = this.props;
        const { animPosY } = this.state;

        if (editorMode) {
            return this.renderContent();
        }

        const background = [ themeManager.GetColor('ground1'), themeManager.GetColor('ground2') ];
        const animStyle = { transform: [{ translateY: animPosY }] };
        const screenHeight = { height: user.interface?.screenHeight || 0};

        return (
            <Animated.View
                style={[animStyle, styles.absolute]}
                onLayout={this.onLayout}
            >
                <LinearGradient
                    style={[styles.absolute, styles.linear, screenHeight]}
                    colors={background}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                />
                <View style={styles.container}>
                    {this.renderContent()}
                </View>
            </Animated.View>
        );
    }
}

export default UserHeader;
