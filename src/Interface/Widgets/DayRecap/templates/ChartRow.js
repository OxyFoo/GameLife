import React from 'react';
import { View, StyleSheet } from 'react-native';

import themeManager from 'Managers/ThemeManager';

import ActivitiesSection from '../sections/ActivitiesSection';
import StatsSection from '../sections/StatsSection';
import QuestSection from '../sections/QuestSection';

/**
 * Chart row template: Activities on top, then Stats radar + Quest donut side by side (chart only)
 * @param {import('./index').TemplateProps} props
 */
const ChartRow = ({
    donutData,
    totalTimeFormatted,
    skills,
    formatDuration,
    statsKeys,
    statsGained,
    radarData,
    questProgress,
    langStats,
    langRecap
}) => {
    const separatorColor = themeManager.GetColor('border', { opacity: 0.3 });

    return (
        <View>
            <ActivitiesSection
                donutData={donutData}
                totalTime={totalTimeFormatted}
                skills={skills}
                formatDuration={formatDuration}
                chartSize={120}
                maxItems={4}
                compactFont={false}
                title={langRecap['activities'] || 'Activities'}
            />

            <View style={[styles.separator, { backgroundColor: separatorColor }]} />

            <View style={styles.chartRow}>
                <View style={styles.chartSide}>
                    <View style={[styles.questDataContainer, { marginTop: 4 }]}>
                        <QuestSection
                            questProgress={questProgress}
                            lang={langRecap}
                            mode='dataOnly'
                            maxItems={4}
                            compactFont
                            title={langRecap['quests'] || 'Quests'}
                        />
                    </View>
                </View>
                <View style={[styles.verticalSeparator, { backgroundColor: separatorColor }]} />
                <View style={styles.chartSide}>
                    <StatsSection
                        statsKeys={statsKeys}
                        statsGained={statsGained}
                        radarData={radarData}
                        lang={langStats}
                        mode='chartOnly'
                        chartSize={140}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    separator: {
        height: 1,
        marginVertical: 8
    },
    chartRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch'
    },
    verticalSeparator: {
        width: 1,
        height: '70%',
        alignSelf: 'center',
        marginHorizontal: 8
    },
    chartSide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    questDataContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center'
    }
});

export default ChartRow;
