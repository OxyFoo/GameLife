import * as React from 'react';
import { View, Keyboard } from 'react-native';

import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';
import dataManager from '../../../Managers/DataManager';

import { Text, Button, Input } from '../../Components';

function renderTitlePopup() {
    return (
        <View></View>
    );
}

function renderItemPopup() {
    const lang = langManager.curr['shop'];
    let [ loading, setLoading ] = React.useState(false);

    function Buy() {
        setLoading(true);

        // TODO - Buy (& disable re-buy)
    }

    // TODO - Textes
    return (
        <View style={{ padding: 24 }}>
            <Text fontSize={22}>{lang['']}</Text>
            <Text style={{ marginTop: 12, textAlign: 'left' }} fontSize={14}>
                {lang['']}
            </Text>

            <Button
                style={{ marginTop: 24 }}
                color='main1'
                onPress={Buy}
                loading={loading}
            >
                {lang['']}
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