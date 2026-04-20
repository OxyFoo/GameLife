import React from 'react';
import { View, StyleSheet } from 'react-native';

import { ProgressDonut, Icon, Text } from 'Interface/Components';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';
import shared from './sharedStyle';

/**
 * @typedef {'full' | 'chartOnly' | 'dataOnly'} SectionMode
 * @typedef {import('../back').QuestProgress} QuestProgress
 */

/**
 * Quest section with progress donut and quest list
 * @param {object} props
 * @param {QuestProgress} props.questProgress - Quest completion data
 * @param {SectionMode} [props.mode] - Display mode
 * @param {boolean} [props.chartLeft] - Chart on left side
 * @param {number} [props.chartSize] - Donut size override
 * @param {number} [props.maxItems] - Max quests to display
 * @param {boolean} [props.compactFont] - Use compact font sizes
 * @param {string} [props.title] - Optional title above the data list
 */
const QuestSection = ({
    questProgress,
    mode = 'full',
    chartLeft = true,
    chartSize = 80,
    maxItems = 5,
    compactFont = true,
    title = ''
}) => {
    const lang = langManager.curr['calendar']['recap'];
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
                shared.chartContainer,
                mode === 'full' && (chartLeft ? shared.chartMarginRight : shared.chartMarginLeft)
            ]}
        >
            {hasQuests ? (
                <ProgressDonut
                    value={progressValue}
                    size={chartSize}
                    progressColor={progressColor}
                    strokeWidth={strokeWidth}
                    delay={0}
                >
                    <View style={shared.chartCenter}>
                        <Text style={[shared.chartCenterText, { fontSize: centerFontSize }]} color='primary'>
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
                        {lang['no-quests']}
                    </Text>
                </View>
            )}
        </View>
    );

    const data = (
        <View style={shared.dataList}>
            {title !== '' && (
                <Text style={shared.sectionTitle} color='secondary'>
                    {title}
                </Text>
            )}
            {quests.slice(0, maxItems).map((quest, index) => (
                <View key={`${index}-${quest.title}`} style={styles.dataRow}>
                    <Text
                        style={[styles.dataTitle, { fontSize: titleFontSize }, quest.completed && styles.dataCompleted]}
                        color={quest.completed ? 'primary' : 'secondary'}
                        numberOfLines={1}
                    >
                        {quest.title}
                        <Text style={[styles.dataDetailText, { fontSize: detailFontSize }]} color='secondary'>
                            {' '}
                            {quest.timeText}
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
                    {'No quests today'}
                </Text>
            )}
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
    noQuests: {
        borderWidth: 2,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center'
    },
    noQuestsText: {
        fontSize: 11
    },
    dataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4
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
