import * as React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import BackLeaderboard from './back';
import { RankElement } from './element';
import langManager from 'Managers/LangManager';

import { Page, Input, Button } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class Leaderboard extends BackLeaderboard {
    render() {
        const lang = langManager.curr['leaderboard'];
        const { search, sortIndex, playersData } = this.state;

        const sortType = Object.values(this.sortList)[sortIndex];
        const thisPlayer = playersData.find(player => player.accountID === 0);

        return (
            <Page ref={ref => this.refPage = ref} scrollable={false}>
                <PageHeader style={styles.header} onBackPress={this.Back} />

                <View style={styles.myRankContainer}>
                    {thisPlayer && (
                        <RankElement item={thisPlayer} />
                    )}
                </View>

                <View style={[styles.filter, styles.row]}>
                    <Input
                        style={styles.inputSearch}
                        label={lang['input-label-search']}
                        text={search}
                        onChangeText={this.onChangeSearch}
                    />
                    <Button
                        style={styles.buttonSortType}
                        borderRadius={8}
                        color='backgroundCard'
                        icon='filter'
                        onPress={this.onSwitchSort}
                    >
                        {sortType}
                    </Button>
                </View>

                <View style={styles.rankingList}>
                    <FlatList
                        data={playersData}
                        style={styles.flatlist}
                        renderItem={({ item }) => <RankElement item={item} />}
                        keyExtractor={item => `rank-id-${item.accountID}`}
                    />
                </View>
            </Page>
        );
    }
}

export default Leaderboard;
