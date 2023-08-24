import DynamicVar from 'Utils/DynamicVar';
import { GetTime } from 'Utils/Time';
import { MonthDayBetween, WeekDayBetween } from 'Utils/Date';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {'none'|'week'|'month'} RepeatModes
 * 
 * @typedef {object} Schedule
 * @property {RepeatModes} Type
 * @property {Array<number>} Repeat
 * 
 * @typedef {object} Subtask
 * @property {boolean} Checked
 * @property {string} Title
 */

class Task {
    /** @type {number} Time in seconds or 0 if unchecked */
    Checked = 0;

    /** @type {string} Task title with max 128 characters */
    Title = '';

    /** @type {string} Task description with max 2048 characters */
    Description = '';

    /** @type {number} Timestamp in seconds */
    Starttime = 0;

    /** @type {number} Timestamp in seconds, 0 if disabled */
    Deadline = 0;

    /** @type {Schedule} Null to don't repeat */
    Schedule = {
        Type: 'none',
        Repeat: []
    };

    /** @type {Array<Subtask>} Subtasks informations */
    Subtasks = [];
}

class Tasks {
    constructor(user) {
        /** @type {UserManager} */
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
         * Sorted tasks using titles
         * @type {Array<string>}
         */
        this.tasksSort = [];

        /**
         * @type {boolean} True if tasks sort is saved
         */
        this.SAVED_sort = true;

        /**
         * @description All tasks (saved and unsaved)
         */
        this.allTasks = new DynamicVar([]);

        /**
         * @description Not saved, only to undo last deletion
         * @type {Task|null}
         */
        this.lastDeletedTask = null;
    }

    Clear() {
        this.SAVED_tasks = [];
        this.UNSAVED_additions = [];
        this.UNSAVED_deletions = [];
        this.tasksSort = [];
        this.SAVED_sort = true;
        this.allTasks.Set([]);
    }
    Load(tasks) {
        const contains = (key) => tasks.hasOwnProperty(key);
        if (contains('tasks'))      this.SAVED_tasks = tasks['tasks'];
        if (contains('additions'))  this.UNSAVED_additions = tasks['additions'];
        if (contains('deletions'))  this.UNSAVED_deletions = tasks['deletions'];
        if (contains('tasksSort'))  this.tasksSort = tasks['tasksSort'];
        if (contains('sortSaved'))  this.SAVED_sort = tasks['sortSaved'];
        this.allTasks.Set(this.Get());
    }
    LoadOnline(tasks) {
        if (typeof(tasks) !== 'object') return;
        this.SAVED_tasks = tasks.map(task => Object.assign(new Task(), task));
        this.user.interface.console.AddLog('info', `${this.SAVED_tasks.length} tasks loaded`);
        this.allTasks.Set(this.Get());
    }
    Save() {
        const tasks = {
            tasks: this.SAVED_tasks,
            additions: this.UNSAVED_additions,
            deletions: this.UNSAVED_deletions,
            tasksSort: this.tasksSort,
            sortSaved: this.SAVED_sort
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
        tasks.forEach(task => this.tasksSort.findIndex(title => task.Title === title) === -1 && this.tasksSort.splice(0, 0, task.Title));
        this.tasksSort = this.tasksSort.filter(title => tasks.findIndex(task => task.Title === title) !== -1);
        return this.tasksSort.map(title => tasks.find(task => task.Title === title));
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
        this.SAVED_sort = true;
    }

    /**
     * Reset tasks which are scheduled to be reset (checked & repeat)
     */
    RefreshScheduleTasks() {
        const tasks = this.Get();
        for (let i = 0; i < tasks.length; i++) {
            let task = tasks[i];
            if (task.Checked === 0 || task.Schedule.Type === 'none') continue;

            let reset = false;
            const now = GetTime();
            if (task.Schedule.Type === 'week') {
                reset ||= WeekDayBetween(task.Schedule.Repeat, task.Checked, now);
            } else if (task.Schedule.Type === 'month') {
                reset ||= MonthDayBetween(task.Schedule.Repeat, task.Checked, now);
            }
            if (reset) {
                this.Remove(task);
                this.Undo();
            }
        }
    }

    /**
     * Add task
     * @param {string} title Title of the task
     * @param {string} description Description of the task
     * @param {number} deadline Unix timestamp in seconds
     * @param {RepeatModes} repeatMode Repeat mode
     * @param {Array<number>} repeatDays Repeat days
     * @param {Array<Subtask>} subtasks Subtasks informations
     * @returns {'added'|'alreadyExist'}
     */
    Add(title, description, deadline, repeatMode, repeatDays, subtasks) {
        const newTask = new Task();
        newTask.Checked = 0;
        newTask.Title = title;
        newTask.Description = description;
        newTask.Starttime = GetTime();
        newTask.Deadline = deadline;
        newTask.Schedule = {
            Type: repeatMode,
            Repeat: repeatDays
        };
        newTask.Subtasks = subtasks.filter(st => !!st.Title);

        // Check if repeat mode is valid
        if (repeatMode !== 'none' && repeatDays.length <= 0) {
            repeatMode = 'none';
        }

        // Check if not exist
        const indexTask = this.GetIndex(this.SAVED_tasks, newTask);
        const indexUnsaved = this.GetIndex(this.UNSAVED_additions, newTask);
        const indexDeletion = this.GetIndex(this.UNSAVED_deletions, newTask);

        if (indexDeletion !== null) {
            this.UNSAVED_deletions.splice(indexDeletion, 1);
        }

        // Task already exist
        if (indexTask !== null || indexUnsaved !== null) {
            return 'alreadyExist';
        }

        // Task not exist, add it
        this.UNSAVED_additions.push(newTask);
        this.allTasks.Set(this.Get());
        return 'added';
    }

    /**
     * Edit task
     * @param {Task} oldTask Task to edit
     * @param {string} title Title of the task
     * @param {string} description Description of the task
     * @param {number} deadline Unix timestamp in seconds (0 = no deadline)
     * @param {RepeatModes} repeatMode Repeat mode
     * @param {Array<number>} repeatDays Repeat days
     * @param {Array<Subtask>} subtasks Subtasks informations
     * @returns {'edited'|'notExist'}
     */
    Edit(oldTask, title, description, deadline, repeatMode, repeatDays, subtasks) {
        const rem = this.Remove(oldTask);
        if (rem === 'notExist') return 'notExist';

        // Check if repeat mode is valid
        if (repeatMode !== 'none' && repeatDays.length <= 0) {
            repeatMode = 'none';
        }

        const add = this.Add(title, description, deadline, repeatMode, repeatDays, subtasks);
        this.allTasks.Set(this.Get());
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
            this.allTasks.Set(this.Get());
            return 'removed';
        }

        return 'notExist';
    }

    /**
     * Change sort order of tasks titles
     * @param {Task} task
     * @param {number} newIndex
     * @returns {boolean} Success of the operation
     */
    Move(task, newIndex) {
        if (!this.tasksSort.includes(task.Title)) {
            this.user.interface.console.AddLog('warn', `Tasks - move failed: task not found (${task.Title} ${newIndex})`);
            return false;
        }
        if (newIndex < 0 || newIndex > this.tasksSort.length) {
            this.user.interface.console.AddLog('warn', `Tasks - move failed: index out of range (${task.Title} ${newIndex})`);
            return false;
        }
        const oldIndex = this.tasksSort.indexOf(task.Title);
        if (oldIndex === newIndex) {
            this.user.interface.console.AddLog('warn', `Tasks - move failed: same index (${task.Title} ${newIndex})`);
            return false;
        }
        this.tasksSort.splice(oldIndex, 1);
        this.tasksSort.splice(newIndex, 0, task.Title);
        this.SAVED_sort = false;
        this.allTasks.Set(this.Get());
        return true;
    }

    /**
     * Change sort order of tasks titles
     * @param {Task} task
     * @param {number} checkedTime UTC Time in seconds or 0 if unchecked
     * @returns {boolean} Success of the operation
     */
    Check(task, checkedTime) {
        let selectedTask = null;
        const indexTask = this.GetIndex(this.SAVED_tasks, task);
        const indexUnsaved = this.GetIndex(this.UNSAVED_additions, task);

        if (indexTask !== null) selectedTask = this.SAVED_tasks.splice(indexTask, 1)[0];
        if (indexUnsaved !== null) selectedTask = this.UNSAVED_additions.splice(indexUnsaved, 1)[0];
        if (selectedTask === null) {
            this.user.interface.console.AddLog('warn', `Tasks - check failed: task not found (${task.Title} ${checkedTime})`);
            return false;
        }

        selectedTask.Checked = checkedTime;
        this.UNSAVED_additions.push(selectedTask);
        this.allTasks.Set(this.Get());
        return true;
    }

    /**
     * Restore last deleted task
     * @returns {boolean} Success of the operation
     */
    Undo() {
        if (this.lastDeletedTask === null) return false;

        // Delete task from UNSAVED_deletions
        const indexDeletion = this.GetIndex(this.UNSAVED_deletions, this.lastDeletedTask);
        if (indexDeletion !== null) this.UNSAVED_deletions.splice(indexDeletion, 1);

        // Save unchecked task in UNSAVED_additions
        this.lastDeletedTask.Checked = 0;
        this.UNSAVED_additions.push(this.lastDeletedTask);
        this.lastDeletedTask = null;
        this.allTasks.Set(this.Get());

        return true;
    }

    /**
     * @param {Array<Task>} arr
     * @param {Task} task
     * @returns {number|null} Index of task or null if not found
     */
    GetIndex(arr, task) {
        const index = arr.findIndex(a => a.Title === task.Title);
        if (index === -1) return null;
        return index;
    }
}

export { Task };
export default Tasks;