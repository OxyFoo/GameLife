import React from 'react';
import { View, StyleSheet, Easing } from 'react-native';

import { ProgressDonut, Icon, Text } from 'Interface/Components';
import themeManager from 'Managers/ThemeManager';

const DONUT_EASING = Easing.out(Easing.exp); // This is here so animation doesn't trigger AGAIN when trying to save the image

/**
 * @typedef {'full' | 'chartOnly' | 'dataOnly'} SectionMode
 * @typedef {import('../back').QuestProgress} QuestProgress
 */

/**
 * Quest section with progress donut and quest list
 * @param {object} props
 * @param {QuestProgress} props.questProgress - Quest completion data
 * @param {Record<string, string>} [props.lang] - Language strings
 * @param {SectionMode} [props.mode] - Display mode
 * @param {boolean} [props.chartLeft] - Chart on left side
 * @param {number} [props.chartSize] - Donut size override
 * @param {number} [props.maxItems] - Max quests to display
 * @param {boolean} [props.compactFont] - Use compact font sizes
 * @param {string} [props.title] - Optional title above the data list
 */
const QuestSection = ({
    questProgress,
    lang = {},
    mode = 'full',
    chartLeft = true,
    chartSize = 80,
    maxItems = 5,
    compactFont = true,
    title = ''
}) => {
    const { completedQuests, totalQuests, allCompleted, quests } = questProgress;
    const hasQuests = totalQuests > 0;
    const rawProgress = hasQuests ? completedQuests / totalQuests : 0;
    const progressValue = Math.min(rawProgress, 0.97);
    const progressColor = allCompleted ? 'success' : 'main1';
    const strokeWidth = Math.max(Math.round(chartSize / 11), 5);
    const centerFontSize = Math.round(chartSize * 0.22);
    const titleFontSize = compactFont ? 13 : 15;
    const detailFontSize = compactFont ? 10 : 12;

    const chart = (
        <View
            style={[
                styles.chartContainer,
                mode === 'full' && (chartLeft ? styles.chartMarginRight : styles.chartMarginLeft)
            ]}
        >
            {hasQuests ? (
                <ProgressDonut
                    value={progressValue}
                    size={chartSize}
                    progressColor={progressColor}
                    strokeWidth={strokeWidth}
                    delay={0}
                    easing={DONUT_EASING}
                >
                    <View style={styles.chartCenter}>
                        <Text style={[styles.chartCenterText, { fontSize: centerFontSize }]} color='primary'>
                            {`${completedQuests}/${totalQuests}`}
                        </Text>
                    </View>
                </ProgressDonut>
            ) : (
                <View
                    style={[
                        styles.noQuests,
                        {
                            borderColor: themeManager.GetColor('border'),
                            width: chartSize,
                            height: chartSize,
                            borderRadius: chartSize / 2
                        }
                    ]}
                >
                    <Text style={styles.noQuestsText} color='secondary'>
                        {lang['no-quests'] || 'No quests'}
                    </Text>
                </View>
            )}
        </View>
    );

    const data = (
        <View style={styles.dataList}>
            {title !== '' && (
                <Text style={styles.sectionTitle} color='secondary'>
                    {title}
                </Text>
            )}
            {quests.slice(0, maxItems).map((quest, index) => (
                <View key={index} style={styles.dataRow}>
                    <Text
                        style={[
                            styles.dataTitle,
                            { fontSize: titleFontSize },
                            quest.completed && styles.dataCompleted
                        ]}
                        color={quest.completed ? 'primary' : 'secondary'}
                        numberOfLines={1}
                    >
                        {quest.title}
                        <Text style={[styles.dataDetailText, { fontSize: detailFontSize }]} color='secondary'>
                            {' '}{quest.timeText}
                        </Text>
                    </Text>
                    <View style={styles.streakBadge}>
                        {quest.streak > 0 && (
                            <>
                                <Icon icon='flame' size={16} color='main2' />
                                <Text style={styles.streakText} color='main2'>
                                    {quest.streak}
                                </Text>
                            </>
                        )}
                    </View>
                </View>
            ))}
            {!hasQuests && (
                <Text style={styles.emptyText} color='secondary'>
                    {lang['no-quests-message'] || 'No quests today'}
                </Text>
            )}
        </View>
    );

    if (mode === 'chartOnly') return <View style={styles.container}>{chart}</View>;
    if (mode === 'dataOnly') return data;

    return (
        <View style={styles.container}>
            {chartLeft ? chart : data}
            {chartLeft ? data : chart}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    chartMarginRight: {
        marginRight: 12
    },
    chartMarginLeft: {
        marginLeft: 12
    },
    chartCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    chartCenterText: {
        fontWeight: 'bold'
    },
    noQuests: {
        borderWidth: 2,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center'
    },
    noQuestsText: {
        fontSize: 11
    },
    dataList: {
        flex: 1,
        overflow: 'hidden',
        paddingTop: 0
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 4,
        textAlign: 'left',
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    dataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4
    },
    dataInfo: {
        flexShrink: 1,
        alignItems: 'flex-start'
    },
    dataTitle: {
        fontSize: 13
    },
    dataCompleted: {
        fontWeight: '600'
    },
    dataDetailText: {
        fontSize: 10
    },
    streakText: {
        fontSize: 13,
        fontWeight: 'bold'
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 2,
        minWidth: 36
    },
    emptyText: {
        fontSize: 13
    }
});

export default QuestSection;
