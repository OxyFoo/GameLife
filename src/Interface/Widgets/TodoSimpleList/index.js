import React from 'react';
import { FlatList } from 'react-native';

import styles from './style';
import BackTodoSimpleList from './back';

import langManager from 'Managers/LangManager';

import { Button, TodoButton } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').ListRenderItem<Todo>} ListRenderItemTodo
 *
 * @typedef {import('Class/Todoes').Todo} Todo
 *
 * @typedef {Object} TodoListPropsType
 * @prop {StyleProp} style
 */

/** @type {TodoListPropsType} */
const TodoListProps = {
    style: {}
};

class TodoSimpleList extends BackTodoSimpleList {
    render() {
        const { todoes } = this.state;

        return (
            <FlatList
                data={todoes}
                scrollEnabled={false}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                ListFooterComponent={this.renderFooter}
            />
        );
    }

    /** @type {ListRenderItemTodo} */
    renderItem = ({ item }) => {
        return <TodoButton style={styles.todo} todo={item} onCheck={this.onTodoCheck} onRemove={this.onTodoRemove} />;
    };

    renderFooter = () => {
        const lang = langManager.curr['todoes'];

        return (
            <Button style={styles.addTodo} appearance='outline' onPress={this.addTodo}>
                {lang['button-all-todoes']}
            </Button>
        );
    };
}

TodoSimpleList.prototype.props = TodoListProps;
TodoSimpleList.defaultProps = TodoListProps;

export { TodoSimpleList };
