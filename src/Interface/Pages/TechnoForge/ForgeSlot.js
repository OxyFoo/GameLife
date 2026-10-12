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
import { ItemStats } from 'Interface/Widgets';

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
 * @param {Rarities | null} [props.transitionTo] Main slot only: the rarity reached on success (null = top reached)
 * @param {boolean} [props.enabled]
 * @param {Animated.Value} [props.fill] Catalyst slots: 0 → 1 fills the card from the bottom, like a liquid
 * @param {string} [props.fillColor]
 * @param {StyleProp} [props.style]
 */
function ForgeSlot({ size, label, stuff, onPress, transitionTo, enabled = true, fill, fillColor, style }) {
    const item = stuff === null ? null : dataManager.items.GetByID(stuff.ItemID);
    const sizeStyle = { width: size, height: size };

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

    if (stuff === null || item === null) {
        return (
            <View style={[styles.slotWrapper, style]}>
                <Button
                    style={[
                        styles.slot,
                        styles.slotEmpty,
                        sizeStyle,
                        { borderColor: themeManager.GetColor('main1', { opacity: 0.7 }) }
                    ]}
                    styleContent={styles.slotContent}
                    appearance='uniform'
                    color='transparent'
                    rippleColor='main2'
                    enabled={enabled}
                    onPress={onPress}
                >
                    <Icon icon='add' size={28} color='main1' />
                    <Text style={styles.slotLabel} fontSize={10} color='light'>
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
    const frameSize = Math.round(size * 0.45);

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
                <ItemStats stats={stuff.Stats ?? {}} compact max={2} />
                <Text style={styles.slotLabel} fontSize={9} color='light'>
                    {label.toUpperCase()}
                </Text>
            </Button>
            {liquid}
            {transitionTo !== undefined && (
                <View style={[styles.transition, { backgroundColor: themeManager.GetColor('background') }]}>
                    <RarityLabel from={stuff.Rarity} to={transitionTo} fontSize={9} />
                </View>
            )}
        </View>
    );
}

export { ForgeSlot };
