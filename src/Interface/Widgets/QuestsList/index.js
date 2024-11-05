import React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import BackQuestsList from './back';
import { QuestButton } from './Button';

import langManager from 'Managers/LangManager';

import { Button } from 'Interface/Components';

/**
 * @typedef {import('Types/Data/User/Quests').Quest} Quest
 * @typedef {import('react-native').ListRenderItem<Quest>} ListRenderItemQuest
 */

class QuestsList extends BackQuestsList {
    static Button = QuestButton;

    render() {
        const { style } = this.props;
        const { quests } = this.state;

        return (
            <View style={style}>
                <FlatList
                    data={quests}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    ListFooterComponent={this.renderFooter}
                    scrollEnabled={false}
                />
            </View>
        );
    }

    /** @type {ListRenderItemQuest} */
    renderItem = ({ item }) => {
        return <QuestButton style={styles.questItem} quest={item} enableQuickAdd />;
    };

    renderFooter = () => {
        const lang = langManager.curr['quests'];

        return (
            <Button style={styles.buttonOpenQuest} appearance='outline' onPress={this.openQuests}>
                {lang['button-all-quests']}
            </Button>
        );
    };
}

export { QuestsList };
