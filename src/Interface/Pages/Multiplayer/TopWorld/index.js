import React from 'react';
import { Dimensions, View } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import ProfileLeaderboardPlayer from 'Interface/PageView/ProfileLeaderboardPlayer';
import { BODY_COLORS } from 'Interface/Pages/Profile/AvatarEditor/avatarConstants';
import { Button, Text, Icon } from 'Interface/Components';
import { Gradient } from 'Interface/Primitives';

/**
 * @typedef {import('@oxyfoo/avatar-factory').ItemConfig} ItemConfig
 * @typedef {import('@oxyfoo/gamelife-types').LeaderboardPlayer} LeaderboardPlayer
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 */

/**
 * Get avatar items from a leaderboard player avatar object
 * @param {LeaderboardPlayer['avatar']} avatar
 * @returns {ItemConfig[]}
 */
const getLeaderboardAvatarItems = (avatar) => {
    if (!avatar) return [];
    const skinColor = BODY_COLORS[avatar.SkinColor] || BODY_COLORS[0];

    /** @type {ItemConfig[]} */
    const faceItems = [{ id: 'face_00' }, { id: 'ears_00', color: skinColor }];

    /** @type {ItemConfig[]} */
    const equipmentItems = [];
    if (avatar.Hair) equipmentItems.push({ id: avatar.Hair });
    if (avatar.Top) equipmentItems.push({ id: avatar.Top });
    if (avatar.Bottom) equipmentItems.push({ id: avatar.Bottom });
    if (avatar.Shoes) equipmentItems.push({ id: avatar.Shoes });

    return [...faceItems, ...equipmentItems];
};

/**
 * Render avatar for a player or placeholder if no player
 * @param {LeaderboardPlayer | null} player
 * @param {number} size
 * @returns {React.ReactNode}
 */
const renderAvatar = (player, size) => {
    if (!player?.avatar) {
        return <View style={styles.avatarPlaceholder} />;
    }

    const items = getLeaderboardAvatarItems(player.avatar);
    const body = player.avatar.Skin || 'human_00';
    const bodyColor = BODY_COLORS[player.avatar.SkinColor] || BODY_COLORS[0];
    const containerSize = dataManager.items.GetContainerSize('profile');

    return (
        <AvatarFrame style={styles.avatarFrame} width={size} height={size} renderScale={2} backgroundColor='#00000000'>
            <AvatarCharacter
                body={body}
                bodyColor={bodyColor}
                position={containerSize.pos}
                scale={containerSize.scale}
                items={items}
                portraitMode
            />
        </AvatarFrame>
    );
};

/**
 * Handle player press - open profile panel
 * @param {LeaderboardPlayer | null} player
 */
const handlePlayerPress = (player) => {
    if (!player) return;
    const screen = Dimensions.get('window');
    user.interface.bottomPanel?.Open({
        content: <ProfileLeaderboardPlayer player={player} />,
        maxPosY: screen.height * 0.8
    });
};

/**
 * @param {Object} param0
 * @param {StyleViewProp} [param0.style]
 * @param {LeaderboardPlayer[]} param0.players Players list (top 3)
 * @returns {React.ReactNode}
 */
const TopWorld = ({ style, players }) => {
    /** @type {StyleViewProp} */
    const styleFrame = {
        borderColor: themeManager.GetColor('border')
    };

    /** @type {StyleViewProp} */
    const styleBgRank = {
        backgroundColor: themeManager.GetColor('border')
    };

    const player1 = players.length >= 1 ? players[0] : null;
    const player2 = players.length >= 2 ? players[1] : null;
    const player3 = players.length >= 3 ? players[2] : null;

    return (
        <View style={[styles.topWorldContainer, style]}>
            {/* 2nd Place - Left */}
            <Button
                style={styles.topWorld}
                appearance='uniform'
                color='transparent'
                onPress={() => handlePlayerPress(player2)}
                enabled={player2 !== null}
            >
                <View style={styles.topWorldView}>
                    <View style={[styles.topWorldFrame, styleFrame]}>{renderAvatar(player2, 80)}</View>
                    <View style={styles.topWorldRankContainer}>
                        <View style={[styles.topWorldRank, styleBgRank]}>
                            <Text style={styles.topWorldRankText}>2</Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.topWorldPseudo}>{player2?.username || ''}</Text>
            </Button>

            {/* 1st Place - Center */}
            <View style={styles.topWorldMiddle}>
                <Button
                    style={styles.topWorldMiddleButton}
                    appearance='uniform'
                    color='transparent'
                    onPress={() => handlePlayerPress(player1)}
                    enabled={player1 !== null}
                >
                    <Gradient
                        style={styles.topWorldMiddleGradient}
                        containerStyle={styles.topWorldMiddleGradientContainer}
                        colors={[
                            themeManager.GetColor('main1', { opacity: 0.45 }),
                            themeManager.GetColor('main1', { opacity: 0.12 })
                        ]}
                        angle={180}
                    >
                        <View style={styles.topWorldView}>
                            <View style={[styles.topWorldFrame, styleFrame]}>{renderAvatar(player1, 100)}</View>
                            <View style={styles.topWorldRankContainer}>
                                <View style={[styles.topWorldRank, styles.topWorldRankFirst, styleBgRank]}>
                                    <Gradient>
                                        <Text color='backgroundDark' style={styles.topWorldRankText}>
                                            1
                                        </Text>
                                    </Gradient>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.topWorldPseudo}>{player1?.username || ''}</Text>
                    </Gradient>
                </Button>
                <View style={styles.topWorldCrownContainer} pointerEvents='none'>
                    <Icon icon='crown' color='gradient' />
                </View>
            </View>

            {/* 3rd Place - Right */}
            <Button
                style={styles.topWorld}
                appearance='uniform'
                color='transparent'
                onPress={() => handlePlayerPress(player3)}
                enabled={player3 !== null}
            >
                <View style={styles.topWorldView}>
                    <View style={[styles.topWorldFrame, styleFrame]}>{renderAvatar(player3, 80)}</View>
                    <View style={styles.topWorldRankContainer}>
                        <View style={[styles.topWorldRank, styleBgRank]}>
                            <Text style={styles.topWorldRankText}>3</Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.topWorldPseudo}>{player3?.username || ''}</Text>
            </Button>
        </View>
    );
};

export default TopWorld;
