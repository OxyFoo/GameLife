import * as React from 'react';
import { Dimensions, View } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import Avatar from 'Data/User/Avatar';
import ProfileFriend from 'Interface/PageView/ProfileFriend';
import ProfileRaidPlayer from 'Interface/PageView/ProfileRaidPlayer';
import { BODY_COLORS } from 'Interface/Pages/Profile/AvatarEditor/avatarConstants';
import { Gradient } from 'Interface/Primitives';
import { Button } from '../Button';
import { Text } from '../Text';
import { Icon } from '../Icon';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidLeaderboardPlayer} RaidLeaderboardPlayer
 */

/**
 * One line of the raid ranking: avatar, username, title, rank and its trend since yesterday
 * @param {object} props
 * @param {RaidLeaderboardPlayer} props.item
 * @param {boolean} [props.isSelf]
 * @param {StyleProp} [props.style]
 */
function RankElement({ item, isSelf = false, style }) {
    const containerSize = dataManager.items.GetContainerSize('profile');

    let titleText = null;
    if (item.title !== 0) {
        const titleData = dataManager.titles.GetByID(item.title);
        if (titleData !== null) {
            titleText = langManager.GetText(titleData.Name);
        }
    }

    const onPress = () => {
        const screen = Dimensions.get('window');
        const friend = user.multiplayer.GetFriendByID(item.accountID);
        user.interface.bottomPanel?.Open({
            content:
                friend !== null && friend.friendshipState === 'accepted' ? (
                    <ProfileFriend friendID={item.accountID} />
                ) : (
                    <ProfileRaidPlayer player={item} />
                ),
            maxPosY: screen.height * 0.8
        });
    };

    const gradientColors = isSelf
        ? [themeManager.GetColor('main1', { opacity: 0.6 }), themeManager.GetColor('main1', { opacity: 0.2 })]
        : ['#38406573', '#38406526'];
    const frameStyle = { borderColor: themeManager.GetColor(isSelf ? 'main1' : 'border') };

    return (
        <Button style={[styles.itemContainer, style]} onPress={onPress} appearance='uniform' color='transparent'>
            <Gradient
                containerStyle={styles.itemGradient}
                style={styles.innerGradient}
                colors={gradientColors}
                angle={100}
            >
                <View style={[styles.frameBorder, frameStyle]}>
                    <AvatarFrame width={44} height={44} renderScale={2} backgroundColor='#00000000'>
                        <AvatarCharacter
                            body={item.avatar.Skin || 'human_00'}
                            bodyColor={BODY_COLORS[item.avatar.SkinColor] || BODY_COLORS[0]}
                            position={containerSize.pos}
                            scale={containerSize.scale}
                            items={Avatar.GetFriendAvatarItems(item)}
                            portraitMode
                        />
                    </AvatarFrame>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.username} color={isSelf ? 'white' : 'primary'}>
                        {item.username}
                    </Text>
                    {titleText !== null && (
                        <Text style={styles.details} color={isSelf ? 'white' : 'main1'}>
                            {titleText}
                        </Text>
                    )}
                </View>

                <View style={styles.rankContainer}>
                    <Text style={styles.rankText} color='main1' bold>
                        {`#${item.rank}`}
                    </Text>
                    {item.trend === 'up' && <Icon icon='arrow-up' size={14} color='main3' />}
                    {item.trend === 'down' && <Icon icon='arrow-up' size={14} angle={180} color='main2' />}
                    {(item.trend === 'same' || item.trend === 'new') && (
                        <Text style={styles.trendSame} color='secondary'>
                            {item.trend === 'new' ? '•' : '–'}
                        </Text>
                    )}
                </View>
            </Gradient>
        </Button>
    );
}

export { RankElement };
