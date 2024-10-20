import { IUserData } from 'Types/Interface/IUserData';
import DynamicVar from 'Utils/DynamicVar';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/TCP/GameLife/Request').TCPServerRequest} ReceiveRequest
 * @typedef {import('Types/Data/User/NotificationsInApp').NotificationInApp<*>} NotificationInApp
 * @typedef {import('Types/Data/User/NotificationsInApp').SaveObject_Local_NotificationInApp} SaveObject_Local_NotificationInApp
 */

/** @extends {IUserData<SaveObject_Local_NotificationInApp>} */
class NotificationsInApp extends IUserData {
    /** @type {DynamicVar<Array<NotificationInApp>>} */
    // eslint-disable-next-line prettier/prettier
    notifications = new DynamicVar(/** @type {Array<NotificationInApp>} */ ([]));

    /** @param {UserManager} user */
    constructor(user) {
        super();

        this.user = user;
    }

    Clear = () => {
        this.notifications.Set([]);
    };

    Load = (data) => {
        this.notifications.Set(data.notifications);
    };

    StartListening = () => {
        this.user.server2.tcp.WaitForAction('update-notifications', (data) => {
            this.notifications.Set(data.notifications);
            return false;
        });
    };
}

export default NotificationsInApp;
