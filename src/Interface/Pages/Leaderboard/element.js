import React from 'react';
import { View, Image } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import Inventory from 'Data/User/Inventory';
import { BODY_COLORS } from 'Interface/Pages/Profile/AvatarEditor/avatarConstants';
import { Button, Text } from 'Interface/Components';

import { rank_purple } from 'Ressources/items/rank/rank';

/**
 * @typedef {import('./back').RankedFriend} RankedFriend
 */

/**
 * @param {Object} param0
 * @param {RankedFriend} param0.item
 */
function RankElement({ item }) {
    if (!item) return null;

    const isThisPlayer = item.accountID === 0;
    const containerSize = dataManager.items.GetContainerSize('profile');

    const componentColor = {
        backgroundColor: themeManager.GetColor(isThisPlayer ? 'black' : 'darkBlue')
    };

    const statusStyle = {};
    if (item.status === 'online' || isThisPlayer) {
        statusStyle.borderColor = themeManager.GetColor('success');
    } else if (item.status === 'offline') {
        statusStyle.borderColor = themeManager.GetColor('disabled');
    }

    const onPress = () => {
        if (item.accountID === 0) return;
        // TODO: Replace with user interface change
        // user.interface.ChangePage('profilefriend', { friendID: item.accountID });
    };

    return (
        <Button style={[styles.itemContainer, componentColor]} onPress={onPress}>
            <View style={[styles.frameBorder, statusStyle]}>
                {item.avatar && (
                    <AvatarFrame width={44} height={44} backgroundColor='#00000000'>
                        <AvatarCharacter
                            body={item.avatar.Skin || 'human_00'}
                            bodyColor={BODY_COLORS[item.avatar.SkinColor] || BODY_COLORS[0]}
                            position={containerSize.pos}
                            scale={containerSize.scale}
                            items={Inventory.GetFriendAvatarItems(item)}
                            portraitMode
                        />
                    </AvatarFrame>
                )}
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.username} color={'primary'}>
                    {item.username}
                </Text>
                <Text style={styles.details} color={'secondary'}>
                    {item.label}
                </Text>
            </View>
            <View style={styles.rankContainer}>
                <Image style={styles.rankImage} source={rank_purple} />
                <Text style={styles.rankText} color={'main1'} fontSize={30 - item.rank.toString().length * 2}>
                    {item.rank.toString()}
                </Text>
            </View>
        </Button>
    );
}

export { RankElement };
