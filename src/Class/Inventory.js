import dataManager from '../Managers/DataManager';

/**
 * @typedef {import('../Data/Items').Slot} Slot
 * @typedef {import('../Data/Items').Item} Item
 * @typedef {import('../Data/Titles').Title} Title
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

        /** @type {Array<Stuff>} */
        this.stuffs = [];

        this.equipmentsEdited = false;
        this.equipments = {
            hair: null,
            hat: null,
            head: null,
            body: 'teeshirt_01',
            legs: null,
            feet: null
        }
    }

    Clear() {
        this.stuffs = [];
    }
    LoadOnline(inventory) {
        if (typeof(inventory) !== 'object') return;
        const contains = (key) => inventory.hasOwnProperty(key);
        if (contains('titles')) this.titles = inventory['titles'];
        if (contains('stuffs')) this.stuffs = inventory['stuffs'].map(task => Object.assign(new Stuff(), task));
        if (contains('equipments') && typeof(inventory['equipments']) === 'object') {
            for (const slot in inventory['equipments']) {
                if (this.equipments.hasOwnProperty(slot)) {
                    this.equipments[slot] = inventory['equipments'][slot];
                }
            }
        }
        this.user.interface.console.AddLog('info', `${this.titles.length} titles loaded`);
        this.user.interface.console.AddLog('info', `${this.stuffs.length} stuffs loaded`);
    }
    Load(data) {
        const contains = (key) => data.hasOwnProperty(key);
        if (contains('titles')) this.titles = data['titles'];
        if (contains('stuffs')) this.stuffs = data['stuffs'];
        if (contains('equipments')) this.equipments = data['equipments'];
    }
    Save() {
        const data = {
            titles: this.titles,
            stuffs: this.stuffs,
            equipments: this.equipments
        };
        return data;
    }

    IsUnsaved = () => {
        return this.equipmentsEdited;
    }
    GetUnsaved = () => {
        return this.equipments;
    }
    Purge = () => {
        this.equipmentsEdited = false;
    }

    /**
     * @param {Slot} slot 
     * @param {String} item 
     */
    SetEquipment = (slot, item) => {
        if (this.equipments[slot] === item) return;
        if (!this.equipments.hasOwnProperty(slot)) return;
        this.equipments[slot] = item;
        this.equipmentsEdited = true;
    }

    /** @returns {Array<Title>} */
    GetTitles = () => this.titles.map(dataManager.titles.GetByID);
    /** @returns {Array<Item>} */
    GetStuffs = () => this.stuffs.map((stuff) => dataManager.items.GetByID(stuff.ItemID));
    /** @returns {Array<String>} */
    GetEquipments = () => Object.values(this.equipments).filter(item => item !== null);
}

export default Inventory;