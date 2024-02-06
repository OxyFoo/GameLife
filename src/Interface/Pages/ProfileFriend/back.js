import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { PageBase, Character } from 'Interface/Components';
import { USER_XP_PER_LEVEL } from 'Class/Experience';
import { GetTime } from 'Utils/Time';

/**
 * @typedef {import('Types/Friend').Friend} Friend
 * @typedef {import('Class/Experience').XPInfo} XPInfo
 */

class BackProfileFriend extends PageBase {
    state = {
        /** @type {Friend | null} */
        friend: null,

        /** @type {XPInfo | null} */
        xpInfo: null
    }

    /**
     * @param {object} props
     * @param {object} props.args
     * @param {Friend} props.args.friend
     */
    constructor(props) {
        super(props);

        if (!props.args.hasOwnProperty('friend') || !props.args.friend) {
            this.Back();
            return;
        }

        const friend = props.args.friend;
        this.state.friend = friend;
        this.state.xpInfo = user.experience.getXPDict(friend.xp, USER_XP_PER_LEVEL);

        this.totalDays = Math.floor((GetTime() - friend.activities.firstTime) / (24 * 60 * 60));
        this.activitiesLength = friend.activities.length;
        this.durationHours = Math.floor(friend.activities.totalDuration / 60);

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

    Back = () => {
        user.interface.BackHandle();
    }
}

export default BackProfileFriend;
