import { IUserClass } from 'Types/Interface/IUserClass';
import DynamicVar from 'Utils/DynamicVar';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/Class/NotificationsInApp').NotificationInApp<*>} NotificationInApp
 */

class NotificationsInApp extends IUserClass {
    /** @type {UserManager} */
    #user;

    /** @type {DynamicVar<NotificationInApp[]>} */
    // eslint-disable-next-line prettier/prettier
    notifications = new DynamicVar(/** @type {NotificationInApp[]} */ ([]));

    /** @type {Symbol | null} */
    #listenerAchievements = null;

    /** @param {UserManager} user */
    constructor(user) {
        super('notifications-in-app');

        this.#user = user;
    }

    Initialize = () => {
        this.#loadAllAchievements();
        this.#listenerAchievements = this.#user.achievements.achievements.AddListener(this.#loadAllAchievements);
    };

    Unmount = () => {
        this.#user.achievements.achievements.RemoveListener(this.#listenerAchievements);
    };

    #loadAllAchievements = () => {
        const allNotifs = [...this.#user.achievements.GetNotifications()];
        this.notifications.Set(allNotifs.sort((a, b) => b.timestamp - a.timestamp));
    };

    Clear = () => {
        this.notifications.Set([]);
    };
}

export default NotificationsInApp;
