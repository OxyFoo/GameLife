import * as React from 'react';
import { Animated, View, ScrollView, FlatList } from 'react-native';

import styles from './style';
import BackProfile from './back';
import { Header } from './Header';
import AvatarEditor from './AvatarEditor';
import langManager from 'Managers/LangManager';

import { Text, ProgressBar, Button } from 'Interface/Components';
import { PageHeader, StatsBar } from 'Interface/Widgets';
import { Round } from 'Utils/Functions';

class Profile extends BackProfile {
    render() {
        const lang = langManager.curr['profile'];
        const { experienceUser, experienceStats, editMode } = this.state;

        // Edit mode animations
        const avatarEditModeInverse = this.avatarEditMode.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
        const uiOpacity = { opacity: avatarEditModeInverse };

        const styleParallax2_5 = { transform: [{ translateY: Animated.divide(this.scrollY, 5) }] };

        return (
            <ScrollView
                ref={this.refScrollView}
                style={styles.page}
                onScroll={this.handleScroll}
                scrollEnabled={!editMode}
            >
                <Animated.View style={[styles.header, uiOpacity]}>
                    <PageHeader
                        style={styles.pageHeader}
                        title={lang['title-profile']}
                        onBackPress={this.onBack}
                        secondaryIcon='settings-outline'
                        secondaryIconColor='gradient'
                        onSecondaryIconPress={this.openSettings}
                    />

                    <Header />

                    <Animated.View style={styles.xpView}>
                        <ProgressBar color='main1' value={experienceUser.xp} maxValue={experienceUser.next} />
                        <View style={styles.xpRow}>
                            <Text>{langManager.curr['level']['level'] + ' ' + experienceUser.lvl}</Text>
                            <Text>{Round(experienceUser.xp) + '/' + experienceUser.next}</Text>
                        </View>
                    </Animated.View>
                </Animated.View>

                {/** Statistics */}
                <Animated.View
                    style={[styles.statsView, styleParallax2_5, uiOpacity]}
                    pointerEvents={editMode ? 'none' : 'auto'}
                >
                    <FlatList
                        style={styles.statsFlatList}
                        data={experienceStats}
                        renderItem={StatsBar}
                        keyExtractor={(item) => `user-stat-${item.statKey}`}
                        scrollEnabled={false}
                    />
                </Animated.View>

                {/* Avatar Frame */}
                <AvatarEditor
                    ref={this.refAvatarEditor}
                    editMode={editMode}
                    animEditMode={this.avatarEditMode}
                    scrollY={this.scrollY}
                    onExitEditMode={this.closeInventory}
                />

                {/** Buttons */}
                <Animated.View style={[styles.buttons, uiOpacity]} pointerEvents={editMode ? 'none' : 'auto'}>
                    <Button style={styles.button} onPress={this.openInventory}>
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
                </Animated.View>
            </ScrollView>
        );
    }
}

export default Profile;
