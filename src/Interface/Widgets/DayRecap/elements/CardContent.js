import React from 'react';
import { View, StyleSheet } from 'react-native';

import themeManager from 'Managers/ThemeManager';

import Footer from './Footer';
import Header from './Header';
import LevelProgress from './LevelProgress';
import DonutSection from './DonutSection';
import StatsSection from './StatsSection';

/**
 * @typedef {import('../back').DayRecapData} DayRecapData
 * @typedef {import('@oxyfoo/gamelife-types/Class/Experience').StatsXP} StatsXP
 */

/**
 * Card content component - composes all recap elements
 * @param {object} props
 * @param {DayRecapData} props.recapData - Recap data
 * @param {Array<{label: string, value: number, stroke: string}>} props.donutData - Donut chart data
 * @param {Array<{label: string, value: number}>} props.radarData - Radar chart data
 * @param {string} props.totalTimeFormatted - Formatted total time
 * @param {Array<keyof StatsXP>} props.statsKeys - Stats keys to display
 * @param {Date} props.date - Date to display
 * @param {(minutes: number) => string} props.formatDuration - Duration formatter
 * @param {Record<string, string>} [props.langRecap] - Language strings for recap
 * @param {Record<string, string>} [props.langStats] - Language strings for stats
 * @param {Record<string, string>} [props.langLevel] - Language strings for level
 */
const CardContent = ({
    recapData,
    donutData,
    radarData,
    totalTimeFormatted,
    statsKeys,
    date,
    formatDuration,
    langRecap = {},
    langStats = {},
    langLevel = {}
}) => {
    const { username, level, xpGained, xpCurrent, xpNext, statsGained, skills } = recapData;
    const borderColor = themeManager.GetColor('border');

    return (
        <View style={styles.mainContent}>
            <Header username={username} date={date} titleTemplate={langRecap['title']} />

            <LevelProgress level={level} xpGained={xpGained} xpCurrent={xpCurrent} xpNext={xpNext} lang={langLevel} />

            <DonutSection
                donutData={donutData}
                totalTime={totalTimeFormatted}
                skills={skills}
                formatDuration={formatDuration}
            />

            <View style={[styles.separator, { backgroundColor: borderColor }]} />

            <StatsSection statsKeys={statsKeys} statsGained={statsGained} radarData={radarData} lang={langStats} />

            <Footer text={langRecap['footer']} />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContent: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'space-around',
        padding: 20,
        paddingVertical: 40
    },
    separator: {
        height: 1,
        marginBottom: 12
    }
});

export default CardContent;
