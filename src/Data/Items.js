/**
 * @typedef {'hair'|'face'|'accessory'|'weapon'|'top'|'gloves'|'bottom'|'shoes'} Slot
 * 
 * @typedef {Object} Buff
 * @property {Number} int
 * @property {Number} soc
 * @property {Number} for
 * @property {Number} end
 * @property {Number} agi
 * @property {Number} dex
 */

const Rarity = {
    common: 0,
    rare: 1,
    epic: 2,
    legendary: 3,
    event: 4
}

class Item {
    ID = '';
    /** @type {Slot} */
    Slot = '';
    Name = { fr: '', en: '' };
    Description = { fr: '', en: '' };
    Rarity = Rarity.common;
    /** @type {Array<Buff>} */
    Buffs = [];
    Value = 0;

    //Color = ''; // TODO - Faire un système de couleur fixe
    //XML = ''; // TODO - Gérer les XML avec les ID
}

class Items {
    constructor() {
        /** @type {Array<Item>} */
        this.items = [];
    }

    Load(items) {
        if (typeof(items) === 'object') {
            this.items = items;
        }
    }
    Save() {
        return this.items;
    }

    /** @returns {Array<Item>} */
    Get() {
        return this.items;
    }

    /** @returns {Item?} */
    GetByID = (ID) => this.items.find(item => item.ID === ID) || null;
}

export { Item, Rarity };
export default Items;