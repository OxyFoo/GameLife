import React from 'react';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { FRIENDS_LIMIT } from 'Data/User/Multiplayer';

/**
 * @typedef {import('react-native').View} View
 *
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Multiplayer').Friend} Friend
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Multiplayer').UserOnline} UserOnline
 */

class BackMultiplayer extends PageBase {
    static feShowUserHeader = true;
    static feShowNavBar = true;

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

    /** @type {React.RefObject<View | null>} */
    refAddButton = React.createRef();

    /** @type {Symbol | null} */
    listenerTcpStateChange = null;

    /** @type {Symbol | null} */
    listenerDeviceAuthStateChange = null;

    /** @type {Symbol | null} */
    listenerUserAuthEmail = null;

    /** @type {Symbol | null} */
    listenerFriends = null;

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

    goToFriends = () => {
        user.interface.ChangePage('friends');
    };

    addFriendHandle = () => {
        const lang = langManager.curr['multiplayer'];

        // Check friends limits
        const totalFriends = user.multiplayer.Get().length;
        if (totalFriends >= FRIENDS_LIMIT) {
            const langPopup = lang['alert-too-friends'];

            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: langPopup['title'],
                    message: langPopup['message']
                }
            });

            return;
        }

        // Ask friend name
        user.interface.screenInput?.Open({
            label: lang['input-search-friend'],
            initialText: '',
            callback: async (username) => {
                const result = await user.multiplayer.AddFriend(username);
                if (result === 'canceled') {
                    return;
                }

                /**
                 * @param {{ title: string, message: string }} texts
                 * @param {string | null} [additionnal]
                 */
                const ShowPopup = (texts, additionnal = null) => {
                    const title = texts.title;
                    let message = texts.message;
                    if (additionnal !== null) {
                        message = message.replace('{}', additionnal);
                    }
                    user.interface.popup?.OpenT({
                        type: 'ok',
                        data: { title, message }
                    });
                };

                if (result === 'not-found') {
                    ShowPopup(lang['alert-friend-notfound'], username);
                } else if (result === 'self') {
                    // Update achievement
                    user.informations.achievementSelfFriend = true;
                    ShowPopup(lang['alert-friend-self']);
                } else if (result === 'already-friend' || result === 'already-pending') {
                    ShowPopup(lang['alert-already-friend'], username);
                } else if (result === 'blocked') {
                    ShowPopup(lang['alert-friend-blocked'], username);
                } else if (result === 'ok') {
                    ShowPopup(lang['alert-friend-added'], username);
                } else {
                    ShowPopup(lang['alert-error'], result);
                }
            }
        });
    };

    Back = () => {
        user.interface.BackHandle();
    };
}

export default BackMultiplayer;
