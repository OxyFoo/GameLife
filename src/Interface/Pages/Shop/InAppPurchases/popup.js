import * as React from 'react';
import { View } from 'react-native';
import { requestPurchase } from 'react-native-iap';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, Button } from 'Interface/Components';

/**
 * @typedef {import('react-native-iap').Product} Product
 * @typedef {import('react-native-iap').RequestPurchase} RequestPurchase
 * @typedef {import('Data/Items').Item} Item
 */

/**
 * @param {Product} item
 * @param {() => void} [refreshCallback=() => {}] Callback to refresh the page
 */
function renderItemPopup(item, refreshCallback = () => {}) {
    const lang = langManager.curr['shop']['iap'];
    let [loading, setLoading] = React.useState(false);

    const itemName = item.title;
    const itemDescription = item.description;
    const buttonText = lang['popup-item-button']
        .replace('{}', item.localizedPrice.toString());

    const buy = async () => {
        if (this.state.buying) return;
        setLoading(true); this.setState({ buying: true });
        await purchase(item.productId);
        setLoading(false); this.setState({ buying: false });
        refreshCallback();
    };

    return (
        <View style={styles.itemPopup}>
            <Text style={styles.itemPopupTitle}>
                {itemName}
            </Text>

            {itemDescription !== '' && (
                <Text style={styles.itemPopupText}>
                    {itemDescription}
                </Text>
            )}

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

/** @param {string} sku Product ID */
const purchase = async (sku) => {
    try {
        console.log("purchase of sku", sku)
        const result = await requestPurchase({
            sku: sku,
            andDangerouslyFinishTransactionAutomaticallyIOS: false
        });
        console.log(result);
        return result;
    } catch (err) {
        user.interface.console.AddLog('error', 'Error purchasing item', err);
        return null;
    }
};

export { renderItemPopup };
