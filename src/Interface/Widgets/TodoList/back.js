import React from 'react';
import { Animated } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { GetGlobalTime } from 'Utils/Time';
import { MinMax } from 'Utils/Functions';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {import('Class/Todoes').Todo} Todo
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

        this.state.todoes = user.todoes.Get();
        this.listenerTodo = user.todoes.allTodoes.AddListener(this.refreshTodoes);
    }

    refreshTodoes = () => {
        this.setState({ todoes: user.todoes.Get() });
    };

    componentWillUnmount() {
        user.todoes.allTodoes.RemoveListener(this.listenerTodo);
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

    /**
     * Add a new todo to the list and open the todo page\
     * Max 8 todoes
     */
    addTodo = () => {
        if (this.state.todoes.length >= 8) {
            const title = langManager.curr['todoes']['alert-todoeslimit-title'];
            const message = langManager.curr['todoes']['alert-todoeslimit-message'];
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title, message }
            });
            return;
        }

        user.interface.ChangePage('todo', { storeInHistory: false });
    };

    /** @param {Todo} todo */
    onTodoCheck = (todo) => {
        if (todo.checked !== 0) {
            user.todoes.Uncheck(todo);
        } else {
            user.todoes.Check(todo, GetGlobalTime());
        }
        user.GlobalSave();
    };

    /**
     * @param {Todo} todo
     * @param {(cancelback: (cancel: () => void) => void) => void} callbackRemove
     */
    onTodoRemove = (todo, callbackRemove) => {
        // Remove todo
        callbackRemove((cancel) => {
            const success = user.todoes.Remove(todo) === 'removed';
            if (!success) {
                cancel();
                return;
            }

            this.setState({ todoes: [...user.todoes.Get()] });
            user.GlobalSave();
        });
    };

    /** @param {Todo} item */
    onDrag = (item) => {
        this.props.changeScrollable(false);
        this.setState({ draggedItem: item });

        this.selectedIndex = user.todoes.Get().indexOf(item);
        const initY = this.selectedIndex * this.itemHeight;
        this.state.mouseY.setValue(initY);
    };

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        const { pageY } = event.nativeEvent;
        this.initialSort = [...user.todoes.sort];
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
        const currIndex = user.todoes.sort.indexOf(draggedItem.created);
        index !== currIndex && user.todoes.Move(draggedItem, index);
    };

    /** @param {GestureResponderEvent} _event */
    onTouchEnd = (_event) => {
        // Dragging ended & save new todoes order
        this.props.changeScrollable(true);
        this.setState({ draggedItem: null });

        // Save changes if todoes order changed (and not just a todo check)
        if (
            this.initialSort.join() !== user.todoes.sort.join() &&
            this.initialSort.length === user.todoes.sort.length
        ) {
            user.GlobalSave();
        }
    };
}

BackTodoList.prototype.props = TodoListProps;
BackTodoList.defaultProps = TodoListProps;

export default BackTodoList;
