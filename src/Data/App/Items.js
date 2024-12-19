import { IAppData } from 'Types/Interface/IAppData';

/**
 * // TODO: Replace StuffID with ItemID in Types/Data/App/Items.js
 * @typedef {import('Ressources/items/stuffs/Stuffs').StuffID} StuffID
 *
 * @typedef {import('Types/Data/App/Items').Item} Item
 * @typedef {import('Types/Data/App/Items').ItemSlot} Slot
 *
 * @typedef {{ x: number, y: number, width: number, height: number }} CharacterContainerSize
 *
 * @typedef {object} Buff
 * @property {number} int
 * @property {number} soc
 * @property {number} for
 * @property {number} sta
 * @property {number} agi
 * @property {number} dex
 */

const itemContainerSize = {
    default: { x: 0, y: 0, width: 1000, height: 1000 },
    hair: { x: 100, y: -50, width: 700, height: 550 },
    top: { x: 180, y: 200, width: 400, height: 550 },
    bottom: { x: 200, y: 320, width: 600, height: 400 },
    shoes: { x: 300, y: 600, width: 400, height: 400 }
};

/** @extends {IAppData<Item[]>} */
class Items extends IAppData {
    /** @type {Item[]} */
    items = [];

    Clear = () => {
        this.items = [];
    };

    /** @param {Item[] | undefined} items */
    Load = (items) => {
        if (typeof items !== 'undefined') {
            this.items = items;
        }
    };

    Save = () => {
        return this.items;
    };

    /** @returns {Item[]} */
    Get = () => {
        return this.items;
    };

    /**
     * @param {Slot | false} slot
     * @returns {Item[]}
     */
    GetBuyable(slot = false) {
        return this.items.filter((i) => i.Buyable && (slot === false || i.Slot === slot));
    }

    /**
     * @param {StuffID} itemID Item ID
     * @param {Item[]} items List of items to get dyables items
     * @returns {Item[]} List of dyables items for the given item
     */
    GetDyables(itemID, items = this.items) {
        const itemMainID = itemID.split('-')[0];
        return items.filter((i) => i.ID.startsWith(itemMainID + '-') && i.ID !== itemID);
    }

    /**
     * @param {StuffID} ID
     * @returns {Item | null}
     */
    GetByID = (ID) => this.items.find((item) => item.ID === ID) || null;

    /**
     * @param {'default'|Slot} slot
     * @returns {CharacterContainerSize}
     */
    GetContainerSize = (slot) => itemContainerSize[slot];
}

export default Items;
