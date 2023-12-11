import React from 'react';
import { Animated, FlatList } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { GetTime } from 'Utils/Time';
import { MinMax } from 'Utils/Functions';
import { GetAbsolutePosition } from 'Utils/UI';
import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 * @typedef {import('react-native').NativeScrollEvent} NativeScrollEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * @typedef {import('react-native').NativeSyntheticEvent<NativeScrollEvent>} NativeSyntheticEvent
 * 
 * @typedef {import('Class/Todos').Todo} Todo
 */

class BackTodoList extends React.Component {
    state = {
        /** @type {Todo[]} */
        todos: [],

        /** @type {boolean} Used to disable scroll when dragging a todo */
        scrollable: true,

        /** @type {boolean} Used to enable/disable undo button */
        undoEnabled: false,

        /** @type {Todo | null} Used to manage selected todo */
        draggedItem: null,

        mouseY: new Animated.Value(0)
    }

    constructor(props) {
        super(props);

        /** @type {FlatList<Todo> | null} Used to manage todo sorting */
        this.refFlatlist = null;

        this.flatlist = {
            contentSizeHeight: 0,
            layoutMeasurementHeight: 0,
            contentOffsetY: 0,
        }

        /** @type {NodeJS.Timeout | null} */
        this.undoTimeout = null;

        /** @type {LayoutRectangle | null} */
        this.tmpLayoutContainer = null;

        this.state.todos = user.todos.Get();
        this.listenerTodo = user.todos.allTodos.AddListener(this.refreshTodos);
    }

    refreshTodos = () => {
        this.setState({ todos: user.todos.Get() });
    }

    componentWillUnmount() {
        user.todos.allTodos.RemoveListener(this.listenerTodo);
    }

    /** @param {Todo} item */
    keyExtractor = (item) => (
        'todo-' + [
            item.title,
            ...item.created.toString(),
            ...item.deadline.toString()
        ].join('-')
    )

    /**
     * Add a new todo to the list and open the todo page\
     * Max 8 todos
     */
    addTodo = () => {
        if (this.state.todos.length >= 8) {
            const title = langManager.curr['todos']['alert-todoslimit-title'];
            const text = langManager.curr['todos']['alert-todoslimit-text'];
            user.interface.popup.Open('ok', [title, text]);
            return;
        }

        user.interface.ChangePage('todo', undefined, true);
    }

    /** @param {Todo} todo */
    onTodoCheck = (todo) => {
        if (todo.checked !== 0) {
            user.todos.Uncheck(todo);
        } else {
            user.todos.Check(todo, GetTime());
        }
        user.GlobalSave();
    }

    /**
     * @param {Todo} todo
     * @param {(cancel: () => void) => void} callbackRemove
     */
    onTodoRemove = (todo, callbackRemove) => {
        // Close undo button after 10 seconds
        this.undoTimeout = setTimeout(() => {
            this.setState({ undoEnabled: false });
        }, 10 * 1000);

        // Remove todo
        callbackRemove((cancel) => {
            const success = user.todos.Remove(todo) === 'removed';
            if (!success) {
                cancel();
                return;
            }

            this.setState({
                todos: [ ...user.todos.Get() ],
                undoEnabled: true
            });
            user.GlobalSave();
        });
    }

    undo = () => {
        if (user.todos.lastDeletedTodo === null) {
            return;
        }

        // Close undo button
        clearTimeout(this.undoTimeout);

        this.setState({
            todos: [...user.todos.Get()],
            undoEnabled: false
        });

        user.todos.Undo();
        user.GlobalSave();
    }

    /** @param {Todo} item */
    onDrag = (item) => {
        this.setState({
            scrollable: false,
            draggedItem: item
        });
    }

    /** @param {NativeSyntheticEvent} event */
    onScroll = (event) => {
        this.flatlist.contentOffsetY = event.nativeEvent.contentOffset.y;
    }

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        const { pageY } = event.nativeEvent;
        this.initialSort = [ ...user.todos.todosSort ];

        GetAbsolutePosition(this.refFlatlist).then(pos => {
            this.tmpLayoutContainer = pos;

            const posY = this.tmpLayoutContainer.y + 32 / 2;
            const newY = MinMax(0, pageY - posY, this.tmpLayoutContainer.height);
            TimingAnimation(this.state.mouseY, newY, 0).start();
        });
    }
    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        const { draggedItem, scrollable } = this.state;
        const { pageY } = event.nativeEvent;
        const { contentOffsetY: scrollY, contentSizeHeight, layoutMeasurementHeight } = this.flatlist;

        if (!scrollable) {
            event.stopPropagation();
        }

        if (this.tmpLayoutContainer === null || draggedItem === null) {
            return;
        }

        // Move todo selection
        const posY = this.tmpLayoutContainer.y + 32 / 2;
        const newY = MinMax(0, pageY - posY, this.tmpLayoutContainer.height);
        TimingAnimation(this.state.mouseY, newY, 0).start();

        // Change todo order when dragging
        const index = Math.floor((newY + scrollY) / 46);
        const currIndex = user.todos.todosSort.indexOf(draggedItem.title);
        if (index !== currIndex && user.todos.Move(draggedItem, index)) {
            this.setState({ todos: user.todos.Get() });
        }

        // Scroll flatlist when dragging todo near top or bottom
        const scrollOffset = 48;
        const scrollYMax = contentSizeHeight - layoutMeasurementHeight;
        if (newY < scrollOffset && scrollY > 0) {
            const newOffset = Math.max(0, scrollY - scrollOffset);
            this.refFlatlist?.scrollToOffset({ offset: newOffset, animated: true });
        } else if (newY > this.tmpLayoutContainer.height - scrollOffset && scrollY < scrollYMax) {
            const newOffset = Math.min(scrollYMax, scrollY + scrollOffset);
            this.refFlatlist?.scrollToOffset({ offset: newOffset, animated: true });
        }
    }
    /** @param {GestureResponderEvent} event */
    onTouchEnd = (event) => {
        // Dragging ended & save new todos order
        this.setState({
            scrollable: true,
            draggedItem: null
        });

        // Save changes if todos order changed (and not just a todo check)
        if (this.initialSort.join() !== user.todos.todosSort.join() &&
            this.initialSort.length === user.todos.todosSort.length) {
                user.GlobalSave();
        }

        // Reset tmpLayoutContainer
        this.tmpLayoutContainer = null;
    }
}

export default BackTodoList;
