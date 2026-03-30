import React from 'react';
import { View, StyleSheet } from 'react-native';

import themeManager from 'Managers/ThemeManager';

import ActivitiesSection from '../sections/ActivitiesSection';
import StatsSection from '../sections/StatsSection';
import QuestSection from '../sections/QuestSection';

/**
 * Triple stack template: Activities + Stats + Quests (3 rows, compact sizes)
 * @param {import('./index').TemplateProps} props
 */
const TripleStack = ({
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
                chartSize={80}
                maxItems={5}
                title={langRecap['activities'] || 'Activities'}
            />

            <View style={[styles.separator, { backgroundColor: separatorColor }]} />

            <StatsSection
                statsKeys={statsKeys}
                statsGained={statsGained}
                radarData={radarData}
                lang={langStats}
                chartSize={130}
                maxItems={6}
            />

            <View style={[styles.separator, { backgroundColor: separatorColor }]} />

            <QuestSection questProgress={questProgress} lang={langRecap} chartSize={80} maxItems={5} title={langRecap['quests'] || 'Quests'} />
        </View>
    );
};

const styles = StyleSheet.create({
    separator: {
        height: 1,
        marginVertical: 8
    }
});

export default TripleStack;
