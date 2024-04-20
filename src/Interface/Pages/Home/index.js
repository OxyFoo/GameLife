import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackHome from './back';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Page } from 'Interface/Global';
import { Text, XPBar } from 'Interface/Components';
import { News, TodayPieChart, SkillsGroup, StatsBars, MultiplayerPanel, Missions } from 'Interface/Widgets';

/**
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 * @typedef {import('react-native').ListRenderItem<MyQuest>} FlatListMyQuestProps
 */

class Home extends BackHome {
    render() {
        const {
            experience: { xpInfo },
            values: { current_level, next_level },
            mission
        } = this.state;

        const lang = langManager.curr['home'];
        const txt_level = langManager.curr['level']['level'];

        const styleContainer = {
            backgroundColor: themeManager.GetColor('dataBigKpi')
        };

        const styleSmallContainer = {
            backgroundColor: themeManager.GetColor('ground2'),
        };

        return (
            <Page ref={ref => this.refPage = ref} isHomePage canScrollOver>

                <View style={styles.XPHeader}>
                    <View style={styles.XPHeaderLvl}>
                        <Text style={styles.level}>{txt_level}</Text>
                        <Text color='main2'>{current_level}</Text>
                    </View>
                    <Text>{next_level + '%'}</Text>
                </View>

                <XPBar
                    value={xpInfo.xp}
                    maxValue={xpInfo.next}
                />

                <View style={[styles.homeRow, styles.topSpace]}>
                    <TodayPieChart style={styles.todayPieChart} />
                </View>

                <Missions
                    style={styles.topSpace}
                    refHome={this}
                />

                {mission.state === 'claimed' && (
                    <News style={styles.topSpace} />
                )}

                <View style={[styles.homeRow, styles.topSpace]}>
                    <View style={[styleSmallContainer, styles.stats]}>
                        <Text bold={true} fontSize={20} style={styles.titleWidget}>
                            {lang['container-stats-title']}
                        </Text>
                        <StatsBars data={user.stats} simplifiedDisplay={true} />
                    </View>

                    <View style={[styleContainer, styles.skills]}>
                        <Text bold={true} fontSize={20} style={styles.titleWidget}>
                            {lang['container-skills-title']}
                        </Text>
                        <SkillsGroup style={styles.skillsGroup} />
                    </View>
                </View>

                <MultiplayerPanel
                    ref={this.refMultiplayerPanel}
                    style={styles.topSpace}
                    hideWhenOffline
                />

                {mission.state !== 'claimed' && (
                    <News style={styles.topSpace} />
                )}

            </Page>
        );
    }
}

export default Home;
