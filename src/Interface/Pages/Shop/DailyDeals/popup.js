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
 * @param {Item} item
 * @param {() => void} [refreshCallback=() => {}] Callback to refresh the page
 */
function renderItemPopup(item, refreshCallback = () => {}) {
    const lang = langManager.curr['shop']['dailyDeals'];
    let [loading, setLoading] = React.useState(false);

    const price = Math.round(item.Value * user.shop.priceFactor);
    const itemName = langManager.GetText(item.Name);
    const itemDescription = langManager.GetText(item.Description);
    const buttonText = lang['popup-item-button'].replace('{}', price.toString());

    const buy = async () => {
        if (this.state.buying) return;
        setLoading(true);
        this.setState({ buying: true });
        await buyDailyDeals.call(this, item);
        setLoading(false);
        this.setState({ buying: false });
        refreshCallback();
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

/** @param {Item} item */
const buyDailyDeals = async (item) => {
    const lang = langManager.curr['shop'];

    // Check Ox Amount
    const price = Math.round(item.Value * user.shop.priceFactor);
    if (user.informations.ox.Get() < price) {
        const title = lang['popup-notenoughox-title'];
        const text = lang['popup-notenoughox-message'];
        user.interface.popup.ForceOpen('ok', [title, text]);
        return;
    }

    // Buy item
    const response = await user.server.Request('buyDailyDeals', { itemID: item.ID });
    if (response === null) return;

    // Request failed
    if (response['status'] !== 'ok') {
        const title = lang['reward-failed-title'];
        const text = lang['reward-failed-message'];
        user.interface.popup.ForceOpen('ok', [title, text]);
        return;
    }

    // Update inventory & Ox amount
    user.inventory.LoadOnline({ stuffs: response['stuffs'] });
    user.informations.ox.Set(parseInt(response['ox'], 10));
    user.shop.buyToday.items.push(item.ID);
    user.SaveLocal();

    // Update mission
    user.missions.SetMissionState('mission3', 'completed');

    // Show success message
    const itemName = langManager.GetText(item.Name);
    const title = lang['dailyDeals']['popup-buysuccess-title'];
    const text = lang['dailyDeals']['popup-buysuccess-text'].replace('{}', itemName).replace('{}', price.toString());
    user.interface.popup.ForceOpen('ok', [title, text], undefined, false);
};

export { renderItemPopup };
