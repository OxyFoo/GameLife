import React, { useState } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

import { Button } from 'Interface/Components';

/**
 * @typedef {import('@oxyfoo/avatar-factory').AvatarCharacterProps} AvatarCharacterProps
 * @typedef {'all' | 'bodyColor' | 'hair' | 'top' | 'bottom' | 'shoes'} InventorySlotType
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').ItemSlot} ItemSlot
 * @typedef {import('@oxyfoo/avatar-factory').ItemName} ItemName
 * @typedef {{slot: ItemSlot, itemName: ItemName, isEmpty?: boolean}} DisplayedItem
 * @typedef {{slot: 'bodyColor', color: string}} BodyColorItem
 * @typedef {{changeSlot: (slot: InventorySlotType) => void}} InventoryPanelRef
 */

// TODO: Available body colors should come from backend / user profile / db ?
/** Available body colors */
const BODY_COLORS = ['#f3e4d1', '#f2d2bb', '#d5a283', '#bc9665', '#b5956f', '#6b3d1c'];

/** @type {{ [key in ItemSlot]: ItemName[] }} */
const AVAILABLE_ITEMS = {
    hair: ['hair_00', 'hair_01', 'hair_02'],
    top: ['top_00', 'top_01', 'top_02'],
    bottom: ['bottom_00', 'bottom_01', 'bottom_02'],
    shoes: ['shoes_00', 'shoes_01', 'shoes_02']
};

/** @type {{ [key in ItemSlot]: { pos: AvatarCharacterProps['position'], scale: AvatarCharacterProps['scale'] } }} */
const AVATAR_POSITION_IN_FRAME = {
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
 * @param {object} props
 * @param {Array<{id: ItemName}>} props.avatarItems - Current avatar items
 * @param {string} props.bodyColor - Current body color
 * @param {(slot: InventorySlotType) => void} [props.onSlotChange] - Callback called when changing slot
 * @param {(itemId: ItemName) => void} [props.onItemSelect] - Callback called when selecting an item
 * @param {(color: string) => void} [props.onBodyColorSelect] - Callback called when selecting a body color
 * @param {React.RefObject<InventoryPanelRef | null>} [props.forwardedRef] - Ref to expose changeSlot method
 */
const InventoryPanel = ({ avatarItems, bodyColor, onSlotChange, onItemSelect, onBodyColorSelect, forwardedRef }) => {
    const [selectedSlot, setSelectedSlot] = useState(/** @type {InventorySlotType} */ ('hair'));
    const [tmpBottomItem, setTmpBottomItem] = useState(avatarItems[3].id);
    const [panelBodyColor, setPanelBodyColor] = useState(bodyColor);

    // Expose changeSlot function to parent
    React.useImperativeHandle(forwardedRef, () => ({
        /**
         * @param {InventorySlotType} slot
         */
        changeSlot: (slot) => {
            setSelectedSlot(slot);
            onSlotChange?.(slot);
        }
    }));

    /**
     * Retrieves the items to display according to the selected slot
     * @returns {(DisplayedItem | BodyColorItem | {isEmpty: true})[]}
     */
    const getDisplayedItems = () => {
        /** @type {(DisplayedItem | BodyColorItem | {isEmpty: true})[]} */
        const items = [];
        if (selectedSlot === 'bodyColor') {
            BODY_COLORS.forEach((color) => items.push({ slot: 'bodyColor', color }));
        } else if (selectedSlot === 'all') {
            // Show body colors
            BODY_COLORS.forEach((color) => {
                items.push({ slot: 'bodyColor', color });
            });

            // Show all items
            Object.entries(AVAILABLE_ITEMS).forEach(([slot, itemNames]) => {
                itemNames.forEach((itemName) => {
                    items.push({ slot: /** @type {ItemSlot} */ (slot), itemName });
                });
            });
        } else {
            // Regular item slots
            const itemNames = AVAILABLE_ITEMS[/** @type {ItemSlot} */ (selectedSlot)];
            itemNames.forEach((itemName) => {
                items.push({ slot: /** @type {ItemSlot} */ (selectedSlot), itemName });
            });
        }

        // Add empty items to have a multiple of 4
        const remainder = items.length % 4;
        if (remainder !== 0) {
            const emptyItemsCount = 4 - remainder;
            for (let i = 0; i < emptyItemsCount; i++) {
                items.push({ isEmpty: true });
            }
        }

        return items;
    };

    /**
     * Renders an item in the inventory
     * @param {{item: DisplayedItem | BodyColorItem | {isEmpty: true}}} param
     */
    const renderItem = ({ item }) => {
        const screenWidth = Dimensions.get('window').width;
        const frameSize = screenWidth / 4 - 12;

        // Empty slot
        if ('isEmpty' in item && item.isEmpty) {
            return (
                <View style={[styles.itemButton, styles.itemButtonNoBorder]}>
                    <View style={{ width: frameSize, height: frameSize }} />
                </View>
            );
        }

        // Body color item
        if ('slot' in item && item.slot === 'bodyColor') {
            const isSelected = panelBodyColor === item.color;
            return (
                <Button
                    style={[styles.itemButton, styles.itemButtonNoBorder]}
                    appearance='uniform'
                    color='transparent'
                    onPress={() => {
                        setPanelBodyColor(item.color);
                        onBodyColorSelect?.(item.color);
                    }}
                >
                    <View
                        style={[
                            { width: frameSize, height: frameSize, backgroundColor: item.color },
                            styles.colorSquare,
                            styles.colorSquareBorder,
                            isSelected ? styles.colorSquareSelected : null,
                            isSelected ? { borderColor: themeManager.GetColor('main1') } : null
                        ]}
                    />
                </Button>
            );
        }

        return (
            <Button
                style={styles.itemButton}
                appearance='uniform'
                color='transparent'
                onPress={() => {
                    onItemSelect?.(item.itemName);

                    // TODO: TEMP
                    if (item.slot === 'bottom') setTmpBottomItem(item.itemName);
                }}
            >
                <AvatarFrame
                    key={`avatar-frame-${item.slot}-${item.itemName}`}
                    width={frameSize}
                    height={frameSize}
                    backgroundColor='#00000000'
                >
                    <AvatarCharacter
                        body='human_00'
                        bodyColor={panelBodyColor}
                        items={
                            item.slot !== 'top'
                                ? [{ id: item.itemName }]
                                : [{ id: item.itemName }, { id: tmpBottomItem }]
                        }
                        position={AVATAR_POSITION_IN_FRAME[item.slot].pos}
                        scale={AVATAR_POSITION_IN_FRAME[item.slot].scale}
                        portraitMode={item.slot === 'hair'}
                    />
                </AvatarFrame>
            </Button>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.flatList}
                ref={user.interface.bottomPanel?.mover.SetScrollView}
                onLayout={user.interface.bottomPanel?.mover.onLayoutFlatList}
                onContentSizeChange={user.interface.bottomPanel?.mover.onContentSizeChange}
                contentContainerStyle={styles.itemsContainer}
                data={getDisplayedItems()}
                extraData={panelBodyColor}
                renderItem={renderItem}
                keyExtractor={(item, index) => {
                    if ('isEmpty' in item && item.isEmpty) return `empty-${index}`;
                    if ('slot' in item && item.slot === 'bodyColor') return `color-${item.color}`;
                    return `${item.slot}-${item.itemName}-${index}`;
                }}
                removeClippedSubviews={false}
                numColumns={4}
                scrollEnabled={false}
            />
        </View>
    );
};

export default InventoryPanel;
