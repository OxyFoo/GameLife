import * as React from 'react';
import { View, ScrollView } from 'react-native';

import styles from './style';
import BackMultiplayer from './back';
import TopFriends from './TopFriends';
import TopWorld from './TopWorld';
import langManager from 'Managers/LangManager';
import { Button, Text, Icon } from 'Interface/Components';

class Multiplayer extends BackMultiplayer {
    render() {
        const lang = langManager.curr['multiplayer'];
        const { bestFriends, topWorldPlayers } = this.state;

        return (
            <ScrollView style={styles.page}>
                <View style={styles.titleRow}>
                    <Text style={styles.title} color='border'>
                        {lang['title-top-world']}
                    </Text>
                    <Button
                        style={styles.titleButton}
                        appearance='uniform'
                        color='transparent'
                        onPress={this.goToLeaderboard}
                    >
                        <Icon color='gradient' size={24} icon='arrow-square-outline' angle={90} />
                    </Button>
                </View>

                <TopWorld style={styles.topContainer} players={topWorldPlayers} />

                <View style={styles.titleRow}>
                    <Text style={styles.title} color='border'>
                        {lang['title-top-friends']}
                    </Text>
                    <Button
                        style={styles.titleButton}
                        appearance='uniform'
                        color='transparent'
                        onPress={this.goToFriends}
                    >
                        <Icon color='gradient' size={24} icon='arrow-square-outline' angle={90} />
                    </Button>
                </View>

                <TopFriends style={styles.topContainer} friends={bestFriends} />
            </ScrollView>
        );
    }

    renderLoading = () => {
        const textLoading = langManager.curr['multiplayer']['connection-loading'];

        return (
            <>
                <Text>{textLoading}</Text>
            </>
        );
    };

    renderDisconnected = () => {
        const textFailed = langManager.curr['multiplayer']['connection-offline'];

        return (
            <>
                <Text>{textFailed}</Text>
            </>
        );
    };
}

export default Multiplayer;
