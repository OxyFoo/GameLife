import * as React from 'react';
import { Animated, Dimensions, View, ScrollView, TouchableOpacity } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import BackHome from './back';
import { Title } from './title';
import Experience from './Experience';
import TodayActivitiesPieChart from './TodayActivitiesPieChart';
import TodayQuestsPieChart from './TodayQuestsPieChart';
import { StatsRadar } from './StatsRadar';
import { SkillsTags } from './SkillsTags';
import { AchievementPreview } from './AchievementPreview';
import { MoreInfo } from './MoreInfo';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Button } from 'Interface/Components';
import { Missions, TodoList } from 'Interface/Widgets';

class Home extends BackHome {
    render() {
        const lang = langManager.curr['home'];

        // Avatar data
        const { skin, skinColor, items } = user.avatar.GetAvatarRenderData();
        const screenWidth = Dimensions.get('window').width;
        const avatarSize = screenWidth * 1.3;

        // Parallax effect for avatar
        const avatarParallax = {
            transform: [{ translateY: Animated.divide(this.scrollY, 6) }]
        };

        return (
            <ScrollView
                ref={this.refScrollView}
                style={styles.page}
                onScroll={this.handleScroll}
                scrollEventThrottle={16}
            >
                {/* User experience (progressbar + lvl + xp) */}
                <Experience />

                {/* Missions - Optional */}
                <Missions />

                {/* Today recap: Activities & Quests */}
                <Title ref={this.refQuestsTitle} title={lang['section-today-performance']} />
                <View style={styles.chartsContainer}>
                    <TodayActivitiesPieChart />
                    <TodayQuestsPieChart />
                </View>

                {/* Main stats & avatar */}
                <View>
                    {/* Left column: Stats, Skills, Achievements */}
                    <View style={styles.leftColumn}>
                        {/* Stats title + widget */}
                        <Title title={lang['container-stats-title']} />
                        <StatsRadar />

                        {/* Skills title + widget */}
                        <Title title={lang['container-skills-title']} />
                        <SkillsTags />
                    </View>

                    {/* Right column: Avatar with parallax */}
                    <Animated.View style={[styles.rightColumn, avatarParallax]}>
                        <TouchableOpacity onPress={this.openProfile} activeOpacity={0.8}>
                            <AvatarFrame width={avatarSize} height={avatarSize} backgroundColor='#00000000'>
                                <AvatarCharacter
                                    body={skin}
                                    bodyColor={skinColor}
                                    position={{ x: 0, y: 0, z: 0 }}
                                    scale={1}
                                    items={items}
                                />
                            </AvatarFrame>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                {/* Achievements title + widget */}
                <Title title={lang['btn-achievements']} />
                <AchievementPreview />

                {/* More infos KPIs */}
                <Title title={lang['btn-more-info']} />
                <MoreInfo />

                {/* My todos */}
                <Title title={lang['section-my-todos']}>
                    <Button
                        style={styles.sectionTitleAddButton}
                        appearance='uniform'
                        color='transparent'
                        icon='add-outline'
                        fontColor='gradient'
                    />
                </Title>
                <TodoList style={styles.lastWidget} />
            </ScrollView>
        );
    }
}

export default Home;
