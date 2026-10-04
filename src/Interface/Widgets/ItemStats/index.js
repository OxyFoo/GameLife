import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';
import { STAT_KEYS } from '@oxyfoo/gamelife-types/Rules/ItemStats';

import { Text } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').ItemStatsMap} ItemStatsMap
 */

/**
 * The percent bonuses of one copy of an item: a badge per stat, the largest first (same look as
 * the stats of the day recap). Nothing is rendered for a copy without stats.
 * @param {object} props
 * @param {ItemStatsMap} props.stats
 * @param {boolean} [props.compact] Short stat names on one wrapped line, for the forge slots
 * @param {number} [props.max] Stats shown at most
 * @param {StyleProp} [props.style]
 */
function ItemStats({ stats, compact = false, max = 6, style }) {
    const lang = langManager.curr['statistics'][compact ? 'names-min' : 'names'];
    const rows = STAT_KEYS.map((key) => ({ key, value: stats[key] ?? 0 }))
        .filter((row) => row.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, max);

    if (rows.length === 0) {
        return null;
    }

    return (
        <View style={[compact ? styles.compact : styles.list, style]}>
            {rows.map(({ key, value }) => (
                <View key={key} style={compact ? styles.rowCompact : styles.row}>
                    <View
                        style={[
                            styles.badge,
                            compact && styles.badgeCompact,
                            { backgroundColor: themeManager.GetColor('main1') }
                        ]}
                    >
                        <Text fontSize={compact ? 10 : 11} color='backgroundCard' bold>
                            {`+${value} %`}
                        </Text>
                    </View>
                    <Text style={styles.label} fontSize={compact ? 10 : 12} color='primary'>
                        {lang[key]}
                    </Text>
                </View>
            ))}
        </View>
    );
}

export { ItemStats };
