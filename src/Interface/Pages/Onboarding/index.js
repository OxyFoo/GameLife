import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import BackOnboarding from './back';
import styles from './style';
import langManager from 'Managers/LangManager';

import { Page, Button, Icon, Text } from 'Interface/Components';

class Onboarding extends BackOnboarding {
    render() {
        const lang = langManager.curr['onboarding'];
        const langs = langManager.GetAllLangs();

        return (
            <Page
                ref={ref => this.refPage = ref}
                style={styles.page}
                scrollable={false}
            >
                {this.state.tutoLaunch === 1 &&
                    <View style={styles.buttonQuestion}>
                        <Icon icon="info" size={30} ref={ref => this.refInfo = ref} />
                    </View>
                }

                {this.state.tutoLaunch === 0 &&
                    <View style={{ alignItems: "center", justifyContent: "center", marginTop: "10%" }}>
                        <Text fontSize={32}>{lang['select-language']}</Text>
                        <TouchableOpacity style={styles.flagRow} onPress={this.selectEnglish} activeOpacity={.6}>
                            <Icon icon='flagEnglish' size={64} />
                            <Text style={styles.flagText}>{langs.en.name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.flagRow} onPress={this.selectFrench} activeOpacity={.6}>
                            <Icon icon='flagFrench' size={64} />
                            <Text style={styles.flagText}>{langs.fr.name}</Text>
                        </TouchableOpacity>

                        <View>
                            <Button
                                style={styles.buttonNext}
                                onPress={this.launchOnboarding}
                                color='main1'
                                fontSize={14}
                                pointerEvents={this.last ? 'none' : 'auto'}
                            >
                                {lang['start']}
                            </Button>
                        </View>
                    </View>
                }

            </Page>
        );
    }
}

export default Onboarding;
