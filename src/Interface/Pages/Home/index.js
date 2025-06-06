import * as React from 'react';
import { View, ScrollView } from 'react-native';

import styles from './style';
import BackHome from './back';
import { Title } from './title';
import langManager from 'Managers/LangManager';

import { Text, ProgressBar, Button } from 'Interface/Components';
import { TodayPieChart, Missions, DailyQuest, QuestsList, TodoList } from 'Interface/Widgets';

class Home extends BackHome {
    render() {
        const lang = langManager.curr['home'];
        const {
            experience: { xpInfo },
            values: { currentLevel, currentXP, nextLevelXP },
            scrollable
        } = this.state;

        return (
            <ScrollView ref={this.refScrollView} style={styles.page} scrollEnabled={scrollable}>
                {/* Experience */}
                <ProgressBar
                    style={styles.progressbar}
                    height={8}
                    color='main1'
                    value={xpInfo.xp}
                    maxValue={xpInfo.next}
                />
                <View style={styles.XPHeader}>
                    <Text style={styles.level}>{langManager.curr['level']['level-small'] + '. ' + currentLevel}</Text>
                    <Text style={styles.experience}>
                        {currentXP + '/' + nextLevelXP + ' ' + langManager.curr['level']['xp']}
                    </Text>
                </View>

                {/* Today missions */}
                <Missions />

                {/* Today performance */}
                <Title ref={this.refQuestsTitle} title={lang['section-today-performance']}>
                    <Button
                        style={styles.sectionTitleAddButton}
                        appearance='uniform'
                        color='transparent'
                        icon='add-outline'
                        fontColor='gradient'
                        onPress={this.addActivity}
                    />
                </Title>
                <TodayPieChart style={styles.todayPieChart} />

                {/* Today missions */}
                <DailyQuest style={styles.dailyQuests} />

                {/* Today quests */}
                <Title title={lang['section-today-quests']}>
                    <Button
                        style={styles.sectionTitleAddButton}
                        appearance='uniform'
                        color='transparent'
                        icon='add-outline'
                        fontColor='gradient'
                        onPress={this.addQuest}
                    />
                </Title>
                <QuestsList />

                {/* My todos */}
                <Title title={lang['section-my-todos']}>
                    <Button
                        style={styles.sectionTitleAddButton}
                        appearance='uniform'
                        color='transparent'
                        icon='add-outline'
                        fontColor='gradient'
                        onPress={this.addTodo}
                    />
                </Title>
                <TodoList style={styles.todoList} changeScrollable={this.onChangeScrollable} />
            </ScrollView>
        );
    }
}

export default Home;
