import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import QuestProgressChartBack from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Button, ProgressDonutChart, Text } from 'Interface/Components';

class QuestProgressChart extends QuestProgressChartBack {
    render() {
        const lang = langManager.curr['home'];

        const { size = 110, progressColor = '#4CAF50' } = this.props;
        const { completedQuests, totalQuests, allCompleted } = this.state;

        // Format progress text
        const progressText = allCompleted && totalQuests > 0 ? '✓' : `${completedQuests}/${totalQuests}`;

        // Calculate colors - use white like PieChart
        const chartProgressColor = allCompleted ? '#4CAF50' : progressColor;

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
                        <Text style={styles.title}>{lang['today-quest']}</Text>
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
                        <ProgressDonutChart
                            current={completedQuests}
                            goal={Math.max(totalQuests, 1)} // Avoid division by zero
                            size={size}
                            progressColor={chartProgressColor}
                            strokeWidth={8}
                            duration={1000}
                        >
                            <View style={styles.centerContent}>
                                {/* TODO : BOLD TEXT mais il veut pas */}
                                <Text
                                    style={[
                                        styles.progressText,
                                        {
                                            fontSize: size * 0.15
                                        }
                                    ]}
                                >
                                    {progressText}
                                </Text>
                            </View>
                        </ProgressDonutChart>
                    </View>
                </View>
            </LinearGradient>
        );
    }
}

export default QuestProgressChart;
