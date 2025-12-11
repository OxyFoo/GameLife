import user from 'Managers/UserManager';

/**
 * @typedef {import('@oxyfoo/avatar-factory').AvatarName} AvatarName
 * @typedef {import('@oxyfoo/avatar-factory').ItemConfig} ItemConfig
 *
 * @typedef {'all' | 'bodyColor' | 'hair' | 'top' | 'bottom' | 'shoes'} InventorySlotType
 * @typedef {'avatar' | 'bodyColor' | 'hair' | 'top' | 'bottom' | 'shoes'} SlotType
 * @typedef {{x?: number, y?: number, scale?: number}} AvatarPosition
 */

/**
 * Return avatar item configs reflecting the current backend state
 * @returns {ItemConfig[]}
 */
export const getInitialAvatarItems = () => {
    return user.inventory.GetAvatarItems();
};

/**
 * Get hex body color currently stored for the user
 * @returns {string}
 */
export const getBodyColorHexFromUser = () => {
    return user.inventory.GetBodyColorHex();
};

/**
 * Persist a body color selection back to the user inventory
 * @param {string} colorHex
 */
export const setBodyColorHexOnUser = (colorHex) => {
    user.inventory.SetBodyColorHex(colorHex);
};

/**
 * Retrieve currently selected avatar body type
 * @returns {AvatarName}
 */
export const getBodyTypeFromUser = () => {
    return user.inventory.GetBodyType();
};

/**
 * Persist avatar body type change
 * @param {AvatarName} bodyType
 */
export const setBodyTypeOnUser = (bodyType) => {
    user.inventory.SetBodyType(bodyType);
};
