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

    function Buy() {
        setLoading(true);

        // TODO - Check Ox Amount & Buy (& disable re-buy)
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

    function Buy() {
        setLoading(true);

        // TODO - Check Ox Amount & Buy (& disable re-buy)
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