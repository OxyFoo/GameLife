import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';

import BackOnboarding from './back';
import styles from './style';
import langManager from 'Managers/LangManager';

import { Button, Icon, Text } from 'Interface/Components';

/**
 * @typedef {import('Managers/LangManager').LangKey} LangKey
 * @typedef {import('Interface/Components/Icon').Icons} Icons
 */

class Onboarding extends BackOnboarding {
    render() {
        const lang = langManager.curr['onboarding'];

        return (
            <View style={styles.page}>
                <Text fontSize={32}>{lang['select-language']}</Text>

                <View style={styles.flagsContainer}>
                    {this.flag({ key: 'en', icon: 'flag-english' })}
                    {this.flag({ key: 'fr', icon: 'flag-french' })}
                </View>

                <Button
                    style={styles.buttonNext}
                    onPress={this.Next}
                    color='main1'
                    fontSize={14}
                >
                    {lang['start']}
                </Button>
            </View>
        );
    }

    /**
     * @param {Object} props
     * @param {LangKey} props.key
     * @param {Icons} props.icon
     */
    flag = ({ key, icon }) => {
        const langs = langManager.GetAllLangs();
        const opacity = this.state.selectedLangKey === key ? 1 : .6;
        const fontSize = this.state.selectedLangKey === key ? 24 : 18;
        const onPress = () => this.selectLanguage(key);

        return (
            <TouchableOpacity
                style={[styles.flagRow, { opacity }]}
                onPress={onPress}
                activeOpacity={.6}
            >
                <Icon icon={icon} size={64} />
                <Text style={styles.flagText} fontSize={fontSize}>
                    {langs[key].name}
                </Text>
            </TouchableOpacity>
        );
    }
}

export default Onboarding;
