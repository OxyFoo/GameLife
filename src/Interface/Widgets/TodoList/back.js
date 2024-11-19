import React from 'react';
import { Animated } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';

import { MinMax } from 'Utils/Functions';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {import('Types/Data/User/Todos').Todo} Todo
 *
 * @typedef {Object} TodoListPropsType
 * @property {StyleProp} style Style of todoes container
 * @property {(enabled: boolean) => void} changeScrollable Change scrollable state
 */

/** @type {TodoListPropsType} */
const TodoListProps = {
    style: {},
    changeScrollable: () => {}
};

class BackTodoList extends React.Component {
    state = {
        /** @type {Todo[]} */
        todoes: [],

        /** @type {Todo | null} Used to manage selected todo */
        draggedItem: null,

        mouseY: new Animated.Value(0)
    };

    /** @type {number[]} */
    initialSort = [];

    firstPageY = 0;
    selectedIndex = 0;
    containerHeight = 0;
    itemHeight = 46;

    /** @param {any} props */
    constructor(props) {
        super(props);

        this.state.todoes = user.todos.Get();
        this.listenerTodo = user.todos.todos.AddListener((todos) => {
            this.setState({ todoes: [...todos] });
        });
    }

    componentWillUnmount() {
        user.todos.todos.RemoveListener(this.listenerTodo);
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        this.containerHeight = height;
    };

    /** @param {LayoutChangeEvent} event */
    onLayoutItem = (event) => {
        const { height } = event.nativeEvent.layout;
        this.itemHeight = height + styles.todoButton.marginBottom;
    };

    /** @param {Todo} item */
    keyExtractor = (item) => 'todo-' + [item.title, ...item.created.toString(), ...item.deadline.toString()].join('-');

    /** @param {Todo} todo */
    onTodoCheck = async (todo) => {
        if (todo.checked !== 0) {
            user.todos.Uncheck(todo);
        } else {
            user.todos.Check(todo);
        }
        await user.GlobalSave();
    };

    /**
     * @param {Todo} todo
     * @param {(cancelback: (cancel: () => void) => void) => void} callbackRemove
     */
    onTodoRemove = (todo, callbackRemove) => {
        // Remove todo
        callbackRemove((cancel) => {
            const success = user.todos.Remove(todo) === 'removed';
            if (!success) {
                cancel();
                return;
            }

            this.setState({ todoes: [...user.todos.Get()] });
            user.GlobalSave();
        });
    };

    /** @param {Todo} item */
    onDrag = (item) => {
        this.props.changeScrollable(false);
        this.setState({ draggedItem: item });

        this.selectedIndex = user.todos.Get().indexOf(item);
        const initY = this.selectedIndex * this.itemHeight;
        this.state.mouseY.setValue(initY);
    };

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        const { pageY } = event.nativeEvent;
        this.initialSort = [...user.todos.GetSort()];
        this.firstPageY = pageY;
    };

    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        const { draggedItem } = this.state;
        const { pageY } = event.nativeEvent;

        if (draggedItem === null) {
            return;
        }

        // Move todo selection
        const deltaY = pageY - this.firstPageY;
        const relativeY = this.selectedIndex * this.itemHeight;
        const newY = MinMax(0, deltaY + relativeY, this.containerHeight - this.itemHeight);
        this.state.mouseY.setValue(newY);

        // Change todo order when dragging
        const index = Math.floor((newY + this.itemHeight / 2) / this.itemHeight);
        const currIndex = user.todos.GetSort().indexOf(draggedItem.created);
        index !== currIndex && user.todos.Move(draggedItem, index);
    };

    /** @param {GestureResponderEvent} _event */
    onTouchEnd = (_event) => {
        // Dragging ended & save new todoes order
        this.props.changeScrollable(true);
        this.setState({ draggedItem: null });

        // Save changes if todoes order changed (and not just a todo check)
        const sort = user.todos.GetSort();
        if (this.initialSort.join() !== sort.join() && this.initialSort.length === sort.length) {
            user.GlobalSave();
        }
    };
}

BackTodoList.prototype.props = TodoListProps;
BackTodoList.defaultProps = TodoListProps;

export default BackTodoList;
