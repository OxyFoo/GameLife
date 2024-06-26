import React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import BackQuestsList from './back';
//import QuestSelection from './Elements/questSelection';

import langManager from 'Managers/LangManager';

import { Button, QuestButton } from 'Interface/Components';

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

class MyQuestsAdvancedList extends BackQuestsList {
    render() {
        const { quests, draggedItem, mouseY } = this.state;

        return (
            <View>
                {/* <QuestSelection draggedItem={draggedItem} mouseY={mouseY} /> */}

                <FlatList
                    ref={this.refFlatlist}
                    onScroll={this.onScroll}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}
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
        const { draggedItem } = this.state;

        const styleOpacity = { opacity: 1 };
        if (draggedItem !== null && item.title === draggedItem.title) {
            styleOpacity.opacity = 0.25;
        }

        return <QuestButton style={[styles.quest, styleOpacity]} quest={item} onDrag={() => this.onDrag(item)} />;
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

MyQuestsAdvancedList.prototype.props = QuestsProps;
MyQuestsAdvancedList.defaultProps = QuestsProps;

export { MyQuestsAdvancedList };
