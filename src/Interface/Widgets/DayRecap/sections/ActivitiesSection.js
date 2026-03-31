import React from 'react';
import { View, StyleSheet } from 'react-native';

import { DonutChart, Text } from 'Interface/Components';
import shared from './shared';

/**
 * @typedef {'full' | 'chartOnly' | 'dataOnly'} SectionMode
 *
 * @typedef {object} SkillData
 * @property {string} name - Skill name
 * @property {number} durationMinutes - Duration in minutes
 */

/**
 * Activities section with donut chart and skills list
 * @param {object} props
 * @param {Array<{label: string, value: number, stroke: string}>} props.donutData - Data for donut chart
 * @param {string} props.totalTime - Formatted total time
 * @param {SkillData[]} props.skills - List of skills
 * @param {(minutes: number) => string} props.formatDuration - Duration formatter function
 * @param {SectionMode} [props.mode] - Display mode
 * @param {boolean} [props.chartLeft] - Chart on left side
 * @param {number} [props.chartSize] - Chart size override
 * @param {number} [props.maxItems] - Max items to display
 * @param {boolean} [props.compactFont] - Use compact font sizes
 * @param {string} [props.title] - Optional title above the data list
 */
const ActivitiesSection = ({
    donutData,
    totalTime,
    skills,
    formatDuration,
    mode = 'full',
    chartLeft = true,
    chartSize = 80,
    maxItems = 5,
    compactFont = true,
    title = ''
}) => {
    const strokeWidth = Math.max(Math.round(chartSize / 11), 5);
    const centerFontSize = Math.round(chartSize * 0.22);
    const fontSize = compactFont ? 13 : 16;

    const chart = (
        <View
            style={[
                shared.chartContainer,
                mode === 'full' && (chartLeft ? shared.chartMarginRight : shared.chartMarginLeft)
            ]}
        >
            <DonutChart
                data={donutData}
                size={chartSize}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                delay={0}
                segmentGap={10}
            >
                <View style={[shared.chartCenter, styles.chartCenterAbsolute]}>
                    <Text style={[shared.chartCenterText, { fontSize: centerFontSize }]} color='primary'>
                        {totalTime}
                    </Text>
                </View>
            </DonutChart>
        </View>
    );

    const data = (
        <View style={shared.dataList}>
            {title !== '' && (
                <Text style={shared.sectionTitle} color='secondary'>
                    {title}
                </Text>
            )}
            {skills.slice(0, maxItems).map((skill, index) => (
                <View key={`${index}-${skill.name}`} style={styles.dataItem}>
                    <Text style={[styles.dataName, { fontSize }]} color='primary'>
                        {skill.name}{' '}
                        <Text style={[styles.dataDuration, { fontSize }]} color='secondary'>
                            - {formatDuration(skill.durationMinutes)}
                        </Text>
                    </Text>
                </View>
            ))}
        </View>
    );

    if (mode === 'chartOnly') return <View style={shared.container}>{chart}</View>;
    if (mode === 'dataOnly') return <View style={shared.container}>{data}</View>;

    return (
        <View style={shared.container}>
            {chartLeft ? chart : data}
            {chartLeft ? data : chart}
        </View>
    );
};

const styles = StyleSheet.create({
    chartCenterAbsolute: {
        position: 'absolute'
    },
    dataItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 2
    },
    dataName: {
        flex: 1,
        fontSize: 13,
        textAlign: 'left'
    },
    dataDuration: {
        flexShrink: 0,
        fontSize: 13,
        textAlign: 'left'
    }
});

export default ActivitiesSection;
