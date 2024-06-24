import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackHome from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, ProgressBar } from 'Interface/Components';
import { TodayPieChart, Missions, MyQuestsList } from 'Interface/Widgets';
import { News, SkillsGroup, StatsBars, MultiplayerPanel } from 'Interface/Widgets';

/**
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 * @typedef {import('react-native').ListRenderItem<MyQuest>} FlatListMyQuestProps
 */

class Home extends BackHome {
    render() {
        const {
            experience: { xpInfo },
            values: { currentLevel, currentXP, nextLevelXP }
        } = this.state;

        const lang = langManager.curr['home'];

        return (
            <View style={styles.page}>
                <ProgressBar
                    style={styles.progressbar}
                    height={12}
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

                <Missions refHome={this} style={styles.topSpace} />

                {/* Today performance */}
                <Text style={styles.sectionTitle} color='secondary'>
                    {lang['section-today-performance']}
                </Text>
                <View style={styles.homeRow}>
                    <TodayPieChart style={styles.todayPieChart} />
                </View>

                {/* Today missions */}
                <Text style={styles.sectionTitle} color='secondary'>
                    {lang['section-today-quests']}
                </Text>

                <MyQuestsList />

                {/*
                {mission?.state === 'claimed' && <News style={styles.topSpace} />}

                <View style={[styles.homeRow, styles.topSpace]}>
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

                <MultiplayerPanel ref={this.refMultiplayerPanel} style={styles.topSpace} hideWhenOffline />

                {mission?.state !== 'claimed' && <News style={styles.topSpace} />}
                */}
            </View>
        );
    }
}

export default Home;
