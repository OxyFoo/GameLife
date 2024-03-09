import React from 'react';
import { FlatList } from 'react-native';

import styles from './style';
import BackTodoList from './back';
import TodoElement from './Elements/todo';
import TaskElement from './Elements/taskElement';
import TodoSelection from './Elements/todoSelection';

import langManager from 'Managers/LangManager';

import { Container, Button, Text } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Class/Todoes').Todo} Todo
 * @typedef {import('Interface/Components/Icon').Icons} Icons
 */

const TodoListProps = {
    /** @type {StyleProp} Style of todoes container */
    style: {}
};

class TodoList extends BackTodoList {
    static TodoElement = TodoElement;
    static TaskElement = TaskElement;

    /** @param {{ item: Todo }} param0 */
    renderItem = ({ item }) => {
        const { draggedItem } = this.state;

        const styleOpacity = { opacity: 1 };
        if (draggedItem !== null && item.title === draggedItem.title) {
            styleOpacity.opacity = .25;
        }

        return (
            <TodoElement
                style={styleOpacity}
                todo={item}
                onCheck={this.onTodoCheck}
                onRemove={this.onTodoRemove}
                onDrag={() => this.onDrag(item)}
            />
        );
    }

    renderEmpty = () => {
        const lang = langManager.curr['todoes'];

        return (
            <>
                <Text style={styles.emptyText}>
                    {lang['todoes-empty-title']}
                </Text>
                <Button style={styles.emptyButton} onPress={this.addTodo} color='main1' colorNextGen>
                    {lang['todoes-empty-button']}
                </Button>
            </>
        );
    }

    render() {
        const lang = langManager.curr['todoes'];
        const {
            scrollable, todoes,
            draggedItem, mouseY,
            undoEnabled
        } = this.state;

        /** @type {Icons} */
        const containerIcon = undoEnabled ? 'undo' : 'add';
        const containerAction = undoEnabled ? this.undo : this.addTodo;

        return (
            <Container
                style={this.props.style}
                styleContainer={styles.todoesContainer}
                type='static'
                icon={containerIcon}
                text={lang['container-title']}
                onIconPress={containerAction}
                colorNextGen
            >
                <TodoSelection
                    draggedItem={draggedItem}
                    mouseY={mouseY}
                />

                <FlatList
                    ref={ref => this.refFlatlist = ref}

                    onScroll={this.onScroll}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}

                    data={todoes}
                    scrollEnabled={scrollable}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    ListEmptyComponent={this.renderEmpty}
                />
            </Container>
        );
    }
}

TodoList.prototype.props = TodoListProps;
TodoList.defaultProps = TodoListProps;

export default TodoList;
