import * as React from 'react';
import { FlatList, View } from 'react-native';

import styles from './style';
import BackMultiplayerPanel from './back';

import { Container, Text, FriendElement } from 'Interface/Components';

/**
 * @typedef {import('Interface/Components/Icon').Icons} Icons
 * @typedef {import('Types/Friend').Friend} Friend
 * @typedef {import('react-native').ListRenderItem<Friend>} ListRenderFriend
 */

class MultiplayerPanel extends BackMultiplayerPanel {
    render() {
        const { state } = this.state;
        const { hideWhenOffline } = this.props;

        if (state !== 'connected' && hideWhenOffline) {
            return null;
        }

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
                data={this.state.friends}
                keyExtractor={(item, index) => 'multi-player-' + item.accountID}
                ListEmptyComponent={this.renderEmpty}
                renderItem={({ item, index }) => (
                    <FriendElement friend={item} />
                )}
            />
        );
    }

    renderEmpty = () => {
        return (
            <View>
                <Text>[Aucun ami en ligne]</Text>
            </View>
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
