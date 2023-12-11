import * as React from 'react';
import { View, StyleSheet, Button } from 'react-native';

import BackMultiplayer from './back';
import langManager from 'Managers/LangManager';

import { Container, Page, Text, HeatMap, StreakChart } from 'Interface/Components';
import { YearHeatMap } from 'Interface/Widgets';

class Multiplayer extends BackMultiplayer {
    render() {
        const lang = langManager.curr['multiplayer'];
        const WEEKS = 52;
        const DAYS_PER_WEEK = 7;
        const LEVELS = 7;

        // Data with 52 cells, one for each week
        const weeklyData = new Array(WEEKS).fill(null).map(() => Math.floor(Math.random() * LEVELS));

        // Data with 52 * 7 cells, one for each day of the year (assuming 7 days per week)
        const dailyData = new Array(WEEKS * DAYS_PER_WEEK).fill(null).map(() => Math.floor(Math.random() * LEVELS));

        const gridSize = 10; // For example, 7 cells per column
        //const lang = langManager.curr['quests'];


        return (
            <Page ref={ref => this.refPage = ref} isHomePage canScrollOver>

                <View>
                    {/*}             
                <FullQuest questID={1}/> 
                <FullQuest questID={2}/> 
                <FullQuest questID={3}/> 

                <Button title="Add quest" onPress={() => this.createQuest()}/>
            */}


                    <YearHeatMap />

                    <Text>{this.state.buttonTestValue}</Text>
                    <Button title="Change value" onPress={() => { console.log("CLIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIiiIIIIIIIIIIIIIIICK"); this.setState({ buttonTestValue: this.state.buttonTestValue + 1 }) }} />

                    <StreakChart currentStreak={12} bestStreak={this.state.buttonTestValue} />
                    {/*<StreakChart currentStreak={342} bestStreak={432} />*/}


                </View>
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
