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
        const { search, sortIndex, selfData, playersData } = this.state;

        const sortType = Object.values(this.sortList)[sortIndex];

        return (
            <Page ref={ref => this.refPage = ref} scrollable={false}>
                <PageHeader style={styles.header} onBackPress={this.Back} />

                <View style={styles.myRankContainer}>
                    {selfData !== null && (
                        <RankElement item={selfData} />
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

                <FlatList
                    data={playersData}
                    style={styles.flatlist}
                    renderItem={({ item }) => <RankElement item={item} />}
                    keyExtractor={item => `rank-id-${item.accountID}`}
                />
            </Page>
        );
    }
}

export default Leaderboard;
