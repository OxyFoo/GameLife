import * as React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import BackWaitinternet from './back';
import langManager from '../../../Managers/LangManager';

import { Page, Text } from '../../Components';

class Waitinternet extends BackWaitinternet {
    render() {
        const textWait = langManager.curr['wait']['wait-internet-text'];

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
        fontSize: 16,
        paddingHorizontal: 24
    }
});

export default Waitinternet;