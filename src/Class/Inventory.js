import dataManager from '../Managers/DataManager';

/**
 * @typedef {import('../Data/Items').Slot} Slot
 * @typedef {import('../Data/Titles').Title} Title
 * @typedef {import('../../res/items/humans/Characters').CharactersName} CharactersName
 * @typedef {import('../../res/items/humans/Characters').Sexes} Sexes
 */

class Stuff {
    ID = 0;
    ItemID = '';
    CreatedBy = 0;
    CreatedAt = 0;
}

class Inventory {
    constructor(user) {
        /**
         * @typedef {import('../Managers/UserManager').default} UserManager
         * @type {UserManager}
         */
        this.user = user;

        /** @type {Array<number>} */
        this.titles = [];

        /**
         * @description Array of owned stuffs
         * @type {Array<Stuff>}
         */
        this.stuffs = [];

        this.avatar = {
            /** @type {Sexes} */
            sexe: 'MALE',

            /** @type {CharactersName} */
            skin: 'skin_01',

            /** @type {number} */
            skinColor: 1,

            hair: 0,
            top: 0,
            bottom: 0,
            shoes: 0
        };

        /**
         * Set to true if avatar is edited
         * Used to know if we need to save it
         * @type {Boolean}
         */
        this.avatarEdited = false;
    }

    Clear() {
        this.stuffs = [];
    }
    LoadOnline(inventory) {
        if (typeof(inventory) !== 'object') return;
        const contains = (key) => inventory.hasOwnProperty(key);
        if (contains('titles')) this.titles = inventory['titles'];
        if (contains('stuffs')) this.stuffs = inventory['stuffs'].map(task => Object.assign(new Stuff(), task));
        if (contains('avatar') && typeof(inventory['avatar']) === 'object') this.avatar = inventory['avatar'];
        this.user.interface.console.AddLog('info', `${this.titles.length} titles loaded`);
        this.user.interface.console.AddLog('info', `${this.stuffs.length} stuffs loaded`);
    }
    Load(data) {
        const contains = (key) => data.hasOwnProperty(key);
        if (contains('titles')) this.titles = data['titles'];
        if (contains('stuffs')) this.stuffs = data['stuffs'];
        if (contains('avatar')) this.avatar = data['avatar'];
    }
    Save() {
        const data = {
            titles: this.titles,
            stuffs: this.stuffs,
            avatar: this.avatar
        };
        return data;
    }

    IsUnsaved = () => {
        return this.avatarEdited;
    }
    GetUnsaved = () => {
        return this.avatar;
    }
    Purge = () => {
        this.avatarEdited = false;
    }

    /**
     * @param {Slot} slot
     * @param {number} stuffID
     */
    Equip = (slot, stuffID) => {
        if (!this.avatar.hasOwnProperty(slot)) {
            this.user.interface.console.AddLog('error', `Slot ${slot} doesn't exist`);
            return;
        }
        if (this.avatar[slot] === stuffID) {
            return;
        }

        this.avatar[slot] = stuffID;
        this.avatarEdited = true;

        // Refresh user character
        this.user.character.SetEquipment(this.GetEquippedItemsID());
    }

    /** @returns {Array<Title>} */
    GetTitles = () => this.titles.map(dataManager.titles.GetByID);

    /**
     * @param {number} ID
     * @returns {Stuff?}
     */
    GetStuffByID = (ID) => this.stuffs.find(stuff => stuff.ID === ID) || null;

    /**
     * @param {Slot} slot
     * @returns {Array<Stuff>}
     */
    GetStuffsBySlot = (slot) => {
        return this.stuffs.filter((stuff) => {
            const item = dataManager.items.GetByID(stuff.ItemID);
            return item.Slot === slot;
        });
    }

    /** @returns {Array<number>} Get list ID of equipped stuffs */
    GetEquipments = () => {
        return [
            this.avatar.hair,
            this.avatar.top,
            this.avatar.bottom,
            this.avatar.shoes
        ];
    }

    /** @returns {Array<string>} */
    GetEquippedItemsID = () => this.GetEquipments().map((ID) => this.GetStuffByID(ID)?.ItemID);
}

export { Stuff };
export default Inventory;