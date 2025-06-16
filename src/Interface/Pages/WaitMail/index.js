import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackWaitmail from './back';
import langManager from 'Managers/LangManager';

import { Text, Button, ProgressBar } from 'Interface/Components';

class Waitmail extends BackWaitmail {
    render() {
        const { email } = this.props.args;
        const { statusText, showResendButton } = this.state;
        const langWait = langManager.curr['wait'];
        const textWait = langWait['wait-email-text'];

        return (
            <View style={styles.page}>
                {/* Title and Email Display */}
                <View>
                    <Text style={styles.title} color='primary' fontSize={22}>
                        {email}
                    </Text>
                    <Text color='primary' fontSize={16}>
                        {textWait}
                    </Text>
                </View>

                {/* Empty View for spacing */}
                <View />

                {/* ProgressBar & Back button */}
                <View style={styles.bottomView}>
                    <Button
                        style={styles.backButton}
                        appearance='outline'
                        icon='arrow-left'
                        onPress={this.onBack}
                        throttleTime={1000}
                    />

                    {/* Resend Button / Waiting View */}
                    <View style={styles.waitingView}>
                        {showResendButton ? (
                            <Button appearance='normal' onPress={this.onResend} throttleTime={3000}>
                                {langWait['wait-email-resend']}
                            </Button>
                        ) : (
                            <>
                                <Text style={styles.resendText}>{statusText}</Text>
                                <ProgressBar.Infinite />
                            </>
                        )}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        height: '100%',
        padding: 32,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    title: {
        marginBottom: 64,
        textDecorationLine: 'underline'
    },

    bottomView: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 24,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    waitingView: {
        flex: 1,
        marginLeft: 24
    },
    backButton: {
        width: 64
    },
    resendText: {
        fontSize: 14,
        textAlign: 'right',
        marginBottom: 6
    }
});

export default Waitmail;
