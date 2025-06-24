import React from 'react';
import { View, Text } from 'react-native';

import styles from './style';
import QuestProgressChartBack from './back';
import themeManager from 'Managers/ThemeManager';

import { Button, ProgressDonutChart } from 'Interface/Components';

class QuestProgressChart extends QuestProgressChartBack {
    render() {
        const { size = 110, progressColor = '#4CAF50' } = this.props;
        const { completedQuests, totalQuests, allCompleted } = this.state;

        // Format progress text
        const progressText = allCompleted && totalQuests > 0 ? '✓' : `${completedQuests}/${totalQuests}`;
        const subtitleText = allCompleted && totalQuests > 0 ? 'Terminé' : 'quêtes';

        // Calculate colors - use white like PieChart
        const chartProgressColor = allCompleted ? '#4CAF50' : progressColor;

        return (
            <Button
                style={[styles.container, this.props.style]}
                appearance='normal'
                gradientColors={[
                    themeManager.GetColor('main1', { opacity: 0.12 }),
                    themeManager.GetColor('main1', { opacity: 0.45 })
                ]}
                gradientColorsAngle={90}
                onLayout={this.onLayout}
                onPress={this.onQuestPress}
            >
                <ProgressDonutChart
                    current={completedQuests}
                    goal={Math.max(totalQuests, 1)} // Avoid division by zero
                    size={size}
                    progressColor={chartProgressColor}
                    strokeWidth={8}
                    duration={1000}
                >
                    <View style={styles.centerContent}>
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
                        {!(allCompleted && totalQuests > 0) && (
                            <Text
                                style={[
                                    styles.subtitleText,
                                    {
                                        fontSize: size * 0.08
                                    }
                                ]}
                            >
                                {subtitleText}
                            </Text>
                        )}
                    </View>
                </ProgressDonutChart>
            </Button>
        );
    }
}

export default QuestProgressChart;
