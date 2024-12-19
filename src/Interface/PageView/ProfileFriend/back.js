import React from 'react';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Character } from 'Interface/Components';
import { GetGlobalTime } from 'Utils/Time';
import { StartActivityNow } from 'Utils/Activities';

/**
 * @typedef {import('Types/Data/User/Multiplayer').Friend} Friend
 * @typedef {import('Types/Data/User/Multiplayer').UserOnline} UserOnline
 * @typedef {import('Types/Class/Experience').XPInfo} XPInfo
 * @typedef {import('Types/Class/Experience').Stats} Stats
 */

const BackProfileFriendProps = {
    /** @type {number} */
    friendID: 0
};

class BackProfileFriend extends React.Component {
    state = {
        /** @type {Friend | UserOnline | null} */
        friend: null,

        /** @type {XPInfo | null} */
        xpInfo: null,

        /** @type {Stats} */
        statsInfo: user.experience.GetEmptyExperience(),

        activities: {
            totalDays: 0,
            activitiesLength: 0,
            durationHours: 0
        }
    };

    /** @type {Symbol | null} */
    listenerTCP = null;

    /** @type {Symbol | null} */
    listenerFriend = null;

    /** @param {BackProfileFriendProps} props */
    constructor(props) {
        super(props);

        if (!props.hasOwnProperty('friendID') || (!props.friendID && props.friendID !== 0)) {
            this.Back();
            return;
        }

        const friend =
            props.friendID !== 0 ? user.multiplayer.GetFriendByID(props.friendID) : user.multiplayer.GetSelf();
        if (friend === null) {
            this.Back();
            return;
        }

        this.state.friend = friend;
        this.state.xpInfo = user.experience.getXPDict(friend.xp, 'user');
        if (friend.friendshipState === 'accepted') {
            this.state.statsInfo = Object.assign(
                {},
                ...user.experience.statsKey.map((i) => ({
                    [i]: user.experience.getXPDict(friend.stats[i], 'stat')
                }))
            );
        }

        if (friend.friendshipState === 'accepted') {
            if (friend.activities.firstTime) {
                this.state.activities.totalDays = Math.floor(
                    (GetGlobalTime() - friend.activities.firstTime) / (24 * 60 * 60)
                );
            }
            this.state.activities.activitiesLength = friend.activities.length;
            this.state.activities.durationHours = Math.floor(friend.activities.totalDuration / 60);
        }

        const character = new Character(
            'character-player-' + friend.accountID.toString(),
            friend.avatar.Sexe,
            friend.avatar.Skin,
            friend.avatar.SkinColor
        );
        const stuff = [friend.avatar.Hair, friend.avatar.Top, friend.avatar.Bottom, friend.avatar.Shoes];
        character.SetEquipment(stuff);
        this.character = character;
    }

    componentDidMount() {
        this.listenerTCP = user.server2.tcp.state.AddListener((state) => state !== 'connected' && this.Back());
        this.listenerFriend = user.multiplayer.friends.AddListener(this.updateFriend);
    }

    componentWillUnmount() {
        user.server2.tcp.state.RemoveListener(this.listenerTCP);
        user.multiplayer.friends.RemoveListener(this.listenerFriend);
    }

    /** @param {(Friend | UserOnline)[]} friends */
    updateFriend = (friends) => {
        const { friend } = this.state;
        if (friend === null) {
            this.Back();
            return;
        }

        const newFriend = friends.find((f) => f.accountID === friend.accountID) || null;
        if (newFriend === null) {
            this.Back();
            return;
        }

        if (friend.friendshipState === 'accepted') {
            let totalDays = 0;
            if (friend.activities.firstTime) {
                totalDays = Math.floor((GetGlobalTime() - friend.activities.firstTime) / (24 * 60 * 60));
            }
            const statsInfo = Object.assign(
                {},
                ...user.experience.statsKey.map((i) => ({
                    [i]: user.experience.getXPDict(friend.stats[i], 'stat')
                }))
            );

            this.setState({
                friend: newFriend,
                statsInfo: statsInfo,
                activities: {
                    totalDays: totalDays,
                    activitiesLength: friend.activities.length,
                    durationHours: Math.floor(friend.activities.totalDuration / 60)
                }
            });
            return;
        }

        this.setState({ friend: newFriend });
    };

    handleStartNow = () => {
        const { friend } = this.state;
        if (!friend || friend.friendshipState !== 'accepted' || friend.currentActivity === null) {
            return;
        }

        const skillID = friend.currentActivity.skillID;
        StartActivityNow(skillID);
    };

    removeFriendHandler = () => {
        const { friend } = this.state;
        if (friend === null) return;

        const lang = langManager.curr['profile-friend'];
        user.interface.popup?.OpenT({
            type: 'yesno',
            data: {
                title: lang['alert-removefriend-title'],
                message: lang['alert-removefriend-message'].replace('{}', friend.username)
            },
            callback: (button) => {
                if (button !== 'yes') return;
                user.multiplayer.RemoveFriend(friend.accountID);
                this.Back();
            }
        });
    };

    cancelFriendHandler = () => {
        const { friend } = this.state;
        if (friend === null) return;

        const lang = langManager.curr['profile-friend'];
        user.interface.popup?.OpenT({
            type: 'yesno',
            data: {
                title: lang['alert-cancelfriend-title'],
                message: lang['alert-cancelfriend-message'].replace('{}', friend.username)
            },
            callback: async (button) => {
                if (button !== 'yes') {
                    return;
                }

                const cancelStatus = await user.multiplayer.CancelFriend(friend.accountID);

                if (cancelStatus !== 'ok') {
                    const langMulti = langManager.curr['multiplayer'];
                    user.interface.popup?.OpenT({
                        type: 'ok',
                        data: {
                            title: langMulti['alert-error']['title'],
                            message: langMulti['alert-error']['message'].replace('{}', cancelStatus)
                        }
                    });
                    return;
                }
            }
        });
    };

    unblockFriendHandler = () => {
        const { friend } = this.state;
        if (friend === null) return;

        const lang = langManager.curr['profile-friend'];
        user.interface.popup?.OpenT({
            type: 'yesno',
            data: {
                title: lang['alert-unblockfriend-title'],
                message: lang['alert-unblockfriend-message'].replace('{}', friend.username)
            },
            callback: async (button) => {
                if (button !== 'yes') {
                    return;
                }

                const unblockStatus = await user.multiplayer.UnblockFriend(friend.accountID);

                if (unblockStatus === false) {
                    const langMulti = langManager.curr['multiplayer'];
                    user.interface.popup?.OpenT({
                        type: 'ok',
                        data: {
                            title: langMulti['alert-error']['title'],
                            message: langMulti['alert-error']['message'].replace('{}', 'unblock-failed')
                        }
                    });
                    return;
                }
            }
        });
    };

    Back = () => {
        user.interface.BackHandle();
    };
}

BackProfileFriend.defaultProps = BackProfileFriendProps;
BackProfileFriend.prototype.props = BackProfileFriendProps;

export default BackProfileFriend;
