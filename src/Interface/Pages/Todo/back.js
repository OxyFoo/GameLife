import { Animated, Keyboard } from 'react-native';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { SpringAnimation } from 'Utils/Animations';
import { DeepCopy } from 'Utils/Object';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('Class/Todoes').Todo} Todo
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

        editButtonHeight: 0,
        animEditButton: new Animated.Value(0)
    };

    /** @param {BackTodoProps} props */
    constructor(props) {
        super(props);

        /** @type {Todo | null} */
        const todo = this.props.args?.todo || null;

        if (todo !== null) {
            this.state = {
                ...this.state,

                action: 'remove',
                tempTodo: DeepCopy(todo),
                error: null
            };
        }
    }

    componentDidFocused = () => {
        user.interface.SetCustomBackHandler(this.BackHandler);
    };

    onBackPress = () => {
        user.interface.BackHandle();
    };

    /** @param {LayoutChangeEvent} event */
    onEditButtonLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        this.setState({ editButtonHeight: height });
    };

    /**
     * @param {boolean} askPopup Show a popup to ask the user if he wants to leave the page when he is editing a todo
     * @returns {boolean}
     */
    BackHandler = (askPopup = true) => {
        const lang = langManager.curr['todo'];
        const { action } = this.state;

        // Don't show popup or todo not edited => leave
        if (!askPopup || action === 'remove') {
            user.interface.ResetCustomBackHandler();
            return true;
        }

        user.interface.popup?.OpenT({
            type: 'yesno',
            data: {
                title: lang['alert-back-title'],
                message: lang['alert-back-message']
            },
            callback: (btn) => {
                if (btn === 'yes') {
                    user.interface.ResetCustomBackHandler();
                    user.interface.BackHandle();
                }
            }
        });
        return false;
    };

    keyboardDismiss = () => {
        Keyboard.dismiss();
        return false;
    };

    isEdited = () => {
        const todo = this.props.args?.todo || null;
        const { tempTodo } = this.state;
        if (todo === null || tempTodo === null) {
            return false;
        }

        const oldTasks = todo.tasks.map((t) => Object.values(t).join('-')).join(',');
        const newTasks = tempTodo.tasks.map((t) => Object.values(t).join('-')).join(',');

        return (
            todo.title !== tempTodo.title ||
            todo.description !== tempTodo.description ||
            todo.deadline !== tempTodo.deadline ||
            oldTasks !== newTasks
        );
    };

    /** @param {Todo} todo */
    onChangeTodo = (todo) => {
        const { action, animEditButton } = this.state;
        const titleError = this.checkTitleErrors(todo.title);

        if (action === 'edit' || action === 'remove') {
            const edited = this.isEdited();
            this.setState({
                action: edited ? 'edit' : 'remove',
                tempTodo: { ...todo },
                error: titleError
            });
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
        const todo = this.props.args?.todo || null;

        if (title.trim().length <= 0) {
            return lang['error-title-empty'];
        }

        /** @type {string | null} */
        let message = null;

        const titleIsCurrent = title === todo?.title;
        const titleUsed = user.todoes.Get().some((t) => t.title === title);

        if (title.trim().length <= 0) {
            message = lang['error-title-empty'];
        } else if (!titleIsCurrent && titleUsed) {
            message = lang['error-title-exists'];
        }

        return message;
    };

    addTodo = () => {
        const { title, description, deadline, tasks } = this.state.tempTodo;
        if (this.checkTitleErrors(title)) {
            return;
        }

        const addition = user.todoes.Add(title.trim(), description, deadline, tasks);
        if (!addition) {
            user.interface.console?.AddLog('warn', 'Todo: Todo already exist, cannot add');
            return;
        }

        user.GlobalSave();
        user.interface.ResetCustomBackHandler();
        user.interface.BackHandle();
    };

    editTodo = () => {
        const todo = this.props.args?.todo || null;
        if (todo === null) {
            user.interface.console?.AddLog('warn', 'Todo: Todo already exist, cannot add');
            return;
        }

        const { title, description, deadline, tasks } = this.state.tempTodo;
        if (this.checkTitleErrors(title)) {
            return;
        }

        const edition = user.todoes.Edit(todo, title.trim(), description, deadline, tasks);
        if (!edition) {
            user.interface.console?.AddLog('warn', 'Todo: Todo not exist, cannot edit');
            return;
        }

        user.GlobalSave();
        user.interface.ResetCustomBackHandler();
        user.interface.BackHandle();
    };

    removeTodo = () => {
        const lang = langManager.curr['todo'];
        const todo = this.props.args?.todo || null;

        if (todo === null) {
            user.interface.console?.AddLog('error', 'Todo: Selected todo is null');
            return;
        }

        const title = lang['alert-remtodo-title'];
        const message = lang['alert-remtodo-message'];
        user.interface.popup?.OpenT({
            type: 'yesno',
            data: { title, message },
            callback: (btn) => {
                if (btn !== 'yes') {
                    return;
                }

                const remove = user.todoes.Remove(todo);
                if (remove === 'removed') {
                    user.GlobalSave();
                    user.interface.ResetCustomBackHandler();
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
