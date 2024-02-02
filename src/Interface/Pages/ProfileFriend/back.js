import user from 'Managers/UserManager';
import { PageBase, Character } from 'Interface/Components';
import { USER_XP_PER_LEVEL } from 'Class/Experience';

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

    Back = () => {
        user.interface.BackHandle();
    }
}

export default BackProfileFriend;
