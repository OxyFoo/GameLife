/**
 * @typedef {import('@oxyfoo/avatar-factory').AvatarName} AvatarName
 * @typedef {import('./back').InventorySlotType} InventorySlotType
 * @typedef {{x?: number, y?: number, scale?: number}} AvatarPosition
 */

/** Available avatar body types */
/** @type {AvatarName[]} */
export const AVATAR_BODIES = ['human_00', 'human_01'];

// TODO: Available body colors should come from backend / user profile / db ?
/** Available body colors */
export const BODY_COLORS = ['#FFF5E1', '#FFDAB9', '#E8B89A', '#D1A684', '#B5866B', '#8D5524', '#5C4033', '#3B2414'];

/**
 * Get avatar position configuration based on selected category
 * @param {InventorySlotType | null} category
 * @returns {Required<AvatarPosition>}
 */
export const getAvatarPositionForCategory = (category) => {
    switch (category) {
        case 'hair':
            return { x: -1 / 2, y: 220, scale: 1.75 };
        case 'top':
            return { x: -1 / 2, y: -50, scale: 1.2 };
        case 'bottom':
            return { x: -1 / 2, y: -300, scale: 0.8 };
        case 'shoes':
            return { x: -1 / 2, y: -400, scale: 0.7 };
        case 'bodyColor':
        case 'all':
        default:
            return { x: -1 / 2, y: -100, scale: 1 };
    }
};

/**
 * Get default avatar position configuration
 * @returns {Required<AvatarPosition>}
 */
export const getDefaultAvatarPosition = () => {
    return { x: -1 / 4, y: 0, scale: 1 };
};
