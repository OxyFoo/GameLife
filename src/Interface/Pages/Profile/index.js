import * as React from 'react';
import { Animated, View, ScrollView, FlatList, Dimensions } from 'react-native';

import styles from './style';
import BackProfile from './back';
import { Header } from './Header';
import EditorAvatar from './EditAvatar';
import { RenderStatistic } from './Components/statistic';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Round } from 'Utils/Functions';
import { Text, ProgressBar, Button } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

// @ts-ignore
const avatarPlaceholder = require('../../../../res/items/avatar_placeholder.png');

class Profile extends BackProfile {
    render() {
        const lang = langManager.curr['profile'];
        const { editorOpened, infoHeaderHeight, experienceUser, experienceStats } = this.state;
        const screenDim = Dimensions.get('window');

        const interReverse = { inputRange: [0, 1], outputRange: [1, 0] };
        const animAvatar = this.refAvatar.current?.state.editorAnim.interpolate(interReverse) || 1;
        const headerOpacity = { opacity: animAvatar };
        const headerPointer = this.refAvatar.current === null ? 'auto' : editorOpened ? 'none' : 'auto';
        const styleParallax = { transform: [{ translateY: Animated.divide(this.state.scrollY, 2) }] };
        const styleParallax2_5 = { transform: [{ translateY: Animated.divide(this.state.scrollY, 5) }] };
        const styleParallax2 = { transform: [{ translateY: Animated.divide(this.state.scrollY, 3) }] };

        return (
            <ScrollView style={styles.page} onScroll={this.handleScroll}>
                <View style={styles.header} onLayout={this.onLayoutHeader}>
                    <PageHeader
                        style={styles.pageHeader}
                        title={lang['title-profile']}
                        onBackPress={this.onBack}
                        secondaryIcon='settings-outline'
                        secondaryIconColor='gradient'
                        onSecondaryIconPress={this.openSettings}
                    />

                    <Animated.View style={headerOpacity} pointerEvents={headerPointer}>
                        <Header />
                    </Animated.View>

                    <Animated.View style={[styles.xpView, headerOpacity]}>
                        <ProgressBar color='main1' value={experienceUser.xp} maxValue={experienceUser.next} />
                        <View style={styles.xpRow}>
                            <Text>{langManager.curr['level']['level'] + ' ' + experienceUser.lvl}</Text>
                            <Text>{Round(experienceUser.xp) + '/' + experienceUser.next}</Text>
                        </View>
                    </Animated.View>
                </View>

                {/* <EditorAvatar
                    ref={this.refAvatar}
                    //refParent={this}
                    onChangeState={(opened) => this.setState({ editorOpened: opened })}
                /> */}

                <View style={[styles.avatarView, { transform: [{ translateY: infoHeaderHeight }] }]}>
                    <Animated.Image
                        style={[
                            styles.avatarPlaceholder,
                            styleParallax,
                            {
                                width: screenDim.width,
                                height: screenDim.height * 0.9
                            }
                        ]}
                        source={avatarPlaceholder}
                    />
                    <Text
                        style={[
                            styles.avatarComingSoonText,
                            {
                                textShadowColor: themeManager.GetColor('main2')
                            },
                            styles.avatarComingSoon,
                            styleParallax2
                        ]}
                        color='secondary'
                        animated
                    >
                        {lang['coming-soon']}
                    </Text>
                </View>

                <Animated.View style={[styles.statsView, styleParallax2_5]}>
                    <FlatList
                        style={styles.statsFlatList}
                        data={experienceStats}
                        renderItem={RenderStatistic}
                        keyExtractor={(item) => `user-stat-${item.statKey}`}
                        scrollEnabled={false}
                    />
                </Animated.View>

                <View style={styles.buttons}>
                    <Button style={styles.button} enabled={false}>
                        {lang['btn-edit-profile']}
                    </Button>

                    <Button style={styles.button} appearance='outline-blur' icon='default' onPress={this.openSkills}>
                        {lang['btn-skills']}
                    </Button>

                    <Button style={styles.button} appearance='outline-blur' icon='graph' onPress={this.openStatistics}>
                        {lang['btn-statistics']}
                    </Button>

                    <Button
                        style={styles.button}
                        appearance='outline-blur'
                        icon='success'
                        onPress={this.openAchievements}
                    >
                        {lang['btn-achievements']}
                    </Button>

                    <Button style={styles.button} appearance='outline-blur' icon='social' onPress={this.openFriends}>
                        {lang['btn-friends']}
                    </Button>
                </View>
            </ScrollView>
        );
    }
}

export default Profile;
