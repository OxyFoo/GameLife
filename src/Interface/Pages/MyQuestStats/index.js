import * as React from 'react';
import { FlatList, View } from 'react-native';

import styles from './style';
import BackQuest from './back';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import StartHelp from './help';
import { Page, Button, StreakChart, Text } from 'Interface/Components';
import { PageHeader, YearHeatMap } from 'Interface/Widgets';

class MyQuestStats extends BackQuest {
    renderFooter() {
        return (
            <Button
                style={styles.addActivity}
                color='main2'
                onPress={this.onAddPress}
                icon='add'
                iconSize={30}
            />
        );
    }
    render() {
        const currentStreak = user.quests.myquests.GetStreak(this.selectedQuest);
        const maxStreak = Math.max(10, this.selectedQuest.maximumStreak);

        const skills = this.selectedQuest.skills;
        let skillsName = "";
        for (let i = 0; i < skills.length; i++) {
            const skill = dataManager.skills.GetByID(skills[i]);
            if (skill === null) continue;

            const name = skill?.Name[langManager.currentLangageKey];
            skillsName += name;
            if (i !== skills.length - 1) skillsName += ' • ';
        }

        const styleContainer = {
            backgroundColor: themeManager.GetColor('dataBigKpi')
        };

        return (
            <Page
                ref={ref => this.refPage = ref}
                footer={this.renderFooter()}
            >
                <PageHeader
                    style={styles.pageHeaderView}
                    onBackPress={() => user.interface.BackHandle()}
                    onHelpPress={StartHelp.bind(this)}
                />

                <View
                    style={[styles.headerView, styleContainer]}
                    ref={ref => this.refTuto1 = ref}
                >
                    <View>
                        <Text
                            style={styles.titleQuest}
                            color='primary'
                            fontSize={30}
                            bold={true}
                        >
                            {this.selectedQuest.title}
                        </Text>
                        <Text
                            style={styles.skills}
                            color='primary'
                            fontSize={14}
                            bold={true}
                        >
                            {skillsName}
                        </Text>
                    </View>

                    <Button
                        style={styles.editActivity}
                        icon='edit'
                        iconSize={24}
                        onPress={this.onEditPress}
                    />
                </View>

                <StreakChart
                    style={[styles.streakChartContainer, styleContainer]}
                    size={200}
                    height={150}
                    currentStreak={currentStreak}
                    bestStreak={maxStreak}
                    ref={ref => this.refTuto2 = ref}
                />

                <YearHeatMap
                    style={styles.yearHeatMap}
                    quest={this.selectedQuest}
                    ref={ref => this.refTuto3 = ref}
                />
            </Page>
        );
    }
}

export default MyQuestStats;
