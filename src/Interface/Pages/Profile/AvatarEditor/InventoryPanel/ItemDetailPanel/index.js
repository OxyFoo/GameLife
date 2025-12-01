import React from 'react';
import { View } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import themeManager from 'Managers/ThemeManager';

import { Text, Button } from 'Interface/Components';
import { AVATAR_POSITION_CONFIG } from '../../avatarConstants';

/**
 * @typedef {import('@oxyfoo/avatar-factory').ItemName} ItemName
 * @typedef {import('@oxyfoo/avatar-factory').AvatarName} AvatarName
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').ItemSlot} ItemSlot
 */

/**
 * @typedef {object} ItemDetailPanelProps
 * @property {ItemName} itemName - The item to display details for
 * @property {ItemSlot} slot - The slot type of the item
 * @property {AvatarName} bodyType - Current body type for preview
 * @property {string} bodyColor - Current body color for preview
 * @property {boolean} isEquipped - Whether the item is currently equipped
 * @property {(itemName: ItemName) => void} onEquip - Callback when equip button is pressed
 * @property {(itemName: ItemName) => void} onSell - Callback when sell button is pressed
 * @property {() => void} onClose - Callback to close the panel
 */

/**
 * Panel showing item details with equip/sell buttons
 * @param {ItemDetailPanelProps} props
 */
const ItemDetailPanel = ({ itemName, slot, bodyType, bodyColor, isEquipped, onEquip, onSell, onClose }) => {
    const frameSize = 120;

    // Get item info (TODO: get from data manager when available)
    const itemTitle = itemName.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    const itemDescription = `Un bel item de type ${slot}.`; // TODO: Get from item data

    const handleEquip = () => {
        onEquip(itemName);
        onClose();
    };

    const handleSell = () => {
        onSell(itemName);
        onClose();
    };

    return (
        <View style={styles.container}>
            {/* Item Preview */}
            <View style={styles.previewContainer}>
                <AvatarFrame width={frameSize} height={frameSize} backgroundColor={themeManager.GetColor('ground2')}>
                    <AvatarCharacter
                        body={bodyType}
                        bodyColor={bodyColor}
                        items={[{ id: itemName }]}
                        position={AVATAR_POSITION_CONFIG[slot]?.pos || { x: 0, y: 0 }}
                        scale={AVATAR_POSITION_CONFIG[slot]?.scale || 1}
                        portraitMode={slot === 'hair'}
                    />
                </AvatarFrame>
            </View>

            {/* Item Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{itemTitle}</Text>
                <Text style={styles.description}>{itemDescription}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
                <Button
                    style={styles.button}
                    appearance='uniform'
                    color={isEquipped ? 'transparent' : 'main1'}
                    disabled={isEquipped}
                    onPress={handleEquip}
                >
                    <Text style={[styles.buttonText, isEquipped && styles.buttonTextDisabled]}>
                        {isEquipped ? 'Équipé' : 'Équiper'}
                    </Text>
                </Button>

                <Button
                    style={styles.button}
                    appearance='uniform'
                    color={isEquipped ? 'transparent' : 'ground2'}
                    disabled={isEquipped}
                    onPress={handleSell}
                >
                    <Text style={[styles.buttonText, isEquipped && styles.buttonTextDisabled]}>Vendre</Text>
                </Button>
            </View>
        </View>
    );
};

export default ItemDetailPanel;
