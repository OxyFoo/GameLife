import * as React from 'react';

import user from 'Managers/UserManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 *
 * @typedef {import('Interface/OldComponents/Container').default} Container
 * @typedef {import('Types/Features/UserOnline').Friend} Friend
 * @typedef {import('Types/TCP/GameLife/Request').ConnectionState} ConnectionState
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
    };

    /** @type {React.RefObject<Container>} */
    refContainer = React.createRef();

    componentDidMount() {
        this.updateState(user.server2.tcp.state.Get());
        this.updateFriends(user.multiplayer.friends.Get());
        this.listenerState = user.server2.tcp.state.AddListener(this.updateState);
        this.listenerFriends = user.multiplayer.friends.AddListener(this.updateFriends);
    }

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
        if (state !== this.state.state) {
            this.setState({ state });
        }
    };

    /** @param {Array<Friend>} friends */
    updateFriends = (friends) => {
        const newFriends = friends
            .filter((friend) => friend.friendshipState === 'accepted')
            .filter((friend) => friend.status === 'online')
            .slice(0, 5);
        this.setState({ friends: newFriends });
    };

    openMultiplayer = () => {
        user.interface.ChangePage('multiplayer');
    };
    Reconnect = () => {
        console.log('Reconnect');
        this.setState({ state: 'idle' });
        // user.server2.tcp.Connect(); // NOT HERE
    };
}

BackMultiplayerPanel.prototype.props = MultiplayerPanelProps;
BackMultiplayerPanel.defaultProps = MultiplayerPanelProps;

export default BackMultiplayerPanel;
