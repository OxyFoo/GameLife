/**
 * @typedef {'friend-pending' | 'achievement-pending'} NotificationInAppTypes
 * @typedef {object} NotificationInAppValue
 * @property {NIA_FriendPending} friend-pending
 * @property {NIA_AchievementPending} achievement-pending
 * 
 * @typedef {object} NIA_FriendPending
 * @property {number} accountID
 * @property {string} username
 * 
 * @typedef {object} NIA_AchievementPending
 * @property {number} achievementID
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

    /** @type {number} */
    timestamp;

    /** @type {boolean} */
    read;
}

export { NotificationInApp };
