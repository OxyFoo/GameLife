import * as React from 'react';
import { View, ScrollView } from 'react-native';

import styles from './style';
import BackHome from './back';
import langManager from 'Managers/LangManager';

import { Text, ProgressBar, Icon, Swiper } from 'Interface/Components';
import { TodayPieChart, Missions, MyQuestsSimpleList, TodoSimpleList } from 'Interface/Widgets';

class Home extends BackHome {
    render() {
        const {
            experience: { xpInfo },
            values: { currentLevel, currentXP, nextLevelXP }
        } = this.state;

        const lang = langManager.curr['home'];

        const { Title } = this;
        return (
            <ScrollView style={styles.page}>
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
                <Title title={lang['section-missions']} />
                <Missions refHome={this} />

                {/* Today performance */}
                <Title title={lang['section-today-performance']}>
                    <Icon icon='add-outline' color='gradient' onPress={() => this.fe.console?.AddLog('info', 'YAY')} />
                </Title>
                <Swiper pages={[<TodayPieChart style={styles.todayPieChart} />]} />

                {/* Today quests */}
                <Title title={lang['section-today-quests']} />
                <MyQuestsSimpleList />

                {/* My todoes */}
                <Title title={lang['section-my-todoes']} />
                <TodoSimpleList style={styles.todoList} />

                {/*
                <View style={styles.homeRow}>
                    <View style={[styleSmallContainer, styles.stats]}>
                        <Text fontSize={20} style={styles.titleWidget}>
                            {lang['container-stats-title']}
                        </Text>
                        <StatsBars data={user.stats} simplifiedDisplay={true} />
                    </View>

                    <View style={[styleContainer, styles.skills]}>
                        <Text fontSize={20} style={styles.titleWidget}>
                            {lang['container-skills-title']}
                        </Text>
                        <SkillsGroup style={styles.skillsGroup} />
                    </View>
                </View>

                <News />
                <MultiplayerPanel ref={this.refMultiplayerPanel} hideWhenOffline />
                */}
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
