import React from 'react';
import { View, StyleSheet } from 'react-native';

import { RadarChart, Text } from 'Interface/Components';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Class/Experience').StatsXP} StatsXP
 */

/**
 * Stats section with badges and radar chart
 * @param {object} props
 * @param {Array<keyof StatsXP>} props.statsKeys - Keys of stats to display
 * @param {Record<keyof StatsXP, number>} props.statsGained - Stats values gained
 * @param {Array<{label: string, value: number}>} props.radarData - Data for radar chart
 * @param {Record<string, string>} [props.lang] - Language strings for stat names
 */
const StatsSection = ({ statsKeys, statsGained, radarData, lang = {} }) => {
    return (
        <View style={styles.statsContainer}>
            <View style={styles.statsBars}>
                {statsKeys.slice(0, 6).map((key) => {
                    const value = statsGained[key];

                    return (
                        <View key={key} style={styles.statBarRow}>
                            <View style={[styles.statBadge, { backgroundColor: themeManager.GetColor('main1') }]}>
                                <Text style={styles.statBadgeText} color='backgroundCard'>
                                    +{value}
                                </Text>
                            </View>
                            <Text style={styles.statLabel} color='primary'>
                                {lang[key] || key}
                            </Text>
                        </View>
                    );
                })}
            </View>

            <View style={styles.radarContainer}>
                <RadarChart data={radarData} size={130} showLabels={true} levels={4} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    statsBars: {
        flex: 1,
        marginRight: 12
    },
    radarContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    statBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2
    },
    statBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 5,
        marginRight: 6,
        minWidth: 36,
        alignItems: 'center',
        justifyContent: 'center'
    },
    statBadgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    statLabel: {
        fontSize: 12
    }
});

export default StatsSection;
