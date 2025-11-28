import React from 'react';
import { View } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import themeManager from 'Managers/ThemeManager';
import { Button } from 'Interface/Components';

/**
 * @typedef {import('./back').InventorySlotType} InventorySlotType
 * @typedef {import('./back').ItemSlot} ItemSlot
 * @typedef {import('@oxyfoo/avatar-factory').ItemName} ItemName
 * @typedef {'avatar' | 'bodyColor' | 'hair' | 'top' | 'bottom' | 'shoes'} SlotType
 */

/**
 * @typedef {object} SlotButtonProps
 * @property {SlotType} slotType
 * @property {InventorySlotType} category
 * @property {InventorySlotType} selectedSlot
 * @property {Array<{id: ItemName}>} avatarItems
 * @property {string} bodyColor
 * @property {(slotType: SlotType) => void} onPress
 */

/**
 * Slot button component
 * @param {SlotButtonProps} props
 * @returns {React.ReactElement}
 */
const SlotButton = ({ slotType, category, selectedSlot, avatarItems, bodyColor, onPress }) => {
    const isSelected = selectedSlot === category;
    const bgColor = themeManager.GetColor(isSelected ? 'main1' : 'backgroundCard');

    /**
     * Get items to display in slot preview
     * @returns {Array<{id: ItemName}>}
     */
    const getPreviewItems = () => {
        if (slotType === 'avatar') return avatarItems;
        if (slotType === 'bodyColor') return [];

        const slot = /** @type {ItemSlot} */ (slotType);
        const foundItem = avatarItems.find((item) => String(item.id).startsWith(slot));
        if (!foundItem) return [];

        // For 'top', also show bottom item
        if (slotType === 'top') {
            const bottomItem = avatarItems.find((item) => String(item.id).startsWith('bottom'));
            return bottomItem ? [foundItem, bottomItem] : [foundItem];
        }

        return [foundItem];
    };

    /**
     * Get avatar position config for slot type
     * @returns {{x: number, y: number, scale: number}}
     */
    const getAvatarConfig = () => {
        const configs = {
            avatar: { x: 0, y: 0, scale: 1 },
            bodyColor: { x: 0, y: 0, scale: 1 },
            hair: { x: 0, y: -3.5, scale: 5 },
            top: { x: 0, y: -1, scale: 3 },
            bottom: { x: 0, y: 0.5, scale: 2 },
            shoes: { x: 0, y: 1.6, scale: 2.5 }
        };
        return configs[slotType];
    };

    const config = getAvatarConfig();

    // Special rendering for body color slot (simple color square View)
    if (slotType === 'bodyColor') {
        return (
            <Button
                style={styles.slotButton}
                appearance='uniform'
                color={isSelected ? 'main1' : 'backgroundCard'}
                onPress={() => onPress(slotType)}
            >
                <View style={[styles.colorSquare, { backgroundColor: bodyColor }]} />
            </Button>
        );
    }

    return (
        <Button
            style={styles.slotButton}
            appearance='uniform'
            color={isSelected ? 'main1' : 'backgroundCard'}
            onPress={() => onPress(slotType)}
        >
            <AvatarFrame width={64} height={64} backgroundColor={bgColor}>
                <AvatarCharacter
                    body={'human_00'}
                    bodyColor={bodyColor}
                    position={{ x: config.x, y: config.y, z: 0 }}
                    rotation={{ x: 0, y: 0, z: 0 }}
                    scale={config.scale}
                    items={getPreviewItems()}
                />
            </AvatarFrame>
        </Button>
    );
};

export default SlotButton;
