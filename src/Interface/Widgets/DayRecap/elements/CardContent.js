import React from 'react';
import { View, StyleSheet } from 'react-native';

import Footer from './Footer';
import Header from './Header';
import LevelProgress from './LevelProgress';
import TemplateRouter from '../templates';

/**
 * @typedef {import('../back').DayRecapData} DayRecapData
 * @typedef {import('@oxyfoo/gamelife-types/Class/Experience').StatsXP} StatsXP
 */

/**
 * Card content component - composes header, level, template content, and footer
 * @param {object} props
 * @param {DayRecapData} props.recapData - Recap data
 * @param {Array<{label: string, value: number, stroke: string}>} props.donutData - Donut chart data
 * @param {Array<{label: string, value: number}>} props.radarData - Radar chart data
 * @param {string} props.totalTimeFormatted - Formatted total time
 * @param {Array<keyof StatsXP>} props.statsKeys - Stats keys to display
 * @param {Date} props.date - Date to display
 * @param {string} [props.template] - Template name (tripleStack, dualStack, chartRow)
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
    template = 'tripleStack',
    formatDuration,
    langRecap = {},
    langStats = {},
    langLevel = {}
}) => {
    const { username, level, xpGained, xpCurrent, xpNext, skills, statsGained, questProgress } = recapData;

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
