/**
 * @typedef {'hair'|'face'|'accessory'|'weapon'|'top'|'gloves'|'bottom'|'shoes'} _OldSlot
 * @typedef {'hair'|'top'|'bottom'|'shoes'} Slot
 * @typedef {{ x: number, y: number, width: number, height: number }} CharacterContainerSize
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
};

const itemContainerSize = {
    default: { x: 0, y: 0, width: 1000, height: 1000 },
    hair: { x: 100, y: -50, width: 700, height: 550 },
    top: { x: 180, y: 200, width: 400, height: 550 },
    bottom: { x: 200, y: 320, width: 600, height: 400 },
    shoes: { x: 300, y: 600, width: 400, height: 400 }
};

class Item {
    /** @type {string} */
    ID = '';

    /** @type {Slot} */
    Slot = 'hair';

    Name = { fr: '', en: '' };
    Description = { fr: '', en: '' };

    /** @type {number} */
    Rarity = Rarity.common;

    /** @type {number} 0 = Not buyable, 1 = Buyable */
    Buyable = 0;

    /** @type {number} */
    Value = 0;

    /**
     * @type {Array<Buff>}
     * @deprecated
     */
    Buffs = [];
}

class Items {
    /** @type {Array<Item>} */
    items = [];

    Clear() {
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

    /**
     * @param {Slot|false} slot
     * @returns {Array<Item>}
     */
    GetBuyable(slot = false) {
        const checkSlot = s => slot === false || s === slot;
        return this.items.filter(i => i.Buyable && i.Rarity <= 3 && checkSlot(i.Slot));
    }

    /**
     * @param {string} itemID Item ID
     * @param {Array<Item>} items List of items to get dyables items
     * @returns {Array<Item>} List of dyables items for the given item
     */
    GetDyables(itemID, items = this.items) {
        const itemMainID = itemID.split('-')[0];
        return items.filter(i => i.ID.startsWith(itemMainID + '-') && i.ID !== itemID);
    }

    /**
     * @param {string} ID
     * @returns {Item?}
     */
    GetByID = (ID) => this.items.find(item => item.ID === ID) || null;

    /**
     * @param {'default'|Slot} slot
     * @returns {CharacterContainerSize}
     */
    GetContainerSize = (slot) => itemContainerSize[slot];
}

export { Item, Rarity };
export default Items;
