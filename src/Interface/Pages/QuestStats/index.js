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

import { Button, Icon, ProgressDonut, Text } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class QuestStats extends BackQuest {
    render() {
        if (this.selectedQuest === null) {
            return null;
        }

        const lang = langManager.curr['quest-stats'];
        const { schedule } = this.selectedQuest;

        const currentStreak = user.quests.GetStreak(this.selectedQuest);

        const skillsName = this.selectedQuest.skills
            .map((skillID) => dataManager.skills.GetByID(skillID))
            .filter((skill) => skill !== null)
            .map((skill) => skill !== null && langManager.GetText(skill.Name))
            .join(' • ');

        return (
            <>
                <ScrollView style={styles.page}>
                    <PageHeader
                        style={styles.pageHeader}
                        title={this.selectedQuest.title}
                        onBackPress={this.onBackPress}
                        secondaryIcon='edit'
                        secondaryIconColor='gradient'
                        onSecondaryIconPress={this.onEditPress}
                    />

                    {/* Quest info: Title + skills + duration + edit button */}
                    <Text style={styles.title} color='border'>
                        {lang['title-skills']}
                    </Text>
                    <View style={styles.questHeaderView}>
                        <Text style={styles.questSkills} color='primary'>
                            {skillsName}
                        </Text>
                    </View>

                    {/* KPI Containers */}
                    <Text style={styles.title} color='border'>
                        {lang['title-data']}
                    </Text>
                    <Text style={styles.warnText} color='secondary'>
                        {lang['warn-message']}
                    </Text>
                    <View style={styles.kpiRow}>
                        <LinearGradient
                            style={styles.kpiContainer}
                            colors={[
                                themeManager.GetColor('border', { opacity: 0.2 }),
                                themeManager.GetColor('border', { opacity: 0.06 })
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <View style={styles.kpiContent}>
                                <Text fontSize={16} color='white' style={styles.kpiTitle}>
                                    {lang['kpi-efficient']}
                                </Text>
                                <View style={styles.donutContainer}>
                                    <ProgressDonut
                                        value={this.efficiencyScore / 100}
                                        size={100}
                                        progressColor='main1'
                                        strokeWidth={8}
                                        delay={0}
                                    >
                                        <View style={styles.donutCenter}>
                                            <Text fontSize={16} bold color='primary'>
                                                {this.efficiencyScore}%
                                            </Text>
                                        </View>
                                    </ProgressDonut>
                                </View>
                            </View>
                        </LinearGradient>

                        <LinearGradient
                            style={styles.kpiContainer}
                            colors={[
                                themeManager.GetColor('border', { opacity: 0.2 }),
                                themeManager.GetColor('border', { opacity: 0.06 })
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <View style={styles.kpiContent}>
                                <Text fontSize={16} color='white' style={styles.kpiTitle}>
                                    {lang['kpi-streak']}
                                </Text>
                                <View style={styles.donutContainer}>
                                    <ProgressDonut
                                        value={this.dailyProgress}
                                        size={100}
                                        progressColor='main2'
                                        strokeWidth={8}
                                        delay={0}
                                    >
                                        <View style={styles.donutCenter}>
                                            <View style={styles.streakRow}>
                                                <Text fontSize={16} bold color='primary'>
                                                    {currentStreak}
                                                </Text>
                                                <Icon icon='flame' color='main2' size={16} />
                                            </View>
                                            <Text fontSize={10} color='secondary'>
                                                {this.activitiesTimeText}
                                            </Text>
                                        </View>
                                    </ProgressDonut>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Heatmap */}
                    <LinearGradient
                        style={styles.heatmapContainer}
                        colors={[
                            themeManager.GetColor('border', { opacity: 0.2 }),
                            themeManager.GetColor('border', { opacity: 0.06 })
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <View style={styles.heatmapContent}>
                            <YearHeatMap quest={this.selectedQuest} />
                        </View>
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
                </ScrollView>

                <Button style={styles.addActivity} onPress={this.onAddPress}>
                    {lang['button-add-activity']}
                </Button>
            </>
        );
    }
}

export default QuestStats;
