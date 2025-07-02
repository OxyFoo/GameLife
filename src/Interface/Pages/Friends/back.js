import PageBase from 'Interface/FlowEngine/PageBase';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { FRIENDS_LIMIT } from 'Data/User/Multiplayer';
import { FormatForSearch } from 'Utils/String';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Multiplayer').Friend} Friend
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Multiplayer').UserOnline} UserOnline
 */

const BackFriendsProps = {
    args: {}
};

class BackFriends extends PageBase {
    state = {
        /** @type {Friend[]} */
        friends: [],

        /** @type {UserOnline[]} */
        waitingFriends: [],

        /** @type {UserOnline[]} */
        blockedFriends: [],

        search: '',
        sortIndex: 0,
        ascending: false
    };

    /** @type {Symbol | null} */
    listenerFriends = null;

    componentDidMount() {
        this.updateFriends();
        this.listenerFriends = user.multiplayer.friends.AddListener(this.updateFriends);
    }

    componentWillUnmount() {
        if (this.listenerFriends) {
            user.multiplayer.friends.RemoveListener(this.listenerFriends);
        }
    }

    updateFriends = () => {
        const { search, sortIndex, ascending } = this.state;

        const searchText = FormatForSearch(search);
        const friends = user.multiplayer
            .GetFriends()
            .filter((f) => search.length === 0 || FormatForSearch(f.username).includes(searchText))
            .sort((a, b) => {
                if (sortIndex === 0) {
                    return a.username.localeCompare(b.username);
                } else if (sortIndex === 1) {
                    return b.xp - a.xp;
                } else if (sortIndex === 2) {
                    return b.activities.length - a.activities.length;
                } else if (sortIndex === 3) {
                    return b.activities.totalDuration - a.activities.totalDuration;
                } else {
                    return 0;
                }
            });

        const waitingFriends = user.multiplayer
            .GetWaitingFriends()
            .filter((f) => search.length === 0 || FormatForSearch(f.username).includes(searchText))
            .sort((a, b) => {
                if (sortIndex === 0) {
                    return a.username.localeCompare(b.username);
                } else if (sortIndex === 1) {
                    return b.xp - a.xp;
                } else {
                    return 0;
                }
            });

        const blockedFriends = user.multiplayer
            .GetBlockedFriends()
            .filter((f) => search.length === 0 || FormatForSearch(f.username).includes(searchText))
            .sort((a, b) => {
                if (sortIndex === 0) {
                    return a.username.localeCompare(b.username);
                } else if (sortIndex === 1) {
                    return b.xp - a.xp;
                } else {
                    return 0;
                }
            });

        if (ascending) {
            friends.reverse();
            waitingFriends.reverse();
            blockedFriends.reverse();
        }

        this.setState({ friends, waitingFriends, blockedFriends });
    };

    /** @param {string} search */
    onSearchChange = (search) => {
        this.setState({ search }, this.updateFriends);
    };

    onSortPress = () => {
        const lang = langManager.curr['friends'];
        const { sortIndex } = this.state;

        const maxIndex = lang['sort-list'].length;
        this.setState({ sortIndex: (sortIndex + 1) % maxIndex }, this.updateFriends);
    };

    onAscendingPress = () => {
        const { ascending } = this.state;
        this.setState({ ascending: !ascending }, this.updateFriends);
    };

    onAddFriendPress = () => {
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

    onBack = () => {
        user.interface.BackHandle();
    };
}

BackFriends.defaultProps = BackFriendsProps;
BackFriends.prototype.props = BackFriendsProps;

export default BackFriends;
