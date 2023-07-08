import * as React from 'react';
import { StyleSheet } from 'react-native';

import BackMultiplayer from './back';
import langManager from 'Managers/LangManager';

import { Button, Container, Page, Text } from 'Interface/Components';

class Multiplayer extends BackMultiplayer {
    render() {
        // Show "Coming soon" message in center of screen with emoji
        return (
            <Page ref={ref => this.refPage = ref} isHomePage canScrollOver>
                <Text style={styles.firstText}>🚧 Coming soon 🚧</Text>
            </Page>
        );

        const { server } = this.state;
        const pages = {
            '': this.renderLoading,
            'connected': this.renderMultiplayer,
            'disconnected': this.renderFailed,
            'error': this.renderFailed,
            'offline': this.renderOffline,
            'test': this.renderTest
        };
        console.log(server);

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

    renderTest = () => {
        return (
            <>
                <Button style={{ marginBottom: 24 }} color='main1' borderRadius={8} onPress={this.ConnectToServer}>Connect to server</Button>
                <Button style={{ marginBottom: 24 }} color='main1' borderRadius={8} onPress={this.Send}>Send</Button>
                <Button style={{ marginBottom: 24 }} color='main1' borderRadius={8} onPress={this.Disconnect}>Disconnect</Button>
            </>
        );
    }
}

const styles = StyleSheet.create({
    firstText: {
        marginTop: '45%',
        paddingHorizontal: 12,
        fontSize: 24
    }
});

export default Multiplayer;