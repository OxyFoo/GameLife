import * as React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import BackMultiplayer from './back';
import langManager from 'Managers/LangManager';

import { Button, Page, Text, UserOnlineElement } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';
import { FRIENDS_LIMIT } from 'Class/Multiplayer';

class Multiplayer extends BackMultiplayer {
    render() {
        return (
            <Page
                ref={ref => this.refPage = ref}
                overlay={this.renderAddButton()}
                bottomOffset={64}
                canScrollOver
            >
                <PageHeader onBackPress={this.Back} />
                {this.renderContent()}
            </Page>
        );
    }

    renderAddButton = () => {
        const { state, friends, friendsPending } = this.state;

        if (state !== 'connected') {
            return null;
        }

        return (
            <>
                <Button
                    style={styles.classementButton}
                    color='main1'
                    icon='world'
                    borderRadius={12}
                    onPress={this.openClassement}
                />
                {friends.length + friendsPending.length < FRIENDS_LIMIT && (
                    <Button
                        style={styles.addFriendButton}
                        color='main2'
                        icon='userAdd'
                        borderRadius={12}
                        onPress={this.addFriendHandle}
                    />
                )}
            </>
        );
    }

    renderContent = () => {
        const lang = langManager.curr['multiplayer'];
        const { state, friends, friendsPending } = this.state;

        if (state === 'disconnected')   return this.renderDisconnected();
        else if (state === 'idle')      return this.renderLoading();
        else if (state === 'error')     return this.renderError();

        return (
            <View>
                <Text fontSize={24}>{lang['category-friend']}</Text>
                <FlatList
                    style={styles.flatList}
                    data={friends}
                    keyExtractor={(item, index) => 'multi-player-' + item.accountID}
                    renderItem={({ item, index }) => (
                        <UserOnlineElement friend={item} />
                    )}
                    ListEmptyComponent={this.renderEmpty}
                />

                {friendsPending.length > 0 && (
                    <>
                        <Text style={styles.topMargin} fontSize={24}>{lang['category-friend-pending']}</Text>
                        <FlatList
                            style={styles.flatList}
                            data={friendsPending}
                            keyExtractor={(item, index) => 'multi-player-' + item.accountID}
                            renderItem={({ item, index }) => (
                                <UserOnlineElement friend={item} />
                            )}
                        />
                    </>
                )}
            </View>
        );
    }

    renderEmpty = () => {
        const lang = langManager.curr['multiplayer'];
        return (
            <>
                <Text style={styles.firstText}>{lang['container-friends-empty']}</Text>
            </>
        );
    }

    renderLoading = () => {
        const textLoading = langManager.curr['multiplayer']['connection-loading'];
        return (
            <>
                <Text style={styles.firstText}>{textLoading}</Text>
            </>
        );
    }

    renderError = () => {
        const textFailed = langManager.curr['multiplayer']['connection-failed'];
        const textRetry = langManager.curr['multiplayer']['button-retry'];
        return (
            <>
                <Text style={styles.firstText}>{textFailed}</Text>
                <Button style={{ marginTop: 24 }} color='main1' onPress={this.Reconnect}>{textRetry}</Button>
            </>
        );
    }

    renderDisconnected = () => {
        const textFailed = langManager.curr['multiplayer']['connection-offline'];
        const textRetry = langManager.curr['multiplayer']['button-retry'];
        return (
            <>
                <Text style={styles.firstText}>{textFailed}</Text>
                <Button style={{ marginTop: 24 }} color='main1' onPress={this.Reconnect}>{textRetry}</Button>
            </>
        );
    }
}

const styles = StyleSheet.create({
    flatList: {
        marginTop: 12,
        marginHorizontal: -24
    },
    classementButton: {
        aspectRatio: 1,
        position: 'absolute',
        left: 24,
        bottom: 24,
        paddingHorizontal: 0
    },
    addFriendButton: {
        aspectRatio: 1,
        position: 'absolute',
        right: 24,
        bottom: 24,
        paddingHorizontal: 0
    },

    topMargin: {
        marginTop: 24
    },

    firstText: {
        marginTop: '45%',
        paddingHorizontal: 12,
        fontSize: 24
    }
});

export default Multiplayer;
