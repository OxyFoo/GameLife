import * as React from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import BackProfileFriend from './back';
import user from 'Managers/UserManager';
import { BODY_COLORS } from 'Interface/Pages/Profile/AvatarEditor/avatarConstants';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import Inventory from 'Data/User/Inventory';
import { Container, Text, Button, KPI, ProgressBar } from 'Interface/Components';
import { AchievementsGroup, StatsBarTextOnly } from 'Interface/Widgets';
import { Round } from 'Utils/Functions';

class ProfileFriend extends BackProfileFriend {
    render() {
        const lang = langManager.curr['profile-friend'];
        const langDates = langManager.curr['dates']['names'];

        const { friend, xpInfo, statsInfo, activities } = this.state;

        if (friend === null || xpInfo === null) {
            return null;
        }

        const username = friend.username;
        const title = friend.title !== 0 ? dataManager.titles.GetByID(friend.title) : null;
        const titleText = title === null ? null : langManager.GetText(title.Name);

        const avatarItems = Inventory.GetFriendAvatarItems(friend);
        const avatarBody = friend.avatar?.Skin || 'human_00';
        const avatarBodyColor = BODY_COLORS[friend.avatar?.SkinColor] || BODY_COLORS[0];
        const containerSize = dataManager.items.GetContainerSize('profile');

        return (
            <ScrollView
                ref={user.interface.bottomPanel?.mover.SetScrollView}
                style={styles.page}
                onLayout={user.interface.bottomPanel?.mover.onLayoutFlatList}
                onContentSizeChange={user.interface.bottomPanel?.mover.onContentSizeChange}
                scrollEnabled={false}
            >
                {/** User Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <AvatarFrame width={84} height={84} renderScale={2} backgroundColor='#00000000'>
                            <AvatarCharacter
                                body={avatarBody}
                                bodyColor={avatarBodyColor}
                                position={containerSize.pos}
                                scale={containerSize.scale}
                                items={avatarItems}
                                portraitMode
                            />
                        </AvatarFrame>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.usernameContainer}>
                            <Text style={styles.username} color='primary'>
                                {username}
                            </Text>
                        </View>

                        {titleText !== null && (
                            <Text style={styles.title} color='secondary'>
                                {titleText}
                            </Text>
                        )}
                    </View>
                </View>

                {/** XP Bar */}
                <View style={styles.botSpace}>
                    <View style={styles.xpRow}>
                        <Text>{langManager.curr['level']['level'] + ' ' + xpInfo.lvl}</Text>
                        <Text>{Round(xpInfo.xp) + '/' + xpInfo.next}</Text>
                    </View>
                    <ProgressBar value={xpInfo.xp} maxValue={xpInfo.next} />
                </View>

                {/** Current activity */}
                {this.renderCurrentActivity()}

                {/** KPI */}
                {friend.friendshipState === 'accepted' && (
                    <View style={styles.kpiContainer}>
                        <KPI
                            style={styles.kpiProfile}
                            title={lang['row-since']}
                            value={`${activities.totalDays} ${langDates['day-min']}`}
                        />
                        <KPI
                            style={styles.kpiProfile}
                            containerStyle={styles.kpiProfileMiddle}
                            title={lang['row-activities']}
                            value={activities.activitiesLength}
                        />
                        <KPI
                            style={styles.kpiProfile}
                            title={lang['row-time']}
                            value={`${activities.durationHours} ${langDates['hours-min']}`}
                        />
                    </View>
                )}

                {/* Stats */}
                {friend.friendshipState === 'accepted' && (
                    <Container
                        text={lang['container-stats-title']}
                        style={styles.topSpace}
                        styleContainer={styles.statsContainer}
                        type='rollable'
                        opened={friend.accountID === 0}
                        backgroundColor='dataBigKpi'
                    >
                        <FlatList
                            data={statsInfo}
                            renderItem={StatsBarTextOnly}
                            keyExtractor={(item) => `stat-${item.statKey}`}
                            numColumns={2}
                            scrollEnabled={false}
                            nestedScrollEnabled={false}
                        />
                    </Container>
                )}

                {/** Achievements */}
                {friend.friendshipState === 'accepted' && friend.accountID !== 0 && (
                    <Container
                        style={styles.topSpace}
                        text={lang['container-achievements-title']}
                        type='rollable'
                        opened={true}
                        backgroundColor='dataBigKpi'
                    >
                        <AchievementsGroup friend={friend} />
                    </Container>
                )}

                {/** Actions */}
                {friend.accountID !== 0 && <View style={styles.botSpace}>{this.renderAction()}</View>}
            </ScrollView>
        );
    }

    renderCurrentActivity = () => {
        const lang = langManager.curr['profile-friend'];
        const { friend } = this.state;

        if (!friend || friend.friendshipState !== 'accepted' || friend.currentActivity === null) {
            return null;
        }

        const skill = dataManager.skills.GetByID(friend.currentActivity.skillID);
        if (skill === null) {
            return null;
        }

        const skillName = langManager.GetText(skill.Name);
        const titleCurrentActivity = lang['activity-now-title'].replace('{}', skillName);

        return (
            <View style={styles.startNowContainer}>
                <Text>{titleCurrentActivity}</Text>
                <Button style={styles.startNowButton} color='main1' onPress={this.handleStartNow}>
                    <Text fontSize={16}>{lang['activity-now-start']}</Text>
                </Button>
            </View>
        );
    };

    renderAction = () => {
        const lang = langManager.curr['profile-friend'];
        const { friend } = this.state;

        if (friend === null) {
            return null;
        }

        // Remove friend button
        if (friend.friendshipState === 'accepted') {
            return (
                <Button style={styles.topSpace} color='danger' onPress={this.removeFriendHandler}>
                    {lang['button-remove']}
                </Button>
            );
        }

        // Cancel request button
        else if (friend.friendshipState === 'pending') {
            return (
                <Button style={styles.topSpace} color='main1' onPress={this.cancelFriendHandler}>
                    {lang['button-cancel']}
                </Button>
            );
        }

        // Unblock button
        else if (friend.friendshipState === 'blocked') {
            return (
                <Button style={styles.topSpace} color='main1' onPress={this.unblockFriendHandler}>
                    {lang['button-unblock']}
                </Button>
            );
        }

        // Default: Add friend button
        return null; // TODO
    };
}

export default ProfileFriend;
