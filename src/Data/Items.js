/**
 * @typedef {'hair'|'face'|'accessory'|'weapon'|'top'|'gloves'|'bottom'|'shoes'} _OldSlot
 * @typedef {'hair'|'top'|'bottom'|'shoes'} Slot
 * 
 * @typedef {object} Buff
 * @property {number} int
 * @property {number} soc
 * @property {number} for
 * @property {number} end
 * @property {number} agi
 * @property {number} dex
 */

const Rarity = {
    common: 0,
    rare: 1,
    epic: 2,
    legendary: 3,
    event: 4
}

const itemContainerSize = {
    default: { x: 0, y: 0, width: 1000, height: 1000 },
    hair: { x: 100, y: -50, width: 700, height: 550 },
    top: { x: 180, y: 200, width: 400, height: 550 },
    bottom: { x: 200, y: 320, width: 600, height: 400 },
    shoes: { x: 300, y: 600, width: 400, height: 400 }
};

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

    /** @returns {Array<Item>} */
    GetBuyable() {
        return this.items.filter(i => i.Rarity <= 3);
    }

    /**
     * @param {string} ID
     * @returns {Item?}
     */
    GetByID = (ID) => this.items.find(item => item.ID === ID) || null;

    /**
     * @param {'default'|Slot} slot
     * @returns {{ x: number, y: number, width: number, height: number }}
     */
    GetContainerSize = (slot) => itemContainerSize[slot];
}

export { Item, Rarity };
export default Items;