import * as React from 'react';
import { FlatList } from 'react-native';

import styles from './style';
import langManager from 'Managers/LangManager';

import { Text, UserOnlineElement } from 'Interface/Components';

/**
 * @typedef {import('Types/Data/User/Multiplayer').Friend} Friend
 * @typedef {import('Types/Data/User/Multiplayer').UserOnline} UserOnline
 * @typedef {import('react-native').ListRenderItem<Friend | UserOnline>} ListRenderItemFriends
 */

/**
 * @param {Object} param0
 * @param {Object} [param0.style]
 * @param {(Friend | UserOnline)[]} param0.friends
 * @returns {JSX.Element}
 */
const OnlineFriends = ({ style, friends }) => {
    return (
        <FlatList
            style={[styles.flatList, style]}
            data={friends}
            keyExtractor={(item) => 'multi-player-' + item.accountID}
            renderItem={FriendItem}
            ListEmptyComponent={RenderEmpty}
        />
    );
};

const RenderEmpty = () => {
    const lang = langManager.curr['multiplayer'];

    return <Text>{lang['container-friends-empty']}</Text>;
};

/**
 * @type {ListRenderItemFriends}
 */
const FriendItem = ({ item: friend }) => {
    return <UserOnlineElement style={styles.item} friend={friend} />;
};

export default OnlineFriends;
