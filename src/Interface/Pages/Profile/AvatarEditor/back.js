import user from 'Managers/UserManager';
import { BODY_COLORS } from './avatarConstants';

/**
 * @typedef {import('@oxyfoo/avatar-factory').ItemName} ItemName
 * @typedef {import('@oxyfoo/avatar-factory').AvatarName} AvatarName
 * @typedef {import('@oxyfoo/avatar-factory').ItemConfig} ItemConfig
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').ItemSlot} ItemSlot
 *
 * @typedef {'all' | 'bodyColor' | 'hair' | 'top' | 'bottom' | 'shoes'} InventorySlotType
 * @typedef {'avatar' | 'bodyColor' | 'hair' | 'top' | 'bottom' | 'shoes'} SlotType
 * @typedef {{x?: number, y?: number, scale?: number}} AvatarPosition
 */

/** @type {ItemSlot[]} */
export const EQUIPMENT_SLOTS = ['hair', 'top', 'bottom', 'shoes'];

/** @type {{ [key in ItemSlot]: ItemName }} */
const DEFAULT_ITEMS_BY_SLOT = {
    hair: 'hair_00',
    top: 'top_00',
    bottom: 'bottom_00',
    shoes: 'shoes_00'
};

/** @type {ItemName} */
const FACE_ITEM_ID = 'face_00';

/**
 * Return avatar item configs reflecting the current backend state
 * @returns {ItemConfig[]}
 */
export const getInitialAvatarItems = () => {
    const equippedItems = EQUIPMENT_SLOTS.map((slot) => createItemConfig(getEquippedItemID(slot)));
    return [createItemConfig(FACE_ITEM_ID), ...equippedItems];
};

/**
 * Update avatar preview configuration locally
 * @param {ItemConfig[]} currentItems
 * @param {ItemName} itemId
 * @returns {ItemConfig[]}
 */
export const updateAvatarItem = (currentItems, itemId) => {
    const slotType = /** @type {ItemSlot} */ (itemId.split('_')[0]);
    if (!slotType) {
        return currentItems;
    }

    const slotIndex = EQUIPMENT_SLOTS.indexOf(slotType);
    if (slotIndex === -1) {
        return currentItems;
    }

    const newAvatarItems = [...currentItems];
    newAvatarItems[slotIndex + 1] = createItemConfig(itemId);
    return newAvatarItems;
};

/**
 * Get hex body color currently stored for the user
 * @returns {string}
 */
export const getBodyColorHexFromUser = () => {
    const colorIndex = user.inventory.avatar.skinColor;
    return BODY_COLORS[colorIndex] || BODY_COLORS[0];
};

/**
 * Persist a body color selection back to the user inventory
 * @param {string} colorHex
 */
export const setBodyColorHexOnUser = (colorHex) => {
    const nextIndex = BODY_COLORS.findIndex((color) => color.toLowerCase() === colorHex.toLowerCase());
    if (nextIndex === -1) {
        return;
    }
    user.inventory.SetSkinColor(nextIndex);
};

/**
 * Retrieve currently selected avatar body type
 * @returns {AvatarName}
 */
export const getBodyTypeFromUser = () => {
    return user.inventory.avatar.skin || 'human_00';
};

/**
 * Persist avatar body type change
 * @param {AvatarName} bodyType
 */
export const setBodyTypeOnUser = (bodyType) => {
    user.inventory.SetSkin(bodyType);
};

/**
 * @param {ItemSlot} slot
 * @returns {ItemName}
 */
const getEquippedItemID = (slot) => {
    const equippedStuffID = user.inventory.avatar[slot];
    const stuff = user.inventory.GetStuffByID(equippedStuffID);
    if (stuff !== null && typeof stuff !== 'undefined') {
        return stuff.ItemID;
    }

    return DEFAULT_ITEMS_BY_SLOT[slot];
};

/**
 * @param {ItemName} itemId
 * @returns {ItemConfig}
 */
const createItemConfig = (itemId) => ({ id: itemId });
