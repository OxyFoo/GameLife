import * as React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import BackWaitinternet from '../back/waitinternet';

import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';

class Waitinternet extends BackWaitinternet {
    render() {
        const textWait = langManager.curr['waitmail']['text-wait'];

        return (
            <View style={styles.body}>
                <View style={styles.backgroundCircles}>
                    <Image source={require('../../../res/logo/login_circles.png')} />
                </View>

                {/* Content */}
                <View style={styles.container}>
                    <Text style={[styles.text, { color: themeManager.colors['text']['main'] }]}>{textWait}</Text>
                </View>

                {/* ProgressBar & Back button */}
                <View style={styles.backButton}>
                    <Button
                        mode="contained"
                        color="#9095FF"
                        contentStyle={{ height: '100%' }}
                        labelStyle={{ fontSize: 12, marginRight: -1, color: '#FFFFFF' }}
                        icon={require('../../../res/icons/back.png')}
                        onPress={this.onBack}
                    ></Button>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        padding: '5%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        width: '100%',
        marginTop: '5%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    backgroundCircles: {
        position: 'absolute',
        top: 0,
        right: 0
    },
    progressBar: {
        position: 'absolute',
        left: 96,
        right: 24,
        bottom: 24,
        borderRadius: 20,
        overflow: 'hidden'
    },
    backButton: {
        position: 'absolute',
        height: 56,
        width: 64,
        left: 24,
        bottom: 24,
        borderRadius: 20,
        overflow: 'hidden'
    },
    text: {
        width: '90%',
        marginVertical: '4%',
        textAlign: 'center',
        fontSize: 16
    }
});

export default Waitinternet;