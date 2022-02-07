import * as React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import BackWaitmail from '../PageBack/WaitMail';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

import { Text, Button, ProgressBar } from '../Components';

class Waitmail extends BackWaitmail {
    render() {
        const email = user.settings.email;
        const langWait = langManager.curr['wait'];
        const textWait = langWait['wait-email-text'];

        const { time } = this.state;
        let timeText = '';
        if (time === 0) {
            timeText = langWait['wait-email-send'];
        } else if (time !== null) {
            const SS = time % 60;
            const MM = (time - SS) / 60;
            timeText = langWait['wait-email-remain'].replace('{}', MM).replace('{}', SS);
        }

        return (
            <View style={styles.body}>
                <View style={styles.backgroundCircles}>
                    <Image source={require('../../../res/logo/login_circles.png')} />
                </View>

                <Text style={styles.title} color='primary' fontSize={22}>{email}</Text>
                <Text color='primary' fontSize={16}>{textWait}</Text>

                {/* ProgressBar & Back button */}
                <View style={styles.progressBar}>
                    <Text style={styles.resendText}>{timeText}</Text>
                    <ProgressBar />
                </View>
                <Button
                    style={styles.backButton}
                    color="main1"
                    icon='arrowLeft'
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
    },
    resendText: {
        fontSize: 14,
        textAlign: 'right',
        marginBottom: 6
    }
});

export default Waitmail;