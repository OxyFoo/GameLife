import React from 'react';
import { View, StyleSheet } from 'react-native';

import { RadarChart, ProgressDonut, Text } from 'Interface/Components';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Class/Experience').StatsXP} StatsXP
 * @typedef {import('../back').QuestProgress} QuestProgress
 */

/**
 * Bottom row with radar chart (left) and quest donut (right)
 * @param {object} props
 * @param {Array<{label: string, value: number}>} props.radarData - Data for radar chart
 * @param {QuestProgress} props.questProgress - Quest completion data
 * @param {Record<string, string>} [props.langRecap] - Language strings
 */
const BottomRow = ({ radarData, questProgress, langRecap = {} }) => {
    const { completedQuests, totalQuests, allCompleted } = questProgress;
    const hasQuests = totalQuests > 0;
    const rawProgress = hasQuests ? completedQuests / totalQuests : 0;
    const progressValue = Math.min(rawProgress, 0.975); // 97.5% is sexier for the photo, because a full donut can look like unfull, this value is perfectly showing it's filled entirely !
    const progressColor = allCompleted ? 'success' : 'main1';

    return (
        <View style={styles.container}>
            {/* Radar chart - left */}
            <View style={styles.radarSide}>
                <Text style={styles.sectionLabel} color='secondary'>
                    {langRecap['stats'] || 'Stats'}
                </Text>
                <View style={styles.chartContainer}>
                    <RadarChart data={radarData} size={140} showLabels={true} levels={4} />
                </View>
            </View>

            {/* Quest donut - right */}
            <View style={styles.questSide}>
                <Text style={styles.sectionLabel} color='secondary'>
                    {langRecap['quests'] || 'Quests'}
                </Text>
                {hasQuests ? (
                    <View style={styles.chartContainer}>
                        <ProgressDonut
                            value={progressValue}
                            size={121}
                            progressColor={progressColor}
                            strokeWidth={8}
                            delay={0}
                        >
                            <View style={styles.questCenter}>
                                <Text style={styles.questCount} color='primary'>
                                    {`${completedQuests}/${totalQuests}`}
                                </Text>
                                <Text style={styles.questLabel} color='secondary'>
                                    {allCompleted
                                        ? langRecap['quests-done'] || 'Done!'
                                        : langRecap['quests-progress'] || 'today'}
                                </Text>
                            </View>
                        </ProgressDonut>
                    </View>
                ) : (
                    <View style={[styles.noQuests, { borderColor: themeManager.GetColor('border') }]}>
                        <Text style={styles.noQuestsText} color='secondary'>
                            {langRecap['no-quests'] || 'No quests'}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        marginBottom: 12
    },
    radarSide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    questSide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    chartContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    questCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    questCount: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    questLabel: {
        fontSize: 11
    },
    noQuests: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 2,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center'
    },
    noQuestsText: {
        fontSize: 13
    }
});

export default BottomRow;
