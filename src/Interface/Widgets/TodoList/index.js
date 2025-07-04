import React from 'react';
import { Animated, View, FlatList } from 'react-native';

import styles from './style';
import BackTodoList from './back';
import { TodoButton } from './Button';

import langManager from 'Managers/LangManager';

import { Text } from 'Interface/Components';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Todos').Todo} Todo
 */

class TodoList extends BackTodoList {
    static Button = TodoButton;

    render() {
        const { style } = this.props;
        const { todos, draggedItem, mouseY } = this.state;

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
                    data={todos}
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
        const lang = langManager.curr['todos'];

        return <Text style={styles.emptyText}>{lang['todos-empty-text']}</Text>;
    };
}

export { TodoList };
