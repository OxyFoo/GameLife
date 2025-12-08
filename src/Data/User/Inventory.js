import dataManager from 'Managers/DataManager';
import { IUserData } from '@oxyfoo/gamelife-types/Interface/IUserData';
import DynamicVar from 'Utils/DynamicVar';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Data/App/Items').Slot} Slot
 * @typedef {import('Data/App/Titles').Title} Title
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Inventory').Stuff} Stuff
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Inventory').AvatarObject} AvatarObject
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').CharactersID} CharactersID
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

    /**
     * @description Avatar object
     * @type {AvatarObject}
     */
    avatar = {
        skin: 'human_00',
        skinColor: 1,
        hair: 0,
        top: 0,
        bottom: 0,
        shoes: 0
    };

    /**
     * Set to true if avatar is edited
     * Used to know if we need to save it
     * @type {boolean}
     */
    avatarEdited = false;

    #token = 0;

    Clear = () => {
        this.stuffs = [];
        this.titleIDs.Set([]);
        this.avatar = {
            skin: 'human_00',
            skinColor: 1,
            hair: 0,
            top: 0,
            bottom: 0,
            shoes: 0
        };
        this.avatarEdited = false;
        this.#token = 0;
    };

    /** @returns {SaveObject_Inventory} */
    Get = () => {
        return {
            titleIDs: this.titleIDs.Get(),
            stuffs: this.stuffs,
            avatar: this.avatar,
            token: this.#token
        };
    };

    /** @param {Partial<SaveObject_Inventory>} data */
    Load = (data) => {
        if (typeof data.titleIDs !== 'undefined') this.titleIDs.Set(data.titleIDs);
        if (typeof data.stuffs !== 'undefined') this.stuffs = data.stuffs;
        if (typeof data.avatar !== 'undefined') this.avatar = data.avatar;
        if (typeof data.token !== 'undefined') this.#token = data.token;
    };

    /** @returns {SaveObject_Inventory} */
    Save = () => {
        return {
            titleIDs: this.titleIDs.Get(),
            stuffs: this.stuffs,
            avatar: this.avatar,
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
        this.avatar = response.result.avatar;
        this.#token = response.result.token;

        this.user.interface.console?.AddLog('info', `[Titles] ${this.titleIDs.Get().length} titles loaded`);
        this.user.interface.console?.AddLog('info', `[Stuffs] ${this.stuffs.length} stuffs loaded`);
        return true;
    };

    SaveOnline = async () => {
        if (!this.avatarEdited) {
            return true;
        }

        const response = await this.user.server2.tcp.SendAndWait({
            action: 'save-inventories',
            avatar: this.avatar,
            token: this.#token
        });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'save-inventories' ||
            response.result === 'error'
        ) {
            this.user.interface.console?.AddLog('error', `[Inventory] Failed to save inventory (${response})`);
            return false;
        }

        this.#token = response.result.token;
        this.avatarEdited = false;
        this.user.interface.console?.AddLog('info', '[Inventory] Inventory saved successfully');
        return true;
    };

    /**
     * @param {Slot} slot
     * @param {number} stuffID
     */
    Equip = (slot, stuffID) => {
        if (!this.avatar.hasOwnProperty(slot)) {
            this.user.interface.console?.AddLog('error', `Slot ${slot} doesn't exist`);
            return;
        }
        if (this.avatar[slot] === stuffID) {
            return;
        }

        this.avatar[slot] = stuffID;
        this.avatarEdited = true;
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

    /** @returns {number[]} Get list ID of equipped stuffs */
    GetEquipments = () => {
        return [this.avatar.hair, this.avatar.top, this.avatar.bottom, this.avatar.shoes];
    };

    /** @returns {string[]} */
    GetEquippedItemsID = () => this.GetEquipments().map((ID) => this.GetStuffByID(ID)?.ItemID || '[Default Item]');

    /**
     * Update avatar skin color index
     * @param {number} colorIndex
     */
    SetSkinColor = (colorIndex) => {
        if (typeof colorIndex !== 'number' || Number.isNaN(colorIndex)) {
            return;
        }
        if (this.avatar.skinColor === colorIndex) {
            return;
        }

        this.avatar.skinColor = colorIndex;
        this.avatarEdited = true;
    };

    /**
     * Update avatar skin (body type)
     * @param {CharactersID} skinID
     */
    SetSkin = (skinID) => {
        if (this.avatar.skin === skinID) {
            return;
        }

        this.avatar.skin = skinID;
        this.avatarEdited = true;
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
