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
    };

    /** @type {FriendshipState} */
    friendshipState = 'pending';

    activities = {
        /** @type {number} Number of activities */
        length: 0,

        /** @type {number} Total duration of activities in minutes */
        totalDuration: 0,

        /** @type {number} Timestamp of the first activity (in seconds, UTC) */
        firstTime: 0
    };
}

export { Friend };
