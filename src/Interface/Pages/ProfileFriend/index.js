import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackProfileFriend from './back';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Page, Text, Button, XPBar, Frame, KPI } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';
import { Round } from 'Utils/Functions';

class ProfileFriend extends BackProfileFriend {
    render() {
        const lang = langManager.curr['profile-friend'];
        const langDates = langManager.curr['dates']['names'];

        const { friend, xpInfo, activities } = this.state;

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
            <Page ref={ref => this.refPage = ref}>
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

                {/** KPI */}
                {this.state.friend.friendshipState === 'accepted' && (
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

                {/** Actions */}
                {this.renderAction()}
            </Page>
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
