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
        state: 'waiting',

        /** @type {Array<Friend>} */
        friends: []
    }

    componentDidMount() {
        this.listener = user.multiplayer.state.AddListener((state) => {
            const newState = { state };
            if (state === 'connected') {
                newState.friends = user.multiplayer.friends;
            }
            this.setState(newState);
        });
    }

    componentWillUnmount() {
        user.multiplayer.state.RemoveListener(this.listener);
    }
}

BackMultiplayerPanel.prototype.props = MultiplayerPanelProps;
BackMultiplayerPanel.defaultProps = MultiplayerPanelProps;

export default BackMultiplayerPanel;
