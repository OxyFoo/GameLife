import langManager from 'Managers/LangManager';

import { IUserData } from '@oxyfoo/gamelife-types/Interface/IUserData';
import DynamicVar from 'Utils/DynamicVar';

const FRIENDS_LIMIT = 50;

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Multiplayer').Friend} Friend
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Multiplayer').UserOnline} UserOnline
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Multiplayer').SaveObject_Multiplayer} SaveObject_Multiplayer
 * @typedef {import('@oxyfoo/gamelife-types/TCP/GameLife/Request_ServerToClient').ServerRequestUpdateFriends} ServerRequestUpdateFriends
 */

/** @extends {IUserData<SaveObject_Multiplayer>} */
class Multiplayer extends IUserData {
    /** @type {UserManager} */
    #user;

    /** @param {UserManager} user */
    constructor(user) {
        super('multiplayer');

        this.#user = user;
        this.#user.server2.tcp.WaitForAction('update-friends', this.#updateFriends);
    }

    /** @type {DynamicVar<(UserOnline | Friend)[]>} */
    friends = new DynamicVar(/** @type {(UserOnline | Friend)[]} */ ([]));

    Clear = () => {
        this.friends.Set([]);
    };

    Get = () => {
        return this.friends.Get();
    };

    /** @returns {Friend[]} */
    GetFriends = () => {
        return this.friends.Get().filter((f) => f.friendshipState === 'accepted');
    };

    /** @returns {UserOnline[]} */
    GetWaitingFriends = () => {
        /** @param {Friend | UserOnline} f @returns {f is UserOnline} */
        const isUserOnline = (f) => f.friendshipState === 'pending';
        return this.friends.Get().filter(isUserOnline);
    };

    /** @returns {UserOnline[]} */
    GetBlockedFriends = () => {
        /** @param {Friend | UserOnline} f @returns {f is UserOnline} */
        const isUserOnline = (f) => f.friendshipState === 'blocked';
        return this.friends.Get().filter(isUserOnline);
    };

    /** @param {Partial<SaveObject_Multiplayer>} data */
    Load = (data) => {
        if (typeof data.friends !== 'undefined') {
            this.friends.Set(data.friends);
        }
    };

    /** @returns {SaveObject_Multiplayer} */
    Save = () => {
        return {
            friends: this.friends.Get()
        };
    };

    /** @param {ServerRequestUpdateFriends} response */
    #updateFriends = (response) => {
        if (response.result === 'error') {
            return true;
        }

        let friends = this.friends.Get();
        const { friends: newFriends, friendIDsToUpdate } = response.result;
        for (const friendID of friendIDsToUpdate) {
            const newFriendIndex = newFriends.findIndex((f) => f.accountID === friendID);
            if (newFriendIndex === -1) {
                friends = friends.filter((f) => f.accountID !== friendID);
                continue;
            }

            const friendIndex = friends.findIndex((f) => f.accountID === friendID);
            if (friendIndex === -1) {
                friends.push(newFriends[newFriendIndex]);
            } else {
                friends[friendIndex] = newFriends[newFriendIndex];
            }
        }

        this.friends.Set(friends);

        return false;
    };

    /** @param {number} accountID */
    GetFriendByID = (accountID) => {
        return this.friends.Get().find((f) => f.accountID === accountID) || null;
    };

    /** @returns {Friend} */
    GetSelf = () => {
        const achievements = this.#user.achievements.Get();
        const activities = this.#user.activities.Get();
        return {
            accountID: 0,
            achievements: achievements,
            activities: {
                firstTime: activities.length === 0 ? 0 : activities[0].startTime,
                length: activities.length,
                totalDuration: activities.reduce((acc, a) => acc + a.duration, 0)
            },
            // TODO: Finish this
            avatar: {
                Sexe: 'MALE',
                Skin: 'skin_01',
                SkinColor: 0,
                Hair: 'hair_01',
                Top: 'top_01',
                Bottom: 'bottom_01',
                Shoes: 'shoes_01'
            },
            currentActivity: null,
            friendshipState: 'accepted',
            stats: this.#user.experience.GetStatsNumber(),
            status: 'online',
            title: this.#user.informations.title.Get(),
            username: this.#user.informations.username.Get(),
            xp: this.#user.experience.experience.Get().xpInfo.totalXP
        };
    };

    /**
     * @param {{ title: string, message: string }} lang
     * @param {string | null} [additionnal]
     */
    ShowError = (lang, additionnal = null) => {
        const title = lang.title;
        let message = lang.message;
        if (additionnal !== null) {
            message = message.replace('{}', additionnal);
        }
        this.#user.interface.popup?.OpenT({
            type: 'ok',
            data: { title, message }
        });
    };

    /** @param {string | null} username */
    AddFriend = async (username) => {
        if (!username) {
            return 'canceled';
        }

        // Update mission
        this.#user.missions.SetMissionState('mission3', 'completed');

        const sendSuccess = await this.#user.server2.tcp.SendAndWait({
            action: 'add-friend',
            username: username
        });

        // Check errors
        if (sendSuccess === 'interrupted' || sendSuccess === 'timeout' || sendSuccess === 'not-sent') {
            return sendSuccess;
        }
        if (sendSuccess.status !== 'add-friend' || sendSuccess.result === 'error') {
            return 'error';
        }

        return sendSuccess.result;
    };

    /**
     * @param {number} accountID
     * @returns {Promise<boolean>}
     */
    RemoveFriend = async (accountID) => {
        const response = await this.#user.server2.tcp.SendAndWait({
            action: 'remove-friend',
            friendID: accountID
        });

        // Wrong type or not connected
        const lang = langManager.curr['multiplayer'];
        if (response === 'interrupted' || response === 'not-sent' || response === 'timeout') {
            this.ShowError(lang['alert-error'], response);
            return false;
        } else if (response.status !== 'remove-friend' || response.result === 'error') {
            this.ShowError(lang['alert-error'], 'error');
            return false;
        }

        return true;
    };

    /** @param {number} accountID */
    CancelFriend = async (accountID) => {
        const cancelStatus = await this.#user.server2.tcp.SendAndWait({
            action: 'cancel-friend',
            friendID: accountID
        });

        // Check errors
        if (cancelStatus === 'interrupted' || cancelStatus === 'timeout' || cancelStatus === 'not-sent') {
            return cancelStatus;
        }
        if (cancelStatus.status !== 'cancel-friend' || cancelStatus.result === 'error') {
            return 'error';
        }

        return cancelStatus.result;
    };

    /**
     * @param {number} accountID
     * @returns {Promise<boolean>}
     */
    AcceptFriend = async (accountID) => {
        const response = await this.#user.server2.tcp.SendAndWait({
            action: 'accept-friend',
            friendID: accountID
        });

        // Check errors
        const lang = langManager.curr['multiplayer'];
        if (response === 'timeout' || response === 'interrupted' || response === 'not-sent') {
            this.ShowError(lang['alert-error'], response);
            return false;
        }

        if (response.status !== 'accept-friend' || response.result === 'error') {
            this.ShowError(lang['alert-error'], 'error');
            return false;
        }

        return true;
    };

    /**
     * @param {number} accountID
     * @returns {Promise<boolean>}
     */
    DeclineFriend = async (accountID) => {
        const response = await this.#user.server2.tcp.SendAndWait({
            action: 'decline-friend',
            friendID: accountID
        });

        // Check errors
        const lang = langManager.curr['multiplayer'];
        if (response === 'timeout' || response === 'interrupted' || response === 'not-sent') {
            this.ShowError(lang['alert-error'], response);
            return false;
        }

        if (response.status !== 'decline-friend' || response.result === 'error') {
            this.ShowError(lang['alert-error'], 'error');
            return false;
        }

        return true;
    };

    /**
     * @param {number} accountID
     * @returns {Promise<boolean>}
     */
    BlockFriend = async (accountID) => {
        const response = await this.#user.server2.tcp.SendAndWait({
            action: 'block-friend',
            friendID: accountID
        });

        // Check errors
        const lang = langManager.curr['multiplayer'];
        if (response === 'timeout' || response === 'interrupted' || response === 'not-sent') {
            this.ShowError(lang['alert-error'], response);
            return false;
        }

        if (response.status !== 'block-friend' || response.result === 'error') {
            this.ShowError(lang['alert-error'], 'error');
            return false;
        }

        return true;
    };

    /**
     * @param {number} accountID
     * @returns {Promise<boolean>}
     */
    UnblockFriend = async (accountID) => {
        const response = await this.#user.server2.tcp.SendAndWait({
            action: 'unblock-friend',
            friendID: accountID
        });

        // Check errors
        const lang = langManager.curr['multiplayer'];
        if (response === 'timeout' || response === 'interrupted' || response === 'not-sent') {
            this.ShowError(lang['alert-error'], response);
            return false;
        }

        if (response.status !== 'unblock-friend' || response.result === 'error') {
            this.ShowError(lang['alert-error'], 'error');
            return false;
        }

        return true;
    };
}

export { FRIENDS_LIMIT };
export default Multiplayer;
