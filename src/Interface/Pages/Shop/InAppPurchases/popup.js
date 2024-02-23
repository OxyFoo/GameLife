import * as React from 'react';
import { View, Platform } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { Text, Button } from 'Interface/Components';

import { requestPurchase } from 'react-native-iap';

/**
 * @typedef {import('Data/Items').Item} Item
 */

/**
 * @param {TODO} item
 * @param {() => void} [refreshCallback=() => {}] Callback to refresh the page
 */
function renderItemPopup(item, refreshCallback = () => { }) {
    console.log("item", item)

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

const purchase = async (sku) => {
    const params = Platform.select({
        ios: {
            sku: sku,
            andDangerouslyFinishTransactionAutomaticallyIOS: false
        },
        android: {
            skus: [sku]
        }
    })

    console.log("purchase of sku", sku, "with params", params)

    try {
        const result = await requestPurchase(params);
        console.log("purchase of sku", sku, "success")
        console.log(result)
    } catch (err) {
        console.error(err.code, err.message);
    }
};

/** @param {Item} item */
const buyDailyDeals = async (item) => {
    const lang = langManager.curr['shop'];

    // Check Ox Amount
    if (user.informations.ox.Get() < item.Value) {
        const title = lang['popup-notenoughox-title'];
        const text = lang['popup-notenoughox-text'];
        user.interface.popup.ForceOpen('ok', [title, text]);
        return;
    }

    // Buy item
    const response = await user.server.Request('buyDailyDeals', { itemID: item.ID });
    if (response === null) return;

    // Request failed
    if (response['status'] !== 'ok') {
        const title = lang['reward-failed-title'];
        const text = lang['reward-failed-text'];
        user.interface.popup.ForceOpen('ok', [title, text]);
        return;
    }

    // Update inventory & Ox amount
    user.inventory.LoadOnline({ stuffs: response['stuffs'] });
    user.informations.ox.Set(parseInt(response['ox']));
    user.shop.buyToday.items.push(item.ID);
    user.LocalSave();

    // Show success message
    const itemName = dataManager.GetText(item.Name);
    const title = lang['dailyDeals']['popup-buysuccess-title'];
    const text = lang['dailyDeals']['popup-buysuccess-text']
        .replace('{}', itemName)
        .replace('{}', item.Value.toString());
    user.interface.popup.ForceOpen('ok', [title, text], undefined, false);
}

export { renderItemPopup };
