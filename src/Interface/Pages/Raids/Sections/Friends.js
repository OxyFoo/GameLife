import * as React from 'react';
import { View, FlatList } from 'react-native';

import styles from '../style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Button, InputText, Text, UserOnlineElement } from 'Interface/Components';
import { FormatForSearch } from 'Utils/String';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Multiplayer').Friend} Friend
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Multiplayer').UserOnline} UserOnline
 */

/** Friends tab of the raid page: search, sort, friends, pending requests and blocked users */
class Friends extends React.Component {
    state = {
        /** @type {Friend[]} */
        friends: [],

        /** @type {UserOnline[]} */
        waitingFriends: [],

        /** @type {UserOnline[]} */
        blockedFriends: [],

        search: '',
        sortIndex: 0,
        ascending: false
    };

    /** @type {Symbol | null} */
    listenerFriends = null;

    componentDidMount() {
        this.updateFriends();
        this.listenerFriends = user.multiplayer.friends.AddListener(this.updateFriends);
    }

    componentWillUnmount() {
        user.multiplayer.friends.RemoveListener(this.listenerFriends);
    }

    updateFriends = () => {
        const { search, sortIndex, ascending } = this.state;
        const searchText = FormatForSearch(search);

        /**
         * @param {Friend | UserOnline} a
         * @param {Friend | UserOnline} b
         */
        const compare = (a, b) => {
            if (sortIndex === 1) {
                return b.xp - a.xp;
            }
            if (sortIndex === 2 && a.friendshipState === 'accepted' && b.friendshipState === 'accepted') {
                return b.activities.length - a.activities.length;
            }
            if (sortIndex === 3 && a.friendshipState === 'accepted' && b.friendshipState === 'accepted') {
                return b.activities.totalDuration - a.activities.totalDuration;
            }
            return a.username.localeCompare(b.username);
        };

        /** @param {Friend | UserOnline} friend */
        const matches = (friend) => search.length === 0 || FormatForSearch(friend.username).includes(searchText);

        const friends = user.multiplayer.GetFriends().filter(matches).sort(compare);
        const waitingFriends = user.multiplayer.GetWaitingFriends().filter(matches).sort(compare);
        const blockedFriends = user.multiplayer.GetBlockedFriends().filter(matches).sort(compare);

        if (ascending) {
            friends.reverse();
            waitingFriends.reverse();
            blockedFriends.reverse();
        }

        this.setState({ friends, waitingFriends, blockedFriends });
    };

    /** @param {string} search */
    onSearchChange = (search) => {
        this.setState({ search }, this.updateFriends);
    };

    onSortPress = () => {
        const lang = langManager.curr['raids'];
        const maxIndex = lang['friends-sort-list'].length;
        this.setState({ sortIndex: (this.state.sortIndex + 1) % maxIndex }, this.updateFriends);
    };

    onAscendingPress = () => {
        this.setState({ ascending: !this.state.ascending }, this.updateFriends);
    };

    render() {
        const lang = langManager.curr['raids'];
        const { friends, waitingFriends, blockedFriends, search, sortIndex, ascending } = this.state;

        return (
            <View>
                <InputText
                    label={lang['friends-search']}
                    icon='rounded-magnifer-outline'
                    value={search}
                    onChangeText={this.onSearchChange}
                />

                <View style={styles.buttonRow}>
                    <Button
                        style={styles.buttonFilter}
                        appearance='uniform'
                        color='transparent'
                        fontColor='secondary'
                        onPress={this.onSortPress}
                    >
                        {`${lang['friends-sort']} ${lang['friends-sort-list'][sortIndex]}`}
                    </Button>
                    <Button
                        style={styles.buttonAscending}
                        appearance='uniform'
                        color='transparent'
                        fontColor='gradient'
                        icon='filter-outline'
                        iconAngle={ascending ? 180 : 0}
                        onPress={this.onAscendingPress}
                    />
                </View>

                <Text style={styles.friendsTitle} color='secondary'>
                    {lang['friends-title']}
                </Text>
                <FlatList
                    style={styles.friendsList}
                    data={friends}
                    keyExtractor={(item) => `${item.accountID}-${item.friendshipState}`}
                    renderItem={({ item }) => <UserOnlineElement style={styles.friend} friend={item} />}
                    scrollEnabled={false}
                />

                {waitingFriends.length > 0 && (
                    <Text style={styles.friendsTitle} color='secondary'>
                        {lang['friends-waiting']}
                    </Text>
                )}
                <FlatList
                    style={styles.friendsList}
                    data={waitingFriends}
                    keyExtractor={(item) => `${item.accountID}-${item.friendshipState}`}
                    renderItem={({ item }) => <UserOnlineElement style={styles.friend} friend={item} />}
                    scrollEnabled={false}
                />

                {blockedFriends.length > 0 && (
                    <Text style={styles.friendsTitle} color='secondary'>
                        {lang['friends-blocked']}
                    </Text>
                )}
                <FlatList
                    style={styles.friendsList}
                    data={blockedFriends}
                    keyExtractor={(item) => `${item.accountID}-${item.friendshipState}`}
                    renderItem={({ item }) => <UserOnlineElement style={styles.friend} friend={item} />}
                    scrollEnabled={false}
                />
            </View>
        );
    }
}

export { Friends };
