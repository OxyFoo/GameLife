import { Keyboard } from 'react-native';

import { PageBase } from 'Interface/Components';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @typedef {import('Class/Todos').Todo} Todo
 * @typedef {import('Class/Todos').RepeatModes} RepeatModes
 * 
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 * 
 * @typedef {'new' | 'edit' | 'remove'} States
 * 
 * @typedef {import('./Sections/activity').default} SectionActivity
 * @typedef {import('./Sections/schedule').default} SectionSchedule
 * @typedef {import('./Sections/schedule').OnChangeScheduleEvent} OnChangeScheduleEvent
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

    /** @type {SectionActivity | null} */
    refSectionSkill = null;

    /** @type {SectionSchedule | null} */
    refSectionSchedule = null;

    /** @type {SectionTasks | null} */
    refSectionTasks = null;

    /** @type {SectionDescription | null} */
    refSectionDescription = null;

    /** @type {Todo | null} */
    selectedTodo = null;

    /** @type {RepeatModes} */
    lastRepeatMode = 'none';

    constructor(props) {
        super(props);

        if (this.props.args?.todo) {
            /** @type {Todo | null} */
            const todo = this.props.args.todo || null;
            this.selectedTodo = todo;
            this.lastRepeatMode = todo.Schedule.Type;

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

                title: todo.Title,
                error: ''
            };
        }
    }

    componentDidMount() {
        super.componentDidMount();

        const { selectedTodo } = this;
        if (selectedTodo === null) return;

        const { Deadline, Schedule: { Type, Repeat } } = selectedTodo;
        this.refSectionSchedule.SetValues(Deadline, Type, Repeat);
        this.refSectionTasks.SetTasks(selectedTodo.Tasks);
        this.refSectionSkill.SetSkill(selectedTodo.Skill);
        this.refSectionDescription.SetDescription(selectedTodo.Description);
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

        const titleIsCurrent = title === (this.selectedTodo?.Title || null);
        const titleUsed = user.todos.Get().some(t => t.Title === title);

        if (title.trim().length <= 0) {
            message = langManager.curr['todo']['error-title-empty'];
        }

        else if (!titleIsCurrent && titleUsed) {
            message = langManager.curr['todo']['error-title-exists'];
        }

        this.setState({ error: message });
        return message.length > 0;
    }

    /** @type {OnChangeScheduleEvent} */
    onChangeSchedule = (deadline, repeatMode, repeatDays) => {
        // Check if repeat mode has changed to reset scroll position
        if (this.lastRepeatMode !== repeatMode) {
            this.lastRepeatMode = repeatMode;
            this.refPage.GotoY(0);
        }

        this.onEditTodo();
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
        const { deadline, repeatMode, selectedDays } = this.refSectionSchedule.GetValues();

        const skill = this.refSectionSkill.GetSkill();
        const tasks = this.refSectionTasks.GetTasks()
        const description = this.refSectionDescription.GetDescription();

        if (this.checkTitleErrors(title)) {
            return;
        }

        const addition = user.todos.Add(
            title,
            description,
            deadline,
            repeatMode,
            selectedDays,
            skill,
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
        const { deadline, repeatMode, selectedDays } = this.refSectionSchedule.GetValues();

        const skill = this.refSectionSkill.GetSkill();
        const tasks = this.refSectionTasks.GetTasks();
        const description = this.refSectionDescription.GetDescription();

        if (this.checkTitleErrors(title)) {
            return;
        }

        const edition = user.todos.Add(
            title,
            description,
            deadline,
            repeatMode,
            selectedDays,
            skill,
            tasks
        );

        if (edition === 'added') {
            const remove = user.todos.Remove(this.selectedTodo);
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
                const remove = user.todos.Remove(this.selectedTodo);
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
