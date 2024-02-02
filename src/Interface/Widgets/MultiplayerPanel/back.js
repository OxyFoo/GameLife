import user from 'Managers/UserManager';
import * as React from 'react';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 * 
 * @typedef {import('Types/Friend').Friend} Friend
 * @typedef {import('Class/Multiplayer').ConnectionState} ConnectionState
 * @typedef {import('Interface/Components/Icon').Icons} Icons
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 */

const MultiplayerPanelProps = {
    /** @type {StyleViewProp} */
    style: {}
};

class BackMultiplayerPanel extends React.Component {
    state = {
        /** @type {ConnectionState} */
        state: 'idle',

        /** @type {Array<Friend>} */
        friends: []
    }

    componentDidMount() {
        this.updateState(user.multiplayer.state.Get());
        this.listener = user.multiplayer.state.AddListener((state) => {
            this.updateState(state);
        });
    }

    componentWillUnmount() {
        user.multiplayer.state.RemoveListener(this.listener);
    }

    /** @param {ConnectionState} state */
    updateState = (state) => {
        const newState = {};
        if (state !== this.state.state) {
            newState.state = state;
        }
        if (state === 'connected') {
            newState.friends = user.multiplayer.friends;
        }
        this.setState(newState);
    }

    openMultiplayer = () => {
        user.interface.ChangePage('multiplayer');
    }
    Reconnect = () => {
        this.setState({ state: 'idle' });
        user.multiplayer.Connect();
    }
}

BackMultiplayerPanel.prototype.props = MultiplayerPanelProps;
BackMultiplayerPanel.defaultProps = MultiplayerPanelProps;

export default BackMultiplayerPanel;
