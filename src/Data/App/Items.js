import { IAppData } from '@oxyfoo/gamelife-types/Interface/IAppData';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').ItemID} ItemID
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').Item} Item
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').ItemSlot} Slot
 * @typedef {import('@oxyfoo/avatar-factory').AvatarCharacterProps} AvatarCharacterProps
 *
 * @typedef {{ pos: AvatarCharacterProps['position'], scale: AvatarCharacterProps['scale'] }} CharacterContainerSize
 *
 * @typedef {object} Buff
 * @property {number} int
 * @property {number} soc
 * @property {number} for
 * @property {number} sta
 * @property {number} agi
 * @property {number} dex
 *
 * @typedef {'avatar' | 'bodyColor' | Slot} SlotType
 * @typedef {'all' | 'bodyColor' | Slot} InventorySlotType
 * @typedef {{ x?: number, y?: number, scale?: number }} AvatarPosition
 */

/** @type {{ [key in SlotType]: CharacterContainerSize }} */
const avatarPreviewConfig = {
    avatar: {
        pos: { x: 0, y: -0.7 },
        scale: 2
    },
    bodyColor: {
        pos: { x: 0, y: 0 },
        scale: 1
    },
    hair: {
        pos: { x: 0, y: -3.5 },
        scale: 5
    },
    top: {
        pos: { x: 0, y: -1 },
        scale: 3
    },
    bottom: {
        pos: { x: 0, y: 0.5 },
        scale: 2
    },
    shoes: {
        pos: { x: 0, y: 1.6 },
        scale: 2.5
    }
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
     * @param {ItemID} itemID Item ID
     * @param {Item[]} items List of items to get dyables items
     * @returns {Item[]} List of dyables items for the given item
     */
    GetDyables(itemID, items = this.items) {
        const itemMainID = itemID.split('-')[0];
        return items.filter((i) => i.ID.startsWith(itemMainID + '-') && i.ID !== itemID);
    }

    /**
     * @param {ItemID} ID
     * @returns {Item | null}
     */
    GetByID = (ID) => this.items.find((item) => item.ID === ID) || null;

    /**
     * Retrieve avatar preview configuration for a slot
     * @param {'avatar' | 'bodyColor' | Slot | 'all'} slot
     * @returns {CharacterContainerSize}
     */
    GetContainerSize = (slot = 'avatar') => {
        if (slot === 'all') {
            return avatarPreviewConfig.avatar;
        }

        return avatarPreviewConfig[slot] || avatarPreviewConfig.avatar;
    };
}

export default Items;
