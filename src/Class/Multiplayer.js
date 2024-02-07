import langManager from 'Managers/LangManager';

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

    /**
     * @param {{ title: string, message: string }} lang
     * @param {string} [additionnal]
     */
    ShowError = (lang, additionnal = null) => {
        const title = lang.title;
        let text = lang.message;
        if (additionnal !== null) {
            text = text.replace('{}', additionnal);
        }
        this.user.interface.popup.Open('ok', [ title, text ]);
    }

    /** @param {string} username */
    AddFriend = async (username) => {
        const callbackID = 'add-friend-' + Date.now();
        const sendSuccess = this.user.tcp.Send({
            action: 'add-friend',
            username: username,
            callbackID: callbackID
        });

        // Wrong type or not connected
        if (sendSuccess === false) {
            return;
        }

        const lang = langManager.curr['multiplayer'];
        const result = await this.user.tcp.WaitCallback(callbackID);
        if (result === 'timeout') {
            this.ShowError(lang['alert-timeout']);
        } else if (result === 'not-found') {
            this.ShowError(lang['alert-friend-notfound'], username);
        } else if (result === 'self') {
            this.ShowError(lang['alert-friend-self']);
        } else if (result === 'already-friend') {
            this.ShowError(lang['alert-already-friend'], username);
        } else if (result === 'sql-error') {
            this.ShowError(lang['alert-error'], result);
        }
    }
    /** @param {number} accountID */
    RemoveFriend = async (accountID) => {
        const callbackID = 'remove-friend-' + Date.now();
        const sendSuccess = this.user.tcp.Send({
            action: 'remove-friend',
            accountID: accountID,
            callbackID: callbackID
        });

        // Wrong type or not connected
        if (sendSuccess === false) {
            return;
        }

        const lang = langManager.curr['multiplayer'];
        const result = await this.user.tcp.WaitCallback(callbackID);
        if (result === 'timeout') {
            this.ShowError(lang['alert-timeout']);
        } else if (result === 'sql-error') {
            this.ShowError(lang['alert-error'], result);
        }
    }
    /** @param {number} accountID */
    AcceptFriend = async (accountID) => {
        const callbackID = 'accept-friend-' + Date.now();
        const sendSuccess = this.user.tcp.Send({
            action: 'accept-friend',
            accountID: accountID,
            callbackID: callbackID
        });

        // Wrong type or not connected
        if (sendSuccess === false) {
            return;
        }

        const lang = langManager.curr['multiplayer'];
        const result = await this.user.tcp.WaitCallback(callbackID);
        if (result === 'timeout') {
            this.ShowError(lang['alert-timeout']);
        } else if (result === 'sql-error') {
            this.ShowError(lang['alert-error'], result);
        }
    }
    /** @param {number} accountID */
    DeclineFriend = async (accountID) => {
        const callbackID = 'decline-friend-' + Date.now();
        const sendSuccess = this.user.tcp.Send({
            action: 'decline-friend',
            accountID: accountID,
            callbackID: callbackID
        });

        // Wrong type or not connected
        if (sendSuccess === false) {
            return;
        }

        const lang = langManager.curr['multiplayer'];
        const result = await this.user.tcp.WaitCallback(callbackID);
        if (result === 'timeout') {
            this.ShowError(lang['alert-timeout']);
        } else if (result === 'sql-error' || result === 'sql-error2') {
            this.ShowError(lang['alert-error'], result);
        }
    }
    /** @param {number} accountID */
    BlockFriend = async (accountID) => {
        const callbackID = 'block-friend-' + Date.now();
        const sendSuccess = this.user.tcp.Send({
            action: 'block-friend',
            accountID: accountID,
            callbackID: callbackID
        });

        // Wrong type or not connected
        if (sendSuccess === false) {
            return;
        }

        const lang = langManager.curr['multiplayer'];
        const result = await this.user.tcp.WaitCallback(callbackID);
        if (result === 'timeout') {
            this.ShowError(lang['alert-timeout']);
        } else if (result === 'sql-error' || result === 'sql-error2') {
            this.ShowError(lang['alert-error'], result);
        }
    }
}

export default Multiplayer;
