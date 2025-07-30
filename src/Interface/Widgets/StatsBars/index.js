import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import styles from './style';
import { PopupContent } from './popup';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('@oxyfoo/gamelife-types/Class/Experience').StatsXP} StatsXP
 */

/**
 * @typedef {{ statKey: keyof StatsXP, points: number }} StatsBarProps
 * @typedef {import('react-native').ListRenderItem<StatsBarProps>} ListRenderItemStat
 */

/**
 * @param {StatsXP} stats
 * @param {keyof StatsXP} statKey
 */
function openStatsPopup(stats, statKey) {
    user.interface.popup?.Open({
        content: <PopupContent stats={stats} initStatKey={statKey} />
    });
}

/** @type {ListRenderItemStat} */
function StatsBar({ item }) {
    const langStats = langManager.curr['statistics']['names'];

    const title = langStats[item.statKey];
    const experience = user.experience.experience.Get();

    const pointsRaw = item.points;
    const pointsValue = pointsRaw < 1000 ? pointsRaw : Math.floor(pointsRaw / 1000);
    const pointsSize = pointsValue < 10 ? 18 : pointsValue < 100 ? 14 : 12;
    const pointsText = `${pointsValue}${pointsRaw < 1000 ? '' : ' k'}`;

    /** @type {StyleProp} */
    const statStyle = {
        backgroundColor: themeManager.GetColor('main1')
    };

    return (
        <TouchableOpacity
            style={styles.statsView}
            activeOpacity={0.6}
            onPress={() => openStatsPopup(experience.stats, item.statKey)}
        >
            <View style={[styles.statsCount, statStyle]}>
                <Text style={styles.statsText} fontSize={pointsSize} color='backgroundCard'>
                    {pointsText}
                </Text>
            </View>
            <Text color='border'>{title}</Text>
        </TouchableOpacity>
    );
}

/**
 * @typedef {{ statKey: keyof StatsXP, stats: StatsXP }} StatsBarTextOnlyProps
 * @typedef {import('react-native').ListRenderItem<StatsBarTextOnlyProps>} ListRenderItemStatTextOnly
 */

/** @type {ListRenderItemStatTextOnly} */
function StatsBarTextOnly({ item }) {
    const { statKey, stats } = item;
    const langStats = langManager.curr['statistics']['names'];

    if (stats === null) {
        return null;
    }

    const pointsValue = stats[statKey];
    const pointsText = pointsValue < 1000 ? pointsValue : Math.floor(pointsValue / 1000) + ' K';

    return (
        <TouchableOpacity
            style={styles.toStatsView}
            key={`skill_${statKey}`}
            activeOpacity={0.6}
            onPress={() => openStatsPopup(stats, statKey)}
        >
            <View style={styles.toStatsRow}>
                <Text>{langStats[statKey]}</Text>
                <Text fontSize={20}>{`${pointsText}`}</Text>
            </View>
        </TouchableOpacity>
    );
}

export { StatsBar, StatsBarTextOnly };
