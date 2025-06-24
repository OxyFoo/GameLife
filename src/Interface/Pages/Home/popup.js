import * as React from 'react';
import { View, ScrollView } from 'react-native';

import stylesPopup from './stylePopup';
import langManager from 'Managers/LangManager';

import { Text } from 'Interface/Components';

/**
 * PopupContent pour afficher les informations sur les activités et récap du jour
 */
function RecapInfoPopupContent() {
    const lang = langManager.curr['app-explain'];

    return (
        <View style={stylesPopup.popupContent}>
            <ScrollView style={stylesPopup.popupScrollView}>
                <View style={stylesPopup.popupHeader}>
                    <Text fontSize={24} style={stylesPopup.popupTitle}>
                        {lang['recap']['popup-title']}
                    </Text>
                </View>

                <View style={stylesPopup.popupSection}>
                    <Text fontSize={18} style={stylesPopup.sectionTitle}>
                        {lang['recap']['title-1']}
                    </Text>
                    {lang['recap']['text-1'].map((text, index) => (
                        <Text key={index} fontSize={14} style={stylesPopup.sectionText}>
                            {text}
                        </Text>
                    ))}
                </View>

                <View style={stylesPopup.popupSection}>
                    <Text fontSize={18} style={stylesPopup.sectionTitle}>
                        {lang['recap']['title-2']}
                    </Text>
                    {lang['recap']['text-2'].map((text, index) => (
                        <Text key={index} fontSize={14} style={stylesPopup.sectionText}>
                            {text}
                        </Text>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

/**
 * PopupContent pour afficher les informations sur les quêtes
 */
function QuestsInfoPopupContent() {
    const lang = langManager.curr['app-explain'];

    return (
        <View style={stylesPopup.popupContent}>
            <ScrollView style={stylesPopup.popupScrollView}>
                <View style={stylesPopup.popupHeader}>
                    <Text fontSize={24} style={stylesPopup.popupTitle}>
                        {lang['quest']['popup-title']}
                    </Text>
                </View>

                <View style={stylesPopup.popupSection}>
                    <Text fontSize={18} style={stylesPopup.sectionTitle}>
                        {lang['quest']['title-1']}
                    </Text>
                    {lang['quest']['text-1'].map((text, index) => (
                        <Text key={index} fontSize={14} style={stylesPopup.sectionText}>
                            {text}
                        </Text>
                    ))}
                </View>

                <View style={stylesPopup.popupSection}>
                    <Text fontSize={18} style={stylesPopup.sectionTitle}>
                        {lang['quest']['title-2']}
                    </Text>
                    {lang['quest']['text-2'].map((text, index) => (
                        <Text key={index} fontSize={14} style={stylesPopup.sectionText}>
                            {text}
                        </Text>
                    ))}
                </View>

                <View style={stylesPopup.popupSection}>
                    <Text fontSize={18} style={stylesPopup.sectionTitle}>
                        {lang['quest']['title-3']}
                    </Text>
                    {lang['quest']['text-3'].map((text, index) => (
                        <Text key={index} fontSize={14} style={stylesPopup.sectionText}>
                            {text}
                        </Text>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

export { RecapInfoPopupContent, QuestsInfoPopupContent };
