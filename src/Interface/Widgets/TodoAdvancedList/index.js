import React from 'react';
import { FlatList } from 'react-native';

import styles from './style';
import BackTodoList from './back';
//import TodoSelection from './Elements/todoSelection';

import langManager from 'Managers/LangManager';

import { Button, Text, TodoButton } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Class/Todoes').Todo} Todo
 * @typedef {import('Ressources/Icons').IconsName} IconsName
 */

const TodoListProps = {
    /** @type {StyleProp} Style of todoes container */
    style: {}
};

class TodoAdvancedList extends BackTodoList {
    render() {
        const { todoes, draggedItem, mouseY } = this.state;

        return (
            <>
                {/* <TodoSelection draggedItem={draggedItem} mouseY={mouseY} /> */}

                <FlatList
                    ref={this.refFlatlist}
                    onScroll={this.onScroll}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}
                    data={todoes}
                    scrollEnabled={false}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    ListEmptyComponent={this.renderEmpty}
                />
            </>
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
                style={styleOpacity}
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

TodoAdvancedList.prototype.props = TodoListProps;
TodoAdvancedList.defaultProps = TodoListProps;

export { TodoAdvancedList };
