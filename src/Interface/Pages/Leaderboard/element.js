import React from 'react';
import { Dimensions, View, Image } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import ProfileLeaderboardPlayer from 'Interface/PageView/ProfileLeaderboardPlayer';
import { BODY_COLORS } from 'Interface/Pages/Profile/AvatarEditor/avatarConstants';
import { Button, Text } from 'Interface/Components';
import { Gradient } from 'Interface/Primitives';

import { rank_purple } from 'Ressources/items/rank/rank';

/**
 * @typedef {import('@oxyfoo/avatar-factory').ItemConfig} ItemConfig
 * @typedef {import('@oxyfoo/gamelife-types/TCP/GameLife/Request_Types').LeaderboardPlayer} LeaderboardPlayer
 * @typedef {import('react-native').ListRenderItem<LeaderboardPlayer>} ListRenderItemLeaderboardPlayer
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
 * @param {Object} param0
 * @param {LeaderboardPlayer} param0.item
 */
function RankElement({ item }) {
    if (!item) return null;

    const containerSize = dataManager.items.GetContainerSize('profile');
    const isSelf = user.informations.username.Get().toLocaleLowerCase() === item.username.toLocaleLowerCase();

    const componentColor = {
        opacity: isSelf ? 0.9 : 1
    };

    const statusStyle = {
        borderColor: themeManager.GetColor(isSelf ? 'main1' : 'border')
    };

    // Get title text if available
    let titleText = null;
    if (item.title !== 0) {
        const titleData = dataManager.titles.GetByID(item.title);
        if (titleData !== null) {
            titleText = langManager.GetText(titleData.Name);
        }
    }

    const onPress = () => {
        const screen = Dimensions.get('window');
        user.interface.bottomPanel?.Open({
            content: <ProfileLeaderboardPlayer player={item} />,
            maxPosY: screen.height * 0.8
        });
    };

    const avatarItems = getLeaderboardAvatarItems(item.avatar);

    return (
        <Button
            style={[styles.itemContainer, componentColor]}
            onPress={onPress}
            appearance='uniform'
            color='transparent'
        >
            <Gradient
                containerStyle={styles.itemGradient}
                style={styles.innerGradient}
                colors={['#38406573', '#38406526']}
                angle={100}
            >
                <View style={[styles.frameBorder, statusStyle]}>
                    <AvatarFrame width={44} height={44} renderScale={2} backgroundColor='#00000000'>
                        <AvatarCharacter
                            body={item.avatar.Skin || 'human_00'}
                            bodyColor={BODY_COLORS[item.avatar.SkinColor] || BODY_COLORS[0]}
                            position={containerSize.pos}
                            scale={containerSize.scale}
                            items={avatarItems}
                            portraitMode
                        />
                    </AvatarFrame>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.username} color={isSelf ? 'white' : 'primary'}>
                        {item.username}
                    </Text>
                    {titleText !== null && (
                        <Text style={styles.details} color={isSelf ? 'white' : 'secondary'}>
                            {titleText}
                        </Text>
                    )}
                </View>

                <View style={styles.rankContainer}>
                    <Image style={styles.rankImage} source={rank_purple} />
                    <Text style={styles.rankText} color={'main1'} fontSize={30 - item.rank.toString().length * 2}>
                        {item.rank.toString()}
                    </Text>
                </View>
            </Gradient>
        </Button>
    );
}

export { RankElement };
