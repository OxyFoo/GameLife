import DynamicVar from 'Utils/DynamicVar';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/Friend').Friend} Friend
 * @typedef {import('Types/NotificationInApp').NotificationInApp} NotificationInApp
 * @typedef {import('Types/TCP').TCPServerRequest} ReceiveRequest
 */

class Multiplayer {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;
    }

    /** @type {DynamicVar<Array<Friend>>} */
    friends = new DynamicVar([]);

    /** @type {DynamicVar<Array<NotificationInApp>>} */
    notifications = new DynamicVar([]);

    /** @param {ReceiveRequest} data */
    onMessage = (data) => {
        const status = data.status;

        if (status === 'update-friends') {
            this.friends.Set(data.friends);
        }
        if (status === 'update-notifications') {
            this.notifications.Set(data.notifications);
        }
    }

    /** @param {string} username */
    AddFriend = (username) => {
        this.user.tcp.Send({ action: 'add-friend', username });
    }
    /** @param {number} accountID */
    RemoveFriend = (accountID) => {
        this.user.tcp.Send({ action: 'remove-friend', accountID });
    }
    /** @param {number} accountID */
    AcceptFriend = (accountID) => {
        this.user.tcp.Send({ action: 'accept-friend', accountID });
    }
    /** @param {number} accountID */
    DeclineFriend = (accountID) => {
        this.user.tcp.Send({ action: 'decline-friend', accountID });
    }
    /** @param {number} accountID */
    BlockFriend = (accountID) => {
        this.user.tcp.Send({ action: 'block-friend', accountID });
    }
}

export default Multiplayer;
