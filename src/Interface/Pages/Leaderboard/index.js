// TODO: This page is unused, remove it ?

import * as React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import BackLeaderboard from './back';
import { RankElement } from './element';
import langManager from 'Managers/LangManager';

import { InputText, Button } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class Leaderboard extends BackLeaderboard {
    render() {
        const lang = langManager.curr['leaderboard'];
        const { search, sortIndex, selfData, playersData } = this.state;

        const sortType = Object.values(this.sortList)[sortIndex];

        return (
            <View>
                <PageHeader style={styles.header} onBackPress={this.Back} />

                <View style={styles.myRankContainer}>{selfData !== null && <RankElement item={selfData} />}</View>

                <View style={[styles.filter, styles.row]}>
                    <InputText
                        style={styles.inputSearch}
                        label={lang['input-label-search']}
                        value={search}
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
                    keyExtractor={(item) => `rank-id-${item.accountID}`}
                />
            </View>
        );
    }
}

export default Leaderboard;
