import React from 'react';
import { FlatList, View } from 'react-native';

import styles from './style';
import BackQuestsList from './back';
import StartHelp from './help';
import QuestElement from './Elements/quest';
import QuestSelection from './Elements/questSelection';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Container, SimpleContainer, Button, Text, Separator, Icon } from 'Interface/Components';

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

    /**
     * @param {Icons} icon
     * @param {() => void} onPress
     */
    renderHeader = (icon, onPress) => {
        const lang = langManager.curr['quests'];
        const headerStatic = (
            <Button
                style={styles.headerStyle}
                colorNextGen={true}
                rippleColor='transparent'
                borderRadius={8}
                pointerEvents='box-none'
            >
                <View style={styles.buttonInfo}>
                    <Icon
                        containerStyle={styles.iconStaticHeader}
                        icon={'info'}
                        size={24}
                        onPress={StartHelp.bind(this)}
                    />
                    <Text color={'primary'}>
                        {lang['container-title']}
                    </Text>
                </View>
                {icon !== null && (
                    <Icon
                        ref={ref => this.refAddQuest = ref}
                        containerStyle={styles.iconStaticHeader}
                        icon={icon}
                        size={24}
                        angle={180}
                        onPress={onPress}
                    />
                )}
            </Button>
        );
        return headerStatic
    }

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
        const { scrollable, quests, draggedItem, mouseY } = this.state;

        /** @type {Icons | null} */
        let icon = null;
        let iconPress = null;
        if (!user.quests.myquests.IsMax()) {
            icon = 'addSquare';
            iconPress = this.addQuest;
        }

        return (

            <SimpleContainer
                ref={ref => this.refContainer = ref}
                style={this.props.style}
                colorNextGen
            >
                <SimpleContainer.Header>
                    {this.renderHeader(icon, iconPress)}
                </SimpleContainer.Header>

                <SimpleContainer.Body>
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
                </SimpleContainer.Body >

            </SimpleContainer >
        );
    }
}

MyQuestsList.prototype.props = QuestsProps;
MyQuestsList.defaultProps = QuestsProps;

export default MyQuestsList;
