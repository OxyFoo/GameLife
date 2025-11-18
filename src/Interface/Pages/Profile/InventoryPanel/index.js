import React, { useState } from 'react';
import { View, ScrollView, FlatList, Dimensions } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import { Button } from 'Interface/Components';

/**
 * @typedef {import('@oxyfoo/avatar-factory').AvatarCharacterProps} AvatarCharacterProps
 * @typedef {'all' | 'hair' | 'top' | 'bottom' | 'shoes'} InventorySlotType
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').ItemSlot} ItemSlot
 * @typedef {import('@oxyfoo/avatar-factory').ItemName} ItemName
 */

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
 * @param {(slot: InventorySlotType) => void} [props.onSlotChange] - Callback called when changing slot
 */
const InventoryPanel = ({ onSlotChange }) => {
    /** @type {[InventorySlotType, React.Dispatch<React.SetStateAction<InventorySlotType>>]} */
    const [selectedSlot, setSelectedSlot] = useState(/** @type {InventorySlotType} */ ('all'));

    /**
     * Changes the selected inventory slot
     * @param {InventorySlotType} slot
     */
    const selectSlot = (slot) => {
        setSelectedSlot(slot);
        onSlotChange?.(slot);
    };

    /**
     * Retrieves the items to display according to the selected slot
     * @returns {Array<{slot: ItemSlot, itemName: ItemName, isEmpty?: boolean}>}
     */
    const getDisplayedItems = () => {
        /** @type {Array<{slot: ItemSlot, itemName: ItemName, isEmpty?: boolean}>} */
        const items = [];
        if (selectedSlot === 'all') {
            Object.entries(AVAILABLE_ITEMS).forEach(([slot, itemNames]) => {
                itemNames.forEach((itemName) => {
                    items.push({ slot: /** @type {ItemSlot} */ (slot), itemName });
                });
            });
        } else {
            const itemNames = AVAILABLE_ITEMS[selectedSlot];
            itemNames.forEach((itemName) => {
                items.push({ slot: selectedSlot, itemName });
            });
        }

        // Add empty items to have a multiple of 4
        const remainder = items.length % 4;
        if (remainder !== 0) {
            const emptyItemsCount = 4 - remainder;
            for (let i = 0; i < emptyItemsCount; i++) {
                items.push({ slot: 'hair', itemName: 'hair_00', isEmpty: true });
            }
        }

        return items;
    };

    /**
     * Renders an item in the inventory
     * @param {{item: {slot: ItemSlot, itemName: ItemName, isEmpty?: boolean}}} param
     */
    const renderItem = ({ item }) => {
        const screenWidth = Dimensions.get('window').width;
        const frameSize = screenWidth / 4 - 12;

        // Empty slot
        if (item.isEmpty) {
            return <View style={{ width: frameSize, height: frameSize }} />;
        }

        return (
            <Button style={styles.itemButton} appearance='uniform' color='transparent'>
                <AvatarFrame
                    key={`avatar-frame-${item.slot}-${item.itemName}-${Math.random()}`}
                    width={frameSize}
                    height={frameSize}
                    backgroundColor='#00000000'
                >
                    <AvatarCharacter
                        body='human_00'
                        // bodyColor='#d4d4d4'
                        items={[{ id: item.itemName }]}
                        position={AVATAR_POSITION_IN_FRAME[item.slot].pos}
                        scale={AVATAR_POSITION_IN_FRAME[item.slot].scale}
                        portraitMode={item.slot === 'hair'}
                        // showcaseMode
                    />
                </AvatarFrame>
            </Button>
        );
    };

    return (
        <View>
            <ScrollView style={styles.scrollView} horizontal nestedScrollEnabled>
                <Button
                    style={styles.slotButton}
                    appearance={selectedSlot === 'all' ? 'uniform' : 'outline'}
                    color={selectedSlot === 'all' ? 'main1' : undefined}
                    borderColor={selectedSlot === 'all' ? undefined : 'main1'}
                    fontColor={selectedSlot === 'all' ? 'automatic' : 'main1'}
                    onPress={() => selectSlot('all')}
                >
                    [TOUT]
                </Button>
                <Button
                    style={styles.slotButton}
                    appearance={selectedSlot === 'hair' ? 'uniform' : 'outline'}
                    color={selectedSlot === 'hair' ? 'main1' : undefined}
                    borderColor={selectedSlot === 'hair' ? undefined : 'main1'}
                    fontColor={selectedSlot === 'hair' ? 'automatic' : 'main1'}
                    onPress={() => selectSlot('hair')}
                >
                    [Cheveux]
                </Button>
                <Button
                    style={styles.slotButton}
                    appearance={selectedSlot === 'top' ? 'uniform' : 'outline'}
                    color={selectedSlot === 'top' ? 'main1' : undefined}
                    borderColor={selectedSlot === 'top' ? undefined : 'main1'}
                    fontColor={selectedSlot === 'top' ? 'automatic' : 'main1'}
                    onPress={() => selectSlot('top')}
                >
                    [Haut]
                </Button>
                <Button
                    style={styles.slotButton}
                    appearance={selectedSlot === 'bottom' ? 'uniform' : 'outline'}
                    color={selectedSlot === 'bottom' ? 'main1' : undefined}
                    borderColor={selectedSlot === 'bottom' ? undefined : 'main1'}
                    fontColor={selectedSlot === 'bottom' ? 'automatic' : 'main1'}
                    onPress={() => selectSlot('bottom')}
                >
                    [Bas]
                </Button>
                <Button
                    style={styles.slotButtonLast}
                    appearance={selectedSlot === 'shoes' ? 'uniform' : 'outline'}
                    color={selectedSlot === 'shoes' ? 'main1' : undefined}
                    borderColor={selectedSlot === 'shoes' ? undefined : 'main1'}
                    fontColor={selectedSlot === 'shoes' ? 'automatic' : 'main1'}
                    onPress={() => selectSlot('shoes')}
                >
                    [Chaussures]
                </Button>
            </ScrollView>

            <FlatList
                contentContainerStyle={styles.itemsContainer}
                data={getDisplayedItems()}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.slot}-${item.itemName}-${index}`}
                numColumns={4}
            />
        </View>
    );
};

export default InventoryPanel;
