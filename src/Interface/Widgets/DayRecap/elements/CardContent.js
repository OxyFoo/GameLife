import React from 'react';
import { View, StyleSheet } from 'react-native';

import themeManager from 'Managers/ThemeManager';

import Footer from './Footer';
import Header from './Header';
import LevelProgress from './LevelProgress';
import DonutSection from './DonutSection';
import BottomRow from './BottomRow';

/**
 * @typedef {import('../back').DayRecapData} DayRecapData
 * @typedef {import('../back').QuestProgress} QuestProgress
 */

/**
 * Card content component - composes all recap elements
 * @param {object} props
 * @param {DayRecapData} props.recapData - Recap data
 * @param {Array<{label: string, value: number, stroke: string}>} props.donutData - Donut chart data
 * @param {Array<{label: string, value: number}>} props.radarData - Radar chart data
 * @param {string} props.totalTimeFormatted - Formatted total time
 * @param {Date} props.date - Date to display
 * @param {(minutes: number) => string} props.formatDuration - Duration formatter
 * @param {Record<string, string>} [props.langRecap] - Language strings for recap
 * @param {Record<string, string>} [props.langLevel] - Language strings for level
 */
const CardContent = ({
    recapData,
    donutData,
    radarData,
    totalTimeFormatted,
    date,
    formatDuration,
    langRecap = {},
    langLevel = {}
}) => {
    const { username, level, xpGained, xpCurrent, xpNext, skills, questProgress } = recapData;
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

            <BottomRow radarData={radarData} questProgress={questProgress} langRecap={langRecap} />

            <Footer text={langRecap['footer']} />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContent: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingVertical: 40
    },
    separator: {
        height: 1,
        marginBottom: 12
    }
});

export default CardContent;
