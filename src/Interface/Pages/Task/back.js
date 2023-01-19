import { Keyboard } from 'react-native';

import { PageBack } from '../../Components';
import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';

/**
 * @typedef {import('../../../Class/Tasks').Task} Task
 * @typedef {import('../../../Class/Tasks').Subtask} Subtask
 * @typedef {import('../../Widgets/TaskSchedule').OnChangeScheduleEvent} OnChangeScheduleEvent
 * @typedef {'new'|'edit'|'remove'} States
 */

class BackTask extends PageBack {
    state = {
        /** @type {States} */
        action: 'new',

        /** @type {string} */
        title: '',
        /** @type {string|null} */
        description: null,
        /** @type {Array<Subtask>} */
        subtasks: [],
        /** @type {string} */
        error: '',

        deadline: null,
        repeatMode: null,
        repeatDays: []
    };

    /** @type {Task|null} */
    selectedTask = null;

    /** @type {Array|null} */
    initValues = null;

    constructor(props) {
        super(props);

        if (this.props.args?.task) {
            /** @type {Task|null} */
            const task = this.props.args.task || null;
            if (task === null) {
                user.interface.BackPage();
                user.interface.console.AddLog('error', 'Task: Task not found');
                return;
            }

            this.selectedTask = task;

            this.state = {
                action: 'remove',

                title: task.Title,
                description: task.Description,
                subtasks: [ ...task.Subtasks ],
                error: '',

                deadline: task.Deadline,
                repeatMode: null,
                repeatDays: null
            };

            if (task.Schedule !== null) {
                this.state.repeatMode = task.Schedule.Type;
                this.state.repeatDays = task.Schedule.Repeat;
            }

            this.initValues = [ this.state.deadline, this.state.repeatMode, this.state.repeatDays ];
        }
    }

    isEditMode = () => this.selectedTask !== null;

    keyboardDismiss = () => {
        Keyboard.dismiss();
        return false;
    }

    /**
     * @param {string} title 
     * @param {boolean} [init=false]
     */
    onChangeTitle = (title, init = false) => {
        const newState = { title, error: '' };

        // Edition mode if title is modified
        if (this.isEditMode() && !init) {
            newState['action'] = 'edit';
        }

        // Check title for errors
        if (title.trim().length <= 0) {
            newState['error'] = langManager.curr['task']['error-title-empty'];
        } else if (title !== this.selectedTask?.Title && user.tasks.Get().some(t => t.Title === title)) {
            newState['error'] = langManager.curr['task']['error-title-exists'];
        }

        this.setState(newState);
    }

    /** @type {OnChangeScheduleEvent} */
    onChangeSchedule = (deadline, repeatMode, repeatDays) => {
        const newState = { deadline, repeatMode, repeatDays };
        if (this.isEditMode()) newState['action'] = 'edit';
        this.setState(newState);
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

        const action = !this.isEditMode() ? this.state.action : 'edit';
        this.setState({ action, subtasks });
    }
    onEditSubtask = (index, checked, title) => {
        let { subtasks } = this.state;

        subtasks.splice(index, 1, {
            Checked: checked,
            Title: title
        });

        const action = !this.isEditMode() ? this.state.action : 'edit';
        this.setState({ action, subtasks });
    }
    onDeleteSubtask = (index) => {
        let { subtasks } = this.state;

        subtasks.splice(index, 1);

        const action = !this.isEditMode() ? this.state.action : 'edit';
        this.setState({ action, subtasks });
    }

    onAddComment = () => {
        const callback = (text) => {
            const action = !this.isEditMode() ? this.state.action : 'edit';
            this.setState({ description: text.length ? text : null, action });
        };
        const titleCommentary = langManager.curr['task']['title-commentary'];
        user.interface.screenInput.Open(titleCommentary, '', callback, true);
    }
    onEditComment = () => {
        const callback = (text) => {
            const action = !this.isEditMode() ? this.state.action : 'edit';
            this.setState({ description: text.length ? text : null, action });
        };
        const titleCommentary = langManager.curr['task']['title-commentary']
        user.interface.screenInput.Open(titleCommentary, this.state.description, callback, true);
    }
    onRemComment = () => {
        const callback = (btn) => {
            if (btn === 'yes') {
                const action = !this.isEditMode() ? this.state.action : 'edit';
                this.setState({ description: null, action });
            }
        }
        const title = langManager.curr['task']['alert-remcomment-title'];
        const text = langManager.curr['task']['alert-remcomment-text'];
        user.interface.popup.Open('yesno', [ title, text ], callback);
    }

    onButtonPress = () => {
        const { action } = this.state;
        switch (action) {
            case 'new':     this.addTask();     break;
            case 'edit':    this.editTask();    break;
            case 'remove':  this.remTask();     break;
            default:
                user.interface.console.AddLog('error', 'Task: Unknown action');
        }
    }
    addTask = () => {
        const { title, description, deadline, repeatMode, repeatDays, subtasks } = this.state;
        const addition = user.tasks.Add(title, description, deadline, repeatMode, repeatDays, subtasks);
        if (addition === 'added') {
            user.interface.BackPage();
        } else if (addition === 'alreadyExist') {
            user.interface.console.AddLog('warn', 'Task: Task already exist');
        }
    }
    editTask = () => {
        if (this.selectedTask === null) {
            user.interface.console.AddLog('error', 'Task: Selected task is null');
            return;
        }

        const { title, description, deadline, repeatMode, repeatDays, subtasks } = this.state;
        const edition = user.tasks.Edit(this.selectedTask, title, description, deadline, repeatMode, repeatDays, subtasks);
        if (edition === 'edited') {
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