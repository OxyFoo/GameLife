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

            <StatsSection
                statsKeys={statsKeys}
                statsGained={statsGained}
                radarData={radarData}
                lang={langStats}
                chartSize={160}
                maxItems={99}
                compactFont={false}
                title={langRecap['stats'] || 'Stats'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    separator: {
        height: 1,
        marginVertical: 8
    }
});

export default DualStack;
