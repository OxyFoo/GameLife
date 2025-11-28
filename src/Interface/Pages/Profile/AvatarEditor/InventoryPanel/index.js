import React, { useState, useMemo, useCallback } from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

import { Button } from 'Interface/Components';
import { AVATAR_POSITION_CONFIG, AVATAR_BODIES, BODY_COLORS } from '../avatarConstants';

/**
 * @typedef {import('@oxyfoo/avatar-factory').AvatarCharacterProps} AvatarCharacterProps
 * @typedef {import('../back').InventorySlotType} InventorySlotType
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').ItemSlot} ItemSlot
 * @typedef {import('@oxyfoo/avatar-factory').ItemName} ItemName
 * @typedef {import('@oxyfoo/avatar-factory').AvatarName} AvatarName
 * @typedef {{slot: ItemSlot, itemName: ItemName, isEmpty?: boolean}} DisplayedItem
 * @typedef {{slot: 'bodyColor', color: string}} BodyColorItem
 * @typedef {{slot: 'avatar', bodyType: AvatarName}} AvatarBodyItem
 * @typedef {{changeSlot: (slot: InventorySlotType) => void}} InventoryPanelRef
 */

// TODO: Available items should come from backend / user profile
/** @type {{ [key in ItemSlot]: ItemName[] }} */
const AVAILABLE_ITEMS = {
    hair: ['hair_00', 'hair_01', 'hair_02'],
    top: ['top_00', 'top_01', 'top_02'],
    bottom: ['bottom_00', 'bottom_01', 'bottom_02'],
    shoes: ['shoes_00', 'shoes_01', 'shoes_02']
};

/**
 * @param {object} props
 * @param {Array<{id: ItemName}>} props.avatarItems - Current avatar items
 * @param {string} props.bodyColor - Current body color
 * @param {AvatarName} props.bodyType - Current body type
 * @param {InventorySlotType} props.selectedSlot - Currently selected slot
 * @param {(slot: InventorySlotType) => void} [props.onSlotChange] - Callback called when changing slot
 * @param {(itemId: ItemName) => void} [props.onItemSelect] - Callback called when selecting an item
 * @param {(color: string) => void} [props.onBodyColorSelect] - Callback called when selecting a body color
 * @param {(body: AvatarName) => void} [props.onBodyTypeSelect] - Callback called when selecting a body type
 * @param {React.RefObject<InventoryPanelRef | null>} [props.forwardedRef] - Ref to expose changeSlot method
 */
const InventoryPanel = ({
    forwardedRef,
    bodyType,
    bodyColor,
    avatarItems,
    selectedSlot: initialSelectedSlot,
    onBodyTypeSelect,
    onBodyColorSelect,
    onSlotChange,
    onItemSelect
}) => {
    const [selectedSlot, setSelectedSlot] = useState(initialSelectedSlot);
    const [tmpBottomItem, setTmpBottomItem] = useState(avatarItems[3].id);
    const [panelBodyColor, setPanelBodyColor] = useState(bodyColor);
    const [localAvatarItems, setLocalAvatarItems] = useState(avatarItems);
    const [selectedBody, setSelectedBody] = useState(bodyType);

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
     * @returns {(DisplayedItem | BodyColorItem | AvatarBodyItem | { isEmpty: true })[]}
     */
    const displayedItems = useMemo(() => {
        /** @type {(DisplayedItem | BodyColorItem | AvatarBodyItem | { isEmpty: true })[]} */
        const items = [];
        if (selectedSlot === 'bodyColor') {
            BODY_COLORS.forEach((color) => items.push({ slot: 'bodyColor', color }));
        } else if (selectedSlot === 'all') {
            // Show avatar bodies with full equipment
            AVATAR_BODIES.forEach((_bodyType) => {
                items.push({ slot: 'avatar', bodyType: _bodyType });
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
    }, [selectedSlot]);

    /**
     * Renders an item in the inventory
     * @param {{item: DisplayedItem | BodyColorItem | AvatarBodyItem | { isEmpty: true }}} param
     */
    const { width: screenWidth } = useWindowDimensions();
    const frameSize = useMemo(() => screenWidth / 4 - 12, [screenWidth]);

    const renderItem = useCallback(
        /** @param {{item: DisplayedItem | BodyColorItem | AvatarBodyItem | { isEmpty: true }}} param */
        ({ item }) => {
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

            // Avatar body item (full avatar)
            if ('slot' in item && item.slot === 'avatar') {
                const isSelected = selectedBody === item.bodyType;

                return (
                    <Button
                        style={styles.itemButton}
                        appearance='uniform'
                        color='transparent'
                        onPress={() => {
                            setSelectedBody(item.bodyType);
                            onBodyTypeSelect?.(item.bodyType);
                        }}
                    >
                        <AvatarFrame
                            key={`avatar-frame-body-${item.bodyType}`}
                            width={frameSize}
                            height={frameSize}
                            backgroundColor={isSelected ? themeManager.GetColor('main1') : '#00000000'}
                        >
                            <AvatarCharacter
                                body={item.bodyType}
                                bodyColor={panelBodyColor}
                                items={localAvatarItems.slice(1)}
                                position={AVATAR_POSITION_CONFIG.avatar.pos}
                                scale={AVATAR_POSITION_CONFIG.avatar.scale}
                            />
                        </AvatarFrame>
                    </Button>
                );
            }

            // Regular avatar item
            const isSelected = localAvatarItems.some((avatarItem) => avatarItem.id === item.itemName);

            return (
                <Button
                    style={styles.itemButton}
                    appearance='uniform'
                    color='transparent'
                    onPress={() => {
                        // Update local state
                        const slotType = item.itemName.split('_')[0];
                        const index = localAvatarItems.findIndex((avatarItem) =>
                            String(avatarItem.id).startsWith(slotType)
                        );
                        if (index !== -1) {
                            const newItems = [...localAvatarItems];
                            newItems[index] = { id: item.itemName };
                            setLocalAvatarItems(newItems);
                        }

                        onItemSelect?.(item.itemName);

                        // TODO: TEMP
                        if (item.slot === 'bottom') setTmpBottomItem(item.itemName);
                    }}
                >
                    <AvatarFrame
                        key={`avatar-frame-${item.slot}-${item.itemName}`}
                        width={frameSize}
                        height={frameSize}
                        backgroundColor={isSelected ? themeManager.GetColor('main1') : '#00000000'}
                    >
                        <AvatarCharacter
                            body={selectedBody}
                            bodyColor={panelBodyColor}
                            items={
                                item.slot !== 'top'
                                    ? [{ id: item.itemName }]
                                    : [{ id: item.itemName }, { id: tmpBottomItem }]
                            }
                            position={AVATAR_POSITION_CONFIG[item.slot].pos}
                            scale={AVATAR_POSITION_CONFIG[item.slot].scale}
                            portraitMode={item.slot === 'hair'}
                        />
                    </AvatarFrame>
                </Button>
            );
        },
        [
            panelBodyColor,
            localAvatarItems,
            selectedBody,
            tmpBottomItem,
            onBodyColorSelect,
            onBodyTypeSelect,
            onItemSelect,
            frameSize
        ]
    );

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.flatList}
                ref={user.interface.bottomPanel?.mover.SetScrollView}
                onLayout={user.interface.bottomPanel?.mover.onLayoutFlatList}
                onContentSizeChange={user.interface.bottomPanel?.mover.onContentSizeChange}
                contentContainerStyle={styles.itemsContainer}
                data={displayedItems}
                extraData={{ panelBodyColor, localAvatarItems, selectedBody }}
                renderItem={renderItem}
                keyExtractor={(item, index) => {
                    if ('isEmpty' in item && item.isEmpty) return `empty-${index}`;
                    if ('slot' in item && item.slot === 'bodyColor') return `color-${item.color}`;
                    if ('slot' in item && item.slot === 'avatar') return `avatar-${item.bodyType}`;
                    return `${item.slot}-${item.itemName}`;
                }}
                removeClippedSubviews={false}
                numColumns={4}
                scrollEnabled={false}
            />
        </View>
    );
};

export default InventoryPanel;
