import { Keyboard } from 'react-native';

import { PageBack } from '../../Components';
import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';

/**
 * @typedef {import('../../../Class/Tasks').Task} Task
 * @typedef {import('../../../Class/Tasks').Subtask} Subtask
 * @typedef {import('../../Widgets/TaskSchedule').OnChangeScheduleEvent} OnChangeScheduleEvent
 */

class BackTask extends PageBack {
    constructor(props) {
        super(props);

        /** @type {string?} */
        this.taskName = null;

        this.state = {
            action: 'new',
            title: '',
            description: null,
            /** @type {Array<Subtask>} */
            subtasks: [],
            error: '',
    
            deadline: null,
            repeatMode: null,
            repeatDays: []
        };

        if (this.props.args?.task) {
            /** @type {Task} */
            const task = this.props.args.task;
            this.taskName = task.Title;

            this.state = {
                action: 'remove',
                newTask: false,
                title: task.Title,
                description: task.Description,
                subtasks: [...task.Subtasks],
                error: '',
        
                deadline: task.Deadline,
                repeatMode: null,
                repeatDays: null
            };
            if (task.Schedule !== null) {
                this.state.repeatMode = task.Schedule.Type;
                this.state.repeatDays = task.Schedule.Repeat;
            }
        }
    }

    componentDidMount() {
        const title = this.props.args.task?.Title || '';
        this.onChangeTitle(title, true);
    }

    keyboardDismiss = () => {
        Keyboard.dismiss();
        return false;
    }

    onChangeTitle = (title, init = false) => {
        let action = this.state.action;
        if (this.taskName !== null && !init) {
            action = 'edit';
        }

        let error = '';
        if (title.length <= 0) {
            error = langManager.curr['task']['error-title-empty'];
        } else if (title !== this.taskName && user.tasks.Get().some(t => t.Title === title)) {
            error = langManager.curr['task']['error-title-exists'];
        }

        this.setState({ action, title, error });
    }

    /** @type {OnChangeScheduleEvent} */
    onChangeSchedule = (deadline, repeatMode, repeatDays) => {
        const action = this.taskName === null ? this.state.action : 'edit';
        this.setState({ deadline, repeatMode, repeatDays, action });
    }

    addSubtask = () => {
        let { subtasks } = this.state;

        if (subtasks.length >= 20) {
            const title = langManager.curr['task']['alert-subtaskslimit-title'];
            const text = langManager.curr['task']['alert-subtaskslimit-text'];
            user.interface.popup.Open('ok', [title, text]);
            return;
        }

        const action = this.taskName === null ? this.state.action : 'edit';
        subtasks.push({
            Checked: false,
            Title: ''
        });
        this.setState({ action, subtasks });
    }
    onEditSubtask = (index, checked, title) => {
        let { subtasks } = this.state;
        const action = this.taskName === null ? this.state.action : 'edit';
        subtasks.splice(index, 1, {
            Checked: checked,
            Title: title
        });
        this.setState({ action, subtasks });
    }
    onDeleteSubtask = (index) => {
        let { subtasks } = this.state;
        const action = this.taskName === null ? this.state.action : 'edit';
        subtasks.splice(index, 1);
        this.setState({ action, subtasks });
    }

    onAddComment = () => {
        const callback = (text) => {
            const action = this.taskName === null ? this.state.action : 'edit';
            this.setState({ description: text.length ? text : null, action });
        };
        const titleCommentary = langManager.curr['task']['title-commentary'];
        user.interface.screenInput.Open(titleCommentary, '', callback, true);
    }
    onEditComment = () => {
        const callback = (text) => {
            const action = this.taskName === null ? this.state.action : 'edit';
            this.setState({ description: text.length ? text : null, action });
        };
        const titleCommentary = langManager.curr['task']['title-commentary']
        user.interface.screenInput.Open(titleCommentary, this.state.description, callback, true);
    }
    onRemComment = () => {
        const callback = (btn) => {
            if (btn === 'yes') {
                const action = this.taskName === null ? this.state.action : 'edit';
                this.setState({ description: null, action });
            }
        }
        const title = langManager.curr['task']['alert-remcomment-title'];
        const text = langManager.curr['task']['alert-remcomment-text'];
        user.interface.popup.Open('yesno', [ title, text ], callback);
    }

    onButtonPress = () => {
        // TODO - Ajouter des vérifications
        switch (this.state.action) {
            case 'new':
                this.addTask();
                break;
            case 'edit':
                this.editTask();
                break;
            case 'remove':
                this.remTask();
                break;
        }
    }
    addTask = () => {
        const { title, description, deadline, repeatMode, repeatDays, subtasks } = this.state;
        const addition = user.tasks.Add(title, description, deadline, repeatMode, repeatDays, subtasks);
        if (addition === 'added') {
            user.interface.BackPage();
        } else if (addition === 'alreadyExist') {
            user.interface.console.AddLog('warn', 'Task already exist');
        }
    }
    editTask = () => {
        const oldTask = this.props.args.task;
        const { title, description, deadline, repeatMode, repeatDays, subtasks } = this.state;
        const edition = user.tasks.Edit(oldTask, title, description, deadline, repeatMode, repeatDays, subtasks);
        if (edition === 'edited') {
            user.interface.BackPage();
        } else if (edition === 'notExist') {
            user.interface.console.AddLog('warn', 'Task not exist');
        }
    }
    remTask = () => {
        const callback = (btn) => {
            if (btn === 'yes') {
                const remove = user.tasks.Remove(this.props.args.task);
                if (remove === 'removed') {
                    user.interface.BackPage();
                } else if (remove === 'notExist') {
                    user.interface.console.AddLog('warn', 'Task not exist');
                }
            }
        }
        const title = langManager.curr['task']['alert-remtask-title'];
        const text = langManager.curr['task']['alert-remtask-text'];
        user.interface.popup.Open('yesno', [ title, text ], callback);
    }
}

export default BackTask;