import * as React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import BackWaitinternet from './back';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Page } from 'Interface/Global';
import { Text } from 'Interface/Components';

class Waitinternet extends BackWaitinternet {
    render() {
        let textWait = langManager.curr['wait']['wait-internet-text'];

        if (user.server.status === 'maintenance') {
            textWait = langManager.curr['wait']['wait-maintenance-text'];
        }

        return (
            <Page
                ref={ref => this.refPage = ref}
                style={styles.body}
                scrollable={false}
            >
                <View style={styles.backgroundCircles}>
                    <Image source={this.image} />
                </View>

                <Text style={styles.text} color='primary'>{textWait}</Text>
                <Text style={styles.link} onPress={this.goToWebsite} color='main1'>oxyfoo.com</Text>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    backgroundCircles: {
        position: 'absolute',
        top: 0,
        right: 0
    },
    text: {
        fontSize: 20,
        paddingHorizontal: 12
    },
    link: {
        marginTop: 12,
        fontSize: 24
    }
});

export default Waitinternet;
