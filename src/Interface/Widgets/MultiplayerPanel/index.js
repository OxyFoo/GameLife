import * as React from 'react';
import { FlatList, View } from 'react-native';

import styles from './style';
import BackMultiplayerPanel from './back';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { USER_XP_PER_LEVEL } from 'Class/Experience';
import { Character, Container, Frame, Text, Button } from 'Interface/Components';

/**
 * @typedef {import('Interface/Components/Icon').Icons} Icons
 * @typedef {import('Types/Friend').Friend} Friend
 * @typedef {import('react-native').ListRenderItem<Friend>} ListRenderFriend
 */

class MultiplayerPanel extends BackMultiplayerPanel {
    render() {
        const { state } = this.state;

        /** @type {Icons} */
        let icon = 'loadingDots';
        let iconPress = () => {};

        if (state === 'connected') {
            icon = 'social';
            iconPress = this.openMultiplayer;
        } else if (state === 'disconnected') {
            icon = 'retry';
            iconPress = this.Reconnect;
        } else if (state === 'error') {
            icon = 'retry';
            iconPress = this.Reconnect;
        }

        return (
            <Container
                style={this.props.style}
                styleContainer={styles.container}
                type='static'
                text={'[Multiplayer]'}
                icon={icon}
                onIconPress={iconPress}
            >
                {this.renderContent()}
            </Container>
        );
    }

    renderContent = () => {
        const { state } = this.state;

        // Not connected
        if (state === 'disconnected')   return this.renderDisconnected();
        else if (state === 'idle')      return this.renderIdle();
        else if (state === 'error')     return this.renderError();

        return (
            <FlatList
                ref={ref => this.refFlatlist = ref}
                data={this.state.friends}
                keyExtractor={(item, index) => 'multi-player-' + item.accountID}
                renderItem={this.renderItem}
            />
        );
    }

    /** @type {ListRenderFriend} */
    renderItem = ({ item, index }) => {
        const frameSize = { x: 200, y: 0, width: 500, height: 450 };

        const friendTitleIndex = dataManager.titles.GetByID(item.title);
        const friendTitle = dataManager.GetText(friendTitleIndex.Name);
        const friendExperience = user.experience.getXPDict(item.xp, USER_XP_PER_LEVEL);

        const character = new Character(
            'character-player-' + item.accountID.toString(),
            item.avatar.Sexe,
            item.avatar.Skin,
            item.avatar.SkinColor
        );
        const stuff = [
            item.avatar.Hair,
            item.avatar.Top,
            item.avatar.Bottom,
            item.avatar.Shoes
        ];
        character.SetEquipment(stuff);

        const statusStyle = {};
        if (item.status === 'online') {
            statusStyle.borderColor = themeManager.GetColor('success');
        } else if (item.status === 'offline') {
            statusStyle.borderColor = themeManager.GetColor('danger');
        }

        return (
            <Button style={styles.friend}>
                <View style={styles.friendInfo}>
                    <View style={[styles.frameBorder, statusStyle]}>
                        <Frame
                            style={styles.frame}
                            characters={[ character ]}
                            size={frameSize}
                            delayTime={0}
                            loadingTime={0}
                            bodyView={'topHalf'}
                        />
                    </View>

                    <View style={styles.friendInfoTitle}>
                        <Text>{item.username}</Text>
                        <Text>{friendTitle}</Text>
                    </View>
                </View>

                <View style={styles.friendDetails}>
                    <Text style={styles.level}>{friendExperience.lvl.toString()}</Text>
                </View>
            </Button>
        );
    }

    renderIdle = () => {
        return (
            <View>
                <Text>[Chargement...]</Text>
            </View>
        );
    }
    renderDisconnected = () => {
        return (
            <View>
                <Text>[Vous avez été déconnecté !]</Text>
            </View>
        );
    }
    renderError = () => {
        return (
            <View>
                <Text>[Error]</Text>
            </View>
        );
    }
}

export default MultiplayerPanel;
