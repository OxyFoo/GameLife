import * as React from 'react';
import { Animated, Image, View } from 'react-native';

import styles from './style';
import UserHeaderBack from './back';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, Icon, Button, Frame } from 'Interface/Components';
import { NotificationsInAppButton } from 'Interface/Widgets';

const AVATAR_FRAME_SIZE = { x: 250, y: 50, width: 400, height: 350 };

class UserHeader extends UserHeaderBack {
    render() {
        const lang = langManager.curr['home'];
        const { style } = this.props;
        const { username, titleText, animPosY } = this.state;

        const animStyle = { transform: [{ translateY: animPosY }] };

        return (
            <Animated.View style={[styles.absolute, animStyle]} onLayout={this.onLayout}>
                <View style={[styles.container, style]}>
                    <View style={styles.userHeader}>
                        <View style={styles.usernameContainer}>
                            <Text style={styles.username} color='primary'>
                                {lang['title-hello'].replace('{}', username)}
                            </Text>
                        </View>

                        {titleText !== '' && (
                            <Text style={styles.title} color='main1'>
                                {titleText}
                            </Text>
                        )}
                    </View>

                    <View style={styles.interactions}>
                        {this.renderNotificationsInAppButton()}
                        {this.renderInteraction()}
                    </View>
                </View>
            </Animated.View>
        );
    }

    renderNotificationsInAppButton = () => {
        if (this.state.connectedToServer === false) {
            return <Icon style={styles.noWifiIcon} icon='no-wifi' color='border' size={32} />;
        }
        return <NotificationsInAppButton ref={this.refBellButton} style={styles.interactionsButton} />;
    };

    renderInteraction = () => {
        const { showAvatar } = this.state;
        const openProfile = () => user.interface.ChangePage('profile');

        return (
            <Button ref={this.refContainer} style={styles.avatar} onPress={openProfile}>
                {showAvatar && user.character && (
                    // TODO: Real avatar
                    // <Frame
                    //     ref={this.refFrame}
                    //     characters={[user.character]}
                    //     size={AVATAR_FRAME_SIZE}
                    //     delayTime={0}
                    //     loadingTime={0}
                    //     bodyView={'topHalf'}
                    // />
                    <Image
                        style={{ width: 48, height: 48 }}
                        resizeMode='stretch'
                        source={require('Ressources/items/avatar_min_placeholder.png')}
                    />
                )}
            </Button>
        );
    };
}

export { UserHeader };
