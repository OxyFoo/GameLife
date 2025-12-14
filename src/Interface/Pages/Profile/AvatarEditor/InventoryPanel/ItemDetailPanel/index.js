import React from 'react';
import { View } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Button } from 'Interface/Components';

/**
 * @typedef {import('@oxyfoo/avatar-factory').ItemName} ItemName
 * @typedef {import('@oxyfoo/avatar-factory').AvatarName} AvatarName
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').ItemSlot} ItemSlot
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').ItemID} ItemID
 */

/** Sell price factor - player gets 75% of item value when selling */
const SELL_PRICE_FACTOR = 0.75;

/**
 * @typedef {object} ItemDetailPanelProps
 * @property {number} stuffID - The stuff ID (inventory item ID)
 * @property {ItemName} itemName - The item to display details for
 * @property {ItemSlot} slot - The slot type of the item
 * @property {AvatarName} bodyType - Current body type for preview
 * @property {string} bodyColor - Current body color for preview
 * @property {boolean} isEquipped - Whether the item is currently equipped
 * @property {(itemName: ItemName) => void} onEquip - Callback when equip button is pressed
 * @property {(stuffID: number) => void} onSell - Callback when sell button is pressed
 * @property {() => void} onClose - Callback to close the panel
 */

/**
 * Panel showing item details with equip/sell buttons
 * @param {ItemDetailPanelProps} props
 */
const ItemDetailPanel = ({ stuffID, itemName, slot, bodyType, bodyColor, isEquipped, onEquip, onSell, onClose }) => {
    const lang = langManager.curr['profile-avatar'];
    const frameSize = 120;
    const slotPreview = dataManager.items.GetContainerSize(slot);
    const previewPos = slotPreview.pos || { x: 0, y: 0 };
    const previewScale = slotPreview.scale || 1;

    const itemData = dataManager.items.GetByID(/** @type {ItemID} */ (itemName));
    const itemTitle = itemData ? langManager.GetText(itemData.Name) : itemName;
    const itemDescription = itemData ? langManager.GetText(itemData.Description) : `Item ${slot}`;
    const sellPrice = itemData ? Math.ceil(itemData.Value * SELL_PRICE_FACTOR) : 0;
    const sellButtonText = lang['button-sell'].replace('{}', sellPrice.toString());

    const handleEquip = () => {
        onEquip(itemName);
        onClose();
    };

    const handleSell = () => {
        // Guard: cannot sell equipped items
        if (isEquipped) return;
        onSell(stuffID);
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
                        position={previewPos}
                        scale={previewScale}
                        portraitMode={slot === 'hair'}
                    />
                </AvatarFrame>
            </View>

            {/* Item Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{itemTitle}</Text>
                <Text style={styles.description}>{itemDescription}</Text>
            </View>

            {/* Action Buttons - hidden when equipped */}
            {!isEquipped && (
                <View style={styles.buttonsContainer}>
                    <Button style={styles.button} appearance='uniform' color='ground2' onPress={handleSell}>
                        <Text style={styles.buttonText}>{sellButtonText}</Text>
                    </Button>

                    <Button style={styles.button} appearance='uniform' color='main1' onPress={handleEquip}>
                        <Text style={styles.buttonText}>{lang['button-equip']}</Text>
                    </Button>
                </View>
            )}
        </View>
    );
};

export default ItemDetailPanel;
