import * as React from 'react';
import { Animated, Dimensions, View, ScrollView, TouchableOpacity } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import BackHome from './back';
import { Title } from './Title';
import { Experience } from './Experience';
import { TodayActivitiesPieChart } from './TodayActivitiesPieChart';
import { StatsRadar } from './StatsRadar';
import { SkillsTags } from './SkillsTags';
// TODO: Delete ?
// import { AchievementPreview } from './AchievementPreview';
import { MoreInfo } from './MoreInfo';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Button } from 'Interface/Components';
import { Missions } from 'Interface/Widgets';

class Home extends BackHome {
    render() {
        const lang = langManager.curr['home'];

        // Avatar data
        const { skin, skinColor, items } = user.avatar.GetAvatarRenderData();
        const screenWidth = Dimensions.get('window').width;
        const avatarSize = screenWidth * 1.5;

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

                {/* Today recap: Activities */}
                <Title title={lang['section-today-performance']}>
                    <Button
                        style={styles.sectionTitleAddButton}
                        appearance='uniform'
                        color='transparent'
                        icon='share-2-outline'
                        fontColor='gradient'
                        onPress={this.openDayRecap}
                    />
                </Title>
                <View style={styles.chartsContainer}>
                    <TodayActivitiesPieChart />
                </View>

                {/* Main stats & avatar */}
                <View>
                    {/* Left column: Stats, Skills, Achievements */}
                    <View style={styles.leftColumn}>
                        {/* Stats title + widget */}
                        <Title title={lang['container-stats-title']} />
                        <StatsRadar />

                        {/* Skills title + widget */}
                        {/* <Title title={lang['container-skills-title']} /> */}
                        <SkillsTags style={styles.sectionMoreData} refParent={this.refSkillsTags} />
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
                {/* <Title title={lang['btn-achievements']} />
                <AchievementPreview /> */}

                <Title title={lang['btn-more-info']} />
                <MoreInfo style={styles.lastWidget} />
            </ScrollView>
        );
    }
}

export default Home;
