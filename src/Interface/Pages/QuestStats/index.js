import * as React from 'react';
import { ScrollView, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import BackQuest from './back';
import WeekMap from './Components/WeekMap';
import YearHeatMap from './Components/YearHeatMap';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Button, StreakChart, Text } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class QuestStats extends BackQuest {
    render() {
        if (this.selectedQuest === null) {
            return null;
        }

        const lang = langManager.curr['quest-stats'];
        const { maximumStreak, schedule } = this.selectedQuest;

        const currentStreak = user.quests.GetStreak(this.selectedQuest);
        const maxStreak = Math.max(10, maximumStreak);

        const skillsName = this.selectedQuest.skills
            .map((skillID) => dataManager.skills.GetByID(skillID))
            .filter((skill) => skill !== null)
            .map((skill) => skill !== null && langManager.GetText(skill.Name))
            .join(' • ');

        return (
            <>
                <ScrollView style={styles.page}>
                    <PageHeader style={styles.pageHeader} title={lang['title']} onBackPress={this.onBackPress} />

                    {/* Quest info: Title + skills + duration + edit button */}
                    <LinearGradient
                        style={styles.questHeader}
                        colors={[
                            themeManager.GetColor('backgroundCard', { opacity: 0.65 }),
                            themeManager.GetColor('backgroundCard', { opacity: 0.25 })
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <View style={styles.questTextView}>
                            <Text style={styles.questTitle} color='primary'>
                                {this.selectedQuest.title}
                            </Text>
                            <Text style={styles.questSkills} color='primary'>
                                {skillsName}
                            </Text>
                        </View>

                        <View style={styles.editActivityView}>
                            <Text style={styles.editActivityTime} color='main1'>
                                {this.activitiesTimeText}
                            </Text>
                            <Button
                                style={styles.editActivityButton}
                                appearance='uniform'
                                color='transparent'
                                icon='edit'
                                iconSize={24}
                                fontColor='gradient'
                                onPress={this.onEditPress}
                            />
                        </View>
                    </LinearGradient>

                    <Text style={styles.warnText} color='secondary'>
                        {lang['warn-message']}
                    </Text>

                    {/* Streak chart */}
                    <LinearGradient
                        style={styles.streakChartContainer}
                        colors={[
                            themeManager.GetColor('main1', { opacity: 0.45 }),
                            themeManager.GetColor('main1', { opacity: 0.15 })
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <StreakChart size={200} height={150} currentStreak={currentStreak} bestStreak={maxStreak} />
                    </LinearGradient>

                    {/* Current week */}
                    {(schedule.type === 'week' || schedule.type === 'month') && (
                        <>
                            <Text style={styles.title} color='border'>
                                {lang['title-current-week']}
                            </Text>
                            <WeekMap quest={this.selectedQuest} showAnimations={this.showAnimations} />
                        </>
                    )}

                    {/* Year heatmap */}
                    <Text style={styles.title} color='border'>
                        {lang['title-heatmap']}
                    </Text>
                    <YearHeatMap style={styles.yearHeatMap} quest={this.selectedQuest} />
                </ScrollView>

                <Button style={styles.addActivity} onPress={this.onAddPress}>
                    {lang['button-add-activity']}
                </Button>
            </>
        );
    }
}

export default QuestStats;
