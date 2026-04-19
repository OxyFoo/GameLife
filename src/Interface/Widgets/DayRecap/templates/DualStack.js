import React from 'react';
import { View, StyleSheet } from 'react-native';

import themeManager from 'Managers/ThemeManager';

import ActivitiesSection from '../sections/ActivitiesSection';
import StatsSection from '../sections/StatsSection';

/**
 * Dual stack template: Activities + Stats (2 rows, bigger sizes, no quests)
 * @param {import('./index').TemplateProps} props
 */
const DualStack = ({
    donutData,
    totalTimeFormatted,
    skills,
    formatDuration,
    statsKeys,
    statsGained,
    radarData,
    activitiesTitle
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
                maxItems={5}
                compactFont={false}
                title={activitiesTitle}
            />

            <View style={[styles.separator, { backgroundColor: separatorColor }]} />

            <StatsSection
                statsKeys={statsKeys}
                statsGained={statsGained}
                radarData={radarData}
                chartLeft={false}
                chartSize={160}
                maxItems={6}
                compactFont={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    separator: {
        height: 1,
        marginTop: 12,
        marginBottom: 2 // 2 because statsSection already has space around it of 10
    }
});

export default DualStack;
