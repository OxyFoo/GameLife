import * as React from 'react';
import { Animated, View } from 'react-native';

import styles from './style';
import UserHeaderBack from './back';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { OnlineView } from 'Interface/Primitives';
import { Text, Icon, Button } from 'Interface/Components';
import { NotificationsInAppButton } from 'Interface/Widgets';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

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
        const { showAvatar, avatarData } = this.state;
        const openProfile = () => user.interface.ChangePage('profile');
        const containerSize = dataManager.items.GetContainerSize('profile');

        return (
            <Button ref={this.refContainer} style={styles.avatar} onPress={openProfile}>
                {showAvatar && avatarData && (
                    <AvatarFrame width={48} height={48} renderScale={2} backgroundColor='#00000000'>
                        <AvatarCharacter
                            body={avatarData.skin}
                            bodyColor={avatarData.skinColor}
                            position={containerSize.pos}
                            scale={containerSize.scale}
                            items={avatarData.items}
                            portraitMode
                        />
                    </AvatarFrame>
                )}
            </Button>
        );
    };
}

export { UserHeader };
