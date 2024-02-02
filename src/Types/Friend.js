/**
 * @typedef {import('Class/Inventory').Sexes} Sexes
 * @typedef {import('Class/Inventory').CharactersName} CharactersName
 * @typedef {'online' | 'offline'} ConnectionState
 * @typedef {'accepted' | 'pending' | 'blocked'} FriendshipState
 */

class Friend {
    /** @type {ConnectionState} */
    status = 'offline';
    accountID = 0;
    username = '';
    title = 0;
    xp = 0;

    avatar = {
        /** @type {Sexes} */
        Sexe: 'MALE',

        /** @type {CharactersName} */
        Skin: 'skin_01',

        /** @type {number} */
        SkinColor: 1,

        /** @type {string} */
        Hair: '',

        /** @type {string} */
        Top: '',

        /** @type {string} */
        Bottom: '',

        /** @type {string} */
        Shoes: ''
    }
    /** @type {FriendshipState} */
    friendshipState = 'pending';
}

export { Friend };
