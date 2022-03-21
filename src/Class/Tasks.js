import { GetTime } from "../Utils/Time";
import { SortByKey } from '../Utils/Functions';

/**
 * @typedef {Object} Subtask
 * @property {Boolean} checked
 * @property {String} title
 */

/**
 * @typedef {Object} Schedule
 * @property {'week'|'month'} Type
 * @property {Array<Number>} Repeat
 */

class Task {
    Title = '';
    Description = '';

    /** @type {Number?} Timestamp in seconds */
    Deadline = null;

    /** @type {Schedule?} Null to don't repeat */
    Schedule = null;

    /** @type {Array<Subtask>} Subtasks informations */
    Subtasks = [];
}

class Tasks {
    constructor(user) {
        /**
         * @typedef {import('../Managers/UserManager').default} UserManager
         * @type {UserManager}
         */
        this.user = user;

        /**
         * @type {Array<Task>}
         */
        this.SAVED_tasks = [];

        /**
         * @type {Array<Task>}
         */
        this.UNSAVED_tasks = [];

        /**
         * @type {Array<Task>}
         */
        this.UNSAVED_deletions = [];
    }

    Clear() {
        this.SAVED_tasks = [];
        this.UNSAVED_tasks = [];
        this.UNSAVED_deletions = [];
    }
    Load(tasks) {
        const contains = (key) => tasks.hasOwnProperty(key);
        if (contains('tasks'))      this.SAVED_tasks = tasks['tasks'];
        if (contains('unsaved'))    this.UNSAVED_tasks = tasks['unsaved'];
        if (contains('deletions'))  this.UNSAVED_deletions = tasks['deletions'];
    }
    LoadOnline(tasks) {
        if (typeof(tasks) !== 'object') return;
        /*this.SAVED_tasks = [];
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            if (Object.keys(task).length !== 5) continue;
            console.log(this.Add(...task, true));
        }*/
        this.SAVED_tasks = tasks.map(task => Object.assign(new Task(), task));
        const length = this.SAVED_tasks.length;
        this.user.interface.console.AddLog('info', `${length} tasks loaded`);
    }
    Save() {
        const tasks = {
            tasks: this.SAVED_tasks,
            unsaved: this.UNSAVED_tasks,
            deletions: this.UNSAVED_deletions
        };
        return tasks;
    }
    /**
     * Return all tasks (save and unsaved) sorted by start time (ascending)
     * @returns {Array<Task>}
     */
    Get() {
        let tasks = [ ...this.SAVED_tasks, ...this.UNSAVED_tasks ];
        return SortByKey(tasks, 'startTime');
    }

    IsUnsaved = () => {
        return this.UNSAVED_tasks.length || this.UNSAVED_deletions.length;
    }
    GetUnsaved = () => {
        let unsaved = [];
        for (let a in this.UNSAVED_tasks) {
            const task = this.UNSAVED_tasks[a];
            unsaved.push({ Action: 'add', ...task });
        }
        for (let a in this.UNSAVED_deletions) {
            const task = this.UNSAVED_deletions[a];
            unsaved.push({ Action: 'rem', ...task });
        }
        return unsaved;
    }
    Purge = () => {
        this.SAVED_tasks.push(...this.UNSAVED_tasks);
        this.UNSAVED_tasks = [];

        for (let i = this.UNSAVED_deletions.length - 1; i >= 0; i--) {
            const index = this.GetIndex(this.SAVED_tasks, this.UNSAVED_deletions[i]);
            if (index !== null) {
                this.SAVED_tasks.splice(index, 1);
            }
        }
        this.UNSAVED_deletions = [];
    }

    /**
     * Add task
     * @param {String} title - Title of the task
     * @param {Number} description - Description of the task
     * @param {Number} deadline - Unix timestamp in seconds
     * @param {'week'|'month'|null} repeatMode - Repeat mode
     * @param {Array<Number>} repeatDays - Repeat days
     * @param {Array<Subtask>} subtasks - Subtasks informations
     * @param {Boolean} [alreadySaved=false] - If false, save task in UNSAVED_activities
     * @returns {'added'|'alreadyExist'}
     */
    Add(title, description, deadline, repeatMode, repeatDays, subtasks, alreadySaved = false) {
        const newTask = new Task();
        newTask.Title = title;
        newTask.Description = description;
        newTask.Deadline = deadline;
        newTask.Schedule = null;
        if (repeatMode !== null && !!repeatDays.length) {
            newTask.Schedule = {
                Type: repeatMode,
                Repeat: repeatDays
            };
        }
        newTask.Subtasks = subtasks;

        // Check if not exist
        const indexTask = this.GetIndex(this.SAVED_tasks, newTask);
        const indexUnsaved = this.GetIndex(this.UNSAVED_tasks, newTask);
        const indexDeletion = this.GetIndex(this.UNSAVED_deletions, newTask);

        if (indexDeletion !== null) {
            this.UNSAVED_deletions.splice(indexDeletion, 1);
        }

        // Activity not exist, add it
        if (indexTask === null && indexUnsaved === null) {
            if (alreadySaved) this.SAVED_tasks.push(newTask);
            else              this.UNSAVED_tasks.push(newTask);
            return 'added';
        }

        return 'alreadyExist';
    }

    /**
     * Edit task
     * @param {Task} oldTask - Task to edit
     * @param {String} title - Title of the task
     * @param {Number} description - Description of the task
     * @param {Number} deadline - Unix timestamp in seconds
     * @param {'week'|'month'|null} repeatMode - Repeat mode
     * @param {Array<Number>} repeatDays - Repeat days
     * @param {Array<Subtask>} subtasks - Subtasks informations
     * @returns {'edited'|'notExist'}
     */
    Edit(oldTask, title, description, deadline, repeatMode, repeatDays, subtasks) {
        const rem = this.Remove(oldTask);
        if (rem === 'notExist') return 'notExist';

        const add = this.Add(title, description, deadline, repeatMode, repeatDays, subtasks);
        return add === 'added' ? 'edited' : 'notExist';
    }

    /**
     * Remove task
     * @param {Task} task
     * @returns {'removed'|'notExist'}
     */
    Remove(task) {
        const indexTask = this.GetIndex(this.SAVED_tasks, task);
        const indexUnsaved = this.GetIndex(this.UNSAVED_tasks, task);
        const indexDeletion = this.GetIndex(this.UNSAVED_deletions, task);
        let deleted = null;

        if (indexTask !== null) {
            deleted = this.SAVED_tasks.splice(indexTask, 1)[0];
            if (indexDeletion === null) {
                this.UNSAVED_deletions.push(deleted);
            }
        }
        if (indexUnsaved !== null) {
            deleted = this.UNSAVED_tasks.splice(indexUnsaved, 1)[0];
            if (indexDeletion === null) {
                this.UNSAVED_deletions.push(deleted);
            }
        }

        if (deleted !== null) {
            return 'removed';
        }

        return 'notExist';
    }

    /**
     * @param {Array<Task>} arr
     * @param {Task} task
     * @returns {Number?} - Index of task or null if not found
     */
    GetIndex(arr, task) {
        const index = arr.findIndex(a => a.Title === task.Title);
        if (index === -1) return null;
        return index;
    }
}

export { Task };
export default Tasks;