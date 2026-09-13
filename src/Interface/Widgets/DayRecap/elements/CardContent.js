import React from 'react';
import { View, StyleSheet } from 'react-native';

import Footer from './Footer';
import Header from './Header';
import LevelProgress from './LevelProgress';
import Template from '../templates';

import langManager from 'Managers/LangManager';

/**
 * @typedef {import('../back').DayRecapData} DayRecapData
 * @typedef {import('@oxyfoo/gamelife-types/Class/Experience').StatsXP} StatsXP
 */

/**
 * Card content component - composes header, level, template content, and footer
 * @param {object} props
 * @param {DayRecapData} props.recapData - Recap data
 * @param {Date} props.date - Date to display
 * @param {(minutes: number) => string} props.formatDuration - Duration formatter
 * @param {(stats: StatsXP) => Array<{label: string, value: number}>} props.computeRadarData - Radar data computer
 */
const CardContent = ({ recapData, date, formatDuration, computeRadarData }) => {
    const { username, level, xpGained, xpCurrent, xpNext, totalMinutes, categories, skills, statsGained, statsKeys } =
        recapData;

    // Derive display data from recapData
    const donutData = categories.map((category) => ({
        label: category.name,
        value: category.durationMinutes,
        stroke: category.color
    }));
    const radarData = computeRadarData(statsGained);
    const totalTimeFormatted = formatDuration(totalMinutes);

    const langHome = langManager.curr['home'];
    const activitiesTitle = langHome['today-activity'];

    return (
        <View style={styles.mainContent}>
            <Header username={username} date={date} />

            <LevelProgress level={level} xpGained={xpGained} xpCurrent={xpCurrent} xpNext={xpNext} />

            <Template
                donutData={donutData}
                totalTimeFormatted={totalTimeFormatted}
                skills={skills}
                formatDuration={formatDuration}
                statsKeys={statsKeys}
                statsGained={statsGained}
                radarData={radarData}
                activitiesTitle={activitiesTitle}
            />

            <Footer />
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
    }
});

export default CardContent;
