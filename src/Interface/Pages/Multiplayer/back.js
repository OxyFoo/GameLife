import { PageBase } from 'Interface/Components';
import user from 'Managers/UserManager';

/**
 * @typedef {import('Types/Friend').Friend} Friend
 * @typedef {import('Types/TCP').ConnectionState} ConnectionState
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
        this.setState({ state });
    }

    /** @param {Array<Friend>} friends */
    updateFriends = (friends) => {
        const newFriends = friends
            .filter(friend => friend.friendshipState === 'accepted')
            .sort((a, b) => a.username.localeCompare(b.username));

        const newFriendsPending = friends
            .filter(friend => friend.friendshipState === 'pending')
            .sort((a, b) => a.username.localeCompare(b.username));

        this.setState({ friends: newFriends, friendsPending: newFriendsPending });
    }

    addFriendHandle = () => {
        user.interface.screenInput.Open('[Ajouter un ami]', '', (username) => {
            user.multiplayer.AddFriend(username);
        }, false);
    }

    Reconnect = () => {
        this.setState({ state: 'idle' });
        user.tcp.Connect();
    }

    Back = () => {
        user.interface.BackHandle();
    }
}

export default BackMultiplayer;
