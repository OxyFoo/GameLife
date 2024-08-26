import * as React from 'react';
import { View, ScrollView } from 'react-native';

import styles from './style';
import BackHome from './back';
import langManager from 'Managers/LangManager';

import { Text, ProgressBar, Button } from 'Interface/Components';
import { TodayPieChart, Missions, DailyQuest, MyQuestsList, TodoList } from 'Interface/Widgets';

class Home extends BackHome {
    render() {
        const lang = langManager.curr['home'];
        const {
            experience: { xpInfo },
            values: { currentLevel, currentXP, nextLevelXP },
            scrollable
        } = this.state;

        const { Title } = this;
        return (
            <ScrollView style={styles.page} scrollEnabled={scrollable}>
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
                {/* <Title title={lang['section-missions']} />
                <View pointerEvents='none'>
                    <Missions refHome={this} />
                </View> */}

                {/* Today performance */}
                <Title title={lang['section-today-performance']}>
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
                {/* <DailyQuest style={styles.dailyQuests} /> */}

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
                <MyQuestsList />

                {/* My todoes */}
                <Title title={lang['section-my-todoes']}>
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

    /**
     * @param {Object} props
     * @param {string} props.title
     * @param {React.ReactNode} [props.children]
     */
    Title({ title, children }) {
        return (
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle} color='secondary'>
                    {title}
                </Text>

                {children}
            </View>
        );
    }
}

export default Home;
