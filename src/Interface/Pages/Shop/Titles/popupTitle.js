import * as React from 'react';
import { View } from 'react-native';

import styles from './styles';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { Text, Button } from 'Interface/Components';

/**
 * @typedef {import('Data/Titles').Title} Title
 */

/**
 * @param {Title} title
 * @param {() => void} [refreshCallback=() => {}] Callback to refresh the page
 */
function renderTitlePopup(title, refreshCallback = () => {}) {
    const lang = langManager.curr['shopItems'];
    let [ loading, setLoading ] = React.useState(false);

    const titleName = dataManager.GetText(title.Name);
    const buttonText = lang['popup-title-button']
                        .replace('{}', title.Value.toString());

    const buy = async () => {
        if (this.state.buying) return;
        setLoading(true); this.setState({ buying: true });
        await buyTitle.call(this, title);
        setLoading(false); this.setState({ buying: false });
        refreshCallback();
    };

    return (
        <View style={styles.titlePopup}>
            <Text style={styles.titlePopupTitle}>
                {titleName}
            </Text>

            <Button
                style={styles.titlePopupButton}
                color='main1'
                onPress={buy}
                loading={loading}
            >
                {buttonText}
            </Button>
        </View>
    );
}

/** @param {Title} titleItem */
const buyTitle = async(titleItem) => {
    const lang = langManager.curr['shopItems'];

    // Check Ox Amount
    if (user.informations.ox.Get() < titleItem.Value) {
        const title = lang['alert-notenoughox-title'];
        const text = lang['alert-notenoughox-text'];
        user.interface.popup.ForceOpen('ok', [ title, text ]);
        return;
    }

    // Buy item
    const response = await user.server.Request('buyTitle', { titleID: titleItem.ID });
    if (response === null) return;

    // Request failed
    if (response['status'] !== 'ok') {
        const title = lang['alert-buyfailed-title'];
        const text = lang['alert-buyfailed-text'];
        user.interface.popup.ForceOpen('ok', [ title, text ]);
        return;
    }

    // Update inventory & Ox amount
    user.inventory.LoadOnline({ titles: response['titles'] });
    user.informations.ox.Set(parseInt(response['ox']));
    user.inventory.buyToday.titles.push(titleItem.ID);
    user.LocalSave();

    // Show success message
    const title = lang['alert-buytitlesuccess-title'];
    const titleName = dataManager.GetText(titleItem.Name);
    const text = lang['alert-buytitlesuccess-text']
                .replace('{}', titleName)
                .replace('{}', titleItem.Value.toString());
    user.interface.popup.ForceOpen('ok', [ title, text ], undefined, false);
}

export { renderTitlePopup };