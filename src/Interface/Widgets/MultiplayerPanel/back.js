import * as React from 'react';

import user from 'Managers/UserManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 * 
 * @typedef {import('Types/Friend').Friend} Friend
 * @typedef {import('Types/TCP').ConnectionState} ConnectionState
 */

const MultiplayerPanelProps = {
    /** @type {StyleViewProp} */
    style: {},

    /** @type {boolean} Hide the panel when the user is offline, disconnected or TCP crash */
    hideWhenOffline: false
};

class BackMultiplayerPanel extends React.Component {
    state = {
        /** @type {ConnectionState} */
        state: 'idle',

        /** @type {Array<Friend>} */
        friends: []
    }

    componentDidMount() {
        this.updateState(user.tcp.state.Get());
        this.updateFriends(user.multiplayer.friends.Get());
        this.listenerState = user.tcp.state.AddListener(this.updateState);
        this.listenerFriends = user.multiplayer.friends.AddListener(this.updateFriends);
    }

    componentWillUnmount() {
        user.tcp.state.RemoveListener(this.listenerState);
        user.multiplayer.friends.RemoveListener(this.listenerFriends);
    }

    /** @param {ConnectionState} state */
    updateState = (state) => {
        if (state !== this.state.state) {
            this.setState({ state });
        }
    }

    /** @param {Array<Friend>} friends */
    updateFriends = (friends) => {
        const newFriends = friends
            .filter(friend => friend.friendshipState === 'accepted')
            .filter(friend => friend.status === 'online')
            .slice(0, 5);
        this.setState({ friends: newFriends });
    }

    openMultiplayer = () => {
        user.interface.ChangePage('multiplayer');
    }
    Reconnect = () => {
        this.setState({ state: 'idle' });
        user.tcp.Connect();
    }
}

BackMultiplayerPanel.prototype.props = MultiplayerPanelProps;
BackMultiplayerPanel.defaultProps = MultiplayerPanelProps;

export default BackMultiplayerPanel;
