import * as React from 'react';
import { Dimensions, Image, View } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import Inventory from 'Data/User/Inventory';
import { Button, Icon, Text } from 'Interface/Components';
import { Gradient } from 'Interface/Primitives';
import ProfileFriend from 'Interface/PageView/ProfileFriend';
import { BODY_COLORS } from 'Interface/Pages/Profile/AvatarEditor/avatarConstants';

// @ts-ignore
const AVATAR_MIN_PLACEHOLDER = require('Ressources/items/avatar_min_placeholder.png');

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 *
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Multiplayer').Friend} Friend
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Multiplayer').UserOnline} UserOnline
 */

/**
 * Render avatar for a friend or placeholder if no friend
 * @param {Friend | UserOnline | null} friend
 * @param {number} size
 * @returns {React.ReactNode}
 */
const renderAvatar = (friend, size) => {
    if (!friend?.avatar) {
        return <Image style={styles.friendTopPlaceholder} resizeMode='stretch' source={AVATAR_MIN_PLACEHOLDER} />;
    }

    const items = Inventory.GetFriendAvatarItems(friend);
    const body = friend.avatar.Skin || 'human_00';
    const bodyColor = BODY_COLORS[friend.avatar.SkinColor] || BODY_COLORS[0];
    const containerSize = dataManager.items.GetContainerSize('profile');

    return (
        <AvatarFrame width={size} height={size} backgroundColor='#00000000'>
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
 * Handle friend press - open profile panel
 * @param {Friend | UserOnline | null} friend
 */
const handleFriendPress = (friend) => {
    if (!friend) return;
    const screen = Dimensions.get('window');
    user.interface.bottomPanel?.Open({
        content: <ProfileFriend friendID={friend.accountID} />,
        maxPosY: screen.height * 0.8
    });
};

/**
 * @param {Object} param0
 * @param {StyleViewProp} [param0.style]
 * @param {(Friend | UserOnline)[]} param0.friends Friends list sorted by rank
 * @returns {React.ReactNode}
 */
const TopFriends = ({ style, friends }) => {
    /** @type {StyleViewProp} */
    const styleFrame = {
        borderColor: themeManager.GetColor('border')
    };

    /** @type {StyleViewProp} */
    const styleBgRank = {
        backgroundColor: themeManager.GetColor('border')
    };

    const friend1 = friends.length >= 1 ? friends[0] : null;
    const friend2 = friends.length >= 2 ? friends[1] : null;
    const friend3 = friends.length >= 3 ? friends[2] : null;

    return (
        <View style={[styles.friendTopContainer, style]}>
            {/* Position 2 - Left */}
            <Button
                style={styles.friendTop}
                appearance='uniform'
                color='transparent'
                onPress={() => handleFriendPress(friend2)}
                enabled={friend2 !== null}
            >
                <View style={styles.friendTopView}>
                    <View style={[styles.friendTopFrame, styleFrame]}>{renderAvatar(friend2, 80)}</View>
                    <View style={styles.frientTopRankContainer}>
                        <View style={[styles.friendTopRank, styleBgRank]}>
                            <Text style={styles.friendTopRankText}>2</Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.frientTopPseudo}>{friend2?.username || ''}</Text>
            </Button>

            {/* Position 1 - Middle (Best friend) */}
            <View style={styles.friendTopMiddle}>
                <Button
                    style={styles.friendTopMiddleButton}
                    appearance='uniform'
                    color='transparent'
                    onPress={() => handleFriendPress(friend1)}
                    enabled={friend1 !== null}
                >
                    <Gradient
                        style={styles.friendTopMiddleGradient}
                        containerStyle={styles.friendTopMiddleGradientContainer}
                        colors={[
                            themeManager.GetColor('main1', { opacity: 0.45 }),
                            themeManager.GetColor('main1', { opacity: 0.12 })
                        ]}
                        angle={180}
                    >
                        <View style={styles.friendTopView}>
                            <View style={[styles.friendTopFrame, styleFrame]}>{renderAvatar(friend1, 100)}</View>
                            <View style={styles.frientTopRankContainer}>
                                <View style={[styles.friendTopRank, styles.friendTopRankFirst, styleBgRank]}>
                                    <Gradient>
                                        <Text color='backgroundDark' style={styles.friendTopRankText}>
                                            1
                                        </Text>
                                    </Gradient>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.frientTopPseudo}>{friend1?.username || ''}</Text>
                    </Gradient>
                </Button>
                <View style={styles.frientTopCrownContainer} pointerEvents='none'>
                    <Icon icon='crown' color='gradient' />
                </View>
            </View>

            {/* Position 3 - Right */}
            <Button
                style={styles.friendTop}
                appearance='uniform'
                color='transparent'
                onPress={() => handleFriendPress(friend3)}
                enabled={friend3 !== null}
            >
                <View style={styles.friendTopView}>
                    <View style={[styles.friendTopFrame, styleFrame]}>{renderAvatar(friend3, 80)}</View>
                    <View style={styles.frientTopRankContainer}>
                        <View style={[styles.friendTopRank, styleBgRank]}>
                            <Text style={styles.friendTopRankText}>3</Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.frientTopPseudo}>{friend3?.username || ''}</Text>
            </Button>
        </View>
    );
};

export default TopFriends;
