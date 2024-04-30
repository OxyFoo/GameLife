import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import PageBase from 'Interface/FlowEngine/PageBase';
import { Character } from 'Interface/Components';
import { GetGlobalTime } from 'Utils/Time';
import { StartActivityNow } from 'Utils/Activities';

/**
 * @typedef {import('Types/UserOnline').Friend} Friend
 * @typedef {import('Class/Experience').XPInfo} XPInfo
 * @typedef {import('Class/Experience').Stats} Stats
 */

class BackProfileFriend extends PageBase {
    state = {
        /** @type {Friend | null} */
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
    }

    /**
     * @param {object} props
     * @param {object} props.args
     * @param {number} props.args.friendID
     */
    constructor(props) {
        super(props);

        if (!props.args.hasOwnProperty('friendID') || !props.args.friendID) {
            this.Back();
            return;
        }

        const friend = user.multiplayer.GetFriendByID(props.args.friendID);
        if (friend === null) {
            this.Back();
            return;
        }

        this.state.friend = friend;
        this.state.xpInfo = user.experience.getXPDict(friend.xp, 'user');
        this.state.statsInfo = Object.assign({}, ...user.statsKey.map(i => ({
            [i]: user.experience.getXPDict(friend.stats[i], 'stat')
        })));

        if (friend.friendshipState === 'accepted') {
            if (friend.activities.firstTime) {
                this.state.activities.totalDays = Math.floor((GetGlobalTime() - friend.activities.firstTime) / (24 * 60 * 60));
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
        const stuff = [
            friend.avatar.Hair,
            friend.avatar.Top,
            friend.avatar.Bottom,
            friend.avatar.Shoes
        ];
        character.SetEquipment(stuff);
        this.character = character;
    }

    componentDidMount() {
        this.listenerTCP = user.tcp.state.AddListener(state => state !== 'connected' && this.Back());
        this.listenerFriend = user.multiplayer.friends.AddListener(this.updateFriend);
    }

    componentWillUnmount() {
        user.tcp.state.RemoveListener(this.listenerTCP);
        user.multiplayer.friends.RemoveListener(this.listenerFriend);
    }

    /** @param {Friend[]} friends */
    updateFriend = (friends) => {
        user.interface.popup.Close();

        const { friend } = this.state;
        if (friend === null) {
            this.Back();
            return;
        }

        const newFriend = friends.find(f => f.accountID === friend.accountID) || null;
        if (newFriend === null) {
            this.Back();
            return;
        }

        if (friend.friendshipState === 'accepted') {
            let totalDays = 0;
            if (friend.activities.firstTime) {
                totalDays = Math.floor((GetGlobalTime() - friend.activities.firstTime) / (24 * 60 * 60));
            }
            const statsInfo = Object.assign({}, ...user.statsKey.map(i => ({
                [i]: user.experience.getXPDict(friend.stats[i], 'stat')
            })));

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
    }

    handleStartNow = () => {
        const skillID = this.state.friend.currentActivity.skillID;
        StartActivityNow(skillID);
    }

    removeFriendHandler = () => {
        const { friend } = this.state;
        if (friend === null) return;

        const callback = (button) => {
            if (button !== 'yes') return;
            user.multiplayer.RemoveFriend(friend.accountID);
            this.Back();
        };

        const lang = langManager.curr['profile-friend'];
        const title = lang['alert-removefriend-title'];
        const text = lang['alert-removefriend-text'].replace('{}', friend.username);
        user.interface.popup.Open('yesno', [ title, text ], callback);
    }

    cancelFriendHandler = () => {
        const { friend } = this.state;
        if (friend === null) return;

        const callback = (button) => {
            if (button !== 'yes') return;
            user.multiplayer.CancelFriend(friend.accountID);
            this.Back();
        };

        const lang = langManager.curr['profile-friend'];
        const title = lang['alert-cancelfriend-title'];
        const text = lang['alert-cancelfriend-text'].replace('{}', friend.username);
        user.interface.popup.Open('yesno', [ title, text ], callback);
    }

    Back = () => {
        user.interface.BackHandle();
    }
}

export default BackProfileFriend;
