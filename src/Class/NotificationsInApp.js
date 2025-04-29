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
    notifications = new DynamicVar(/** @type {NotificationInApp[]} */ ([]));

    /** @type {NotificationInApp[]} */
    #tmpNotifications = [];

    /** @type {Symbol | null} */
    #listenerNetworkState = null;

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
        this.#listenerNetworkState = this.#user.server2.tcp.state.AddListener((newState) => {
            if (newState === 'disconnected' || newState === 'error') {
                this.Clear();
            }
        });
        this.#user.server2.tcp.WaitForAction('update-notifications', (response) => {
            this.#tmpNotifications = response.notifications;
            this.#updateNotifications();
            return false;
        });
    };

    Unmount = () => {
        this.#user.server2.tcp.state.RemoveListener(this.#listenerNetworkState);
        this.#user.achievements.achievements.RemoveListener(this.#listenerAchievements);
    };

    #updateNotifications = () => {
        const notifsAchievements = this.#user.achievements.GetNotifications();
        const notifsFromServer = this.#tmpNotifications;
        const notifForOptionalUpdate = this.#user.informations.GetOptionalUpdateNotifications();

        const allNotifs = [notifForOptionalUpdate, ...notifsAchievements, ...notifsFromServer]
            .filter((n) => n !== null)
            .sort((a, b) => b.timestamp - a.timestamp);

        this.notifications.Set(allNotifs);
    };

    Clear = () => {
        this.notifications.Set([]);
    };

    /**
     * @param {NotificationInApp} notif
     * @returns {boolean}
     */
    Remove = (notif) => {
        const allNotifs = this.notifications.Get();
        const index = allNotifs.indexOf(notif);
        if (index === -1) return false;

        allNotifs.splice(index, 1);
        this.notifications.Set(allNotifs);
        return true;
    };
}

export default NotificationsInApp;
