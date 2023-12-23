import { Keyboard } from 'react-native';

import { PageBase } from 'Interface/Components';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { GetTime } from 'Utils/Time';

/**
 * @typedef {import('Class/Todoes').Todo} Todo
 * 
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 * 
 * @typedef {'new' | 'edit' | 'remove'} States
 * 
 * @typedef {import('./Sections/schedule').default} SectionSchedule
 * @typedef {import('./Sections/tasks').default} SectionTasks
 * @typedef {import('./Sections/description').default} SectionDescription
 */

class BackTodo extends PageBase {
    state = {
        /** @type {States} */
        action: 'new',
        button: {
            /** @type {string} */
            text: langManager.curr['todo']['button-add'],

            /** @type {ThemeColor | ThemeText} */
            color: 'main2'
        },

        /** @type {string} */
        title: '',

        /** @type {string} Error message to display */
        error: ''
    }

    /** @type {SectionSchedule | null} */
    refSectionSchedule = null;

    /** @type {SectionDescription | null} */
    refSectionDescription = null;

    /** @type {SectionTasks | null} */
    refSectionTasks = null;

    /** @type {Todo | null} */
    selectedTodo = null;

    constructor(props) {
        super(props);

        if (this.props.args?.todo) {
            /** @type {Todo | null} */
            const todo = this.props.args.todo || null;
            this.selectedTodo = todo;

            if (todo === null) {
                user.interface.BackHandle();
                user.interface.console.AddLog('error', 'Todo: Todo not found');
                return;
            }

            this.state = {
                action: 'remove',
                button: {
                    text: langManager.curr['todo']['button-remove'],
                    color: 'danger'
                },

                title: todo.title,
                error: ''
            };
        }
    }

    componentDidMount() {
        super.componentDidMount();

        const { selectedTodo } = this;
        if (selectedTodo === null) return;

        this.refSectionSchedule.SetDeadline(selectedTodo.deadline);
        this.refSectionTasks.SetTasks(selectedTodo.tasks);
        this.refSectionDescription.SetDescription(selectedTodo.description);
    }

    componentDidFocused = () => {
        user.interface.SetCustomBackHandler(this.BackHandler);
    }

    /**
     * @param {boolean} askPopup Show a popup to ask the user if he wants to
     *                           leave the page when he is editing a todo
     * @returns {boolean}
     */
    BackHandler = (askPopup = true) => {
        const { action } = this.state;

        // Don't show popup or todo not edited => leave
        if (!askPopup || action === 'remove') {
            user.interface.ResetCustomBackHandler();
            return true;
        }

        const callback = (btn) => {
            if (btn === 'yes') {
                user.interface.ResetCustomBackHandler();
                user.interface.BackHandle();
            }
        }
        const title = langManager.curr['todo']['alert-back-title'];
        const text = langManager.curr['todo']['alert-back-text'];
        user.interface.popup.Open('yesno', [ title, text ], callback);
        return false;
    }

    onEditTodo = () => {
        if (this.selectedTodo !== null && this.state.action !== 'edit') {
            this.setState({
                action: 'edit',
                button: {
                    text: langManager.curr['todo']['button-save'],
                    color: 'success'
                }
            });
        }
    }

    keyboardDismiss = () => {
        Keyboard.dismiss();
        return false;
    }

    /**
     * @param {string} title 
     * @param {boolean} [init=false]
     */
    onChangeTitle = (title, init = false) => {
        // Edition mode if title is modified
        if (!init) this.onEditTodo();

        this.checkTitleErrors(title);
        this.setState({ title });
    }

    /**
     * @param {string} title 
     * @returns {boolean} True if error
     */
    checkTitleErrors = (title) => {
        let message = '';

        const titleIsCurrent = title === (this.selectedTodo?.title || null);
        const titleUsed = user.todoes.Get().some(t => t.title === title);

        if (title.trim().length <= 0) {
            message = langManager.curr['todo']['error-title-empty'];
        }

        else if (!titleIsCurrent && titleUsed) {
            message = langManager.curr['todo']['error-title-exists'];
        }

        this.setState({ error: message });
        return message.length > 0;
    }

    onButtonPress = () => {
        const { action } = this.state;
        switch (action) {
            case 'new': this.addTodo(); break;
            case 'edit': this.editTodo(); break;
            case 'remove': this.removeTodo(); break;
            default:
                user.interface.console.AddLog('error', 'Todo: Unknown action');
        }
    }

    addTodo = () => {
        const { title } = this.state;

        const deadline = this.refSectionSchedule.GetDeadline();
        const tasks = this.refSectionTasks.GetTasks()
        const description = this.refSectionDescription.GetDescription();

        if (this.checkTitleErrors(title)) {
            return;
        }

        const addition = user.todoes.AddOrEdit(
            title,
            description,
            GetTime(),
            deadline,
            tasks
        );

        if (addition === 'edited') {
            user.interface.console.AddLog('warn', 'Todo: Todo already exist, edited instead');
        }

        user.GlobalSave();
        user.interface.ResetCustomBackHandler();
        user.interface.BackHandle();
    }
    editTodo = () => {
        if (this.selectedTodo === null) {
            user.interface.console.AddLog('error', 'Todo: Selected todo is null');
            return;
        }

        const { title } = this.state;

        const deadline = this.refSectionSchedule.GetDeadline();
        const tasks = this.refSectionTasks.GetTasks();
        const description = this.refSectionDescription.GetDescription();

        if (this.checkTitleErrors(title)) {
            return;
        }

        const edition = user.todoes.AddOrEdit(
            title,
            description,
            this.selectedTodo.created || GetTime(),
            deadline,
            tasks
        );

        // Remove old todo (title different => new todo)
        if (edition === 'added') {
            const remove = user.todoes.Remove(this.selectedTodo);
            if (remove === 'notExist') {
                user.interface.console.AddLog('warn', 'Todo: Todo not exist');
            }
        }

        user.GlobalSave();
        user.interface.ResetCustomBackHandler();
        user.interface.BackHandle();
    }
    removeTodo = () => {
        if (this.selectedTodo === null) {
            user.interface.console.AddLog('error', 'Todo: Selected todo is null');
            return;
        }

        const callback = (btn) => {
            if (btn === 'yes') {
                const remove = user.todoes.Remove(this.selectedTodo);
                if (remove === 'removed') {
                    user.GlobalSave();
                    user.interface.ResetCustomBackHandler();
                    user.interface.BackHandle();
                } else if (remove === 'notExist') {
                    user.interface.console.AddLog('warn', 'Todo: Todo not exist');
                }
            }
        }
        const title = langManager.curr['todo']['alert-remtodo-title'];
        const text = langManager.curr['todo']['alert-remtodo-text'];
        user.interface.popup.Open('yesno', [ title, text ], callback);
    }
}

export default BackTodo;
