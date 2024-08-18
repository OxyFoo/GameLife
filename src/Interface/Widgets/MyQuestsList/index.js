import React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import BackQuestsList from './back';
import { MyQuestButton } from './Button';

import langManager from 'Managers/LangManager';

import { Button } from 'Interface/Components';

/**
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 * @typedef {import('react-native').ListRenderItem<MyQuest>} ListRenderItemMyQuest
 */

class MyQuestsList extends BackQuestsList {
    static Button = MyQuestButton;

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

    /** @type {ListRenderItemMyQuest} */
    renderItem = ({ item }) => {
        return <MyQuestButton style={styles.questItem} quest={item} enableQuickAdd />;
    };

    renderFooter = () => {
        const lang = langManager.curr['quests'];

        return (
            <Button style={styles.buttonOpenQuest} appearance='outline' onPress={this.openMyQuests}>
                {lang['button-all-quests']}
            </Button>
        );
    };
}

export { MyQuestsList };
