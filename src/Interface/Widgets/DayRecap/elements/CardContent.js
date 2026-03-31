import React from 'react';
import { View, StyleSheet } from 'react-native';

import Footer from './Footer';
import Header from './Header';
import LevelProgress from './LevelProgress';
import TemplateRouter from '../templates';

/**
 * @typedef {import('../back').DayRecapData} DayRecapData
 */

/**
 * Card content component - composes header, level, template content, and footer
 * @param {object} props
 * @param {DayRecapData} props.recapData - Recap data
 * @param {Date} props.date - Date to display
 * @param {string} [props.template] - Template name (tripleStack, dualStack, chartRow)
 * @param {(minutes: number) => string} props.formatDuration - Duration formatter
 * @param {(stats: import('@oxyfoo/gamelife-types/Class/Experience').StatsXP) => Array<{label: string, value: number}>} props.computeRadarData - Radar data computer
 * @param {Record<string, any>} [props.langRecap] - Language strings for recap
 * @param {Record<string, string>} [props.langStats] - Language strings for stats
 * @param {Record<string, string>} [props.langLevel] - Language strings for level
 */
const CardContent = ({
    recapData,
    date,
    template = 'tripleStack',
    formatDuration,
    computeRadarData,
    langRecap = {},
    langStats = {},
    langLevel = {}
}) => {
    const {
        username,
        level,
        xpGained,
        xpCurrent,
        xpNext,
        totalMinutes,
        categories,
        skills,
        statsGained,
        statsKeys,
        questProgress
    } = recapData;

    // Derive display data from recapData
    const donutData = categories.map((category) => ({
        label: category.name,
        value: category.durationMinutes,
        stroke: category.color
    }));
    const radarData = computeRadarData(statsGained);
    const totalTimeFormatted = formatDuration(totalMinutes);

    return (
        <View style={styles.mainContent}>
            <Header username={username} date={date} titleTemplate={langRecap['title']} />

            <LevelProgress level={level} xpGained={xpGained} xpCurrent={xpCurrent} xpNext={xpNext} lang={langLevel} />

            <TemplateRouter
                template={template}
                donutData={donutData}
                totalTimeFormatted={totalTimeFormatted}
                skills={skills}
                formatDuration={formatDuration}
                statsKeys={statsKeys}
                statsGained={statsGained}
                radarData={radarData}
                questProgress={questProgress}
                langStats={langStats}
                langRecap={langRecap}
            />

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
    }
});

export default CardContent;
