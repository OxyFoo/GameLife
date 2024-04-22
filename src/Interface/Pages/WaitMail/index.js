import * as React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import BackWaitmail from './back';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Page } from 'Interface/Global';
import { Text, Button, ProgressBar } from 'Interface/Components';

class Waitmail extends BackWaitmail {
    render() {
        const email = user.settings.email;
        const langWait = langManager.curr['wait'];
        const textWait = langWait['wait-email-text'];
        const timeText = this.getTimeText();

        return (
            <Page
                ref={this.refPage}
                style={styles.body}
                scrollable={false}
            >
                <View style={styles.backgroundCircles}>
                    <Image source={this.image} />
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
                    color='main1'
                    icon='arrowLeft'
                    onPress={this.onBack}
                    borderRadius={20}
                />
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
