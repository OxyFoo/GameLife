import * as React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { MinMax } from 'Utils/Functions';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StylePropView
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {import('Types/Data/User/Todos').Todo} Todo
 * @typedef {import('Types/Data/User/Todos').Task} Task
 *
 * @typedef {Object} SectionTasksPropsType
 * @property {StylePropView} style
 * @property {Todo | null} todo
 * @property {(newTodo: Todo) => void} onChangeTodo
 * @property {(enabled: boolean) => void} changeScrollable Change scrollable state
 */

/** @type {SectionTasksPropsType} */
const SectionTasksProps = {
    style: {},
    todo: null,
    onChangeTodo: () => {},
    changeScrollable: () => {}
};

class BackSectionTasks extends React.Component {
    state = {
        /** @type {Task[]} */
        tasks: [],

        /** @type {Task | null} */
        draggedItem: null,

        mouseY: new Animated.Value(0)
    };

    lastY = 0;
    firstPageY = 0;
    selectedIndex = 0;
    containerHeight = 0;
    itemHeight = 46;

    /** @param {SectionTasksPropsType} props */
    constructor(props) {
        super(props);

        if (props.todo !== null) {
            this.state.tasks = props.todo.tasks;
        }
    }

    /**
     * @param {SectionTasksPropsType} nextProps
     * @param {this['state']} nextState
     */
    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.todo !== this.props.todo ||
            nextProps.todo?.tasks !== this.props.todo?.tasks ||
            nextState.tasks !== this.state.tasks ||
            nextProps.onChangeTodo !== this.props.onChangeTodo ||
            nextState.draggedItem !== this.state.draggedItem
        ) {
            return true;
        }

        const oldTasks = nextState.tasks.map((t) => Object.values(t).join('-')).join(',');
        const newTasks = this.state.tasks.map((t) => Object.values(t).join('-')).join(',');

        if (oldTasks !== newTasks) {
            return true;
        }

        return false;
    }

    /** @param {SectionTasksPropsType} prevProps */
    componentDidUpdate(prevProps) {
        const { todo } = this.props;

        if (todo !== null && prevProps.todo?.tasks !== todo.tasks) {
            this.setState({ tasks: this.props.todo?.tasks });
        }
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        this.containerHeight = height;
    };

    /** @param {LayoutChangeEvent} event */
    onLayoutItem = (event) => {
        const { height } = event.nativeEvent.layout;
        this.itemHeight = height;
    };

    addTask = () => {
        const lang = langManager.curr['todo'];
        const { todo, onChangeTodo } = this.props;
        if (todo === null) return;

        if (todo.tasks.length >= 20) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-taskslimit-title'],
                    message: lang['alert-taskslimit-text']
                }
            });
            return;
        }

        user.interface.screenInput?.Open({
            label: lang['input-task-placeholder'],
            callback: (title) => {
                if (!title || !title.trim()) return;

                todo.tasks.push({
                    checked: false,
                    title: title.trim()
                });
                onChangeTodo(todo);
            }
        });
    };

    /** @param {Task} task */
    editTitleTask = (task) => {
        const lang = langManager.curr['todo'];
        const { todo, onChangeTodo } = this.props;
        if (todo === null) return;

        const index = todo.tasks.indexOf(task);
        if (index === -1) return;

        user.interface.screenInput?.Open({
            label: lang['input-task-placeholder'],
            initialText: task.title,
            maxLength: 256,
            callback: (title) => {
                if (!title || !title.trim()) return;

                todo.tasks[index] = { ...task, title: title.trim() };
                onChangeTodo(todo);
            }
        });
    };

    /**
     * @param {Task} task
     * @param {boolean} checked
     * @param {string} title
     */
    onEditTask = (task, checked, title) => {
        const { todo, onChangeTodo } = this.props;
        if (todo === null) return;

        const index = todo.tasks.indexOf(task);
        if (index === -1) return;

        todo.tasks[index] = { ...task, checked, title };
        onChangeTodo(todo);
    };

    /** @param {Task} task */
    onDeleteTask = (task) => {
        const lang = langManager.curr['todo'];
        const { todo, onChangeTodo } = this.props;
        if (todo === null) return;

        const index = todo.tasks.indexOf(task);
        if (index === -1) return;

        user.interface.popup?.OpenT({
            type: 'yesno',
            data: {
                title: lang['alert-remtask-title'],
                message: lang['alert-remtask-message']
            },
            callback: (btn) => {
                if (btn !== 'yes') return;

                todo.tasks.splice(index, 1);
                onChangeTodo(todo);
            }
        });
    };

    /**
     * @param {GestureResponderEvent} event
     * @param {Task} item
     */
    dragStart = (event, item) => {
        const { draggedItem } = this.state;
        if (draggedItem !== null) return;

        this.lastY = event.nativeEvent.pageY;
        this.timeoutDrag = setTimeout(() => {
            this.onDrag(item);
        }, 300);
    };

    /** @param {GestureResponderEvent} event */
    dragMove = (event) => {
        const deltaY = event.nativeEvent.pageY - this.lastY;
        if (Math.abs(deltaY) > 10) {
            clearTimeout(this.timeoutDrag);
        }
    };

    /** @param {GestureResponderEvent} _event */
    dragEnd = (_event) => {
        clearTimeout(this.timeoutDrag);
    };

    /** @param {Task} item */
    onDrag = (item) => {
        const { tasks } = this.state;
        if (this.props.todo === null) return;

        this.props.changeScrollable(false);
        this.setState({ draggedItem: item });

        this.selectedIndex = tasks.indexOf(item);
        const initY = this.selectedIndex * this.itemHeight;
        this.state.mouseY.setValue(initY);
    };

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        if (this.props.todo === null) return;

        const { pageY } = event.nativeEvent;
        this.firstPageY = pageY;
    };

    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        const { todo } = this.props;
        const { tasks, draggedItem, mouseY } = this.state;
        const { pageY } = event.nativeEvent;

        if (todo === null || draggedItem === null) {
            return;
        }

        // Move todo selection
        const deltaY = pageY - this.firstPageY;
        const relativeY = this.selectedIndex * this.itemHeight;
        const newY = MinMax(0, deltaY + relativeY, this.containerHeight - this.itemHeight);
        mouseY.setValue(newY);

        // Change todo order when dragging
        const index = Math.floor((newY + this.itemHeight / 2) / this.itemHeight);
        const currIndex = todo.tasks.indexOf(draggedItem);
        if (index !== currIndex) {
            tasks.splice(currIndex, 1);
            tasks.splice(index, 0, draggedItem);

            this.setState({ tasks });
        }
    };

    /** @param {GestureResponderEvent} _event */
    onTouchEnd = (_event) => {
        this.setState({ draggedItem: null }, () => {
            const { todo } = this.props;
            if (todo === null) return;

            todo.tasks = this.state.tasks;
            this.props.onChangeTodo(todo);
            this.props.changeScrollable(true);
        });
    };
}

BackSectionTasks.prototype.props = SectionTasksProps;
BackSectionTasks.defaultProps = SectionTasksProps;

export default BackSectionTasks;
