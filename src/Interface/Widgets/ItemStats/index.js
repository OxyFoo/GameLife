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
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').StatKey} StatKey
 */

/**
 * The stats of a copy worth showing, the largest first
 * @param {ItemStatsMap} stats
 * @param {number} [max]
 * @returns {{ key: StatKey, value: number }[]}
 */
function SortedItemStats(stats, max = 6) {
    return STAT_KEYS.map((key) => ({ key, value: stats[key] ?? 0 }))
        .filter((row) => row.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, max);
}

/**
 * One stat of a copy: its percent in a badge, then its name
 * @param {object} props
 * @param {StatKey} props.statKey
 * @param {number} props.value
 * @param {boolean} [props.compact] Short stat name, smaller badge
 */
function ItemStatBadge({ statKey, value, compact = false }) {
    const lang = langManager.curr['statistics'][compact ? 'names-min' : 'names'];
    return (
        <View style={compact ? styles.rowCompact : styles.row}>
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
                {lang[statKey]}
            </Text>
        </View>
    );
}

/**
 * The percent bonuses of one copy of an item: a badge per stat, the largest first (same look as
 * the stats of the day recap). Nothing is rendered for a copy without stats.
 * @param {object} props
 * @param {ItemStatsMap} props.stats
 * @param {boolean} [props.compact] Short stat names on one wrapped line
 * @param {number} [props.max] Stats shown at most
 * @param {StyleProp} [props.style]
 */
function ItemStats({ stats, compact = false, max = 6, style }) {
    const rows = SortedItemStats(stats, max);
    if (rows.length === 0) {
        return null;
    }
    return (
        <View style={[compact ? styles.compact : styles.list, style]}>
            {rows.map(({ key, value }) => (
                <ItemStatBadge key={key} statKey={key} value={value} compact={compact} />
            ))}
        </View>
    );
}

export { ItemStats, ItemStatBadge, SortedItemStats };
