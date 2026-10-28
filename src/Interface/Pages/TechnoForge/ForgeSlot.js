import * as React from 'react';
import { Animated, View } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import { RarityLabel } from './RarityLabel';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Icon, Text } from 'Interface/Components';
import { ItemStatsTicker } from 'Interface/Widgets';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('@oxyfoo/avatar-factory').ItemConfig} ItemConfig
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Inventory').Stuff} Stuff
 * @typedef {import('@oxyfoo/gamelife-types/Global/Rarities').Rarities} Rarities
 */

/**
 * One slot of the forge: empty (dashed, a plus) or holding a copy (preview, name, stats). The main
 * slot shows the rarity step over its frame.
 * @param {object} props
 * @param {number} props.size
 * @param {string} props.label
 * @param {Stuff | null} props.stuff
 * @param {() => void} props.onPress
 * @param {() => void} [props.onLongPress] Filled slot only: empties it (the long press of the app)
 * @param {Rarities | null} [props.transitionTo] Main slot only: the rarity reached on success (null = top reached)
 * @param {boolean} [props.enabled]
 * @param {boolean} [props.locked] Catalyst slots without a main copy: empty and greyed out, nothing to pick yet
 * @param {Animated.Value} [props.fill] Catalyst slots: 0 → 1 fills the card from the bottom, like a liquid
 * @param {string} [props.fillColor]
 * @param {boolean} [props.labelBelow] Once filled, the label goes under the card (the main slot has its caption there)
 * @param {StyleProp} [props.style]
 */
function ForgeSlot({
    size,
    label,
    stuff,
    onPress,
    onLongPress,
    transitionTo,
    enabled = true,
    locked = false,
    fill,
    fillColor,
    labelBelow,
    style
}) {
    const item = stuff === null ? null : dataManager.items.GetByID(stuff.ItemID);
    const sizeStyle = { width: size, height: size };
    // Inside the border and the padding of the card
    const innerWidth = size - 2 * styles.slot.paddingHorizontal - 2 * styles.slot.borderWidth;

    // The liquid: a full card scaled from its bottom, and its surface line riding on top of it
    const liquid =
        fill === undefined || fillColor === undefined ? null : (
            <View style={[styles.slotFill, sizeStyle]} pointerEvents='none'>
                <Animated.View
                    style={[
                        styles.slotLiquid,
                        {
                            backgroundColor: fillColor,
                            opacity: fill.interpolate({ inputRange: [0, 0.05, 1], outputRange: [0, 0.35, 0.35] }),
                            transform: [
                                { translateY: fill.interpolate({ inputRange: [0, 1], outputRange: [size / 2, 0] }) },
                                { scaleY: fill.interpolate({ inputRange: [0, 1], outputRange: [0.001, 1] }) }
                            ]
                        }
                    ]}
                />
                <Animated.View
                    style={[
                        styles.slotSurface,
                        {
                            backgroundColor: fillColor,
                            opacity: fill.interpolate({
                                inputRange: [0, 0.05, 0.98, 1],
                                outputRange: [0, 0.9, 0.9, 0]
                            }),
                            transform: [
                                { translateY: fill.interpolate({ inputRange: [0, 1], outputRange: [size, 0] }) }
                            ]
                        }
                    ]}
                />
            </View>
        );

    if (locked || stuff === null || item === null) {
        return (
            <View style={[styles.slotWrapper, style]}>
                <Button
                    style={[
                        styles.slot,
                        styles.slotEmpty,
                        sizeStyle,
                        { borderColor: themeManager.GetColor(locked ? 'disabled' : 'main1', { opacity: 0.7 }) }
                    ]}
                    styleContent={styles.slotContent}
                    appearance='uniform'
                    color='transparent'
                    rippleColor='main2'
                    enabled={enabled && !locked}
                    onPress={onPress}
                >
                    <Icon icon='add' size={28} color={locked ? 'disabled' : 'main1'} />
                    <Text style={styles.slotLabel} fontSize={10} color={locked ? 'disabled' : 'light'}>
                        {label.toUpperCase()}
                    </Text>
                </Button>
            </View>
        );
    }

    const containerSize = dataManager.items.GetContainerSize(item.Slot);
    /** @type {ItemConfig[]} The bottom worn goes with a top, like the inventory grid */
    const previewItems =
        item.Slot === 'top'
            ? [{ id: stuff.ItemID }, { id: user.avatar.GetEquippedItemID('bottom') }]
            : [{ id: stuff.ItemID }];
    const frameSize = Math.round(size * 0.5);

    return (
        <View style={[styles.slotWrapper, style]}>
            <Button
                style={[
                    styles.slot,
                    sizeStyle,
                    {
                        borderColor: themeManager.GetRariryColors(stuff.Rarity)[0],
                        backgroundColor: themeManager.GetColor('backgroundCard', { opacity: 0.35 })
                    }
                ]}
                styleContent={styles.slotContent}
                appearance='uniform'
                color='transparent'
                rippleColor='main2'
                enabled={enabled}
                onPress={onPress}
                onLongPress={onLongPress}
            >
                <AvatarFrame width={frameSize} height={frameSize} backgroundColor='#00000000'>
                    <AvatarCharacter
                        body={user.avatar.GetBodyType()}
                        bodyColor={user.avatar.GetBodyColorHex()}
                        items={previewItems}
                        position={containerSize.pos}
                        scale={containerSize.scale}
                        portraitMode={item.Slot === 'hair'}
                    />
                </AvatarFrame>
                <Text style={styles.slotName} fontSize={11} numberOfLines={1} bold>
                    {langManager.GetText(item.Name)}
                </Text>
                <ItemStatsTicker stats={stuff.Stats ?? {}} width={innerWidth} />
            </Button>
            {liquid}
            {labelBelow === true && (
                <Text style={styles.slotLabelBelow} fontSize={9} color='light'>
                    {label.toUpperCase()}
                </Text>
            )}
            {transitionTo !== undefined && (
                <View style={[styles.transition, { backgroundColor: themeManager.GetColor('background') }]}>
                    <RarityLabel from={stuff.Rarity} to={transitionTo} fontSize={9} />
                </View>
            )}
        </View>
    );
}

export { ForgeSlot };
