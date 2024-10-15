import dataManager from 'Managers/DataManager';
import { IUserData } from 'Types/Interface/IUserData';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/Class/Inventory').Stuff} Stuff
 * @typedef {import('Types/Class/Inventory').AvatarObject} AvatarObject
 * @typedef {import('Types/Class/Inventory').SaveObject_Local_Inventory} SaveObject_Local_Inventory
 * @typedef {import('Types/Class/Inventory').SaveObject_Online_Inventory} SaveObject_Online_Inventory
 *
 * @typedef {import('Data/App/Items').Slot} Slot
 * @typedef {import('Data/App/Titles').Title} Title
 */

/** @extends {IUserData<SaveObject_Local_Inventory, SaveObject_Local_Inventory, SaveObject_Online_Inventory>} */
class Inventory extends IUserData {
    /** @param {UserManager} user */
    constructor(user) {
        super();

        this.user = user;
    }

    /** @type {Array<number>} */
    titleIDs = [];

    /**
     * @description Array of owned stuffs
     * @type {Array<Stuff>}
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

    Clear = () => {
        this.stuffs = [];
        this.titleIDs = [];
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
    };

    /** @param {SaveObject_Local_Inventory} data */
    Load = (data) => {
        if (data.titleIDs) this.titleIDs = data.titleIDs;
        if (data.stuffs) this.stuffs = data.stuffs;
        if (data.avatar) this.avatar = data.avatar;
    };

    /** @returns {SaveObject_Local_Inventory} */
    Save = () => {
        return {
            titleIDs: this.titleIDs,
            stuffs: this.stuffs,
            avatar: this.avatar
        };
    };

    /** @param {SaveObject_Local_Inventory} data */
    LoadOnline = (data) => {
        if (typeof data.titleIDs !== 'undefined') {
            this.titleIDs = data.titleIDs;
        }
        if (typeof data.stuffs !== 'undefined') {
            this.stuffs = data.stuffs;
        }
        if (typeof data.avatar !== 'undefined') {
            this.avatar = data.avatar;
        }

        this.user.interface.console?.AddLog('info', `${this.titleIDs.length} titles loaded`);
        this.user.interface.console?.AddLog('info', `${this.stuffs.length} stuffs loaded`);
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

    /** @returns {Array<Title>} */
    GetTitles = () => {
        /** @type {Array<Title>} */
        const titles = [];
        for (const ID of this.titleIDs) {
            const title = dataManager.titles.GetByID(ID);
            if (title !== null) titles.push(title);
        }
        return titles;
    };

    /**
     * @param {number} ID
     * @returns {Stuff | null}
     */
    GetStuffByID = (ID) => this.stuffs.find((stuff) => stuff.ID === ID) || null;

    /**
     * @param {Slot} slot
     * @returns {Array<Stuff>}
     */
    GetStuffsBySlot = (slot) => {
        return this.stuffs.filter((stuff) => {
            const item = dataManager.items.GetByID(stuff.ItemID);
            if (item === null) return false;
            return item.Slot === slot;
        });
    };

    /** @returns {Array<number>} Get list ID of equipped stuffs */
    GetEquipments = () => {
        return [this.avatar.hair, this.avatar.top, this.avatar.bottom, this.avatar.shoes];
    };

    /** @returns {Array<string>} */
    GetEquippedItemsID = () => this.GetEquipments().map((ID) => this.GetStuffByID(ID)?.ItemID || '[Default Item]');
}

export default Inventory;
