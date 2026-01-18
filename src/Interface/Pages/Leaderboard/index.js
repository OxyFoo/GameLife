import * as React from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';

import styles from './style';
import BackLeaderboard from './back';
import { RankElement } from './element';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { InputText, Text } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

/**
 * @typedef {import('@oxyfoo/gamelife-types').LeaderboardPeriodType} LeaderboardPeriodType
 */

/** @type {LeaderboardPeriodType[]} */
const PERIOD_TYPES = ['weekly', 'monthly', 'yearly'];

class Leaderboard extends BackLeaderboard {
    render() {
        const lang = langManager.curr['leaderboard'];
        const { loadingState, search, selfPlayer, periodType } = this.state;

        const filteredPlayers = this.getFilteredPlayers();

        return (
            <View style={styles.page}>
                <PageHeader style={styles.header} title={lang['title']} onBackPress={this.Back} />

                <Text style={styles.sectionTitle} color='border'>
                    {lang['title-general']}
                </Text>

                <View style={styles.periodSelectorContainer}>
                    {PERIOD_TYPES.map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.periodButton,
                                {
                                    backgroundColor: themeManager.GetColor(type === periodType ? 'main1' : 'darkBlue')
                                }
                            ]}
                            onPress={() => this.onChangePeriodType(type)}
                        >
                            <Text color={type === periodType ? 'white' : 'secondary'}>
                                {lang[`period-${type}`] || type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.searchContainer}>
                    <InputText.Thin
                        style={styles.inputSearch}
                        placeholder={lang['input-label-search']}
                        value={search}
                        onChangeText={this.onChangeSearch}
                    />
                </View>

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
            </View>
        );
    }
}

export default Leaderboard;
