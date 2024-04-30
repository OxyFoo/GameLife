import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackProfileFriend from './back';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Container, Text, Button, XPBar, Frame, KPI } from 'Interface/Components';
import { PageHeader, AchievementsGroup, StatsBars } from 'Interface/Widgets';
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

        const backgroundKpi = {
            backgroundColor: themeManager.GetColor('backgroundCard')
        };

        return (
            <View>
                <PageHeader
                    style={{ marginBottom: 12 }}
                    onBackPress={this.Back}
                />

                {/** User Header */}
                <View style={styles.header}>
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
                    <XPBar value={xpInfo.xp} maxValue={xpInfo.next} />
                </View>

                {/** Avatar */}
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Frame characters={[ this.character ]} loadingTime={300} />
                    </View>
                </View>

                {/** Current activity */}
                {this.renderCurrentActivity()}

                {/** KPI */}
                {friend.friendshipState === 'accepted' && (
                    <View style={styles.kpiContainer}>
                        <KPI
                            title={lang['row-since']}
                            value={activities.totalDays}
                            unit={langDates['day-min']}
                            style={[styles.kpiProfile, backgroundKpi]} />
                        <KPI
                            title={lang['row-activities']}
                            value={activities.activitiesLength}
                            style={[styles.kpiProfile, backgroundKpi]} />
                        <KPI
                            title={lang['row-time']}
                            value={activities.durationHours}
                            unit={langDates['hours-min']}
                            style={[styles.kpiProfile, backgroundKpi]}/>
                    </View>
                )}

                {/* Stats */}
                {friend.friendshipState === 'accepted' && (
                    <Container
                        text={lang['container-stats-title']}
                        style={styles.topSpace}
                        type='rollable'
                        opened={false}
                    >
                        <StatsBars data={statsInfo} />
                    </Container>
                )}

                {/** Achievements */}
                {friend.friendshipState === 'accepted' && (
                    <Container
                        style={styles.topSpace}
                        text={lang['container-achievements-title']}
                        type='static'
                        opened={true}
                        color='main1'
                        backgroundColor='backgroundCard'
                    >
                        <AchievementsGroup friend={friend} />
                    </Container>
                )}

                {/** Actions */}
                {this.renderAction()}
            </View>
        );
    }

    renderCurrentActivity = () => {
        const lang = langManager.curr['profile-friend'];
        const { friend } = this.state;

        if (friend.friendshipState !== 'accepted' || friend.currentActivity === null) {
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
                    <Text fontSize={16}>
                        {lang['activity-now-start']}
                    </Text>
                </Button>
            </View>
        );
    }

    renderAction = () => {
        const lang = langManager.curr['profile-friend'];
        const { friend } = this.state;

        // Remove friend button
        if (friend.friendshipState === 'accepted') {
            return (
                <Button
                    style={styles.topSpace}
                    color='danger'
                    onPress={this.removeFriendHandler}
                >
                    {lang['button-remove']}
                </Button>
            );
        }

        // Cancel request button
        else if (friend.friendshipState === 'pending') {
            return (
                <Button
                    style={styles.topSpace}
                    color='main1'
                    onPress={this.cancelFriendHandler}
                >
                    {lang['button-cancel']}
                </Button>
            );
        }

        // Unblock button
        else if (friend.friendshipState === 'blocked') {
            return null; // TODO
        }

        // Default: Add friend button
        return null; // TODO
    }
}

export default ProfileFriend;
