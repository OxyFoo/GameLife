import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackMultiplayer from './back';
import TopFriends from './TopFriends';
import OnlineFriends from './OnlineFriends';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Gradient } from 'Interface/Primitives';
import { Button, Text } from 'Interface/Components';

class Multiplayer extends BackMultiplayer {
    render() {
        const lang = langManager.curr['multiplayer'];
        const { friends, bestFriends } = this.state;

        return (
            <View style={styles.page}>
                <Text style={styles.title} color='border'>
                    {lang['title-top-friends']}
                </Text>

                <TopFriends style={styles.topfriendsContainer} friends={bestFriends} />

                <Text style={styles.title} color='border'>
                    {lang['title-online-friends']}
                </Text>

                <OnlineFriends friends={friends} />

                {/** Bottom buttons: Add friend / Leaderboard */}
                <Gradient
                    style={styles.leaderboardButtonContainer}
                    angle={140}
                    colors={[
                        themeManager.GetColor('main1', { opacity: 0.45 }),
                        themeManager.GetColor('main1', { opacity: 0.12 })
                    ]}
                >
                    <Button
                        nativeRef={this.refAddButton}
                        style={styles.leaderboardButton}
                        icon='add'
                        appearance='uniform'
                        color='transparent'
                        fontColor='gradient'
                        onPress={this.addFriendHandle}
                    />
                </Gradient>

                <Gradient
                    style={styles.addFriendButtonContainer}
                    angle={140}
                    colors={[
                        themeManager.GetColor('main1', { opacity: 0.45 }),
                        themeManager.GetColor('main1', { opacity: 0.12 })
                    ]}
                >
                    <Button
                        style={styles.addFriendButton}
                        appearance='uniform'
                        color='transparent'
                        fontColor='gradient'
                        icon='users'
                        onPress={this.goToFriends}
                    />
                </Gradient>
            </View>
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
