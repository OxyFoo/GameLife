import React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import BackQuestsList from './back';
import QuestElement from './Elements/quest';
import QuestSelection from './Elements/questSelection';

import langManager from 'Managers/LangManager';

import { Button, Text, Separator } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 * @typedef {import('react-native').ListRenderItem<MyQuest>} ListRenderItemMyQuest
 *
 * @typedef {import('Ressources/Icons').IconsName} IconsName
 */

const QuestsProps = {
    /** @type {StyleProp} Style of quests container */
    style: {}
};

class MyQuestsList extends BackQuestsList {
    static QuestElement = QuestElement;

    render() {
        const { scrollable, quests, draggedItem, mouseY } = this.state;

        return (
            <View>
                <QuestSelection draggedItem={draggedItem} mouseY={mouseY} />

                <FlatList
                    ref={(ref) => (this.refFlatlist = ref)}
                    onScroll={this.onScroll}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}
                    data={quests}
                    scrollEnabled={scrollable}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    ListEmptyComponent={this.renderEmpty}
                    ItemSeparatorComponent={this.renderSeparator}
                />
            </View>
        );
    }

    /** @type {ListRenderItemMyQuest} */
    renderItem = ({ item }) => {
        const { draggedItem } = this.state;

        const styleOpacity = { opacity: 1 };
        if (draggedItem !== null && item.Title === draggedItem.title) {
            styleOpacity.opacity = 0.25;
        }

        return <QuestElement style={styleOpacity} quest={item} onDrag={() => this.onDrag(item)} />;
    };

    renderEmpty = () => {
        const lang = langManager.curr['quests'];

        return (
            <>
                <Text style={styles.emptyText}>{lang['quests-empty-title']}</Text>
                <View style={styles.emptyButtonContainer}>
                    <Button style={styles.emptyButton} color='main1' onPress={this.addQuest} colorNextGen>
                        {lang['quests-empty-button']}
                    </Button>
                </View>
            </>
        );
    };

    renderSeparator = () => <Separator color='backgroundTransparent' style={styles.separator} />;
}

MyQuestsList.prototype.props = QuestsProps;
MyQuestsList.defaultProps = QuestsProps;

export default MyQuestsList;
