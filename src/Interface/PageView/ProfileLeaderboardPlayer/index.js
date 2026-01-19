import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import user from 'Managers/UserManager';
import { BODY_COLORS } from 'Interface/Pages/Profile/AvatarEditor/avatarConstants';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { Text, KPI, ProgressBar } from 'Interface/Components';
import { Round } from 'Utils/Functions';

/**
 * @typedef {import('@oxyfoo/avatar-factory').ItemConfig} ItemConfig
 * @typedef {import('@oxyfoo/gamelife-types').LeaderboardPlayer} LeaderboardPlayer
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
 * @param {object} props
 * @param {LeaderboardPlayer} props.player
 */
const ProfileLeaderboardPlayer = ({ player }) => {
    if (!player) return null;

    const lang = langManager.curr['leaderboard'];
    const langLevel = langManager.curr['level'];

    const username = player.username;
    let titleText = null;
    if (player.title !== 0) {
        const titleData = dataManager.titles.GetByID(player.title);
        if (titleData !== null) {
            titleText = langManager.GetText(titleData.Name);
        }
    }

    const avatarItems = getLeaderboardAvatarItems(player.avatar);
    const avatarBody = player.avatar?.Skin || 'human_00';
    const avatarBodyColor = BODY_COLORS[player.avatar?.SkinColor] || BODY_COLORS[0];
    const containerSize = dataManager.items.GetContainerSize('profile');

    const xpInfo = user.experience.getXPDict(player.totalUserXP);
    const totalHours = Round(player.totalTime / 60, 1);

    return (
        <ScrollView
            ref={user.interface.bottomPanel?.mover.SetScrollView}
            style={styles.page}
            onLayout={user.interface.bottomPanel?.mover.onLayoutFlatList}
            onContentSizeChange={user.interface.bottomPanel?.mover.onContentSizeChange}
            scrollEnabled={false}
        >
            {/** User Header */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <AvatarFrame width={84} height={84} renderScale={2} backgroundColor='#00000000'>
                        <AvatarCharacter
                            body={avatarBody}
                            bodyColor={avatarBodyColor}
                            position={containerSize.pos}
                            scale={containerSize.scale}
                            items={avatarItems}
                            portraitMode
                        />
                    </AvatarFrame>
                </View>
                <View style={styles.content}>
                    <View style={styles.usernameContainer}>
                        <Text style={styles.username} color='primary'>
                            {username}
                        </Text>
                    </View>

                    {titleText !== null && (
                        <Text style={styles.title} color='secondary'>
                            {titleText}
                        </Text>
                    )}
                </View>
            </View>

            {/** XP Bar */}
            <View style={styles.xpbarContainer}>
                <ProgressBar value={xpInfo.xp} maxValue={xpInfo.next} />
                <View style={styles.xpRow}>
                    <Text fontSize={14} color={'secondary'}>
                        {langLevel['level'] + ' ' + xpInfo.lvl}
                    </Text>
                    <Text fontSize={14} color={'secondary'}>
                        {Round(xpInfo.xp) + '/' + xpInfo.next + ' ' + langLevel['xp']}
                    </Text>
                </View>
            </View>

            {/** Weekly Stats */}
            <View style={styles.kpiContainer}>
                <KPI style={styles.kpiProfile} title={lang['kpi-rank'] || 'Rang'} value={`#${player.rank}`} />
                <KPI
                    style={styles.kpiProfile}
                    containerStyle={styles.kpiProfileMiddle}
                    title={lang['kpi-time']}
                    value={`${lang['kpi-time-hour'].replace('{}', totalHours.toString())}`}
                />
                <KPI style={styles.kpiProfile} title={lang['kpi-activities']} value={player.totalActivities} />
            </View>
        </ScrollView>
    );
};

export default ProfileLeaderboardPlayer;
