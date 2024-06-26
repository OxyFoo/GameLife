import React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { GetGlobalTime } from 'Utils/Time';
import { MinMax } from 'Utils/Functions';
import { GetAbsolutePosition } from 'Utils/UI';
import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 * @typedef {import('react-native').NativeScrollEvent} NativeScrollEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * @typedef {import('react-native').NativeSyntheticEvent<NativeScrollEvent>} NativeSyntheticEvent
 *
 * @typedef {import('Class/Todoes').Todo} Todo
 * @typedef {import('react-native').FlatList<Todo>} FlatListTodo
 */

class BackTodoList extends React.Component {
    state = {
        /** @type {Todo[]} */
        todoes: [],

        /** @type {boolean} Used to disable scroll when dragging a todo */
        scrollable: true,

        /** @type {boolean} Used to enable/disable undo button */
        undoEnabled: false,

        /** @type {Todo | null} Used to manage selected todo */
        draggedItem: null,

        mouseY: new Animated.Value(0)
    };

    /** @type {React.RefObject<FlatListTodo>} Used to manage todo sorting */
    refFlatlist = React.createRef();

    flatlist = {
        contentSizeHeight: 0,
        layoutMeasurementHeight: 0,
        contentOffsetY: 0
    };

    /** @type {number[]} */
    initialSort = [];

    /** @type {NodeJS.Timeout | null} */
    undoTimeout = null;

    /** @type {LayoutRectangle | null} */
    tmpLayoutContainer = null;

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
        if (this.undoTimeout !== null) {
            clearTimeout(this.undoTimeout);
        }
        user.todoes.allTodoes.RemoveListener(this.listenerTodo);
    }

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
            user.interface.popup.OpenT({
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
        // Close undo button after 10 seconds
        this.undoTimeout = setTimeout(() => {
            this.setState({ undoEnabled: false });
        }, 10 * 1000);

        // Remove todo
        callbackRemove((cancel) => {
            const success = user.todoes.Remove(todo) === 'removed';
            if (!success) {
                cancel();
                return;
            }

            this.setState({
                todoes: [...user.todoes.Get()],
                undoEnabled: true
            });
            user.GlobalSave();
        });
    };

    undo = () => {
        if (user.todoes.lastDeletedTodo === null) {
            return;
        }

        // Close undo button
        if (this.undoTimeout !== null) {
            clearTimeout(this.undoTimeout);
        }

        this.setState({
            todoes: [...user.todoes.Get()],
            undoEnabled: false
        });

        user.todoes.Undo();
        user.GlobalSave();
    };

    /** @param {Todo} item */
    onDrag = (item) => {
        this.setState({
            scrollable: false,
            draggedItem: item
        });
    };

    /** @param {NativeSyntheticEvent} event */
    onScroll = (event) => {
        this.flatlist.contentOffsetY = event.nativeEvent.contentOffset.y;
    };

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        const { pageY } = event.nativeEvent;
        this.initialSort = [...user.todoes.sort];

        if (this.refFlatlist.current === null) {
            return;
        }

        GetAbsolutePosition(this.refFlatlist.current).then((pos) => {
            this.tmpLayoutContainer = pos;

            const posY = this.tmpLayoutContainer.y + 32 / 2;
            const newY = MinMax(0, pageY - posY, this.tmpLayoutContainer.height);
            TimingAnimation(this.state.mouseY, newY, 0).start();
        });
    };

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
        const currIndex = user.todoes.sort.indexOf(draggedItem.created);
        if (index !== currIndex && user.todoes.Move(draggedItem, index)) {
            this.setState({ todoes: user.todoes.Get() });
        }

        // Scroll flatlist when dragging todo near top or bottom
        const scrollOffset = 48;
        const scrollYMax = contentSizeHeight - layoutMeasurementHeight;
        if (newY < scrollOffset && scrollY > 0) {
            const newOffset = Math.max(0, scrollY - scrollOffset);
            this.refFlatlist.current?.scrollToOffset({ offset: newOffset, animated: true });
        } else if (newY > this.tmpLayoutContainer.height - scrollOffset && scrollY < scrollYMax) {
            const newOffset = Math.min(scrollYMax, scrollY + scrollOffset);
            this.refFlatlist.current?.scrollToOffset({ offset: newOffset, animated: true });
        }
    };

    /** @param {GestureResponderEvent} _event */
    onTouchEnd = (_event) => {
        // Dragging ended & save new todoes order
        this.setState({
            scrollable: true,
            draggedItem: null
        });

        // Save changes if todoes order changed (and not just a todo check)
        if (
            this.initialSort.join() !== user.todoes.sort.join() &&
            this.initialSort.length === user.todoes.sort.length
        ) {
            user.GlobalSave();
        }

        // Reset tmpLayoutContainer
        this.tmpLayoutContainer = null;
    };
}

export default BackTodoList;
