/**
 * @typedef {Object} Schedule
 * @property {'week'|'month'} Type
 * @property {Array<Number>} Repeat
 */

/**
 * @typedef {Object} Subtask
 * @property {Boolean} Checked
 * @property {String} Title
 */

class Task {
    /** @type {Number?} Time in seconds or null if unchecked */
    Checked = null;
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
        this.UNSAVED_additions = [];

        /**
         * @type {Array<Task>}
         */
        this.UNSAVED_deletions = [];

        /**
         * @type {Array<String>}
         */
        this.sortTitles = [];

        /**
         * TODO
         * @description Not saved, only to undo last deletion
         * @type {Task?}
         */
        this.lastDeletedTask = null;
    }

    Clear() {
        this.SAVED_tasks = [];
        this.UNSAVED_additions = [];
        this.UNSAVED_deletions = [];
        this.sortTitles = [];
    }
    Load(tasks) {
        const contains = (key) => tasks.hasOwnProperty(key);
        if (contains('tasks'))      this.SAVED_tasks = tasks['tasks'];
        if (contains('additions'))  this.UNSAVED_additions = tasks['additions'];
        if (contains('deletions'))  this.UNSAVED_deletions = tasks['deletions'];
        if (contains('sortTitles')) this.sortTitles = tasks['sortTitles'];
    }
    LoadOnline(tasks) {
        if (typeof(tasks) !== 'object') return;
        this.SAVED_tasks = tasks.map(task => Object.assign(new Task(), task));
        const length = this.SAVED_tasks.length;
        this.user.interface.console.AddLog('info', `${length} tasks loaded`);
    }
    Save() {
        const tasks = {
            tasks: this.SAVED_tasks,
            additions: this.UNSAVED_additions,
            deletions: this.UNSAVED_deletions,
            sortTitles: this.sortTitles
        };
        return tasks;
    }
    /**
     * Return all tasks (save and unsaved) sorted by start time (ascending)
     * @returns {Array<Task>}
     */
    Get() {
        let tasks = [ ...this.SAVED_tasks, ...this.UNSAVED_additions ];
        // Add new tasks title at the top & remove deleted tasks title
        tasks.forEach(task => this.sortTitles.findIndex(title => task.Title === title) === -1 && this.sortTitles.splice(0, 0, task.Title));
        this.sortTitles = this.sortTitles.filter(title => tasks.findIndex(task => task.Title === title) !== -1);
        return this.sortTitles.map(title => tasks.find(task => task.Title === title));
    }

    IsUnsaved = () => {
        return this.UNSAVED_additions.length || this.UNSAVED_deletions.length;
    }
    GetUnsaved = () => {
        let unsaved = [];
        for (let a in this.UNSAVED_additions) {
            const task = this.UNSAVED_additions[a];
            unsaved.push({ Action: 'add', ...task });
        }
        for (let a in this.UNSAVED_deletions) {
            const task = this.UNSAVED_deletions[a];
            unsaved.push({ Action: 'rem', ...task });
        }
        return unsaved;
    }
    Purge = () => {
        this.SAVED_tasks.push(...this.UNSAVED_additions);
        this.UNSAVED_additions = [];

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
     * @param {Number?} deadline - Unix timestamp in seconds
     * @param {'week'|'month'|null} repeatMode - Repeat mode
     * @param {Array<Number>} repeatDays - Repeat days
     * @param {Array<Subtask>} subtasks - Subtasks informations
     * @returns {'added'|'alreadyExist'}
     */
    Add(title, description, deadline, repeatMode, repeatDays, subtasks) {
        const newTask = new Task();
        newTask.Checked = null;
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
        newTask.Subtasks = subtasks.filter(st => !!st.Title);

        // Check if not exist
        const indexTask = this.GetIndex(this.SAVED_tasks, newTask);
        const indexUnsaved = this.GetIndex(this.UNSAVED_additions, newTask);
        const indexDeletion = this.GetIndex(this.UNSAVED_deletions, newTask);

        if (indexDeletion !== null) {
            this.UNSAVED_deletions.splice(indexDeletion, 1);
        }

        // Task not exist, add it
        if (indexTask === null && indexUnsaved === null) {
            this.UNSAVED_additions.push(newTask);
            return 'added';
        }

        return 'alreadyExist';
    }

    /**
     * Edit task
     * @param {Task} oldTask - Task to edit
     * @param {String} title - Title of the task
     * @param {Number} description - Description of the task
     * @param {Number?} deadline - Unix timestamp in seconds
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
        const indexUnsaved = this.GetIndex(this.UNSAVED_additions, task);
        const indexDeletion = this.GetIndex(this.UNSAVED_deletions, task);
        let deleted = null;

        if (indexTask !== null) {
            deleted = this.SAVED_tasks.splice(indexTask, 1)[0];
            if (indexDeletion === null) {
                this.UNSAVED_deletions.push(deleted);
            }
        }
        if (indexUnsaved !== null) {
            deleted = this.UNSAVED_additions.splice(indexUnsaved, 1)[0];
            if (indexDeletion === null) {
                this.UNSAVED_deletions.push(deleted);
            }
        }

        if (deleted !== null) {
            this.lastDeletedTask = deleted;
            return 'removed';
        }

        return 'notExist';
    }

    /**
     * Change sort order of tasks titles
     * @param {Task} task
     * @param {Number} newIndex
     * @returns {Boolean} Success of the operation
     */
    Move(task, newIndex) {
        if (!this.sortTitles.includes(task.Title)) {
            this.user.interface.console.AddLog('warn', `Tasks - move failed: task not found (${task.Title} ${newIndex})`);
            return false;
        }
        if (newIndex < 0 || newIndex > this.sortTitles.length) {
            this.user.interface.console.AddLog('warn', `Tasks - move failed: index out of range (${task.Title} ${newIndex})`);
            return false;
        }
        const oldIndex = this.sortTitles.indexOf(task.Title);
        if (oldIndex === newIndex) {
            this.user.interface.console.AddLog('warn', `Tasks - move failed: same index (${task.Title} ${newIndex})`);
            return false;
        }
        this.sortTitles.splice(oldIndex, 1);
        this.sortTitles.splice(newIndex, 0, task.Title);
        return true;
    }

    /**
     * Change sort order of tasks titles
     * @param {Task} task
     * @param {Number?} checked Time in seconds or null if unchecked
     * @returns {Boolean} Success of the operation
     */
    Check(task, checked) {
        let selectedTask = null;
        const indexTask = this.GetIndex(this.SAVED_tasks, task);
        const indexUnsaved = this.GetIndex(this.UNSAVED_additions, task);

        if (indexTask !== null) selectedTask = this.SAVED_tasks.splice(indexTask, 1)[0];
        if (indexUnsaved !== null) selectedTask = this.UNSAVED_additions.splice(indexUnsaved, 1)[0];
        if (selectedTask === null) {
            this.user.interface.console.AddLog('warn', `Tasks - check failed: task not found (${task.Title} ${checked})`);
            return false;
        }

        selectedTask.Checked = checked;
        this.UNSAVED_additions.push(selectedTask);
        return true;
    }

    /**
     * Restore last deleted task
     * @returns {Boolean} Success of the operation
     */
    Undo() {
        if (this.lastDeletedTask === null) return false;

        // Delete task from UNSAVED_deletions
        const indexDeletion = this.GetIndex(this.UNSAVED_deletions, this.lastDeletedTask);
        if (indexDeletion !== null) this.UNSAVED_deletions.splice(indexDeletion, 1);

        // Save unchecked task in UNSAVED_additions
        this.lastDeletedTask.Checked = null;
        this.UNSAVED_additions.push(this.lastDeletedTask);
        this.lastDeletedTask = null;

        return true;
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