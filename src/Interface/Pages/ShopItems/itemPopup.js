import * as React from 'react';
import { View, Keyboard } from 'react-native';

import styles from './styles';
import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';
import dataManager from '../../../Managers/DataManager';

import { Text, Button, Input } from '../../Components';

/**
 * @typedef {import('../../../Data/Items').Item} Item
 * @typedef {import('../../../Data/Titles').Title} Title
 */

/** @param {Title} title  */
function renderTitlePopup(title) {
    const lang = langManager.curr['shopItems'];
    let [ loading, setLoading ] = React.useState(false);

    const Buy = async() => {
        if (this.state.buying) return;

        // Check Ox Amount
        if (user.informations.ox.Get() < title.Value) {
            const title = lang['alert-notenoughox-title'];
            const text = lang['alert-notenoughox-text'];
            user.interface.popup.ForceOpen('ok', [ title, text ]);
            return;
        }

        // Buy item
        setLoading(true); this.setState({ buying: true });
        const response = await user.server.Request('buyTitle', { titleID: title.ID });
        setLoading(false); this.setState({ buying: false });
        if (response === null) return;

        if (response['status'] !== 'ok') {
            const title = lang['alert-buyfailed-title'];
            const text = lang['alert-buyfailed-text'];
            user.interface.popup.ForceOpen('ok', [ title, text ]);
            return;
        }

        // Update inventory & Ox amount
        user.inventory.LoadOnline({ titles: response['titles'] });
        user.informations.ox.Set(parseInt(response['ox']));
        user.inventory.buyToday.titles.push(title.ID);
        user.LocalSave();
        this.forceUpdate();

        // Show success message
        const _title = lang['alert-buytitlesuccess-title'];
        let text = lang['alert-buytitlesuccess-text'];
        text = text.replace('{}', titleName);
        text = text.replace('{}', titleValue);
        user.interface.popup.ForceOpen('ok', [ _title, text ]);
    }

    const titleName = dataManager.GetText(title.Name);
    const titleValue = title.Value;
    const buttonText = lang['popup-button-buy'].replace('{}', titleValue);

    return (
        <View style={styles.titlePopup}>
            <Text style={styles.titlePopupTitle}>
                {titleName}
            </Text>

            <Button
                style={styles.titlePopupButton}
                color='main1'
                onPress={Buy}
                loading={loading}
            >
                {buttonText}
            </Button>
        </View>
    );
}

/** @param {Item} item */
function renderItemPopup(item) {
    const lang = langManager.curr['shopItems'];
    let [ loading, setLoading ] = React.useState(false);

    const Buy = async() => {
        if (this.state.buying) return;

        // Check Ox Amount
        if (user.informations.ox.Get() < item.Value) {
            const title = lang['alert-notenoughox-title'];
            const text = lang['alert-notenoughox-text'];
            user.interface.popup.ForceOpen('ok', [ title, text ]);
            return;
        }

        // Buy item
        setLoading(true); this.setState({ buying: true });
        const response = await user.server.Request('buyItem', { itemID: item.ID });
        setLoading(false); this.setState({ buying: false });
        if (response === null) return;

        if (response['status'] !== 'ok') {
            const title = lang['alert-buyfailed-title'];
            const text = lang['alert-buyfailed-text'];
            user.interface.popup.ForceOpen('ok', [ title, text ]);
            return;
        }

        // Update inventory & Ox amount
        user.inventory.LoadOnline({ stuffs: response['stuffs'] });
        user.informations.ox.Set(parseInt(response['ox']));
        user.inventory.buyToday.items.push(item.ID);
        user.LocalSave();
        this.forceUpdate();

        // Show success message
        const title = lang['alert-buysuccess-title'];
        let text = lang['alert-buysuccess-text'];
        text = text.replace('{}', itemName);
        text = text.replace('{}', itemValue);
        user.interface.popup.ForceOpen('ok', [ title, text ]);
    }

    const itemName = dataManager.GetText(item.Name);
    const itemDescription = dataManager.GetText(item.Description);
    const itemValue = item.Value;
    const buttonText = lang['popup-button-buy'].replace('{}', itemValue);

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
                onPress={Buy}
                loading={loading}
            >
                {buttonText}
            </Button>
        </View>
    );
}

function renderItemEditorPopup() {
    const lang = langManager.curr['shopItems'];
    // TODO - Placer: lang['error-inventory-empty']

    return (
        <View></View>
    );
}

export { renderTitlePopup, renderItemPopup, renderItemEditorPopup };