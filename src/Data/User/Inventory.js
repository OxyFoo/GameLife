import dataManager from 'Managers/DataManager';
import { IUserData } from '@oxyfoo/gamelife-types/Interface/IUserData';
import DynamicVar from 'Utils/DynamicVar';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Data/App/Items').Slot} Slot
 * @typedef {import('Data/App/Titles').Title} Title
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Inventory').Stuff} Stuff
 *
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Inventory').SaveObject_Inventory} SaveObject_Inventory
 */

/** @extends {IUserData<SaveObject_Inventory>} */
class Inventory extends IUserData {
    /** @param {UserManager} user */
    constructor(user) {
        super('inventory');

        this.user = user;
    }

    /**
     * @description List of title IDs owned by the user
     * @type {DynamicVar<number[]>}
     */
    titleIDs = new DynamicVar(/** @type {number[]} */ ([]));

    /**
     * @description List of stuffs owned by the user
     * @type {Stuff[]}
     */
    stuffs = [];

    #token = 0;

    Clear = () => {
        this.stuffs = [];
        this.titleIDs.Set([]);
        this.#token = 0;
    };

    /** @returns {SaveObject_Inventory} */
    Get = () => {
        return {
            titleIDs: this.titleIDs.Get(),
            stuffs: this.stuffs,
            token: this.#token
        };
    };

    /** @param {Partial<SaveObject_Inventory>} data */
    Load = (data) => {
        if (typeof data.titleIDs !== 'undefined') this.titleIDs.Set(data.titleIDs);
        if (typeof data.stuffs !== 'undefined') this.stuffs = data.stuffs;
        if (typeof data.token !== 'undefined') this.#token = data.token;
    };

    /** @returns {SaveObject_Inventory} */
    Save = () => {
        return {
            titleIDs: this.titleIDs.Get(),
            stuffs: this.stuffs,
            token: this.#token
        };
    };

    LoadOnline = async () => {
        const response = await this.user.server2.tcp.SendAndWait({ action: 'get-inventories', token: this.#token });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'get-inventories' ||
            response.result === 'error'
        ) {
            this.user.interface.console?.AddLog('error', `[Inventory] Failed to load inventory (${response})`);
            return false;
        }

        if (response.result === 'already-up-to-date') {
            this.user.interface.console?.AddLog('info', '[Inventory] Already up to date');
            return true;
        }

        this.titleIDs.Set(response.result.titleIDs);
        this.stuffs = response.result.stuffs;
        this.#token = response.result.token;

        this.user.interface.console?.AddLog('info', `[Titles] ${this.titleIDs.Get().length} titles loaded`);
        this.user.interface.console?.AddLog('info', `[Stuffs] ${this.stuffs.length} stuffs loaded`);
        return true;
    };

    /** @returns {Title[]} */
    GetTitles = () => {
        /** @type {Title[]} */
        const titles = [];
        for (const ID of this.titleIDs.Get()) {
            const title = dataManager.titles.GetByID(ID);
            if (title !== null) titles.push(title);
        }
        return titles;
    };

    /**
     * @param {number} titleID
     * @returns {boolean}
     */
    AddTitle = (titleID) => {
        const ownedTitles = this.titleIDs.Get();
        if (ownedTitles.includes(titleID)) {
            return false;
        }

        this.titleIDs.Set([...ownedTitles, titleID]);
        return true;
    };

    /**
     * @param {number} ID
     * @returns {Stuff | null}
     */
    GetStuffByID = (ID) => this.stuffs.find((stuff) => stuff.ID === ID) || null;

    /**
     * @param {Slot} slot
     * @returns {Stuff[]}
     */
    GetStuffsBySlot = (slot) => {
        return this.stuffs.filter((stuff) => {
            const item = dataManager.items.GetByID(stuff.ItemID);
            if (item === null) return false;
            return item.Slot === slot;
        });
    };

    /**
     * Sell a stuff item from inventory
     * @param {number} stuffID - The stuff ID to sell (inventory item ID)
     * @returns {Promise<'ok' | 'invalid-item' | 'item-not-found' | 'item-equipped' | 'error'>}
     */
    SellStuff = async (stuffID) => {
        const response = await this.user.server2.tcp.SendAndWait({
            action: 'sell-stuff',
            stuffID: stuffID
        });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'sell-stuff'
        ) {
            this.user.interface.console?.AddLog('error', `[Inventory] Failed to sell stuff (${response})`);
            return 'error';
        }

        if (response.result !== 'ok') {
            this.user.interface.console?.AddLog('warn', `[Inventory] Sell stuff failed: ${response.result}`);
            return response.result;
        }

        // Update local inventory
        this.stuffs = this.stuffs.filter((stuff) => stuff.ID !== stuffID);

        // Update Ox amount
        if (typeof response.ox === 'number') {
            this.user.informations.ox.Set(response.ox);
        }

        this.user.interface.console?.AddLog('info', `[Inventory] Stuff ${stuffID} sold successfully`);
        return 'ok';
    };
}

export default Inventory;
