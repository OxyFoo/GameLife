import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import styles, { CONTENT_PADDING } from './style';
import BackRaids from './back';
import { RaidCard } from './RaidCard';
import { RaidBanner } from './RaidBanner';
import { Leaderboard } from './Sections/Leaderboard';
import { Friends } from './Sections/Friends';
import { Feed } from './Sections/Feed';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Icon, Tabs, Text } from 'Interface/Components';

class Raids extends BackRaids {
    render() {
        const lang = langManager.curr['raids'];
        const { tab, onlineState } = this.state;

        if (onlineState !== 'authenticated') {
            return this.renderNoInternet();
        }

        // The page draws under the header and under the status bar (feHeaderOverlay): it owns both
        // offsets the FlowEngine would normally apply, so the card lands where it belongs.
        const headerHeight = this.fe.userHeader?.state.height ?? 0;

        return (
            <View style={styles.page}>
                <RaidBanner />

                <SafeAreaInsetsContext.Consumer>
                    {(insets) => (
                        <ScrollView
                            style={styles.scrollview}
                            contentContainerStyle={[
                                styles.scrollContent,
                                {
                                    paddingTop: (insets?.top ?? 0) + headerHeight,
                                    paddingLeft: CONTENT_PADDING + (insets?.left ?? 0),
                                    paddingRight: CONTENT_PADDING + (insets?.right ?? 0)
                                }
                            ]}
                        >
                            <RaidCard
                                style={styles.card}
                                onPress={this.openDetails}
                                lastSeason={this.state.lastSeason}
                            />

                            <Tabs
                                style={styles.tabs}
                                texts={[lang['tab-rank'], lang['tab-friends'], lang['tab-feed']]}
                                value={tab}
                                onChangeValue={this.setTab}
                                refs={this.refTabs}
                            />

                            {tab === 0 && (
                                <Leaderboard
                                    state={this.state.leaderboardState}
                                    players={this.state.players}
                                    selfPlayer={this.state.selfPlayer}
                                    onInfoPress={this.openLeaderboardInfo}
                                    onRetry={this.fetchLeaderboard}
                                />
                            )}
                            {tab === 1 && <Friends />}
                            {tab === 2 && (
                                <Feed
                                    state={this.state.feedState}
                                    events={this.state.feed}
                                    onInfoPress={this.openFeedInfo}
                                    onRetry={this.fetchFeed}
                                />
                            )}
                        </ScrollView>
                    )}
                </SafeAreaInsetsContext.Consumer>

                {tab === 1 && (
                    <View style={styles.addFriendView}>
                        <Button
                            nativeRef={this.refAddFriendButton}
                            style={styles.addFriendButton}
                            gradientColors={[
                                themeManager.GetColor('main1', { opacity: 0.45 }),
                                themeManager.GetColor('main1', { opacity: 0.12 })
                            ]}
                            gradientColorsAngle={140}
                            icon='add'
                            fontColor='gradient'
                            onPress={this.onAddFriendPress}
                        />
                    </View>
                )}
            </View>
        );
    }

    renderNoInternet = () => {
        const lang = langManager.curr['shop'];

        // Same offsets as the main branch: with feHeaderOverlay both would sit over this
        const headerHeight = this.fe.userHeader?.state.height ?? 0;

        return (
            <View style={[styles.noInternetContainer, { paddingTop: headerHeight }]}>
                <Icon icon='no-wifi' size={100} />
                <Text fontSize={22}>{lang['internet-offline-title']}</Text>
                <Text fontSize={14} color='secondary' style={styles.noInternetSubtext}>
                    {lang['internet-offline-text']}
                </Text>
            </View>
        );
    };
}

export default Raids;
