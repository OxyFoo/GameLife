import React from 'react';
import { FlatList } from 'react-native';

import styles from './style';
import BackQuestsList from './back';

import langManager from 'Managers/LangManager';

import { Button, QuestButton } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 * @typedef {import('react-native').ListRenderItem<MyQuest>} ListRenderItemMyQuest
 */

const QuestsProps = {
    /** @type {StyleProp} */
    style: {}
};

class MyQuestsSimpleList extends BackQuestsList {
    render() {
        const { quests } = this.state;

        return (
            <FlatList
                data={quests}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                ListFooterComponent={this.renderFooter}
                scrollEnabled={false}
            />
        );
    }

    /** @type {ListRenderItemMyQuest} */
    renderItem = ({ item }) => {
        return <QuestButton style={styles.quest} quest={item} />;
    };

    renderFooter = () => {
        const lang = langManager.curr['quests'];

        return (
            <Button style={styles.addQuestButtonBig} appearance='outline' onPress={this.addQuest}>
                {lang['button-all-quests']}
            </Button>
        );
    };
}

MyQuestsSimpleList.prototype.props = QuestsProps;
MyQuestsSimpleList.defaultProps = QuestsProps;

export { MyQuestsSimpleList };
