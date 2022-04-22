import dataManager from '../Managers/DataManager';

/**
 * @typedef {import('../Data/Items').Item} Item
 * @typedef {import('../Data/Titles').Title} Title
 */

class Stuff {
    ItemID = 0;
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
    }

    Clear() {
        this.stuffs = [];
    }
    LoadOnline(inventory) {
        console.log('inventory', inventory);
        if (typeof(inventory) !== 'object') return;
        const contains = (key) => inventory.hasOwnProperty(key);
        if (contains('titles')) this.titles = inventory['titles'];
        if (contains('stuffs')) this.stuffs = inventory['stuffs'].map(task => Object.assign(new Stuff(), task));
        this.user.interface.console.AddLog('info', `${this.titles.length} titles loaded`);
        this.user.interface.console.AddLog('info', `${this.stuffs.length} stuffs loaded`);
    }
    Load(data) {
        const contains = (key) => data.hasOwnProperty(key);
        if (contains('titles')) this.titles = data['titles'];
        if (contains('stuffs')) this.stuffs = data['stuffs'];
    }
    Save() {
        const data = {
            titles: this.titles,
            stuffs: this.stuffs
        };
        return data;
    }
    /** @returns {Array<Title>} */
    GetTitles = () => this.titles.map(dataManager.titles.GetByID);
    /** @returns {Array<Item>} */
    GetStuffs = () => this.stuffs.map(dataManager.items.GetByID);
}

export default Inventory;