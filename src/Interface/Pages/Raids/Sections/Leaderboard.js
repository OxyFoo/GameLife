import * as React from 'react';
import { View, FlatList } from 'react-native';

import styles from '../style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Button, Icon, RankElement, Text } from 'Interface/Components';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidLeaderboardPlayer} RaidLeaderboardPlayer
 * @typedef {import('../back').LoadingState} LoadingState
 */

/**
 * World ranking of the current raid: the player first, then the top 100
 * @param {object} props
 * @param {LoadingState} props.state
 * @param {RaidLeaderboardPlayer[]} props.players
 * @param {RaidLeaderboardPlayer | null} props.selfPlayer
 * @param {() => void} props.onInfoPress
 * @param {() => void} props.onRetry
 */
function Leaderboard({ state, players, selfPlayer, onInfoPress, onRetry }) {
    const lang = langManager.curr['raids'];
    const selfID = selfPlayer?.accountID ?? user.raids.payload.Get()?.accountID ?? -1;

    const data =
        selfPlayer === null ? players : [selfPlayer, ...players.filter((p) => p.accountID !== selfPlayer.accountID)];

    return (
        <View>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle} color='border'>
                    {lang['leaderboard-title']}
                </Text>
                <Icon icon='info-circle-outline' size={22} color='main1' onPress={onInfoPress} />
            </View>

            {(state === 'error-connection' || state === 'error-server') && (
                <View style={styles.centered}>
                    <Text color='white'>
                        {state === 'error-connection' ? lang['error-connection'] : lang['error-loading']}
                    </Text>
                    <Button style={styles.retryButton} appearance='outline' onPress={onRetry}>
                        {lang['retry']}
                    </Button>
                </View>
            )}

            {/** The previous ranking stays as is while it refreshes: nothing flashes */}
            {(state === 'loaded' || state === 'loading') && (
                <>
                    {(state === 'loaded' || data.length > 0) && (
                        <FlatList
                            style={styles.list}
                            data={data}
                            scrollEnabled={false}
                            keyExtractor={(item) => `rank-${item.accountID}`}
                            renderItem={({ item }) => <RankElement item={item} isSelf={item.accountID === selfID} />}
                            ListEmptyComponent={
                                <View style={styles.centered}>
                                    <Text color='secondary'>{lang['leaderboard-empty']}</Text>
                                </View>
                            }
                        />
                    )}
                </>
            )}
        </View>
    );
}

export { Leaderboard };
