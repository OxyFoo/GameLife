import * as React from 'react';
import { Animated, Image, View } from 'react-native';

import styles from './style';
import UserHeaderBack from './back';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { OnlineView } from 'Interface/Primitives';
import { Text, Icon, Button, Frame } from 'Interface/Components';
import { NotificationsInAppButton } from 'Interface/Widgets';

// TODO: Replace this with a real avatar
// @ts-ignore
const AVATAR_MIN_PLACEHOLDER = require('Ressources/items/avatar_min_placeholder.png');

const AVATAR_FRAME_SIZE = { x: 250, y: 50, width: 400, height: 350 };

class UserHeader extends UserHeaderBack {
    render() {
        const lang = langManager.curr['home'];
        const { style } = this.props;
        const { username, titleID, animPosY } = this.state;

        const title = dataManager.titles.GetByID(titleID);
        const titleText = title === null ? '' : langManager.GetText(title.Name);

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
        return (
            <OnlineView offlineView={<Icon style={styles.noWifiIcon} icon='no-wifi' color='border' size={32} />}>
                <NotificationsInAppButton ref={this.refBellButton} style={styles.interactionsButton} />
            </OnlineView>
        );
    };

    renderInteraction = () => {
        const { showAvatar } = this.state;
        const openProfile = () => user.interface.ChangePage('profile');

        return (
            <Button ref={this.refContainer} style={styles.avatar} onPress={openProfile}>
                {showAvatar && user.character && (
                    // TODO: Real avatar
                    <Frame
                        ref={this.refFrame}
                        characters={[user.character]}
                        size={AVATAR_FRAME_SIZE}
                        delayTime={0}
                        loadingTime={0}
                        bodyView={'topHalf'}
                    />
                )}
                <Image style={styles.avatarImage} resizeMode='stretch' source={AVATAR_MIN_PLACEHOLDER} />
            </Button>
        );
    };
}

export { UserHeader };
