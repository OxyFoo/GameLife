import * as React from 'react';
import { Animated, View, FlatList } from 'react-native';

import styles from './style';
import BackQuests from './back';
import langManager from 'Managers/LangManager';

import { Button } from 'Interface/Components';
import { PageHeader, MyQuestsList } from 'Interface/Widgets';

/**
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 * @typedef {import('react-native').ListRenderItem<MyQuest>} ListRenderItemMyQuest
 */

class Quests extends BackQuests {
    render() {
        const lang = langManager.curr['quests'];
        const { quests, scrollable, draggedItem, mouseY } = this.state;

        const translate = {
            transform: [{ translateY: mouseY }]
        };

        return (
            <View style={styles.page}>
                <PageHeader title={lang['container-title']} onBackPress={this.onBackPress} />

                <View>
                    {draggedItem && (
                        <Animated.View style={[styles.selection, translate]}>
                            <MyQuestsList.Button style={styles.selectionQuest} quest={draggedItem} />
                        </Animated.View>
                    )}

                    <FlatList
                        data={quests}
                        extraData={draggedItem}
                        onLayout={this.onLayout}
                        onTouchStart={this.onTouchStart}
                        onTouchMove={this.onTouchMove}
                        onTouchEnd={this.onTouchEnd}
                        onTouchCancel={this.onTouchEnd}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                        ListFooterComponent={this.renderAddQuest}
                        scrollEnabled={scrollable}
                    />
                </View>
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

        return (
            <MyQuestsList.Button
                style={[styles.questItem, styleOpacity]}
                onLayout={this.onLayoutItem}
                quest={item}
                onDrag={this.onDrag}
            />
        );
    };

    renderAddQuest = () => {
        return <Button onPress={this.addQuest}>[Add activity]</Button>;
    };
}

export default Quests;
