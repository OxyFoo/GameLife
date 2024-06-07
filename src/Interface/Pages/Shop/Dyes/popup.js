import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, Button } from 'Interface/Components';

/**
 * @typedef {import('./back').default} BackShopDyes
 * @typedef {import('./back').BuyableDye} BuyableDye
 * @typedef {import('Data/Items').Item} Item
 */

/**
 * @this {BackShopDyes}
 * @param {BuyableDye} dye
 * @param {() => void} [refreshCallback=() => {}] Callback to refresh the page
 */
function renderDyePopup(dye, refreshCallback = () => {}) {
    const lang = langManager.curr['shop']['dyes'];
    let [ loading, setLoading ] = React.useState(false);

    const itemName = dye.Name;
    const itemDescription = lang['popup-dyer-text'];
    const price = Math.round(dye.Price * user.shop.priceFactor);
    const buttonText = lang['popup-dyer-button']
                        .replace('{}', price.toString());

    const buy = async () => {
        if (this.state.buying) return;
        setLoading(true); this.setState({ buying: true });
        await buyDye.call(this, dye);
        setLoading(false); this.setState({ buying: false });
        refreshCallback();
        user.character.SetEquipment(user.inventory.GetEquippedItemsID());
        this.forceUpdate();
    };

    return (
        <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>
                {itemName}
            </Text>

            <Text style={styles.popupText}>
                {itemDescription}
            </Text>

            <Button
                style={styles.popupButton}
                color='main1'
                onPress={buy}
                loading={loading}
            >
                {buttonText}
            </Button>
        </View>
    );
}

/** @param {BuyableDye} item */
const buyDye = async(item) => {
    const lang = langManager.curr['shop'];

    // Check Ox Amount
    const price = Math.round(item.Price * user.shop.priceFactor);
    if (user.informations.ox.Get() < price) {
        const title = lang['popup-notenoughox-title'];
        const text = lang['popup-notenoughox-text'];
        user.interface.popup.ForceOpen('ok', [ title, text ]);
        return;
    }

    // Buy dye
    const data = {
        ID: item.ItemBefore.InventoryID,
        newID: item.ItemAfter.ID
    };
    const response = await user.server.Request('buyDye', data);
    if (response === null) return;

    // Request failed
    if (response['status'] !== 'ok') {
        const title = lang['reward-failed-title'];
        const text = lang['reward-failed-text'];
        user.interface.popup.ForceOpen('ok', [ title, text ]);
        return;
    }

    // Update inventory & Ox amount
    user.inventory.LoadOnline(response['inventory']);
    user.informations.ox.Set(parseInt(response['ox']));
    user.shop.buyToday.dyes.push(item.ItemBefore.InventoryID);
    user.LocalSave();

    // Update mission
    user.missions.SetMissionState('mission3', 'completed');

    // Show success message
    const title = lang['dyes']['popup-dyesuccess-title'];
    let text = lang['dyes']['popup-dyesuccess-text']
        .replace('{}', item.Name)
        .replace('{}', price.toString());
    user.interface.popup.ForceOpen('ok', [ title, text ], undefined, false);
}

export { renderDyePopup };
