import React from 'react';
import { FlatList } from 'react-native';

import styles from './style';
import BackQuestsList from './back';
import QuestElement from './Elements/quest';
import TaskElement from './Elements/tasks';
import QuestSelection from './Elements/questSelection';

import langManager from 'Managers/LangManager';

import { Container, Button, Text, Separator } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('Interface/Components/Icon').Icons} Icons
 */

const QuestsProps = {
    /** @type {StyleProp} Style of quests container */
    style: {}
};

class QuestsList extends BackQuestsList {
    static QuestElement = QuestElement;
    static TaskElement = TaskElement;

    renderItem = ({ item }) => {
        const { draggedItem } = this.state;

        const styleOpacity = { opacity: 1 };
        if (draggedItem !== null && item.Title === draggedItem.Title) {
            styleOpacity.opacity = .25;
        }

        return (
            <QuestElement
                style={styleOpacity}
                quest={item}
                //onDrag={() => this.onDrag(item)}
            />
        );
    }

    renderEmpty = () => {
        const lang = langManager.curr['quests'];

        return (
            <>
                <Text style={styles.emptyText}>{lang['quests-empty-title']}</Text>
                <Button onPress={this.addQuest} color='main1'>{lang['quests-empty-button']}</Button>
            </>
        );
    }

    render() {
        const lang = langManager.curr['quests'];
        const {
            scrollable, quests,
            draggedItem, mouseY,
            undoEnabled
        } = this.state;

        /** @type {Icons} */
        const containerIcon = undoEnabled ? 'undo' : 'addSquare';
        const containerAction = undoEnabled ? this.undo : this.addQuest;

        return (
            <Container
                style={this.props.style}
                styleContainer={styles.questsContainer}
                type='static'
                text={lang['container-title']}
                icon={containerIcon}
                onIconPress={containerAction}
            >
                <QuestSelection
                    draggedItem={draggedItem}
                    mouseY={mouseY}
                />

                <FlatList
                    ref={ref => this.refFlatlist = ref}

                    onScroll={this.onScroll}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}

                    data={quests}
                    scrollEnabled={scrollable}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    ListEmptyComponent={this.renderEmpty}
                    ItemSeparatorComponent={() => <Separator.Horizontal color='backgroundTransparent' style={{ width: 'auto', height: 1.5, marginHorizontal: 12, opacity: .5 }} />}
                />
            </Container>
        );
    }
}

QuestsList.prototype.props = QuestsProps;
QuestsList.defaultProps = QuestsProps;

export default QuestsList;
