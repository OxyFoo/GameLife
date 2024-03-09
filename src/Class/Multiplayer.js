import langManager from 'Managers/LangManager';

import DynamicVar from 'Utils/DynamicVar';

const FRIENDS_LIMIT = 10;

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/UserOnline').Friend} Friend
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

    /** @param {number} accountID */
    GetFriendByID = (accountID) => {
        return this.friends.Get().find(f => f.accountID === accountID) || null;
    }

    /** @param {ReceiveRequest} data */
    onMessage = (data) => {
        const status = data.status;

        switch (status) {
            case 'update-friends':
                this.friends.Set(data.friends);
                break;

            case 'update-notifications':
                this.notifications.Set(data.notifications);
                break;

            case 'update-current-activity':
                this.user.activities.currentActivity.Set(data.activity);
                break;

            case 'update-zap-gpt':
                this.user.informations.zapGPT = data.zapGPTStatus;
                break;
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
        const result = await this.user.tcp.WaitForCallback(callbackID);
        if (result === 'timeout') {
            this.ShowError(lang['alert-timeout']);
        } else if (result === 'not-found') {
            this.ShowError(lang['alert-friend-notfound'], username);
        } else if (result === 'self') {
            // Update achievement
            this.user.informations.achievementSelfFriend = true;
            this.ShowError(lang['alert-friend-self']);
        } else if (result === 'already-friend') {
            this.ShowError(lang['alert-already-friend'], username);
        } else if (result === 'friend-blocked') {
            this.ShowError(lang['alert-friend-blocked'], username);
        } else if (result === 'sql-error' || result === 'get-friend-error') {
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
        const result = await this.user.tcp.WaitForCallback(callbackID);
        if (result === 'timeout') {
            this.ShowError(lang['alert-timeout']);
        } else if (result === 'sql-error') {
            this.ShowError(lang['alert-error'], result);
        }
    }
    /** @param {number} accountID */
    CancelFriend = async (accountID) => {
        const callbackID = 'cancel-friend-' + Date.now();
        const sendSuccess = this.user.tcp.Send({
            action: 'cancel-friend',
            accountID: accountID,
            callbackID: callbackID
        });

        // Wrong type or not connected
        if (sendSuccess === false) {
            return;
        }

        const lang = langManager.curr['multiplayer'];
        const result = await this.user.tcp.WaitForCallback(callbackID);
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
        const result = await this.user.tcp.WaitForCallback(callbackID);
        if (result === 'timeout') {
            this.ShowError(lang['alert-timeout']);
        } else if (result === 'sql-error' || result === 'get-friend-error') {
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
        const result = await this.user.tcp.WaitForCallback(callbackID);
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
        const result = await this.user.tcp.WaitForCallback(callbackID);
        if (result === 'timeout') {
            this.ShowError(lang['alert-timeout']);
        } else if (result === 'sql-error' || result === 'sql-error2') {
            this.ShowError(lang['alert-error'], result);
        }
    }
}

export { FRIENDS_LIMIT };
export default Multiplayer;
