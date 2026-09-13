import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import Avatar from 'Data/User/Avatar';
import { BODY_COLORS } from 'Interface/Pages/Profile/AvatarEditor/avatarConstants';
import { Text, KPI } from 'Interface/Components';
import { FormatThousands } from 'Utils/Raids';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidLeaderboardPlayer} RaidLeaderboardPlayer
 */

/**
 * Profile of a player of the raid ranking who is not a friend: avatar, rank, points, activities
 * @param {object} props
 * @param {RaidLeaderboardPlayer} props.player
 */
const ProfileRaidPlayer = ({ player }) => {
    const lang = langManager.curr['raids'];

    let titleText = null;
    if (player.title !== 0) {
        const titleData = dataManager.titles.GetByID(player.title);
        if (titleData !== null) {
            titleText = langManager.GetText(titleData.Name);
        }
    }

    const containerSize = dataManager.items.GetContainerSize('profile');

    return (
        <ScrollView
            ref={user.interface.bottomPanel?.mover.SetScrollView}
            style={styles.page}
            onLayout={user.interface.bottomPanel?.mover.onLayoutFlatList}
            onContentSizeChange={user.interface.bottomPanel?.mover.onContentSizeChange}
            scrollEnabled={false}
        >
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <AvatarFrame width={84} height={84} renderScale={2} backgroundColor='#00000000'>
                        <AvatarCharacter
                            body={player.avatar.Skin || 'human_00'}
                            bodyColor={BODY_COLORS[player.avatar.SkinColor] || BODY_COLORS[0]}
                            position={containerSize.pos}
                            scale={containerSize.scale}
                            items={Avatar.GetFriendAvatarItems(player)}
                            portraitMode
                        />
                    </AvatarFrame>
                </View>
                <View style={styles.content}>
                    <View style={styles.usernameContainer}>
                        <Text style={styles.username} color='primary'>
                            {player.username}
                        </Text>
                    </View>
                    {titleText !== null && (
                        <Text style={styles.title} color='secondary'>
                            {titleText}
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.kpiContainer}>
                <KPI style={styles.kpiProfile} title={lang['kpi-rank']} value={`#${player.rank}`} />
                <KPI
                    style={styles.kpiProfile}
                    containerStyle={styles.kpiProfileMiddle}
                    title={lang['kpi-points']}
                    value={FormatThousands(player.damage)}
                />
                <KPI style={styles.kpiProfile} title={lang['kpi-activities']} value={player.hits} />
            </View>
        </ScrollView>
    );
};

export default ProfileRaidPlayer;
