import * as React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import BackWaitmail from '../back/waitmail';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import { Text, Button, ProgressBar } from '../Components';

class Waitmail extends BackWaitmail {
    render() {
        const email = user.settings.email;
        const textWait = langManager.curr['wait']['text-wait-email'];

        return (
            <View style={styles.body}>
                <View style={styles.backgroundCircles}>
                    <Image source={require('../../../res/logo/login_circles.png')} />
                </View>

                <Text style={styles.title} color='primary' fontSize={22}>{email}</Text>
                <Text color='primary' fontSize={16}>{textWait}</Text>

                {/* ProgressBar & Back button */}
                <View style={styles.progressBar}>
                    <ProgressBar />
                </View>
                <Button
                    style={styles.backButton}
                    color="main1"
                    icon='arrowLeft'
                    rippleFactor={4}
                    onPress={this.onBack}
                    borderRadius={20}
                />
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
        overflow: 'hidden'
    },
    backButton: {
        position: 'absolute',
        width: 64,
        left: 24,
        bottom: 24
    },
    title: {
        marginBottom: 64,
        textDecorationLine: 'underline'
    }
});

export default Waitmail;