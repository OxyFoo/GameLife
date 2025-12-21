import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import TodayQuestsPieChartBack from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Button, ProgressDonut, Icon } from 'Interface/Components';

class TodayQuestsPieChart extends TodayQuestsPieChartBack {
    render() {
        const lang = langManager.curr['home'];

        const { size, progressColor, completedColor } = this.props;
        const { completedQuests, totalQuests, allCompleted, maxStreak } = this.state;

        const chartProgressColor = allCompleted ? completedColor : progressColor;

        return (
            <View style={styles.container}>
                {/* Absolute add button */}
                <Button
                    style={styles.absoluteAddButton}
                    appearance='uniform'
                    color='transparent'
                    icon='add-outline'
                    fontColor='gradient'
                    onPress={this.addQuest}
                />

                {/* Button with Gradient background for the chart container */}
                <Button style={styles.parentButton} appearance='uniform' color='transparent' onPress={this.openQuests}>
                    <LinearGradient
                        style={[styles.gradientContainer, this.props.style]}
                        colors={[
                            themeManager.GetColor('main1', { opacity: 0.12 }),
                            themeManager.GetColor('main1', { opacity: 0.45 })
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <View style={styles.content}>
                            <View style={styles.header}>
                                <Text fontSize={16} color='white' style={styles.title}>
                                    {lang['today-quest']}
                                </Text>
                            </View>

                            {/* If there are no quests, show message */}
                            {totalQuests === 0 ? (
                                <View style={styles.notEnoughData}>
                                    <Text style={styles.notEnoughDataText}>{lang['chart-quest-notmuch']}</Text>
                                </View>
                            ) : (
                                <ProgressDonut
                                    value={completedQuests / totalQuests}
                                    size={size}
                                    progressColor={chartProgressColor}
                                    strokeWidth={8}
                                    delay={0}
                                >
                                    <View style={styles.centerContent}>
                                        <Text fontSize={16} bold>
                                            {`${completedQuests}/${totalQuests}`}
                                        </Text>
                                    </View>
                                    <View style={styles.textStreak}>
                                        <Text fontSize={16} bold>
                                            {maxStreak}
                                        </Text>
                                        <Icon icon='flame' color='main2' />
                                    </View>
                                </ProgressDonut>
                            )}
                        </View>
                    </LinearGradient>
                </Button>
            </View>
        );
    }
}

export { TodayQuestsPieChart };
