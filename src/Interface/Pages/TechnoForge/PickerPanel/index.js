import * as React from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import { EQUIPMENT_SLOTS } from 'Data/User/Avatar';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Icon, Text } from 'Interface/Components';

/**
 * @typedef {import('@oxyfoo/avatar-factory').ItemConfig} ItemConfig
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').ItemSlot} ItemSlot
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Inventory').Stuff} Stuff
 */

/**
 * The copies of the inventory, by slot, to fill one slot of the forge. The cells are the ones of
 * the inventory grid; a copy that cannot go there is greyed out: equipped (a lock, catalysts only)
 * or already in another slot of the forge (a check).
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.hint
 * @param {number | null} props.selectedID The copy currently in the slot
 * @param {number[]} props.excludedIDs Copies in the other slots of the forge
 * @param {number[]} props.lockedIDs Copies that can never go there (the equipped ones, for a catalyst)
 * @param {(stuffID: number) => void} props.onSelect
 * @param {() => void} props.onClear
 */
function PickerPanel({ title, hint, selectedID, excludedIDs, lockedIDs, onSelect, onClear }) {
    const lang = langManager.curr['technoforge'];
    const langSlots = langManager.curr['shop']['targetedChests']['targets'];
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const frameSize = screenWidth / 4 - 12;
    const body = user.avatar.GetBodyType();
    const bodyColor = user.avatar.GetBodyColorHex();

    const sections = EQUIPMENT_SLOTS.map((slot) => ({ slot, stuffs: user.inventory.GetStuffsBySlot(slot) })).filter(
        (section) => section.stuffs.length > 0
    );

    /**
     * @param {Stuff} stuff
     * @param {ItemSlot} slot
     */
    const renderCell = (stuff, slot) => {
        const locked = lockedIDs.includes(stuff.ID);
        const excluded = excludedIDs.includes(stuff.ID);
        const selected = stuff.ID === selectedID;
        const disabled = locked || excluded;
        const containerSize = dataManager.items.GetContainerSize(slot);
        /** @type {ItemConfig[]} */
        const items =
            slot === 'top'
                ? [{ id: stuff.ItemID }, { id: user.avatar.GetEquippedItemID('bottom') }]
                : [{ id: stuff.ItemID }];

        return (
            <Button
                key={`${slot}-${stuff.ID}`}
                style={[styles.cell, disabled && styles.cellDisabled]}
                appearance='uniform'
                color='transparent'
                enabled={!disabled}
                onPress={() => onSelect(stuff.ID)}
            >
                <AvatarFrame
                    width={frameSize}
                    height={frameSize}
                    backgroundColor={selected ? themeManager.GetColor('main1') : '#00000000'}
                >
                    <AvatarCharacter
                        body={body}
                        bodyColor={bodyColor}
                        items={items}
                        position={containerSize.pos}
                        scale={containerSize.scale}
                        portraitMode={slot === 'hair'}
                    />
                </AvatarFrame>
                <LinearGradient
                    style={styles.rarityBar}
                    colors={themeManager.GetRariryColors(stuff.Rarity)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                {disabled && (
                    <View
                        style={[
                            StyleSheet.absoluteFill,
                            styles.overlay,
                            { backgroundColor: themeManager.GetColor('background', { opacity: 0.6 }) }
                        ]}
                    >
                        <Icon icon={locked ? 'lock' : 'check'} size={20} color='white' />
                    </View>
                )}
            </Button>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title} fontSize={18} bold>
                    {title}
                </Text>
                {selectedID !== null && (
                    <Button style={styles.clearButton} appearance='outline' fontSize={12} onPress={onClear}>
                        {lang['picker-clear']}
                    </Button>
                )}
            </View>
            <Text style={styles.hint} fontSize={12} color='light'>
                {hint}
            </Text>

            <ScrollView
                ref={user.interface.bottomPanel?.mover.SetScrollView}
                style={{ height: screenHeight * 0.55 }}
                onLayout={user.interface.bottomPanel?.mover.onLayoutFlatList}
                onContentSizeChange={user.interface.bottomPanel?.mover.onContentSizeChange}
                scrollEnabled={false}
            >
                {sections.length === 0 && (
                    <Text style={styles.empty} color='secondary'>
                        {lang['picker-empty']}
                    </Text>
                )}
                {sections.map(({ slot, stuffs }) => (
                    <View key={slot}>
                        <Text style={styles.sectionTitle} fontSize={14} color='border'>
                            {langSlots[slot]}
                        </Text>
                        <View style={styles.grid}>{stuffs.map((stuff) => renderCell(stuff, slot))}</View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

export { PickerPanel };
