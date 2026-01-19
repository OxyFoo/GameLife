import React from 'react';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';

/**
 * @typedef {import('react-native').View} View
 *
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Multiplayer').Friend} Friend
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Multiplayer').UserOnline} UserOnline
 *
 * @typedef {import('@oxyfoo/gamelife-types').LeaderboardPlayer} LeaderboardPlayer
 * @typedef {import('@oxyfoo/gamelife-types').LeaderboardPeriodType} LeaderboardPeriodType
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
        friendsPending: [],

        /** @type {'loading' | 'loaded' | 'error-connection' | 'error-server'} */
        loadingState: 'loading',

        /** @type {string} */
        search: '',

        /** @type {LeaderboardPlayer[]} */
        players: [],

        /** @type {LeaderboardPlayer | null} */
        selfPlayer: null,

        /** @type {LeaderboardPeriodType} */
        periodType: 'weekly',

        /** @type {number} */
        periodStart: 0
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

    /** @type {Symbol | null} */
    listenerTcpState = null;

    componentDidMount() {
        this.updateOnlineState();
        this.updateFriends(user.multiplayer.friends.Get());
        this.listenerTcpStateChange = user.server2.tcp.state.AddListener(this.updateOnlineState);
        this.listenerDeviceAuthStateChange = user.server2.deviceAuth.state.AddListener(this.updateOnlineState);
        this.listenerUserAuthEmail = user.server2.userAuth.email.AddListener(this.updateOnlineState);
        this.listenerFriends = user.multiplayer.friends.AddListener(this.updateFriends);
        this.listenerTcpState = user.server2.tcp.state.AddListener(this.onTcpStateChange);
        this.fetchLeaderboard();
    }

    componentWillUnmount() {
        user.server2.tcp.state.RemoveListener(this.listenerTcpStateChange);
        user.server2.deviceAuth.state.RemoveListener(this.listenerDeviceAuthStateChange);
        user.server2.userAuth.email.RemoveListener(this.listenerUserAuthEmail);
        user.multiplayer.friends.RemoveListener(this.listenerFriends);
        user.server2.tcp.state.RemoveListener(this.listenerTcpState);
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

    onTcpStateChange = () => {
        const tcpState = user.server2.tcp.state.Get();
        if (tcpState !== 'connected') {
            this.Back();
        }
    };

    /** @param {LeaderboardPeriodType} [periodType] */
    fetchLeaderboard = async (periodType) => {
        this.setState({ loadingState: 'loading' });

        const requestPeriodType = periodType ?? this.state.periodType;

        const response = await user.server2.tcp.SendAndWait({
            action: 'get-leaderboard',
            periodType: requestPeriodType
        });

        // Erreur de connexion
        if (response === 'interrupted' || response === 'not-sent' || response === 'timeout') {
            this.setState({ loadingState: 'error-connection' });
            return;
        }

        // Erreur serveur
        if (response.status !== 'get-leaderboard' || response.result === 'error') {
            this.setState({ loadingState: 'error-server' });
            return;
        }

        this.setState({
            loadingState: 'loaded',
            players: response.result.players,
            selfPlayer: response.result.self,
            periodType: response.result.periodType,
            periodStart: response.result.periodStart
        });
    };

    /** @param {LeaderboardPeriodType} periodType */
    onChangePeriodType = (periodType) => {
        if (periodType !== this.state.periodType) {
            this.setState({ periodType });
            this.fetchLeaderboard(periodType);
        }
    };

    /** @param {string} search */
    onChangeSearch = (search) => {
        this.setState({ search });
    };

    getFilteredPlayers = () => {
        const { search, players } = this.state;
        const searchLower = search.trim().toLowerCase();

        if (searchLower === '') {
            return players;
        }

        return players.filter((player) => player.username.toLowerCase().includes(searchLower));
    };

    Back = () => {
        user.interface.BackHandle();
    };

    goToFriends = () => {
        user.interface.ChangePage('friends');
    };
}

export default BackMultiplayer;
