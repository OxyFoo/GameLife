import * as React from 'react';
import { FlatList, View } from 'react-native';

import styles from './style';
import BackMultiplayerPanel from './back';
import langManager from 'Managers/LangManager';

import { Container, Text, UserOnlineElement } from 'Interface/Components';

/**
 * @typedef {import('Ressources/Icons').IconsName} IconsName
 * @typedef {import('Types/Data/User/Multiplayer').Friend} Friend
 * @typedef {import('react-native').ListRenderItem<Friend>} ListRenderFriend
 */

class MultiplayerPanel extends BackMultiplayerPanel {
    render() {
        const lang = langManager.curr['multiplayer'];
        const { state } = this.state;
        const { hideWhenOffline } = this.props;

        if (state !== 'connected' && hideWhenOffline) {
            return null;
        }

        /** @type {IconsName} */
        let icon = 'loading-dots';
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
                ref={this.refContainer}
                style={this.props.style}
                styleContainer={styles.container}
                type='static'
                text={lang['container-title']}
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
        if (state === 'disconnected') return this.renderDisconnected();
        else if (state === 'idle') return this.renderIdle();
        else if (state === 'error') return this.renderError();

        return (
            <FlatList
                data={this.state.friends}
                keyExtractor={(item) => `multi-player-${item.accountID}`}
                ListEmptyComponent={this.renderEmpty}
                renderItem={({ item }) => <UserOnlineElement friend={item} />}
            />
        );
    };

    renderEmpty = () => {
        const lang = langManager.curr['multiplayer'];

        return (
            <View>
                <Text style={styles.containerText}>{lang['container-content-empty']}</Text>
            </View>
        );
    };

    renderIdle = () => {
        const lang = langManager.curr['multiplayer'];

        return (
            <View>
                <Text style={styles.containerText}>{lang['container-content-idle']}</Text>
            </View>
        );
    };
    renderDisconnected = () => {
        const lang = langManager.curr['multiplayer'];

        return (
            <View>
                <Text style={styles.containerText}>{lang['container-content-disconnected']}</Text>
            </View>
        );
    };
    renderError = () => {
        const lang = langManager.curr['multiplayer'];

        return (
            <View>
                <Text style={styles.containerText}>{lang['container-content-error']}</Text>
            </View>
        );
    };
}

export default MultiplayerPanel;
