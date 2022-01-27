import * as React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import BackWaitinternet from '../PageBack/WaitInternet';
import langManager from '../../Managers/LangManager';

import { Text } from '../Components';

class Waitinternet extends BackWaitinternet {
    render() {
        const textWait = langManager.curr['wait']['text-wait-internet'];

        return (
            <View style={styles.body}>
                <View style={styles.backgroundCircles}>
                    <Image source={require('../../../res/logo/login_circles.png')} />
                </View>

                <Text style={styles.text} color='primary'>{textWait}</Text>
            </View>
        )
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
        width: '90%',
        fontSize: 16,
        paddingHorizontal: '5%'
    }
});

export default Waitinternet;