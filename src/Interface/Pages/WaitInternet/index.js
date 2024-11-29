import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackWaitinternet from './back';
import langManager from 'Managers/LangManager';

import { Text, ProgressBar } from 'Interface/Components';

class Waitinternet extends BackWaitinternet {
    render() {
        let textWait = langManager.curr['wait']['wait-internet-text'];

        if (this.state.currentStatus === 'maintenance') {
            textWait = langManager.curr['wait']['wait-maintenance-text'];
        }

        return (
            <View style={styles.page}>
                <View>
                    <Text style={styles.text} color='primary'>
                        {textWait}
                    </Text>
                    <Text style={styles.link} onPress={this.goToWebsite} color='main1'>
                        oxyfoo.com
                    </Text>
                </View>

                <View style={styles.bottomView}>
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

    bottomView: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 24
    }
});

export default Waitinternet;
