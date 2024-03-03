import * as React from 'react';
import { FlatList, View } from 'react-native';

import styles from './style';
import BackHome from './back';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Swiper, Text, Button, Icon, XPBar, Page } from 'Interface/Components';
import { News, TodayPieChart, SkillsGroup, StatsBars, MultiplayerPanel, Missions } from 'Interface/Widgets';

/**
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 * @typedef {import('react-native').ListRenderItem<MyQuest>} FlatListMyQuestProps
 */

class Home extends BackHome {
    render() {
        const {
            experience: { xpInfo },
            values: { current_level, next_level }
        } = this.state;

        const lang = langManager.curr['home'];
        const txt_level = langManager.curr['level']['level'];

        const styleContainer = {
            backgroundColor: themeManager.GetColor('dataBigKpi')
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

                <Missions
                    style={styles.topSpace}
                    refHome={this}
                />

                <Swiper
                    style={styles.topSpace}
                    pages={News()}
                />

                <View style={[styles.homeRow, styles.topSpace]}>
                    <TodayPieChart style={styles.todayPieChart} />
                </View>

                <View style={[styles.homeRow, styles.topSpace]}>
                    {this.renderQuestOrStats()}

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

            </Page>
        );
    }

    renderQuestOrStats = () => {
        const lang = langManager.curr['home'];
        const { currentQuests } = this.state;

        const styleSmallContainer = {
            backgroundColor: themeManager.GetColor('ground2'),
        };

        // Return stats if no quests are available today
        if (currentQuests.length <= 0) {
            return (
                <View style={[styleSmallContainer, styles.stats]}>
                    <Text bold={true} fontSize={20} style={styles.titleWidget}>
                        {lang['container-stats-title']}
                    </Text>
                    <StatsBars data={user.stats} simplifiedDisplay={true} />
                </View>
            );
        }

        return (
            <Button style={[styleSmallContainer, styles.myquests]} onPress={this.openQuests}>
                <Text bold={true} fontSize={20} style={styles.titleWidget}>
                    {lang['container-myquests-title']}
                </Text>
                <FlatList
                    style={styles.myquestsFlatlist}
                    data={currentQuests}
                    renderItem={this.renderMyQuest}
                    keyExtractor={(item, index) => index.toString()}
                />
                <Icon
                    style={styles.myQuestsIcon}
                    color='main1'
                    icon='handPress'
                    size={14}
                />
            </Button>
        );
    }

    /** @type {FlatListMyQuestProps} */
    renderMyQuest = ({ item: quest }) => {
        return (
            <Text
                style={styles.myQuestsText}
                fontSize={14}
            >
                {'- ' + quest.title}
            </Text>
        );
    }
}

export default Home;
