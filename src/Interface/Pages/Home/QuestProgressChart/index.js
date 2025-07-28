import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import QuestProgressChartBack from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Button, ProgressDonutChart } from 'Interface/Components';

class QuestProgressChart extends QuestProgressChartBack {
    render() {
        const lang = langManager.curr['home'];

        const { size, progressColor, completedColor } = this.props;
        const { completedQuests, totalQuests, allCompleted } = this.state;

        const chartProgressColor = themeManager.GetColor(allCompleted ? completedColor : progressColor);

        return (
            <LinearGradient
                style={[styles.gradientContainer, this.props.style]}
                colors={[
                    themeManager.GetColor('main1', { opacity: 0.12 }),
                    themeManager.GetColor('main1', { opacity: 0.45 })
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                onLayout={this.onLayout}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text fontSize={16} color='white' style={styles.title}>
                            {lang['today-quest']}
                        </Text>
                        <Button
                            style={styles.sectionTitleAddButton}
                            appearance='uniform'
                            color='transparent'
                            icon='add-outline'
                            fontColor='gradient'
                            onPress={this.addQuest}
                        />
                    </View>

                    <View style={styles.content}>
                        {/* If there are no quests, show message */}
                        {totalQuests === 0 ? (
                            <View style={styles.notEnoughData}>
                                <Text style={styles.notEnoughDataText}>{lang['chart-quest-notmuch']}</Text>
                            </View>
                        ) : (
                            <ProgressDonutChart
                                current={completedQuests}
                                goal={Math.max(totalQuests, 1)} // Avoid division by zero
                                size={size}
                                progressColor={chartProgressColor}
                                strokeWidth={8}
                                delay={0}
                            >
                                <View style={styles.centerContent}>
                                    {/**
                                     * // TODO: Régler le * 0.15
                                     */}
                                    <Text fontSize={size * 0.15} bold>
                                        {`${completedQuests}/${totalQuests}`}
                                    </Text>
                                </View>
                            </ProgressDonutChart>
                        )}
                    </View>
                </View>
            </LinearGradient>
        );
    }
}

export default QuestProgressChart;
