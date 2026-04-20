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
    activitiesTitle,
    questsTitle
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
                title={activitiesTitle}
            />

            <View style={[styles.separator, { backgroundColor: separatorColor }]} />

            <View style={styles.chartRow}>
                <View style={styles.chartSide}>
                    <View style={[styles.questDataContainer]}>
                        <QuestSection
                            questProgress={questProgress}
                            mode='dataOnly'
                            maxItems={4}
                            compactFont
                            title={questsTitle}
                        />
                    </View>
                </View>
                <View style={[styles.verticalSeparator, { backgroundColor: separatorColor }]} />
                <View style={styles.chartSide}>
                    <StatsSection
                        statsKeys={statsKeys}
                        statsGained={statsGained}
                        radarData={radarData}
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
        marginTop: 12,
        marginBottom: 2
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
