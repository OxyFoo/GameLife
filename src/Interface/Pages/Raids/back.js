import React from 'react';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { FRIENDS_LIMIT } from 'Data/User/Multiplayer';

/**
 * @typedef {import('react-native').View} View
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidLeaderboardPlayer} RaidLeaderboardPlayer
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidFeedEvent} RaidFeedEvent
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidHistoryEntry} RaidHistoryEntry
 *
 * @typedef {'loading' | 'loaded' | 'error-connection' | 'error-server'} LoadingState
 */

const BackRaidsProps = {
    args: {}
};

class BackRaids extends PageBase {
    static feShowUserHeader = true;
    static feShowNavBar = true;
    // The season landscape is the page background and must run behind the header: the page owns the
    // whole height and pads its own content by the header height (see render).
    static feHeaderOverlay = true;
    static feKeepMounted = true;

    state = {
        /** @type {'authenticated' | 'offline'} */
        onlineState: 'offline',

        /** @type {number} 0 ranking, 1 friends, 2 feed */
        tab: 0,

        /** @type {LoadingState} */
        leaderboardState: 'loading',

        /** @type {RaidLeaderboardPlayer[]} */
        players: [],

        /** @type {RaidLeaderboardPlayer | null} */
        selfPlayer: null,

        /** @type {LoadingState} */
        feedState: 'loading',

        /** @type {RaidFeedEvent[]} */
        feed: [],

        /** @type {RaidHistoryEntry | null} Last settled season (heroes' rest face of the card) */
        lastSeason: null
    };

    /** @type {Symbol | null} */
    listenerTcpStateChange = null;

    /** @type {Symbol | null} */
    listenerDeviceAuthStateChange = null;

    /** @type {Symbol | null} */
    listenerUserAuthEmail = null;

    /** @type {React.RefObject<View | null>[]} Cells of the tabs, targets of the tutorial */
    refTabs = [React.createRef(), React.createRef(), React.createRef()];

    /** @type {React.RefObject<View | null>} */
    refAddFriendButton = React.createRef();

    componentDidMount() {
        this.listenerTcpStateChange = user.server2.tcp.state.AddListener(this.refreshOnlineState);
        this.listenerDeviceAuthStateChange = user.server2.deviceAuth.state.AddListener(this.refreshOnlineState);
        this.listenerUserAuthEmail = user.server2.userAuth.email.AddListener(this.refreshOnlineState);
        this.componentDidFocused(this.props);
    }

    componentWillUnmount() {
        user.server2.tcp.state.RemoveListener(this.listenerTcpStateChange);
        user.server2.deviceAuth.state.RemoveListener(this.listenerDeviceAuthStateChange);
        user.server2.userAuth.email.RemoveListener(this.listenerUserAuthEmail);
    }

    /** @param {this['props']} props */
    componentDidFocused(props) {
        props;

        // A state change made while the page was not focused was not rendered: refresh now
        this.updateOnlineState(true);

        if (user.server2.IsAuthenticated()) {
            user.raids.LoadOnline().then(() => {
                this.loadTab(this.state.tab);
                this.loadLastSeason();
            });
        }
    }

    refreshOnlineState = () => this.updateOnlineState(false);

    /** @param {boolean} force Re-render even when nothing changed (the page was not focused) */
    updateOnlineState = (force) => {
        const newOnlineState = user.server2.IsAuthenticated() ? 'authenticated' : 'offline';
        if (force === true || newOnlineState !== this.state.onlineState) {
            this.setState({ onlineState: newOnlineState });
        }
    };

    /** @param {number} index */
    setTab = (index) => {
        this.setState({ tab: index }, () => this.loadTab(index));
    };

    /** @param {number} tab */
    loadTab = (tab) => {
        if (tab === 0) {
            this.fetchLeaderboard();
        } else if (tab === 2) {
            this.fetchFeed();
        }
    };

    fetchLeaderboard = async () => {
        this.setState({ leaderboardState: 'loading' });
        const result = await user.raids.LoadLeaderboard();
        if (typeof result === 'string') {
            this.setState({ leaderboardState: result });
            return;
        }
        this.setState({ leaderboardState: 'loaded', players: result.players, selfPlayer: result.self });
    };

    fetchFeed = async () => {
        this.setState({ feedState: 'loading' });
        const result = await user.raids.LoadFeed();
        if (typeof result === 'string') {
            this.setState({ feedState: result });
            return;
        }
        this.setState({ feedState: 'loaded', feed: result.events });
    };

    /**
     * Last settled season, shown under the heroes' rest face. Loaded again once its reward is taken
     * from the card: the reward state lives in the history, not in the raid payload.
     */
    loadLastSeason = async () => {
        const status = user.raids.GetStatus();
        if (status !== 'heroes-rest' && status !== 'no-season' && status !== 'ended') {
            return;
        }
        const result = await user.raids.LoadHistory();
        if (typeof result !== 'string') {
            this.setState({ lastSeason: result.seasons[0] ?? null });
        }
    };

    openLeaderboardInfo = () => {
        const lang = langManager.curr['raids'];
        user.interface.popup?.OpenT({
            type: 'ok',
            data: { title: lang['leaderboard-info-title'], message: lang['leaderboard-info-message'] }
        });
    };

    openFeedInfo = () => {
        const lang = langManager.curr['raids'];
        user.interface.popup?.OpenT({
            type: 'ok',
            data: { title: lang['feed-info-title'], message: lang['feed-info-message'] }
        });
    };

    openDetails = () => {
        user.interface.ChangePage('raid_details', { args: { tab: 0 } });
    };

    /** Same flow as the former Friends page (tutorial mission 3 ends here) */
    onAddFriendPress = () => {
        const lang = langManager.curr['multiplayer'];

        // Check friends limits
        const totalFriends = user.multiplayer.Get().length;
        if (totalFriends >= FRIENDS_LIMIT) {
            const langPopup = lang['alert-too-friends'];
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title: langPopup['title'], message: langPopup['message'] }
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
                    user.interface.popup?.OpenT({ type: 'ok', data: { title, message } });
                };

                if (result === 'not-found') {
                    ShowPopup(lang['alert-friend-notfound'], username);
                } else if (result === 'self') {
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
}

BackRaids.defaultProps = BackRaidsProps;
BackRaids.prototype.props = BackRaidsProps;

export default BackRaids;
