import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, Button } from 'Interface/Components';

/**
 * @typedef {import('Class/Shop').BuyableRandomChest} BuyableRandomChest
 */

/**
 * @param {BuyableRandomChest} item
 * @param {() => void} closePopup
 */
function renderBuyPopup(item, closePopup) {
    const lang = langManager.curr['shop']['randomChests'];
    let [loading, setLoading] = React.useState(false);

    const price = item.PriceDiscount < 0 ? item.PriceOriginal : item.PriceDiscount;
    const itemName = lang[item.LangName];
    const itemDescription = lang['popup-chest-text'].replace('{}', itemName).replace('{}', price.toString());
    const buttonText = lang['popup-chest-button'].replace('{}', price.toString());

    const buy = async () => {
        setLoading(true);
        await user.shop.BuyRandomChest(item);
        setLoading(false);
        closePopup();
    };

    return (
        <View style={styles.itemPopup}>
            <Text style={styles.itemPopupTitle}>{itemName}</Text>

            <Text style={styles.itemPopupText}>{itemDescription}</Text>

            <Button style={styles.itemPopupButton} color='main1' onPress={buy} loading={loading}>
                {buttonText}
            </Button>
        </View>
    );
}

export { renderBuyPopup };
