import * as React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

import langManager from 'Managers/LangManager';

import { Icon, Text } from 'Interface/Components';
import themeManager from 'Managers/ThemeManager';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_WIDTH = SCREEN_WIDTH - 64;

/**
 * @typedef {import('./index').default} OnboardingPage
 */

/**
 * @this {OnboardingPage}
 * @returns {JSX.Element}
 */
function renderPage0() {
    const lang = langManager.curr['onboarding'];
    const langs = langManager.GetAllLangs();
    const backgroundCard = { backgroundColor: themeManager.GetColor('backgroundCard') };

    return (
        <View style={[styles.parent, styles.onboarding, backgroundCard]}>
            <Text fontSize={32}>{lang['select-language']}</Text>
            <TouchableOpacity style={styles.flagRow} onPress={this.selectEnglish} activeOpacity={.6}>
                <Icon icon='flagEnglish' size={64} />
                <Text style={styles.flagText}>{langs.en.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.flagRow} onPress={this.selectFrench} activeOpacity={.6}>
                <Icon icon='flagFrench' size={64} />
                <Text style={styles.flagText}>{langs.fr.name}</Text>
            </TouchableOpacity>
        </View>
    );
}

/**
 * @this {OnboardingPage}
 * @returns {JSX.Element}
 */
function renderPage1() {
    const lang = langManager.curr['onboarding'];
    return (
        <View style={styles.onboarding}>
            <Icon style={styles.onboardingImage} size={IMAGE_WIDTH} icon='onboarding1' />
            <Text fontSize={24}>{lang['page1']}</Text>
        </View>
    );
}

/**
 * @this {OnboardingPage}
 * @returns {JSX.Element}
 */
function renderPage2() {
    const lang = langManager.curr['onboarding'];
    return (
        <View style={styles.onboarding}>
            <Icon style={styles.onboardingImage} size={IMAGE_WIDTH} icon='onboarding2' />
            <Text fontSize={24}>{lang['page2']}</Text>
        </View>
    );
}

/**
 * @this {OnboardingPage}
 * @returns {JSX.Element}
 */
function renderPage3() {
    const lang = langManager.curr['onboarding'];
    return (
        <View style={styles.onboarding}>
            <Icon style={styles.onboardingImage} size={IMAGE_WIDTH} icon='onboarding3' />
            <Text fontSize={24}>{lang['page3']}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    parent: {
        height: '100%',
        padding: 24,
        justifyContent: 'center',
        borderRadius: 16
    },
    flagRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24
    },
    flagText: {
        marginLeft: 16
    },
    onboarding: {
        marginHorizontal: 24,
        alignItems: 'center'
    },
    onboardingImage: {
        marginBottom: 24
    }
});

export { renderPage0, renderPage1, renderPage2, renderPage3 };
