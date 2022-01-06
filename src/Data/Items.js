import { getByKey, sortByKey, strIsJSON } from "../Functions/Functions";

class Item {
    ID = 0;
    Name = '';
    Description = '';
    CategoryID = 0; // TODO - Faire un système de catégorie fixe
    Stats = {
        'int': 0,
        'soc': 0,
        'for': 0,
        'end': 0,
        'agi': 0,
        'dex': 0
    };
    Color = ''; // TODO - Faire un système de couleur fixe
    XML = ''; // TODO - Gérer les XML avec les ID
}

class Items {
    constructor() {
        /**
         * @type {Item[]}
         */
        this.items = [];
    }

    /**
     * @returns {Item[]}
     */
    getAll() {
        return this.items;
    }
    /**
     * @param {Object} items 
     */
    setAll(items) {
        this.items = items;
    }

    save() {
        const data = { items: this.items };
        return JSON.stringify(data);
    }
    load(str) {
        if (strIsJSON(str)) {
            const json = JSON.parse(str);
            this.items = json.items;
        }
    }

    /**
     * @param {Number} ID
     * @returns {?Item} - Return skill if exists or null
     */
    getByID = (ID) => getByKey(this.skills, 'ID', ID);

    getByCategory = (ID) => this.items.filter(items => items.CategoryID === ID);
}

export default Items;