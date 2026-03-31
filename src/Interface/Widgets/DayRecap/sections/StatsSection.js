import React from 'react';
import { View, StyleSheet } from 'react-native';

import { RadarChart, Text } from 'Interface/Components';
import themeManager from 'Managers/ThemeManager';
import shared from './shared';

/**
 * @typedef {'full' | 'chartOnly' | 'dataOnly'} SectionMode
 * @typedef {import('@oxyfoo/gamelife-types/Class/Experience').StatsXP} StatsXP
 */

/**
 * Stats section with badges and radar chart
 * @param {object} props
 * @param {Array<keyof StatsXP>} props.statsKeys - Keys of stats to display
 * @param {Record<keyof StatsXP, number>} props.statsGained - Stats values gained
 * @param {Array<{label: string, value: number}>} props.radarData - Data for radar chart
 * @param {Record<string, string>} [props.lang] - Language strings for stat names
 * @param {SectionMode} [props.mode] - Display mode
 * @param {boolean} [props.chartLeft] - Chart on left side
 * @param {number} [props.chartSize] - Radar chart size override
 * @param {number} [props.maxItems] - Max stats to display
 * @param {boolean} [props.compactFont] - Use compact font sizes
 */
const StatsSection = ({
    statsKeys,
    statsGained,
    radarData,
    lang = {},
    mode = 'full',
    chartLeft = false,
    chartSize = 130,
    maxItems = 6,
    compactFont = true
}) => {
    const badgeFontSize = compactFont ? 11 : 12;
    const labelFontSize = compactFont ? 12 : 14;
    const radarPadding = mode === 'full' && !compactFont ? 15 : 10;

    const chart = (
        <View
            style={[
                shared.chartContainer,
                mode === 'full' && (chartLeft ? shared.chartMarginRight : shared.chartMarginLeft)
            ]}
        >
            <RadarChart data={radarData} size={chartSize} showLabels={true} levels={4} basePadding={radarPadding} />
        </View>
    );

    const data = (
        <View style={shared.dataList}>
            {statsKeys.slice(0, maxItems).map((key) => {
                const value = statsGained[key];
                return (
                    <View key={key} style={styles.dataRow}>
                        <View style={[styles.dataBadge, { backgroundColor: themeManager.GetColor('main1') }]}>
                            <Text style={[styles.dataBadgeText, { fontSize: badgeFontSize }]} color='backgroundCard'>
                                +{value}
                            </Text>
                        </View>
                        <Text style={[styles.dataLabel, { fontSize: labelFontSize }]} color='primary'>
                            {lang[key] || key}
                        </Text>
                    </View>
                );
            })}
        </View>
    );

    if (mode === 'chartOnly') return <View style={shared.container}>{chart}</View>;
    if (mode === 'dataOnly') return <View style={shared.container}>{data}</View>;

    return (
        <View style={shared.container}>
            {chartLeft ? chart : data}
            {chartLeft ? data : chart}
        </View>
    );
};

const styles = StyleSheet.create({
    dataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2
    },
    dataBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 5,
        marginRight: 6,
        minWidth: 36,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dataBadgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    dataLabel: {
        fontSize: 12
    }
});

export default StatsSection;
