/**
 * @typedef {import('@oxyfoo/avatar-factory').ItemConfig} ItemConfig
 * @typedef {import('@oxyfoo/avatar-factory').AvatarCharacterProps} AvatarCharacterProps
 * @typedef {'all' | 'hair' | 'top' | 'bottom' | 'shoes'} InventorySlotType
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').ItemSlot} ItemSlot
 * @typedef {import('@oxyfoo/avatar-factory').ItemName} ItemName
 * @typedef {{x?: number, y?: number, scale?: number}} AvatarPosition
 */

/** @type {{ [key in ItemSlot]: ItemName[] }} */
export const AVAILABLE_ITEMS = {
    hair: ['hair_00', 'hair_01', 'hair_02'],
    top: ['top_00', 'top_01', 'top_02'],
    bottom: ['bottom_00', 'bottom_01', 'bottom_02'],
    shoes: ['shoes_00', 'shoes_01', 'shoes_02']
};

/** @type {{ [key in ItemSlot]: { pos: AvatarCharacterProps['position'], scale: AvatarCharacterProps['scale'] } }} */
export const AVATAR_POSITION_IN_FRAME = {
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

/**
 * TODO: Connecter au back
 * Get initial avatar items configuration
 * @returns {ItemConfig[]}
 */
export const getInitialAvatarItems = () => {
    return [{ id: 'face_00' }, { id: 'hair_00' }, { id: 'top_00' }, { id: 'bottom_00' }, { id: 'shoes_00' }];
};

/**
 * TODO: Remplacer par une vrai fonction qui gère les différents slots
 * Update avatar items with a new item
 * @param {ItemConfig[]} currentItems - Current avatar items
 * @param {string} itemId - The new item id to equip
 * @returns {ItemConfig[]} Updated avatar items
 */
export const updateAvatarItem = (currentItems, itemId) => {
    const slotType = itemId.split('_')[0];
    const index = currentItems.findIndex((item) => String(item.id).startsWith(slotType));

    if (index !== -1) {
        const newAvatarItems = [...currentItems];
        newAvatarItems[index] = { id: /** @type {ItemName} */ (itemId) };
        return newAvatarItems;
    }

    return currentItems;
};

/**
 * Get avatar position configuration based on selected category
 * @param {InventorySlotType | null} category
 * @returns {Pick<Required<AvatarPosition>, 'y' | 'scale'>}
 */
export const getAvatarPositionForCategory = (category) => {
    switch (category) {
        case 'hair':
            return { y: 220, scale: 1.75 };
        case 'top':
            return { y: -50, scale: 1.2 };
        case 'bottom':
            return { y: -300, scale: 0.8 };
        case 'shoes':
            return { y: -400, scale: 0.7 };
        case 'all':
        default:
            return { y: -100, scale: 1 };
    }
};

/**
 * Get default avatar position configuration
 * @returns {Required<AvatarPosition>}
 */
export const getDefaultAvatarPosition = () => {
    return { x: -1 / 4, y: 0, scale: 1 };
};

/**
 * Get edit mode avatar position configuration
 * @returns {Pick<Required<AvatarPosition>, 'x' | 'y'>}
 */
export const getEditModeAvatarPosition = () => {
    return { x: -1 / 2, y: -100 };
};
