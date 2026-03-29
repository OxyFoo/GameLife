import React from 'react';
import { View, StyleSheet, Easing } from 'react-native';

import { ProgressDonut, Icon, Text } from 'Interface/Components';
import themeManager from 'Managers/ThemeManager';

const DONUT_EASING = Easing.out(Easing.exp); // This is here so animation doesn't trigger AGAIN when trying to save the image

/**
 * @typedef {import('../back').QuestProgress} QuestProgress
 */

/**
 * Quest section with donut and quest list
 * @param {object} props
 * @param {QuestProgress} props.questProgress - Quest completion data
 * @param {Record<string, string>} [props.lang] - Language strings
 */
const QuestSection = ({ questProgress, lang = {} }) => {
    const { completedQuests, totalQuests, allCompleted, quests } = questProgress;
    const hasQuests = totalQuests > 0;
    const rawProgress = hasQuests ? completedQuests / totalQuests : 0;
    const progressValue = Math.min(rawProgress, 0.97); // 100% is confusing visually, so we cap it at 97% so it's better looking
    const progressColor = allCompleted ? 'success' : 'main1';

    return (
        <View style={styles.container}>
            <View style={styles.donutContainer}>
                {hasQuests ? (
                    <ProgressDonut
                        value={progressValue}
                        size={80}
                        progressColor={progressColor}
                        strokeWidth={7}
                        delay={0}
                        easing={DONUT_EASING}
                    >
                        <View style={styles.donutCenter}>
                            <Text style={styles.donutCenterText} color='primary'>
                                {`${completedQuests}/${totalQuests}`}
                            </Text>
                        </View>
                    </ProgressDonut>
                ) : (
                    <View style={[styles.noQuests, { borderColor: themeManager.GetColor('border') }]}>
                        <Text style={styles.noQuestsText} color='secondary'>
                            {lang['no-quests'] || 'No quests'}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.questList}>
                {quests.slice(0, 5).map((quest, index) => (
                    <View key={index} style={styles.questRow}>
                        <View style={styles.questInfo}>
                            <Text
                                style={[styles.questTitle, quest.completed && styles.questCompleted]}
                                color={quest.completed ? 'primary' : 'secondary'}
                                numberOfLines={1}
                            >
                                {quest.title}
                            </Text>
                            <Text style={styles.questDetailText} color='secondary'>
                                {quest.timeText}
                            </Text>
                        </View>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 24
    },
    donutContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
    },
    donutCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    donutCenterText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    noQuests: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 2,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center'
    },
    noQuestsText: {
        fontSize: 11
    },
    questList: {
        flex: 1,
        overflow: 'hidden'
    },
    questRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4
    },
    questInfo: {
        flexShrink: 1,
        alignItems: 'flex-start'
    },
    questTitle: {
        fontSize: 13
    },
    questCompleted: {
        fontWeight: '600'
    },
    questDetailText: {
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
