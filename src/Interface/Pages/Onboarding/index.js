import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';

import BackOnboarding from './back';
import styles from './style';
import langManager from 'Managers/LangManager';

import { Page } from 'Interface/Global';
import { Button, Icon, Text } from 'Interface/Components';

/**
 * @typedef {import('Managers/LangManager').LangKey} LangKey
 */

class Onboarding extends BackOnboarding {
    render() {
        const { helpAnimation, tutoLaunched } = this.state;
        const helpStyle = {
            transform: [{ translateY: helpAnimation }]
        };

        return (
            <Page
                ref={ref => this.refPage = ref}
                style={styles.page}
                scrollable={false}
            >
                <Button
                    ref={ref => this.refInfo = ref}
                    style={styles.buttonQuestion}
                    color='transparent'
                    styleAnimation={helpStyle}
                >
                    <Icon icon='info' size={30} />
                </Button>

                {!tutoLaunched && this.renderLangSelector()}
            </Page>
        );
    }

    renderLangSelector() {
        const lang = langManager.curr['onboarding'];
        const langs = langManager.GetAllLangs();

        /** @param {LangKey} key */
        const getSize = (key) => langManager.currentLangageKey === key ? 24 : 18;

        return (
            <View style={styles.langsContainer}>
                <Text fontSize={32}>{lang['select-language']}</Text>

                <View style={styles.flagsContainer}>
                    <TouchableOpacity style={styles.flagRow} onPress={this.selectEnglish} activeOpacity={.6}>
                        <Icon icon='flagEnglish' size={64} />
                        <Text style={styles.flagText} fontSize={getSize('en')}>{langs.en.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.flagRow} onPress={this.selectFrench} activeOpacity={.6}>
                        <Icon icon='flagFrench' size={64} />
                        <Text style={styles.flagText} fontSize={getSize('fr')}>{langs.fr.name}</Text>
                    </TouchableOpacity>
                </View>

                <Button
                    style={styles.buttonNext}
                    onPress={this.launchOnboarding}
                    color='main1'
                    fontSize={14}
                >
                    {lang['start']}
                </Button>
            </View>
        );
    }
}

export default Onboarding;
