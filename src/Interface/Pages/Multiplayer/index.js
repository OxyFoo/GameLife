import * as React from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';

import styles from './style';
import BackMultiplayer from './back';
import { RankElement } from './element';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Gradient } from 'Interface/Primitives';
import { Button, Text, Icon } from 'Interface/Components';

/**
 * @typedef {import('@oxyfoo/gamelife-types').LeaderboardPeriodType} LeaderboardPeriodType
 */

/** @type {LeaderboardPeriodType[]} */
const PERIOD_TYPES = ['weekly', 'monthly', 'yearly'];

class Multiplayer extends BackMultiplayer {
    render() {
        const lang = langManager.curr['leaderboard'];
        const { loadingState, selfPlayer, periodType, filteredPlayers } = this.state;

        if (!user.server2.IsAuthenticated()) {
            return this.renderNoInternet();
        }

        return (
            <View style={styles.page}>
                <Text style={styles.sectionTitle} color='border'>
                    {lang['title']}
                </Text>

                <View style={styles.periodSelectorContainer}>
                    {PERIOD_TYPES.map((period) => (
                        <TouchableOpacity
                            key={period}
                            style={[
                                styles.periodButton,
                                {
                                    backgroundColor: themeManager.GetColor(period === periodType ? 'main1' : 'darkBlue')
                                }
                            ]}
                            onPress={() => this.onChangePeriodType(period)}
                        >
                            <Text color={period === periodType ? 'white' : 'secondary'}>
                                {lang[`period-${period}`] || period}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/*
                TODO | LATER : This will be usefull but later, for now it's not clean-ish, don't like it. 
                But i'm keeping the logic in the code - no need to remove. 
                <View style={styles.searchContainer}>
                    <InputText.Thin
                        style={styles.inputSearch}
                        placeholder={lang['input-label-search']}
                        value={this.state.search}
                        onChangeText={this.onChangeSearch}
                    />
                </View>
                */}

                {loadingState === 'loading' && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size='large' color={themeManager.GetColor('main1')} />
                    </View>
                )}

                {loadingState === 'error-connection' && (
                    <View style={styles.loadingContainer}>
                        <Text color='white'>{lang['error-connection']}</Text>
                    </View>
                )}

                {loadingState === 'error-server' && (
                    <View style={styles.loadingContainer}>
                        <Text color='white'>{lang['error-loading']}</Text>
                    </View>
                )}

                {loadingState === 'loaded' && (
                    <FlatList
                        style={styles.flatlist}
                        contentContainerStyle={styles.flatlistContent}
                        data={filteredPlayers}
                        renderItem={RankElement}
                        keyExtractor={(item) => `rank-id-${item.accountID}`}
                        ListFooterComponent={
                            selfPlayer !== null ? (
                                <View style={styles.selfContainer}>
                                    <RankElement item={selfPlayer} />
                                </View>
                            ) : null
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text color='secondary'>{lang['empty-list']}</Text>
                            </View>
                        }
                    />
                )}

                {/* Bottom part navigation */}
                <Gradient
                    containerStyle={styles.friendsButtonContainer}
                    angle={140}
                    colors={[
                        themeManager.GetColor('main1', { opacity: 0.45 }),
                        themeManager.GetColor('main1', { opacity: 0.12 })
                    ]}
                >
                    <Button
                        nativeRef={this.refFriendsButton}
                        style={styles.navButton}
                        appearance='uniform'
                        color='transparent'
                        fontColor='gradient'
                        icon='users'
                        onPress={this.goToFriends}
                    />
                </Gradient>
            </View>
        );
    }

    renderNoInternet = () => {
        const lang = langManager.curr['shop'];

        return (
            <View style={styles.noInternetContainer}>
                <Icon icon='no-wifi' size={100} />
                <Text fontSize={22}>{lang['internet-offline-title']}</Text>
                <Text fontSize={14} color='secondary' style={styles.noInternetSubtext}>
                    {lang['internet-offline-text']}
                </Text>
            </View>
        );
    };
}

export default Multiplayer;
