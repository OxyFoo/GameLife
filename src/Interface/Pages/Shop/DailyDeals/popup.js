import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, Button } from 'Interface/Components';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').Item} Item
 */

/**
 * @param {object} props
 * @param {Item} props.item
 * @param {(reason: string) => void} props.closePopup
 * @param {() => void} [props.onPurchased] Callback when item is successfully purchased
 */
function BuyPopup({ item, closePopup, onPurchased }) {
    const lang = langManager.curr['shop']['dailyDeals'];
    const [loading, setLoading] = React.useState(false);

    const price = Math.round(item.Value * user.shop.priceFactor);
    const itemName = langManager.GetText(item.Name);
    const itemDescription = langManager.GetText(item.Description);
    const buttonText = lang['popup-item-button'].replace('{}', price.toString());

    const buy = async () => {
        setLoading(true);
        user.interface.popup?.SetCancelable(false);

        const success = await user.shop.BuyDailyDeal(item.ID, price);

        if (!success) {
            closePopup('cancelled');
            return;
        }

        // Notify parent to update UI immediately
        onPurchased?.();

        // Close popup and show item reward page
        closePopup('purchased');
        user.interface.ChangePage('itemreward', {
            args: {
                itemID: item.ID,
                callback: () => user.interface.BackHandle()
            },
            storeInHistory: false
        });
    };

    return (
        <View style={styles.itemPopup}>
            <Text style={styles.itemPopupTitle}>{itemName}</Text>

            {itemDescription !== '' && <Text style={styles.itemPopupText}>{itemDescription}</Text>}

            <Button style={styles.itemPopupButton} color='main1' onPress={buy} loading={loading}>
                {buttonText}
            </Button>
        </View>
    );
}

export { BuyPopup };
