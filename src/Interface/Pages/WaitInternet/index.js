import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackWaitinternet from './back';
import langManager from 'Managers/LangManager';

import { Text, ProgressBar } from 'Interface/Components';

class Waitinternet extends BackWaitinternet {
    render() {
        const lang = langManager.curr['wait'];
        const { currentStatus, lastError } = this.state;

        let textWait = lang['wait-internet-text'];
        if (currentStatus === 'maintenance') {
            textWait = lang['wait-maintenance-text'];
        }

        return (
            <View style={styles.page}>
                <View>
                    <Text style={styles.text} color='primary'>
                        {textWait}
                    </Text>

                    <Text style={styles.link} onPress={this.goToWebsite} color='main1'>
                        oxyfoo.fr
                    </Text>
                </View>

                <View style={styles.bottomView}>
                    {lastError !== null && (
                        <Text style={styles.error} color='secondary'>
                            {lastError}
                        </Text>
                    )}

                    <ProgressBar.Infinite />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        padding: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    text: {
        fontSize: 20,
        paddingHorizontal: 12
    },
    link: {
        marginTop: 12,
        fontSize: 24
    },
    error: {
        marginBottom: 6,
        fontSize: 16,
        textAlign: 'center'
    },

    bottomView: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 24
    }
});

export default Waitinternet;
