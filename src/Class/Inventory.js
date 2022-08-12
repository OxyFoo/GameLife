import dataManager from '../Managers/DataManager';

/**
 * @typedef {import('../Data/Items').Slot} Slot
 * @typedef {import('../Data/Items').Item} Item
 * @typedef {import('../Data/Titles').Title} Title
 * @typedef {import('../../res/items/humans/Characters').CharactersName} CharactersName
 * @typedef {import('../../res/items/humans/Characters').Sexes} Sexes
 */

class Stuff {
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

        /** @type {Array<Number>} */
        this.titles = [];

        /**
         * @description Array of owned stuffs
         * @type {Array<Stuff>}
         */
        this.stuffs = [];

        this.avatar = {
            /** @type {Sexes} */
            Sexe: 'MALE',

            /** @type {CharactersName} */
            Skin: 'skin_01',

            /** @type {Number} */
            SkinColor: 1,

            Hair: '',
            Top: '',
            Bottom: '',
            Shoes: ''
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
     * @param {String} itemID 
     */
    Equip = (slot, itemID) => {
        if (!this.avatar.hasOwnProperty(slot)) {
            this.user.interface.console.AddLog('error', `Slot ${slot} doesn't exist`);
            return;
        }
        if (this.avatar[slot] === itemID) {
            return;
        }

        this.avatar[slot] = itemID;
        this.avatarEdited = true;

        // Refresh user character
        this.user.character.SetEquipment(this.GetEquipments());
    }

    /** @returns {Array<Title>} */
    GetTitles = () => this.titles.map(dataManager.titles.GetByID);
    /** @returns {Array<Item>} */
    GetStuffs = () => this.stuffs.map((stuff) => dataManager.items.GetByID(stuff.ItemID));
    /** @returns {Array<String>} Get list of equipped items */
    GetEquipments = () => {
        return [
            this.avatar.Hair,
            this.avatar.Top,
            this.avatar.Bottom,
            this.avatar.Shoes
        ];
    }
}

export default Inventory;