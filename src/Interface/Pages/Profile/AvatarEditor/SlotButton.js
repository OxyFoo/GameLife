import React from 'react';
import { View } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { Button } from 'Interface/Components';

/**
 * @typedef {import('./back').InventorySlotType} InventorySlotType
 * @typedef {import('./back').SlotType} SlotType
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').ItemSlot} ItemSlot
 * @typedef {import('@oxyfoo/avatar-factory').ItemName} ItemName
 * @typedef {import('@oxyfoo/avatar-factory').AvatarName} AvatarName
 */

/**
 * @typedef {object} SlotButtonProps
 * @property {SlotType} slotType
 * @property {InventorySlotType} category
 * @property {InventorySlotType} selectedSlot
 * @property {Array<{id: ItemName}>} avatarItems
 * @property {string} bodyColor
 * @property {AvatarName} [bodyType] - Current selected avatar body type
 * @property {(slotType: SlotType) => void} onPress
 */

/**
 * Slot button component
 * @param {SlotButtonProps} props
 * @returns {React.ReactElement}
 */
const SlotButton = ({ slotType, category, selectedSlot, avatarItems, bodyColor, bodyType, onPress }) => {
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

    const slotPreview = dataManager.items.GetContainerSize(slotType);
    const avatarPos = slotPreview.pos ?? { x: 0, y: 0 };
    const avatarScale = slotPreview.scale ?? 1;

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
                    body={bodyType ?? 'human_00'}
                    bodyColor={bodyColor}
                    position={avatarPos}
                    rotation={{ x: 0, y: 0, z: 0 }}
                    scale={avatarScale}
                    items={getPreviewItems()}
                />
            </AvatarFrame>
        </Button>
    );
};

export default SlotButton;
