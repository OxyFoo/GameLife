import { PageBase } from 'Interface/Components';
import user from 'Managers/UserManager';

/**
 * @typedef {import('Types/Friend').Friend} Friend
 * @typedef {import('Class/Multiplayer').ConnectionState} ConnectionState
 */

class BackMultiplayer extends PageBase {
    state = {
        /** @type {ConnectionState} */
        state: 'idle',

        /** @type {Array<Friend>} */
        friends: [],

        /** @type {Array<Friend>} */
        friendsPending: []
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
        const newState = { state, friends: [] };
        if (state === 'connected') {
            newState.friends = user.multiplayer.friends
                .filter(friend => friend.friendshipState === 'accepted')
                .sort((a, b) => a.username.localeCompare(b.username));
            newState.friendsPending = user.multiplayer.friends
                .filter(friend => friend.friendshipState === 'pending')
                .sort((a, b) => a.username.localeCompare(b.username));
        }
        this.setState(newState);
    }

    addFriendHandle = () => {
        user.interface.screenInput.Open('[Ajouter un ami]', '', (username) => {
            user.multiplayer.AddFriend(username);
        }, false);
    }

    Reconnect = () => {
        this.setState({ state: 'idle' });
        user.multiplayer.Connect();
    }

    Back = () => {
        user.interface.BackHandle();
    }
}

export default BackMultiplayer;
