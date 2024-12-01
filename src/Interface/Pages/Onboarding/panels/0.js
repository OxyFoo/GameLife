import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import langManager from 'Managers/LangManager';

import { Button, Icon, Text } from 'Interface/Components';

/**
 * @typedef {import('Types/Global/Langs').LangKeys} LangKeys
 * @typedef {import('Ressources/Icons').IconsName} IconsName
 */

/**
 * @param {object} props
 * @param {() => void} [props.onNext]
 * @param {LangKeys} props.selectedLangKey
 * @param {(lang: LangKeys) => void} props.selectLanguage
 * @returns {JSX.Element}
 */
function RenderPage0({ selectedLangKey, selectLanguage, onNext }) {
    const lang = langManager.curr['onboarding'];

    return (
        <View style={styles.panel}>
            {/** Title */}
            <Text fontSize={32}>{lang['select-language']}</Text>

            {/** Flags */}
            <View style={styles.flagsContainer}>
                <RenderFlag
                    langKey='en'
                    icon='flag-english'
                    selectedLangKey={selectedLangKey}
                    selectLanguage={selectLanguage}
                />
                <RenderFlag
                    langKey='fr'
                    icon='flag-french'
                    selectedLangKey={selectedLangKey}
                    selectLanguage={selectLanguage}
                />
            </View>

            {/** CTA */}
            <View style={styles.cta}>
                <Button style={styles.buttonNext} color='main1' fontSize={14} onPress={onNext}>
                    {lang['next']}
                </Button>
            </View>
        </View>
    );
}

/**
 * @param {Object} props
 * @param {LangKeys} props.langKey
 * @param {IconsName} props.icon
 * @param {LangKeys} props.selectedLangKey
 * @param {(lang: LangKeys) => void} props.selectLanguage
 * @returns {JSX.Element}
 */
function RenderFlag({ langKey, icon, selectedLangKey, selectLanguage }) {
    const langs = langManager.GetAllLangs();
    const opacity = selectedLangKey === langKey ? 1 : 0.6;
    const fontSize = selectedLangKey === langKey ? 24 : 18;
    const onPress = () => selectLanguage(langKey);

    return (
        <TouchableOpacity style={[styles.flagRow, { opacity }]} onPress={onPress} activeOpacity={0.6}>
            <Icon icon={icon} size={64} />
            <Text style={styles.flagText} fontSize={fontSize}>
                {langs[langKey].name}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    panel: {
        width: '100%',
        height: '100%',
        paddingTop: '20%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    flagsContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    flagRow: {
        marginVertical: 12,
        flexDirection: 'row',
        alignItems: 'center'
    },
    flagText: {
        marginLeft: 16
    },

    cta: {
        alignItems: 'center'
    },
    buttonNext: {
        width: 'auto',
        paddingVertical: 12,
        paddingHorizontal: 48
    }
});

export { RenderPage0 };
