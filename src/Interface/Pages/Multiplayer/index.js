import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackMultiplayer from './back';
import langManager from 'Managers/LangManager';

import { Button, Container, Page, Text } from 'Interface/Components';

class Multiplayer extends BackMultiplayer {
    render() {
        const { server } = this.state;
        const pages = {
            '': this.renderLoading,
            'connected': this.renderMultiplayer,
            'disconnected': this.renderFailed,
            'error': this.renderFailed,
            'offline': this.renderOffline
        };

        return (
            <Page ref={ref => this.refPage = ref} isHomePage canScrollOver>
                {pages[server]()}
            </Page>
        );
    }

    renderLoading = () => {
        const textLoading = langManager.curr['multiplayer']['connection-loading'];
        return (
            <>
                <Text style={styles.firstText}>{textLoading}</Text>
            </>
        );
    }

    renderMultiplayer = () => {
        return (
            <>
                <Button color='main1' icon='world' borderRadius={12}>[Classement]</Button>
                <Container
                    text='[Alliés]'
                    icon='userAdd'
                    onIconPress={() => { console.log('test'); }}
                >
                </Container>
            </>
        );
    }

    renderFailed = () => {
        const textFailed = langManager.curr['multiplayer']['connection-failed'];
        const textRetry = langManager.curr['multiplayer']['button-retry'];
        return (
            <>
                <Text style={styles.firstText}>{textFailed}</Text>
                <Button style={{ marginTop: 24 }} color='main1' onPress={this.Reconnect}>{textRetry}</Button>
            </>
        );
    }

    renderOffline = () => {
        const textFailed = langManager.curr['multiplayer']['connection-offline'];
        const textRetry = langManager.curr['multiplayer']['button-retry'];
        return (
            <>
                <Text style={styles.firstText}>{textFailed}</Text>
            </>
        );
    }
}

const styles = StyleSheet.create({
    tempContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginVertical: '30%'
    },
    tempTitle: {
        paddingHorizontal: 12,
        fontSize: 32
    },
    tempText: {
        paddingHorizontal: 12,
        fontSize: 24
    },

    firstText: {
        marginTop: '45%',
        paddingHorizontal: 12,
        fontSize: 24
    }
});

export default Multiplayer;
