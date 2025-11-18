import * as React from 'react';
import { Animated, View, ScrollView, FlatList, Dimensions } from 'react-native';
import { AvatarFrame, AvatarCharacter } from '@oxyfoo/avatar-factory';

import styles from './style';
import BackProfile from './back';
import { Header } from './Header';
import langManager from 'Managers/LangManager';

import { Round } from 'Utils/Functions';
import { Text, ProgressBar, Button } from 'Interface/Components';
import { PageHeader, StatsBar } from 'Interface/Widgets';

class Profile extends BackProfile {
    render() {
        const lang = langManager.curr['profile'];
        const { experienceUser, experienceStats, editMode, avatarTranslateX, avatarTranslateY, avatarScale } =
            this.state;
        const screenDim = Dimensions.get('window');

        // Edit mode animations
        const editModeInverse = editMode.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
        const uiOpacity = { opacity: editModeInverse };
        const uiEditorAvatarOpacity = { opacity: editMode };

        const styleAvatar = {
            transform: [
                { translateY: Animated.add(Animated.divide(this.state.scrollY, 2), avatarTranslateY) },
                { translateX: Animated.multiply(avatarTranslateX, screenDim.width) },
                { scale: avatarScale }
            ]
        };
        const styleParallax2_5 = { transform: [{ translateY: Animated.divide(this.state.scrollY, 5) }] };

        return (
            <ScrollView ref={this.refScrollView} style={styles.page} onScroll={this.handleScroll}>
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

                {/** PageHeader: Editor Avatar */}
                <Animated.View style={[styles.editorAvatarHeader, uiEditorAvatarOpacity]} pointerEvents='none'>
                    <PageHeader
                        style={styles.pageHeader}
                        title={lang['title-edit-avatar']}
                        onBackPress={this.closeInventory}
                        // Fake settings button to align with main header
                        secondaryIcon='settings-outline'
                        secondaryIconColor='transparent'
                        onSecondaryIconPress={() => {}}
                    />
                </Animated.View>

                {/** Statistics */}
                <Animated.View style={[styles.statsView, styleParallax2_5, uiOpacity]}>
                    <FlatList
                        style={styles.statsFlatList}
                        data={experienceStats}
                        renderItem={StatsBar}
                        keyExtractor={(item) => `user-stat-${item.statKey}`}
                        scrollEnabled={false}
                    />
                </Animated.View>

                {/* Avatar Frame */}
                <Animated.View style={[styles.avatarContainer, styleAvatar]}>
                    <AvatarFrame
                        width={screenDim.width * 2}
                        height={screenDim.width * 2}
                        // style={{ transform: [{ translateX: screenDim.width * 0.25 }] }}
                        backgroundColor='#00000000'
                    >
                        <AvatarCharacter
                            body={'human_00'}
                            // bodyColor={'#f3e4d1'}
                            position={{ x: 0, y: 0, z: 0 }}
                            rotation={{ x: 0, y: 0, z: 0 }}
                            scale={1}
                            items={[
                                { id: 'face_00' },
                                { id: 'hair_00' },
                                { id: 'top_00' },
                                { id: 'bottom_00' },
                                { id: 'shoes_00' }
                            ]}
                        />
                    </AvatarFrame>
                </Animated.View>

                {/** Buttons */}
                <Animated.View style={[styles.buttons, uiOpacity]}>
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
