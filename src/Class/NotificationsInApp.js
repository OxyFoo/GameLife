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

    /** @type {NotificationInApp[]} */
    #tmpNotifications = [];

    /** @type {Symbol | null} */
    #listenerAchievements = null;

    /** @param {UserManager} user */
    constructor(user) {
        super('notifications-in-app');

        this.#user = user;
    }

    Initialize = () => {
        this.#updateNotifications();
        this.#listenerAchievements = this.#user.achievements.achievements.AddListener(this.#updateNotifications);
        this.#user.server2.tcp.WaitForAction('update-notifications', (response) => {
            this.#tmpNotifications = response.notifications;
            this.#updateNotifications();
            return false;
        });
    };

    Unmount = () => {
        this.#user.achievements.achievements.RemoveListener(this.#listenerAchievements);
    };

    #updateNotifications = () => {
        const notifsAchievements = this.#user.achievements.GetNotifications();
        const allNotifs = [...notifsAchievements, ...this.#tmpNotifications];
        this.notifications.Set(allNotifs.sort((a, b) => b.timestamp - a.timestamp));
    };

    Clear = () => {
        this.notifications.Set([]);
    };
}

export default NotificationsInApp;
