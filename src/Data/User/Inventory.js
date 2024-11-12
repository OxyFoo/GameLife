import dataManager from 'Managers/DataManager';
import { IUserData } from 'Types/Interface/IUserData';
import DynamicVar from 'Utils/DynamicVar';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Data/App/Items').Slot} Slot
 * @typedef {import('Data/App/Titles').Title} Title
 * @typedef {import('Types/Data/User/Inventory').Stuff} Stuff
 * @typedef {import('Types/Data/User/Inventory').AvatarObject} AvatarObject
 *
 * @typedef {import('Types/Data/User/Inventory').SaveObject_Inventory} SaveObject_Inventory
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
    // eslint-disable-next-line prettier/prettier
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
        sexe: 'MALE',
        skin: 'skin_01',
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
            sexe: 'MALE',
            skin: 'skin_01',
            skinColor: 1,
            hair: 0,
            top: 0,
            bottom: 0,
            shoes: 0
        };
        this.avatarEdited = false;
        this.#token = 0;
    };

    Get = () => {
        return {
            titleIDs: this.titleIDs.Get(),
            stuffs: this.stuffs,
            avatar: this.avatar
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

        this.user.interface.console?.AddLog('info', `${this.titleIDs.Get().length} titles loaded`);
        this.user.interface.console?.AddLog('info', `${this.stuffs.length} stuffs loaded`);
        return true;
    };

    IsUnsaved = () => {
        return this.avatarEdited;
    };

    GetUnsaved = () => {
        return {
            avatar: this.avatar
        };
    };

    Purge = () => {
        this.avatarEdited = false;
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

        // Refresh user character
        this.user.character?.SetEquipment(this.GetEquippedItemsID());

        // Update mission
        this.user.missions.SetMissionState('mission4', 'completed');
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
}

export default Inventory;
