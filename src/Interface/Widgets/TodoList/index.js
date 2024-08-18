import React from 'react';
import { Animated, View, FlatList } from 'react-native';

import styles from './style';
import BackTodoList from './back';
import { TodoButton } from './Button';

import langManager from 'Managers/LangManager';

import { Button, Text } from 'Interface/Components';

/**
 * @typedef {import('Class/Todoes').Todo} Todo
 */

class TodoList extends BackTodoList {
    static Button = TodoButton;

    render() {
        const { style } = this.props;
        const { todoes, draggedItem, mouseY } = this.state;

        return (
            <View style={style}>
                {draggedItem !== null && (
                    <Animated.View
                        style={[styles.selection, { transform: [{ translateY: mouseY }] }]}
                        pointerEvents='none'
                    >
                        <TodoButton style={styles.selectionTodo} todo={draggedItem} />
                    </Animated.View>
                )}

                <FlatList
                    data={todoes}
                    extraData={draggedItem}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    onLayout={this.onLayout}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}
                    onTouchCancel={this.onTouchEnd}
                    ListEmptyComponent={this.renderEmpty}
                    scrollEnabled={false}
                />
            </View>
        );
    }

    /** @param {{ item: Todo }} param0 */
    renderItem = ({ item }) => {
        const { draggedItem } = this.state;

        const styleOpacity = { opacity: 1 };
        if (draggedItem !== null && item.title === draggedItem.title) {
            styleOpacity.opacity = 0.25;
        }

        return (
            <TodoButton
                style={[styles.todoButton, styleOpacity]}
                onLayout={this.onLayoutItem}
                todo={item}
                onCheck={this.onTodoCheck}
                onRemove={this.onTodoRemove}
                onDrag={() => this.onDrag(item)}
            />
        );
    };

    renderEmpty = () => {
        const lang = langManager.curr['todoes'];

        return (
            <>
                <Text style={styles.emptyText}>{lang['todoes-empty-title']}</Text>
                <Button style={styles.emptyButton} onPress={this.addTodo} color='main1'>
                    {lang['todoes-empty-button']}
                </Button>
            </>
        );
    };
}

export { TodoList };
