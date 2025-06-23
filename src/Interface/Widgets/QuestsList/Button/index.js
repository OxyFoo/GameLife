import * as React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import QuestButtonBack from './back';
import themeManager from 'Managers/ThemeManager';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import { Sum } from 'Utils/Functions';
import { GetLocalTime } from 'Utils/Time';

import { Text, Icon, Button } from 'Interface/Components';
import { DonutProgressChart } from 'Interface/Components/DonutProgressChart';

class QuestButton extends QuestButtonBack {
    // Calculate current progress for the quest
    getCurrentProgress = () => {
        const { quest } = this.props;
        if (!quest) return { current: 0, goal: 0 };

        // Get total duration of activities done today for this quest
        const totalDuration = Sum(
            user.activities
                .GetByTime(GetLocalTime())
                .filter((activity) => quest.skills.includes(activity.skillID))
                .filter((activity) => user.activities.GetExperienceStatus(activity) === 'grant')
                .map((activity) => activity.duration)
        );

        return {
            current: totalDuration,
            goal: quest.schedule.duration
        };
    };

    // Determine progress color based on most practiced activity category today
    getProgressColor = () => {
        const { quest } = this.props;
        if (!quest) return themeManager.GetColor('primary', { opacity: 1 });

        // Get all activities done today for this quest
        const todayActivities = user.activities
            .GetByTime(GetLocalTime())
            .filter((activity) => quest.skills.includes(activity.skillID))
            .filter((activity) => user.activities.GetExperienceStatus(activity) === 'grant');

        if (todayActivities.length === 0) {
            return themeManager.GetColor('primary', { opacity: 1 });
        }

        // Group activities by skill category and sum durations
        const categoryDurations = new Map();
        todayActivities.forEach((activity) => {
            const skill = dataManager.skills.GetByID(activity.skillID);
            if (skill) {
                const categoryID = skill.CategoryID;
                const currentDuration = categoryDurations.get(categoryID) || 0;
                categoryDurations.set(categoryID, currentDuration + activity.duration);
            }
        });

        // Find the category with the most time spent
        let maxDuration = 0;
        let mostPracticedCategoryID = null;
        categoryDurations.forEach((duration, categoryID) => {
            if (duration > maxDuration) {
                maxDuration = duration;
                mostPracticedCategoryID = categoryID;
            }
        });

        // Get the color of the most practiced category
        if (mostPracticedCategoryID) {
            const category = dataManager.skills.GetCategoryByID(mostPracticedCategoryID);
            if (category && category.Color) {
                return category.Color;
            }
        }

        // Fallback to default color
        return themeManager.GetColor('primary', { opacity: 1 });
    };

    render() {
        const { streakCount } = this.state;
        const { style, quest, onLayout, enableQuickAdd } = this.props;
        if (quest === null) return null;

        const progress = this.getCurrentProgress();

        // Format time for display (convert minutes to hours:minutes)
        /** @param {number} minutes */
        const formatTime = (minutes) => {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            if (hours > 0) {
                return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
            }
            return `${mins}m`;
        };

        const currentTimeText = formatTime(progress.current);
        const goalTimeText = formatTime(progress.goal);

        return (
            <LinearGradient
                style={[styles.item, style]}
                colors={[
                    themeManager.GetColor('backgroundCard', { opacity: 0.45 }),
                    themeManager.GetColor('backgroundCard', { opacity: 0.2 })
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                onLayout={onLayout}
            >
                <Button
                    style={styles.buttonStyle}
                    appearance='uniform'
                    color='transparent'
                    onPress={this.openQuest}
                    onLongPress={this.openQuickAddActivity}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}
                    onTouchCancel={this.onTouchEnd}
                    rippleDuration={enableQuickAdd ? 800 : undefined}
                >
                    <View style={styles.content}>
                        <View style={styles.contentHeader}>
                            <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>
                                {quest.title}
                            </Text>
                        </View>
                        <View style={styles.contentDonut}>
                            <DonutProgressChart
                                current={progress.current}
                                goal={progress.goal}
                                size={80}
                                strokeWidth={6}
                                strokeLinecap='round'
                                progressColor={this.getProgressColor()}
                                backgroundColor={themeManager.GetColor('background', { opacity: 1 })}
                            >
                                <Text style={styles.progressText} color='main1'>
                                    {currentTimeText}/{goalTimeText}
                                </Text>
                            </DonutProgressChart>
                        </View>
                        <View style={styles.contentStreak}>
                            <Text style={styles.streakText} color='main2'>
                                {streakCount.toString()}
                            </Text>
                            <Icon icon='flame' size={16} color='main2' style={styles.streakIcon} />
                        </View>
                    </View>
                </Button>
            </LinearGradient>
        );
    }
}

export { QuestButton };
