/**
 * @typedef {import('Class/Inventory').Sexes} Sexes
 * @typedef {import('Class/Inventory').CharactersName} CharactersName
 * @typedef {import('Ressources/items/stuffs/Stuffs').StuffID} StuffID
 * 
 * @typedef {'online' | 'offline'} ConnectionState
 * @typedef {'accepted' | 'pending' | 'blocked' | 'none'} FriendshipState
 * 
 * @typedef {Object} CurrentActivity
 * @property {number} skillID
 * @property {number} startTime In seconds, unix timestamp UTC
 * @property {number} timezone In hours
 * @property {Array<number>} friendsIDs Array of accountIDs of friends who are also doing this activity
 */

/**
 * @description Users from other accounts
 */
class UserOnline {
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

        /** @type {StuffID} */
        Hair: 'hair_01',

        /** @type {StuffID} */
        Top: 'top_01',

        /** @type {StuffID} */
        Bottom: 'bottom_01',

        /** @type {StuffID} */
        Shoes: 'shoes_01'
    };

    /** @type {FriendshipState} */
    friendshipState = 'none';

    /** @type {CurrentActivity | null} */
    currentActivity = null;
}

class Friend extends UserOnline {
    /** Defined if friendshipState is 'accepted' */
    activities = {
        /** @type {number} Number of activities */
        length: 0,

        /** @type {number} Total duration of activities in minutes */
        totalDuration: 0,

        /** @type {number} Timestamp of the first activity (in seconds, UTC) */
        firstTime: 0
    };
}

export { UserOnline, Friend };
