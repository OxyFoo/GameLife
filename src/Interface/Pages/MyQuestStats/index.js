import * as React from 'react';

import styles from './style';
import BackQuest from './back';
import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

import { Page, Button, StreakChart } from 'Interface/Components';
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

        const styleContainer = {
            backgroundColor: themeManager.GetColor('dataBigKpi')
        };

        return (
            <Page
                ref={ref => this.refPage = ref}
                footer={this.renderFooter()}
            >
                <PageHeader
                    onBackPress={() => user.interface.BackHandle()}
                />

                <Button
                    style={styles.editActivity}
                    color='main1'
                    icon='edit'
                    onPress={this.onEditPress}
                />

                <YearHeatMap
                    style={styles.yearHeatMap}
                    quest={this.selectedQuest}
                />

                <StreakChart
                    style={[styles.streakChartContainer, styleContainer]}
                    size={200}
                    height={150}
                    currentStreak={currentStreak}
                    bestStreak={maxStreak}
                />
            </Page>
        );
    }
}

export default MyQuestStats;
