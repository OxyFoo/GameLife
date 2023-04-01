import * as React from 'react';
import { View } from 'react-native';

import styles from './styles';
import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';
import dataManager from '../../../Managers/DataManager';

import { Text, Button } from '../../Components';

/**
 * @typedef {import('./back').BuyableDye} BuyableDye
 * @typedef {import('../../../Data/Items').Item} Item
 */

/**
 * @param {BuyableDye} dye
 * @param {() => void} [refreshCallback=() => {}] Callback to refresh the page
 */
function renderDyePopup(dye, refreshCallback = () => {}) {
    const lang = langManager.curr['shopItems'];
    let [ loading, setLoading ] = React.useState(false);

    const buttonText = lang['popup-dyer-button'].replace('{}', dye.Price);

    const buy = async () => {
        if (this.state.buying) return;
        setLoading(true); this.setState({ buying: true });
        await buyDye.call(this, dye);
        setLoading(false); this.setState({ buying: false });
        refreshCallback();
    };

    return (
        <View style={styles.itemPopup}>
            <Text style={styles.itemPopupTitle}>
                {dye.Name}
            </Text>

            <Text style={styles.itemPopupText}>
                {lang['popup-dyer-text']}
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

/** @param {BuyableDye} item */
const buyDye = async(item) => {
    const lang = langManager.curr['shopItems'];

    // Check Ox Amount
    if (user.informations.ox.Get() < item.Price) {
        const title = lang['alert-notenoughox-title'];
        const text = lang['alert-notenoughox-text'];
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
        const title = lang['alert-buyfailed-title'];
        const text = lang['alert-buyfailed-text'];
        user.interface.popup.ForceOpen('ok', [ title, text ]);
        return;
    }

    // Update inventory & Ox amount
    user.inventory.LoadOnline({ stuffs: response['stuffs'] });
    user.informations.ox.Set(parseInt(response['ox']));
    user.inventory.buyToday.dyes.push(item.ItemBefore.InventoryID);
    user.LocalSave();

    // Show success message
    const title = lang['alert-dyesuccess-title'];
    let text = lang['alert-dyesuccess-text']
        .replace('{}', item.Name)
        .replace('{}', item.Price);
    user.interface.popup.ForceOpen('ok', [ title, text ], undefined, false);
}

export { renderDyePopup };