import React from 'react';
import { Keyboard } from 'react-native';

import { PageBack } from '../../Components';
import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';

/**
 * @typedef {import('../../../Class/Tasks').RepeatModes} RepeatModes
 * @typedef {import('../../../Class/Tasks').Task} Task
 * @typedef {import('../../../Class/Tasks').Subtask} Subtask
 * @typedef {import('../../Widgets').TaskSchedule} TaskSchedule
 * @typedef {import('../../Widgets/TaskSchedule').OnChangeScheduleEvent} OnChangeScheduleEvent
 * @typedef {'new'|'edit'|'remove'} States
 */

class BackTask extends PageBack {
    state = {
        /** @type {States} */
        action: 'new',

        /** @type {string} */
        title: '',

        /** @type {string} */
        description: '',

        /** @type {Array<Subtask>} */
        subtasks: [],

        /** @type {string} Error message to display */
        error: ''
    };

    /** @type {TaskSchedule} */
    refTaskSchedule = React.createRef();

    /** @type {Task|null} */
    selectedTask = null;

    /** @type {RepeatModes} */
    lastRepeatMode = 'none';

    constructor(props) {
        super(props);

        if (this.props.args?.task) {
            /** @type {Task|null} */
            const task = this.props.args.task || null;
            this.selectedTask = task;
            this.lastRepeatMode = task.Schedule.Type;

            if (task === null) {
                user.interface.BackPage();
                user.interface.console.AddLog('error', 'Task: Task not found');
                return;
            }

            this.state = {
                action: 'remove',

                title: task.Title,
                description: task.Description,
                subtasks: [ ...task.Subtasks ],
                error: ''
            };
        }
    }

    componentDidMount() {
        if (this.selectedTask !== null) {
            const { Deadline, Schedule: { Type, Repeat } } = this.selectedTask;
            this.refTaskSchedule.SetValues(Deadline, Type, Repeat);
        }
    }

    onEditTask = () => {
        if (this.selectedTask !== null && this.state.action !== 'edit') {
            this.setState({ action: 'edit' });
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
        if (!init) this.onEditTask();

        this.checkTitleErrors(title);
        this.setState({ title });
    }

    /**
     * @param {string} title 
     * @returns {boolean} True if error
     */
    checkTitleErrors = (title) => {
        let message = '';

        const titleIsCurrent = title === (this.selectedTask?.Title || null);
        const titleUsed = user.tasks.Get().some(t => t.Title === title);

        if (title.trim().length <= 0) {
            message = langManager.curr['task']['error-title-empty'];
        }

        else if (!titleIsCurrent && titleUsed) {
            message = langManager.curr['task']['error-title-exists'];
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

        this.onEditTask();
    }

    addSubtask = () => {
        let { subtasks } = this.state;

        if (subtasks.length >= 20) {
            const title = langManager.curr['task']['alert-subtaskslimit-title'];
            const text = langManager.curr['task']['alert-subtaskslimit-text'];
            user.interface.popup.Open('ok', [title, text]);
            return;
        }

        subtasks.push({
            Checked: false,
            Title: ''
        });
        this.setState({ subtasks });

        this.onEditTask();
    }
    onEditSubtask = (index, checked, title) => {
        let { subtasks } = this.state;

        subtasks.splice(index, 1, {
            Checked: checked,
            Title: title
        });
        this.setState({ subtasks });

        this.onEditTask();
    }
    onDeleteSubtask = (index) => {
        let { subtasks } = this.state;

        subtasks.splice(index, 1);
        this.setState({ subtasks });

        this.onEditTask();
    }

    onAddComment = () => {
        const callback = (text) => {
            this.onEditTask();
            this.setState({ description: text });
        };
        const titleCommentary = langManager.curr['task']['title-commentary'];
        user.interface.screenInput.Open(titleCommentary, '', callback, true);
    }
    onEditComment = () => {
        const callback = (text) => {
            this.onEditTask();
            this.setState({ description: text });
        };
        const titleCommentary = langManager.curr['task']['title-commentary']
        user.interface.screenInput.Open(titleCommentary, this.state.description, callback, true);
    }
    onRemComment = () => {
        const callback = (btn) => {
            if (btn === 'yes') {
                this.onEditTask();
                this.setState({ description: '' });
            }
        }
        const title = langManager.curr['task']['alert-remcomment-title'];
        const text = langManager.curr['task']['alert-remcomment-text'];
        user.interface.popup.Open('yesno', [title, text], callback);
    }

    onButtonPress = () => {
        const { action } = this.state;
        switch (action) {
            case 'new': this.addTask(); break;
            case 'edit': this.editTask(); break;
            case 'remove': this.remTask(); break;
            default:
                user.interface.console.AddLog('error', 'Task: Unknown action');
        }
    }
    addTask = () => {
        const { title, description, subtasks } = this.state;
        const { deadline, repeatMode, selectedDays } = this.refTaskSchedule.GetValues();

        if (this.checkTitleErrors(title)) {
            return;
        }

        const addition = user.tasks.Add(title, description, deadline, repeatMode, selectedDays, subtasks);
        if (addition === 'added') {
            user.LocalSave();
            user.OnlineSave();
            user.interface.BackPage();
        } else if (addition === 'alreadyExist') {
            user.interface.console.AddLog('warn', 'Task: Task already exist');
        }
    }
    editTask = () => {
        const { title, description, subtasks } = this.state;
        const { deadline, repeatMode, selectedDays } = this.refTaskSchedule.GetValues();

        if (this.selectedTask === null) {
            user.interface.console.AddLog('error', 'Task: Selected task is null');
            return;
        }

        if (this.checkTitleErrors(title)) {
            return;
        }

        const edition = user.tasks.Edit(this.selectedTask, title, description, deadline, repeatMode, selectedDays, subtasks);
        if (edition === 'edited') {
            user.LocalSave();
            user.OnlineSave();
            user.interface.BackPage();
        } else if (edition === 'notExist') {
            user.interface.console.AddLog('warn', 'Task: Task not exist');
        }
    }
    remTask = () => {
        if (this.selectedTask === null) {
            user.interface.console.AddLog('error', 'Task: Selected task is null');
            return;
        }

        const callback = (btn) => {
            if (btn === 'yes') {
                const remove = user.tasks.Remove(this.selectedTask);
                if (remove === 'removed') {
                    user.LocalSave();
                    user.OnlineSave();
                    user.interface.BackPage();
                } else if (remove === 'notExist') {
                    user.interface.console.AddLog('warn', 'Task: Task not exist');
                }
            }
        }
        const title = langManager.curr['task']['alert-remtask-title'];
        const text = langManager.curr['task']['alert-remtask-text'];
        user.interface.popup.Open('yesno', [ title, text ], callback);
    }
}

export default BackTask;