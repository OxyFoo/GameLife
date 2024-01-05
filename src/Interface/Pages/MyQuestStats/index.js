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
        const { skills, maximumStreak } = this.selectedQuest;

        const currentStreak = user.quests.myquests.GetStreak(this.selectedQuest);
        const maxStreak = Math.max(10, maximumStreak);

        const skillsName = this.selectedQuest.skills
            .map(skillID => dataManager.skills.GetByID(skillID))
            .filter(skill => skill !== null) 
            .map(skill => dataManager.GetText(skill.Name))
            .join(' • ');
            
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
