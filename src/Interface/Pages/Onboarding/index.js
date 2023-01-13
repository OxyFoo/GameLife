import * as React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

import BackOnboarding from './back';
import langManager from '../../../Managers/LangManager';

import { Button, Icon, Page, Swiper, Text } from '../../Components';
import themeManager from '../../../Managers/ThemeManager';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_WIDTH = SCREEN_WIDTH - 64;

class Onboarding extends BackOnboarding {
    renderPage0 = () => {
        const lang = langManager.curr['onboarding'];
        const backgroundCard = { backgroundColor: themeManager.GetColor('backgroundCard') };

        return (
            <View style={[styles.parent, styles.onboarding, backgroundCard]}>
                <Text fontSize={32}>{lang['select-language']}</Text>
                <TouchableOpacity style={styles.flagRow} onPress={this.selectEnglish} activeOpacity={.6}>
                    <Icon icon='flagEnglish' size={64} />
                    <Text style={styles.flagText}>{langManager.langages.en.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.flagRow} onPress={this.selectFrench} activeOpacity={.6}>
                    <Icon icon='flagFrench' size={64} />
                    <Text style={styles.flagText}>{langManager.langages.fr.name}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderPage1 = () => {
        const lang = langManager.curr['onboarding'];
        return (
            <View style={styles.onboarding}>
                <Icon style={styles.onboardingImage} size={IMAGE_WIDTH} icon='onboarding1' />
                <Text fontSize={24}>{lang['page1']}</Text>
            </View>
        );
    }

    renderPage2 = () => {
        const lang = langManager.curr['onboarding'];
        return (
            <View style={styles.onboarding}>
                <Icon style={styles.onboardingImage} size={IMAGE_WIDTH} icon='onboarding2' />
                <Text fontSize={24}>{lang['page2']}</Text>
            </View>
        );
    }

    renderPage3 = () => {
        const lang = langManager.curr['onboarding'];
        return (
            <View style={styles.onboarding}>
                <Icon style={styles.onboardingImage} size={IMAGE_WIDTH} icon='onboarding3' />
                <Text fontSize={24}>{lang['page3']}</Text>
            </View>
        );
    }

    render() {
        const lang = langManager.curr['onboarding'];
        const buttonText = this.state.last ? lang['start'] : lang['next'];
        const pages = [
            this.renderPage0(),
            this.renderPage1(),
            this.renderPage2(),
            this.renderPage3()
        ];

        return (
            <Page
                ref={ref => this.refPage = ref}
                style={{ height: '100%', paddingHorizontal: 0 }}
                canScrollOver={false}
            >
                <Swiper
                    ref={ref => { if (ref !== null) this.refSwiper = ref; }}
                    height={'90%'}
                    style={{ justifyContent: 'center' }}
                    backgroundColor='transparent'
                    enableAutoNext={false}
                    pages={pages}
                    onSwipe={this.onSwipe}
                />
                <Button style={styles.buttonNext} onPress={this.next} color='main1' fontSize={14}>{buttonText}</Button>
            </Page>
        );
    }
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
    },
    buttonNext: {
        position: 'absolute',
        right: 24,
        bottom: '15%',
        height: 42,
        paddingHorizontal: 16
    }
});

export default Onboarding;