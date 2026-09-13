import * as React from 'react';
import { View, FlatList } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from '../style';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import Avatar from 'Data/User/Avatar';
import { BODY_COLORS } from 'Interface/Pages/Profile/AvatarEditor/avatarConstants';
import { Button, Icon, Text } from 'Interface/Components';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidFeedEvent} RaidFeedEvent
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidFeedData} RaidFeedData
 * @typedef {import('../back').LoadingState} LoadingState
 */

/**
 * @param {RaidFeedEvent} event
 * @returns {{ subtitle: string, right: React.ReactNode }}
 */
function describeEvent(event) {
    const lang = langManager.curr['raids'];

    switch (event.type) {
        case 'level-up': {
            const data = /** @type {RaidFeedData['level-up']} */ (event.data);
            return {
                subtitle: lang['feed-level-up'].replace('{}', data.to.toString()),
                right: (
                    <>
                        <Icon icon='arrow-up' size={16} color='success' />
                        <Text fontSize={12} color='success' bold>
                            LV.
                        </Text>
                    </>
                )
            };
        }
        case 'achievement': {
            const data = /** @type {RaidFeedData['achievement']} */ (event.data);
            const achievement = dataManager.achievements.GetByID(data.achievementID);
            const name = achievement === null ? '?' : langManager.GetText(achievement.Name);
            return {
                subtitle: lang['feed-achievement'].replace('{}', name),
                right: <Icon icon='cup' size={22} color='main1' />
            };
        }
        case 'raid-critical': {
            const data = /** @type {RaidFeedData['raid-critical']} */ (event.data);
            return {
                subtitle: lang['feed-critical'].replace('{}', data.points.toString()),
                right: <Icon icon='bolt' size={22} color='raid' />
            };
        }
        case 'raid-rank': {
            const data = /** @type {RaidFeedData['raid-rank']} */ (event.data);
            return {
                subtitle: lang['feed-rank'].replace('{}', data.threshold.toString()),
                right: <Icon icon='crown' size={22} color='raid' />
            };
        }
        default:
            return { subtitle: '', right: null };
    }
}

/**
 * @param {object} props
 * @param {RaidFeedEvent} props.event
 */
function FeedRow({ event }) {
    const friend = user.multiplayer.GetFriendByID(event.accountID);
    const containerSize = dataManager.items.GetContainerSize('profile');
    const { subtitle, right } = describeEvent(event);
    const username = friend?.username ?? event.username;

    return (
        <View style={styles.feedRow}>
            <View style={styles.feedFrame}>
                {friend?.avatar ? (
                    <AvatarFrame width={38} height={38} renderScale={2} backgroundColor='#00000000'>
                        <AvatarCharacter
                            body={friend.avatar.Skin || 'human_00'}
                            bodyColor={BODY_COLORS[friend.avatar.SkinColor] || BODY_COLORS[0]}
                            position={containerSize.pos}
                            scale={containerSize.scale}
                            items={Avatar.GetFriendAvatarItems(friend)}
                            portraitMode
                        />
                    </AvatarFrame>
                ) : null}
            </View>
            <View style={styles.feedText}>
                <Text style={styles.feedTextLeft} fontSize={16}>
                    {username}
                </Text>
                <Text style={styles.feedTextLeft} fontSize={12} color='main1' numberOfLines={1}>
                    {subtitle}
                </Text>
            </View>
            <View style={styles.feedRight}>{right}</View>
        </View>
    );
}

/**
 * Feed of the friends: levels, achievements, critical hits and ranks
 * @param {object} props
 * @param {LoadingState} props.state
 * @param {RaidFeedEvent[]} props.events
 * @param {() => void} props.onInfoPress
 * @param {() => void} props.onRetry
 */
function Feed({ state, events, onInfoPress, onRetry }) {
    const lang = langManager.curr['raids'];
    const selfID = user.raids.payload.Get()?.accountID ?? -1;
    const data = events.filter((event) => event.accountID !== selfID);

    return (
        <View>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle} color='border'>
                    {lang['feed-title']}
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

            {(state === 'loaded' || state === 'loading') && (
                <>
                    {(state === 'loaded' || data.length > 0) && (
                        <FlatList
                            style={styles.list}
                            data={data}
                            scrollEnabled={false}
                            keyExtractor={(item) => `feed-${item.id}`}
                            renderItem={({ item }) => <FeedRow event={item} />}
                            ListEmptyComponent={
                                <View style={styles.centered}>
                                    <Text color='secondary'>{lang['feed-empty']}</Text>
                                </View>
                            }
                        />
                    )}
                </>
            )}
        </View>
    );
}

export { Feed };
