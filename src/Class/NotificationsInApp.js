import DynamicVar from 'Utils/DynamicVar';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/Class/NotificationsInApp').NotificationInApp<*>} NotificationInApp
 */

class NotificationsInApp {
    /** @type {DynamicVar<NotificationInApp[]>} */
    // eslint-disable-next-line prettier/prettier
    notifications = new DynamicVar(/** @type {NotificationInApp[]} */ ([]));

    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;
    }

    Clear = () => {
        this.notifications.Set([]);
    };

    /** @returns {NotificationInApp[]} */
    Get = () => {
        const allNotifications = [...this.notifications.Get(), ...this.user.achievements.GetNotifications()];
        return allNotifications.sort((a, b) => b.timestamp - a.timestamp);
    };

    StartListening = () => {
        this.user.server2.tcp.WaitForAction('update-notifications', (data) => {
            this.notifications.Set(data.notifications);
            return false;
        });
    };
}

export default NotificationsInApp;
