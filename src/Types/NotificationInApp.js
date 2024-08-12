/**
 * @typedef {import('Managers/LangManager').LangKey} LangKey
 *
 * @typedef {'friend-pending' | 'achievement-pending' | 'global-message'} NotificationInAppTypes
 * @typedef {object} NotificationInAppValue
 * @property {NIA_FriendPending} friend-pending
 * @property {NIA_AchievementPending} achievement-pending
 * @property {NIA_GlobalMessage} global-message
 *
 * @typedef {object} NIA_FriendPending
 * @property {number} accountID
 * @property {string} username
 *
 * @typedef {object} NIA_AchievementPending
 * @property {number} achievementID
 *
 * @typedef {object} NIA_GlobalMessage
 * @property {number} ID Unique ID in the database
 * @property {{ [key in LangKey]: string }} message
 * @property {'none' | 'can-respond' | 'must-respond' | 'open-page' | 'open-link' | 'reward-ox' | 'reward-chest'} action
 * @property {string | number} data Represent page name, link, reward index or Ox number
 */

/**
 * @template {NotificationInAppTypes} T
 */
class NotificationInApp {
    /**
     * @param {T} type
     * @param {NotificationInAppValue[T]} data
     */
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }

    /**
     * @type {NotificationInAppTypes}
     * @readonly
     */
    type;

    /** @type {NotificationInAppValue[T]} */
    data;

    /** @type {number} Unix timestamp in seconds (UTC) */
    timestamp = 0;
}

export { NotificationInApp };
