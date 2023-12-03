import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, Button } from 'Interface/Components';

/**
 * @typedef {import('./back').Slot} Slot
 * @typedef {import('Class/Shop').BuyableTargetedChest} BuyableTargetedChest
 */

/** @param {BuyableTargetedChest} item */
function renderBuyPopup(item) {
    const lang = langManager.curr['shop']['targetedChests'];
    let [ loading, setLoading ] = React.useState(false);

    const itemDescription = lang['popup-chest-text']
                        .replace('{}', langManager.curr['rarities'][item.Rarity])
                        .replace('{}', item.Name)
                        .replace('{}', item.Price.toString());
    const buttonText = lang['popup-chest-button']
                        .replace('{}', item.Price.toString());

    const buy = async () => {
        setLoading(true);
        await user.shop.BuyTargetedChest(item);
        setLoading(false);
    };

    return (
        <View style={styles.itemPopup}>
            <Text style={styles.itemPopupTitle}>
                {item.Name}
            </Text>

            <Text style={styles.itemPopupText}>
                {itemDescription}
            </Text>

            <Button
                style={styles.itemPopupButton}
                color='main1'
                onPress={buy}
                loading={loading}
            >
                {buttonText}
            </Button>
        </View>
    );
}

export { renderBuyPopup };
