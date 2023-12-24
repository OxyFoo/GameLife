import React from 'react';
import { FlatList } from 'react-native';

import styles from './style';
import BackQuestsList from './back';
import QuestElement from './Elements/quest';
import QuestSelection from './Elements/questSelection';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Container, Button, Text, Separator } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Class/Shop').Icons} Icons
 */

const QuestsProps = {
    /** @type {StyleProp} Style of quests container */
    style: {}
};

class MyQuestsList extends BackQuestsList {
    static QuestElement = QuestElement;

    renderItem = ({ item }) => {
        const { draggedItem } = this.state;

        const styleOpacity = { opacity: 1 };
        if (draggedItem !== null && item.Title === draggedItem.title) {
            styleOpacity.opacity = .25;
        }

        return (
            <QuestElement
                style={styleOpacity}
                quest={item}
                onDrag={() => this.onDrag(item)}
            />
        );
    }

    renderEmpty = () => {
        const lang = langManager.curr['quests'];

        return (
            <>
                <Text style={styles.emptyText}>
                    {lang['quests-empty-title']}
                </Text>
                <Button onPress={this.addQuest} color='main1' colorNextGen>
                    {lang['quests-empty-button']}
                </Button>
            </>
        );
    }

    renderSeparator = () => (
        <Separator.Horizontal
            color='backgroundTransparent'
            style={styles.separator}
        />
    )

    render() {
        const lang = langManager.curr['quests'];
        const { scrollable, quests, draggedItem, mouseY } = this.state;

        /** @type {Icons | null} */
        let icon = null;
        let iconPress = null;
        if (!user.quests.myquests.IsMax()) {
            icon = 'addSquare';
            iconPress = this.addQuest;
        }

        return (
            <Container
                style={this.props.style}
                styleContainer={styles.questsContainer}
                type='static'
                text={lang['container-title']}
                icon={icon}
                onIconPress={iconPress}
                colorNextGen
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
                    ItemSeparatorComponent={this.renderSeparator}
                />
            </Container>
        );
    }
}

MyQuestsList.prototype.props = QuestsProps;
MyQuestsList.defaultProps = QuestsProps;

export default MyQuestsList;
