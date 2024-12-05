import React from 'react';

import PageBase from 'Interface/FlowEngine/PageBase';
import StartMission from './mission';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @typedef {import('Interface/OldComponents/Button').default} Button
 * @typedef {import('Types/Features/UserOnline').Friend} Friend
 * @typedef {import('Types/TCP/GameLife/Request').ConnectionState} ConnectionState
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
        this.updateState(user.server2.tcp.state.Get());
        this.updateFriends(user.multiplayer.friends.Get());
        this.listenerState = user.server2.tcp.state.AddListener(this.updateState);
        this.listenerFriends = user.multiplayer.friends.AddListener(this.updateFriends);
    }

    // componentDidFocused = (args) => {
    //     StartMission.call(this, args?.missionName);
    // };

    componentWillUnmount() {
        if (this.listenerState) {
            user.server2.tcp.state.RemoveListener(this.listenerState);
        }
        if (this.listenerFriends) {
            user.multiplayer.friends.RemoveListener(this.listenerFriends);
        }
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
        user.interface.screenInput?.Open({
            label: lang['input-search-friend'],
            initialText: '',
            callback: (username) => {
                if (!username) {
                    return;
                }

                // Update mission
                user.missions.SetMissionState('mission5', 'completed');

                // Add friend
                user.multiplayer.AddFriend(username);
            }
        });
    };

    Reconnect = () => {
        this.setState({ state: 'idle' });
        // user.server2.tcp.Connect(); // NOT HERE
    };

    Back = () => {
        user.interface.BackHandle();
    };
}

export default BackMultiplayer;
