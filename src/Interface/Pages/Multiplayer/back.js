import React from 'react';

import PageBase from 'Interface/FlowEngine/PageBase';
import StartMission from './mission';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @typedef {import('Interface/OldComponents/Button').default} Button
 * @typedef {import('Types/UserOnline').Friend} Friend
 * @typedef {import('Types/TCP').ConnectionState} ConnectionState
 */

class BackMultiplayer extends PageBase {
    static feShowNavBar = true;

    state = {
        /** @type {ConnectionState} */
        state: 'idle',

        /** @type {Array<Friend>} */
        friends: [],

        /** @type {Array<Friend>} */
        friendsPending: []
    };

    /** @type {React.RefObject<Button>} */
    refAddButton = React.createRef();

    componentDidMount() {
        this.updateState(user.tcp.state.Get());
        this.updateFriends(user.multiplayer.friends.Get());
        this.listenerState = user.tcp.state.AddListener(this.updateState);
        this.listenerFriends = user.multiplayer.friends.AddListener(this.updateFriends);
    }

    componentDidFocused = (args) => {
        StartMission.call(this, args?.missionName);
    };

    componentWillUnmount() {
        user.tcp.state.RemoveListener(this.listenerState);
        user.multiplayer.friends.RemoveListener(this.listenerFriends);
    }

    /** @param {ConnectionState} state */
    updateState = (state) => {
        this.setState({ state });
    };

    /** @param {Array<Friend>} friends */
    updateFriends = (friends) => {
        const newFriends = friends
            .filter((friend) => friend.friendshipState === 'accepted')
            .sort((a, b) => a.username.localeCompare(b.username));

        const newFriendsPending = friends
            .filter((friend) => friend.friendshipState === 'pending')
            .sort((a, b) => a.username.localeCompare(b.username));

        this.setState({ friends: newFriends, friendsPending: newFriendsPending });
    };

    openLeaderboard = () => {
        user.interface.ChangePage('leaderboard');
    };

    addFriendHandle = () => {
        const lang = langManager.curr['multiplayer'];
        user.interface.screenInput.Open(
            lang['input-search-friend'],
            '',
            (username) => {
                // Update mission
                user.missions.SetMissionState('mission5', 'completed');

                user.multiplayer.AddFriend(username);
            },
            false
        );
    };

    Reconnect = () => {
        this.setState({ state: 'idle' });
        user.tcp.Connect();
    };

    Back = () => {
        user.interface.BackHandle();
    };
}

export default BackMultiplayer;
