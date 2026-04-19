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
                chartSize={80}
                maxItems={4}
                title={activitiesTitle}
            />

            <View style={[styles.separator, { backgroundColor: separatorColor }]} />

            <StatsSection
                statsKeys={statsKeys}
                statsGained={statsGained}
                radarData={radarData}
                chartLeft={false}
                chartSize={130}
                maxItems={6}
            />

            <View style={[styles.separator, { backgroundColor: separatorColor }]} />

            <QuestSection questProgress={questProgress} chartSize={80} maxItems={4} title={questsTitle} />
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
