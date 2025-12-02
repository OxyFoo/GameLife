import React, { useState, useMemo, useCallback } from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import ItemDetailPanel from './ItemDetailPanel';
import { EQUIPMENT_SLOTS } from '../back';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { Button } from 'Interface/Components';
import { AVATAR_BODIES, BODY_COLORS } from '../avatarConstants';

/**
 * @typedef {import('@oxyfoo/avatar-factory').AvatarCharacterProps} AvatarCharacterProps
 * @typedef {import('../back').InventorySlotType} InventorySlotType
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').ItemSlot} ItemSlot
 * @typedef {import('@oxyfoo/avatar-factory').ItemName} ItemName
 * @typedef {import('@oxyfoo/avatar-factory').AvatarName} AvatarName
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').Item} Item
 * @typedef {{slot: ItemSlot, itemName: ItemName, stuffID: number, item: Item}} OwnedSlotItem
 * @typedef {{slot: ItemSlot, itemName: ItemName, isEmpty?: boolean}} DisplayedItem
 * @typedef {{slot: 'bodyColor', color: string}} BodyColorItem
 * @typedef {{slot: 'avatar', bodyType: AvatarName}} AvatarBodyItem
 * @typedef {{changeSlot: (slot: InventorySlotType) => void}} InventoryPanelRef
 */

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
 * @param {(itemId: ItemName) => void} [props.onItemSell] - Callback called when selling an item
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
    onItemSelect,
    onItemSell
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
     * Build user-owned items grouped by slot
     */
    const ownedItemsBySlot = useMemo(() => {
        /** @type {Record<ItemSlot, OwnedSlotItem[]>} */
        const grouped = {
            hair: [],
            top: [],
            bottom: [],
            shoes: []
        };

        EQUIPMENT_SLOTS.forEach((slot) => {
            const slotItems = [];
            const stuffs = user.inventory.GetStuffsBySlot(slot);
            for (const stuff of stuffs) {
                const itemData = dataManager.items.GetByID(stuff.ItemID);
                if (itemData === null) continue;

                slotItems.push({
                    slot,
                    stuffID: stuff.ID,
                    itemName: /** @type {ItemName} */ (stuff.ItemID),
                    item: itemData
                });
            }
            grouped[slot] = slotItems;
        });

        return grouped;
    }, []);

    /**
     * Retrieves the items to display according to the selected slot
     * @returns {(OwnedSlotItem | BodyColorItem | AvatarBodyItem | { isEmpty: true })[]}
     */
    const displayedItems = useMemo(() => {
        /** @type {(OwnedSlotItem | BodyColorItem | AvatarBodyItem | { isEmpty: true })[]} */
        const items = [];
        if (selectedSlot === 'bodyColor') {
            BODY_COLORS.forEach((color) => items.push({ slot: 'bodyColor', color }));
        } else if (selectedSlot === 'all') {
            AVATAR_BODIES.forEach((_bodyType) => {
                items.push({ slot: 'avatar', bodyType: _bodyType });
            });
        } else {
            const slot = /** @type {ItemSlot} */ (selectedSlot);
            ownedItemsBySlot[slot]?.forEach((ownedItem) => items.push(ownedItem));
        }

        const remainder = items.length % 4;
        if (remainder !== 0) {
            const emptyItemsCount = 4 - remainder;
            for (let i = 0; i < emptyItemsCount; i++) {
                items.push({ isEmpty: true });
            }
        }

        return items;
    }, [selectedSlot, ownedItemsBySlot]);

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
                const avatarPreview = dataManager.items.GetContainerSize('avatar');
                const avatarPos = avatarPreview.pos || { x: 0, y: 0 };
                const avatarScale = avatarPreview.scale || 1;

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
                                position={avatarPos}
                                scale={avatarScale}
                            />
                        </AvatarFrame>
                    </Button>
                );
            }

            // Regular avatar item owned by the user
            const ownedItem = /** @type {OwnedSlotItem} */ (item);
            const isSelected = localAvatarItems.some((avatarItem) => avatarItem.id === ownedItem.itemName);
            const slotPreview = dataManager.items.GetContainerSize(ownedItem.slot);
            const slotPos = slotPreview.pos || { x: 0, y: 0 };
            const slotScale = slotPreview.scale || 1;

            return (
                <Button
                    style={styles.itemButton}
                    appearance='uniform'
                    color='transparent'
                    onPress={() => {
                        // TODO: Mettre cette fonction dans le back
                        // Open item detail panel with priority (stacked on top)
                        user.interface.bottomPanel?.Open({
                            priority: true,
                            content: (
                                <ItemDetailPanel
                                    itemName={ownedItem.itemName}
                                    slot={ownedItem.slot}
                                    bodyType={selectedBody}
                                    bodyColor={panelBodyColor}
                                    isEquipped={isSelected}
                                    onEquip={(itemId) => {
                                        // Update local state
                                        const slotType = itemId.split('_')[0];
                                        const index = localAvatarItems.findIndex((avatarItem) =>
                                            String(avatarItem.id).startsWith(slotType)
                                        );
                                        if (index !== -1) {
                                            const newItems = [...localAvatarItems];
                                            newItems[index] = { id: itemId };
                                            setLocalAvatarItems(newItems);
                                        }

                                        user.inventory.Equip(ownedItem.slot, ownedItem.stuffID);
                                        onItemSelect?.(itemId);

                                        // TODO: TEMP ?
                                        if (ownedItem.slot === 'bottom') setTmpBottomItem(itemId);
                                    }}
                                    onSell={(itemId) => {
                                        onItemSell?.(itemId);
                                    }}
                                    onClose={() => {
                                        user.interface.bottomPanel?.Close();
                                    }}
                                />
                            )
                        });
                    }}
                >
                    <AvatarFrame
                        key={`avatar-frame-${ownedItem.slot}-${ownedItem.itemName}`}
                        width={frameSize}
                        height={frameSize}
                        backgroundColor={isSelected ? themeManager.GetColor('main1') : '#00000000'}
                    >
                        <AvatarCharacter
                            body={selectedBody}
                            bodyColor={panelBodyColor}
                            items={
                                ownedItem.slot !== 'top'
                                    ? [{ id: ownedItem.itemName }]
                                    : [{ id: ownedItem.itemName }, { id: tmpBottomItem }]
                            }
                            position={slotPos}
                            scale={slotScale}
                            portraitMode={ownedItem.slot === 'hair'}
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
            onItemSell,
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
                extraData={{ panelBodyColor, localAvatarItems, selectedBody, ownedItemsBySlot }}
                renderItem={renderItem}
                keyExtractor={(item, index) => {
                    if ('isEmpty' in item && item.isEmpty) return `empty-${index}`;
                    if ('slot' in item && item.slot === 'bodyColor') return `color-${item.color}`;
                    if ('slot' in item && item.slot === 'avatar') return `avatar-${item.bodyType}`;
                    return `${item.slot}-${'stuffID' in item ? item.stuffID : item.itemName}`;
                }}
                removeClippedSubviews={false}
                numColumns={4}
                scrollEnabled={false}
            />
        </View>
    );
};

export default InventoryPanel;
