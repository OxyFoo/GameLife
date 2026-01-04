import React from 'react';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';

/**
 * @typedef {import('react-native').View} View
 *
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Multiplayer').Friend} Friend
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Multiplayer').UserOnline} UserOnline
 */

class BackMultiplayer extends PageBase {
    static feShowUserHeader = true;
    static feShowNavBar = true;
    static feKeepMounted = true;

    state = {
        /** @type {'authenticated' | 'loading' | 'offline'} */
        onlineState: 'loading',

        /** @type {Friend[]} */
        friends: [],

        /** @type {Friend[]} */
        bestFriends: [],

        /** @type {UserOnline[]} */
        friendsPending: []
    };

    /** @type {Symbol | null} */
    listenerTcpStateChange = null;

    /** @type {Symbol | null} */
    listenerDeviceAuthStateChange = null;

    /** @type {Symbol | null} */
    listenerUserAuthEmail = null;

    /** @type {Symbol | null} */
    listenerFriends = null;

    /** @type {React.RefObject<View | null>} */
    refFriendsButton = React.createRef();

    componentDidMount() {
        this.updateOnlineState();
        this.updateFriends(user.multiplayer.friends.Get());
        this.listenerTcpStateChange = user.server2.tcp.state.AddListener(this.updateOnlineState);
        this.listenerDeviceAuthStateChange = user.server2.deviceAuth.state.AddListener(this.updateOnlineState);
        this.listenerUserAuthEmail = user.server2.userAuth.email.AddListener(this.updateOnlineState);
        this.listenerFriends = user.multiplayer.friends.AddListener(this.updateFriends);
    }

    componentWillUnmount() {
        user.server2.tcp.state.RemoveListener(this.listenerTcpStateChange);
        user.server2.deviceAuth.state.RemoveListener(this.listenerDeviceAuthStateChange);
        user.server2.userAuth.email.RemoveListener(this.listenerUserAuthEmail);
        user.multiplayer.friends.RemoveListener(this.listenerFriends);
    }

    updateOnlineState = () => {
        const { onlineState } = this.state;

        const newOnlineState = user.server2.IsAuthenticated() ? 'authenticated' : 'offline';

        if (newOnlineState !== onlineState) {
            this.setState({ onlineState: newOnlineState });
        }
    };

    /** @param {(Friend | UserOnline)[]} friends */
    updateFriends = (friends) => {
        const newFriends = friends
            .filter((friend) => friend.friendshipState === 'accepted')
            .sort((a, b) => a.username.localeCompare(b.username));

        // Sort by XP
        const selfPlayer = user.multiplayer.GetSelf();
        const newBestFriends = [selfPlayer, ...newFriends].sort((a, b) => b.xp - a.xp).slice(0, 3);

        const newFriendsPending = friends
            .filter((friend) => friend.friendshipState === 'pending')
            .sort((a, b) => a.username.localeCompare(b.username));

        this.setState({
            friends: newFriends,
            bestFriends: newBestFriends,
            friendsPending: newFriendsPending
        });
    };

    goToFriends = async () => {
        await new Promise((resolve) => {
            user.interface.ChangePage('friends', {
                callback: () => resolve(null)
            });
        });
    };

    goToLeaderboard = () => {
        user.interface.ChangePage('leaderboard');
    };

    Back = () => {
        user.interface.BackHandle();
    };
}

export default BackMultiplayer;
