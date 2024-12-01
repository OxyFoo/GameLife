import React from 'react';
import { Animated, Keyboard } from 'react-native';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { SpringAnimation } from 'Utils/Animations';
import { DeepCopy } from 'Utils/Object';

/**
 * @typedef {import('react-native').ScrollView} ScrollView
 * @typedef {import('react-native').NativeScrollEvent} NativeScrollEvent
 * @typedef {import('react-native').NativeSyntheticEvent<NativeScrollEvent>} NativeSyntheticEvent
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * @typedef {import('Types/Data/User/Todos').Todo} Todo
 *
 * @typedef {'new' | 'edit' | 'remove'} States
 */

const BackTodoProps = {
    args: {
        /** @type {Todo | null} */
        todo: null
    }
};

class BackTodo extends PageBase {
    state = {
        /** @type {States} */
        action: 'new',

        /** @type {string | null} Error message to display */
        error: null,

        /** @type {Todo} */
        tempTodo: {
            title: '',
            description: '',
            tasks: [],
            checked: 0,
            deadline: 0,
            created: 0
        },

        loading: false,
        scrollable: true,
        editButtonHeight: 0,
        animEditButton: new Animated.Value(0)
    };

    /** @type {Todo | null} */
    initTodo = null;

    /** @type {React.RefObject<ScrollView>} */
    refScrollView = React.createRef();

    /** @type {number} Position of the scroll (0-1) */
    scrollRatio = 0;

    /** @param {BackTodoProps} props */
    constructor(props) {
        super(props);

        /** @type {Todo | null} */
        const todo = this.props.args?.todo || null;
        this.initTodo = DeepCopy(todo);

        if (todo !== null) {
            this.state = {
                ...this.state,

                action: 'remove',
                tempTodo: DeepCopy(todo),
                error: null
            };
        }
    }

    componentDidMount() {
        user.interface.AddCustomBackHandler(this.BackHandler);
    }

    /** @param {NativeSyntheticEvent} event */
    onScroll = (event) => {
        const { y } = event.nativeEvent.contentOffset;
        const { height } = event.nativeEvent.contentSize;
        const { height: layoutHeight } = event.nativeEvent.layoutMeasurement;
        this.scrollRatio = y / (height - layoutHeight);
    };

    onBackPress = () => {
        user.interface.BackHandle();
    };

    /** @param {LayoutChangeEvent} event */
    onEditButtonLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        this.setState({ editButtonHeight: height });
    };

    /** @param {boolean} enabled */
    onChangeScrollable = (enabled) => {
        this.setState({ scrollable: enabled });
    };

    /**
     * @returns {boolean}
     */
    BackHandler = () => {
        const lang = langManager.curr['todo'];
        const { action } = this.state;

        // Don't show popup or todo not edited => leave
        if (action === 'remove') {
            user.interface.RemoveCustomBackHandler(this.BackHandler);
            user.interface.BackHandle();
            return false;
        }

        user.interface.popup?.OpenT({
            type: 'yesno',
            data: {
                title: lang['alert-back-title'],
                message: lang['alert-back-message']
            },
            callback: (btn) => {
                if (btn === 'yes') {
                    user.interface.RemoveCustomBackHandler(this.BackHandler);
                    user.interface.BackHandle();
                }
            }
        });
        return false;
    };

    /** @param {GestureResponderEvent} event */
    keyboardDismiss = (event) => {
        if (event.target === event.currentTarget) {
            Keyboard.dismiss();
        }
        return false;
    };

    isEdited = () => {
        const { tempTodo } = this.state;
        if (this.initTodo === null || tempTodo === null) {
            return false;
        }

        const oldTasks = this.initTodo.tasks.map((t) => Object.values(t).join('-')).join(',');
        const newTasks = tempTodo.tasks.map((t) => Object.values(t).join('-')).join(',');

        return (
            this.initTodo.title !== tempTodo.title ||
            this.initTodo.description !== tempTodo.description ||
            this.initTodo.deadline !== tempTodo.deadline ||
            oldTasks !== newTasks
        );
    };

    /** @param {Todo} todo */
    onChangeTodo = (todo) => {
        const { action, animEditButton } = this.state;
        const titleError = this.checkTitleErrors(todo.title);

        if (action === 'edit' || action === 'remove') {
            const edited = this.isEdited();
            this.setState(
                {
                    action: edited ? 'edit' : 'remove',
                    tempTodo: { ...todo },
                    error: titleError,
                    loading: false
                },
                () => {
                    // If scroll is at the bottom, scroll to the bottom
                    if (this.scrollRatio >= 0.9 && action !== this.state.action) {
                        this.refScrollView.current?.scrollToEnd({ animated: true });
                    }
                }
            );
            SpringAnimation(animEditButton, edited ? 1 : 0).start();
            return;
        }

        this.setState({
            tempTodo: { ...todo },
            error: titleError
        });
    };

    /**
     * @param {string} title
     * @returns {string | null} Error message or null if no error
     */
    checkTitleErrors = (title) => {
        const lang = langManager.curr['todo'];

        if (title.trim().length <= 0) {
            return lang['error-title-empty'];
        }

        /** @type {string | null} */
        let message = null;

        const titleIsCurrent = title === this.initTodo?.title;
        const titleUsed = user.todos.Get().some((t) => t.title === title);

        if (title.trim().length <= 0) {
            message = lang['error-title-empty'];
        } else if (!titleIsCurrent && titleUsed) {
            message = lang['error-title-exists'];
        }

        return message;
    };

    addTodo = async () => {
        const { title, description, deadline, tasks } = this.state.tempTodo;
        if (this.checkTitleErrors(title)) {
            return;
        }

        const addition = user.todos.Add(title.trim(), description, deadline, tasks);
        if (!addition) {
            user.interface.console?.AddLog('warn', 'Todo: Todo already exist, cannot add');
            return;
        }

        this.setState({ loading: true });
        await user.GlobalSave();
        this.setState({ loading: false });

        user.interface.RemoveCustomBackHandler(this.BackHandler);
        user.interface.BackHandle();
    };

    editTodo = async () => {
        const lang = langManager.curr['todo'];

        if (this.initTodo === null) {
            user.interface.console?.AddLog('warn', 'Todo: Todo already exist, cannot add');
            return;
        }

        const { title, description, deadline, tasks } = this.state.tempTodo;
        if (this.checkTitleErrors(title)) {
            return;
        }

        const editedTodo = user.todos.Edit(this.initTodo, {
            title: title.trim(),
            description,
            deadline,
            tasks
        });

        // If todo not exist, cannot edit
        if (editedTodo === 'not-exist') {
            user.interface.console?.AddLog('warn', `Todo: Todo not exist, cannot edit (${editedTodo})`);
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-todo-notexist-title'],
                    message: lang['alert-todo-notexist-message'].replace('{}', editedTodo)
                }
            });
            return;
        }

        if (user.server2.IsAuthenticated()) {
            this.setState({ loading: true });
            const saved = await user.todos.SaveOnline();

            if (!saved) {
                user.interface.popup?.OpenT({
                    type: 'ok',
                    data: {
                        title: lang['alert-todo-savefail-title'],
                        message: lang['alert-todo-savefail-message']
                    }
                });
                this.setState({ loading: false });
                return;
            }
        }

        // Update the todo in the list
        this.initTodo = DeepCopy(editedTodo);
        this.onChangeTodo(editedTodo);
    };

    removeTodo = () => {
        const lang = langManager.curr['todo'];

        if (this.initTodo === null) {
            user.interface.console?.AddLog('error', 'Todo: Selected todo is null');
            return;
        }

        user.interface.popup?.OpenT({
            type: 'yesno',
            data: {
                title: lang['alert-remtodo-title'],
                message: lang['alert-remtodo-message']
            },
            callback: async (btn) => {
                if (btn !== 'yes' || this.initTodo === null) {
                    return;
                }

                const remove = user.todos.Remove(this.initTodo);
                if (remove === 'removed') {
                    this.setState({ loading: true });
                    await user.GlobalSave();
                    this.setState({ loading: false });

                    user.interface.RemoveCustomBackHandler(this.BackHandler);
                    user.interface.BackHandle();
                } else if (remove === 'notExist') {
                    user.interface.console?.AddLog('warn', 'Todo: Todo not exist');
                }
            }
        });
    };
}

BackTodo.defaultProps = BackTodoProps;
BackTodo.prototype.props = BackTodoProps;

export default BackTodo;
