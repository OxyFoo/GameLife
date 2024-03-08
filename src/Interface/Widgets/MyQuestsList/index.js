import React from 'react';
import { View, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import BackQuestsList from './back';
import StartHelp from './help';
import QuestElement from './Elements/quest';
import QuestSelection from './Elements/questSelection';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { SimpleContainer, Button, Text, Separator, Icon } from 'Interface/Components';

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

    renderHeader = () => {
        const lang = langManager.curr['quests'];
        const titleColors = ['#384065', '#B83EFFE3'];

        /** @type {Icons | null} */
        let icon = null;
        let onPress = null;
        if (!user.quests.myquests.IsMax()) {
            icon = 'addSquare';
            onPress = this.addQuest;
        }

        return (
            <LinearGradient
                colors={titleColors}
                start={{ x: 0, y: -2 }} end={{ x: 1, y: 2 }}
                style={styles.headerStyle}
            >
                <View style={styles.buttonInfo}>
                    <Button
                        style={styles.headerButtonLeft}
                        onPress={StartHelp.bind(this)}
                    >
                        <Icon
                            containerStyle={styles.iconStaticHeader}
                            icon={'info'}
                            size={24}
                        />
                    </Button>
                    <Text color={'primary'}>
                        {lang['container-title']}
                    </Text>
                </View>
                {icon !== null && (
                    <Button
                        ref={ref => this.refAddQuest = ref}
                        onPress={onPress}
                        style={styles.headerButtonRight}
                    >
                        <Icon
                            containerStyle={styles.iconStaticHeader}
                            icon={icon}
                            size={24}
                            angle={180}
                        />
                    </Button>
                )}
            </LinearGradient>
        );
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
                <View style={styles.emptyButtonContainer}>
                    <Button
                        style={styles.emptyButton}
                        color='main1'
                        onPress={this.addQuest}
                        colorNextGen
                    >
                        {lang['quests-empty-button']}
                    </Button>
                </View>
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

        return (
            <SimpleContainer
                ref={ref => this.refContainer = ref}
                style={this.props.style}
            >
                <SimpleContainer.Header>
                    {this.renderHeader()}
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
                </SimpleContainer.Body>
            </SimpleContainer>
        );
    }
}

MyQuestsList.prototype.props = QuestsProps;
MyQuestsList.defaultProps = QuestsProps;

export default MyQuestsList;
