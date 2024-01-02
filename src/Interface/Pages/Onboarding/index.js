import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import BackOnboarding from './back';
import langManager from 'Managers/LangManager';

import { Button, Icon, Text } from 'Interface/Components';

class Onboarding extends BackOnboarding {
    render() {
        const lang = langManager.curr['onboarding'];
        const langs = langManager.GetAllLangs();

        return (
            <View>
                <View style={{ marginTop: 24, marginRight: 24, alignItems: "flex-end", justifyContent: "flex-end" }}>
                    <Icon icon="info" size={30} ref={ref => this.refInfo = ref} />
                </View>

                {this.tutoLaunch === 0 &&
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

            </View>
        );
    }
}

const styles = StyleSheet.create({
    flagRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
    },
    flagText: {
        marginLeft: 16
    },
    buttonNext: {
        height: 42,
        width: 125,
        marginTop: 24,
        paddingHorizontal: 16
    }
});

export default Onboarding;
