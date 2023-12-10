import DynamicVar from 'Utils/DynamicVar';
import { GetTime } from 'Utils/Time';
import { MonthDayBetween, WeekDayBetween } from 'Utils/Date';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {'none' | 'week' | 'month'} RepeatModes
 * 
 * @typedef {object} Schedule
 * @property {RepeatModes} Type
 * @property {Array<number>} Repeat
 * 
 * @typedef {object} Skill
 * @property {number} id
 * @property {boolean} isCategory
 * 
 * @typedef {object} Task
 * @property {boolean} Checked
 * @property {string} Title
 */

class Todo {
    /** @type {number} Time in seconds or 0 if unchecked */
    Checked = 0;

    /** @type {string} Todo title with max 128 characters */
    Title = '';

    /** @type {string} Todo description with max 2048 characters */
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

    /** @type {Skill | null} */
    Skill = null;

    /** @type {Array<Task>} Tasks informations */
    Tasks = [];
}

class Todos {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;
    }

    /**
     * @type {Array<Todo>}
     */
    SAVED_todos = [];

    /**
     * @type {Array<Todo>}
     */
    UNSAVED_additions = [];

    /**
     * @type {Array<Todo>}
     */
    UNSAVED_deletions = [];

    /**
     * Sorted todos using titles
     * @type {Array<string>}
     */
    todosSort = [];

    /**
     * @type {boolean} True if todos sort is saved
     */
    SAVED_sort = true;

    /**
     * @description All todos (saved and unsaved)
     * @type {DynamicVar<Array<Todo>>}
     */
    allTodos = new DynamicVar([]);

    /**
     * @description Not saved, only to undo last deletion
     * @type {Todo | null}
     */
    lastDeletedTodo = null;

    Clear() {
        this.SAVED_todos = [];
        this.UNSAVED_additions = [];
        this.UNSAVED_deletions = [];
        this.todosSort = [];
        this.SAVED_sort = true;
        this.allTodos.Set([]);
    }
    Load(todos) {
        const contains = (key) => todos.hasOwnProperty(key);
        if (contains('todos'))      this.SAVED_todos = todos['todos'];
        if (contains('additions'))  this.UNSAVED_additions = todos['additions'];
        if (contains('deletions'))  this.UNSAVED_deletions = todos['deletions'];
        if (contains('todosSort'))  this.todosSort = todos['todosSort'];
        if (contains('sortSaved'))  this.SAVED_sort = todos['sortSaved'];
        this.allTodos.Set(this.Get());
    }
    LoadOnline(todos) {
        if (typeof(todos) !== 'object') return;
        this.SAVED_todos = todos.map(todo => Object.assign(new Todo(), todo));
        this.user.interface.console.AddLog('info', `${this.SAVED_todos.length} todos loaded`);
        this.allTodos.Set(this.Get());
    }
    Save() {
        const todos = {
            todos: this.SAVED_todos,
            additions: this.UNSAVED_additions,
            deletions: this.UNSAVED_deletions,
            todosSort: this.todosSort,
            sortSaved: this.SAVED_sort
        };
        return todos;
    }
    /**
     * Return all todos (save and unsaved) sorted by start time (ascending)
     * @returns {Array<Todo>}
     */
    Get() {
        let todos = [ ...this.SAVED_todos, ...this.UNSAVED_additions ];

        // Add new todos title at the top
        todos.forEach(todo =>
            this.todosSort.findIndex(title => todo.Title === title) === -1 &&
            this.todosSort.splice(0, 0, todo.Title)
        );

        // Remove deleted todos title
        const filter = title => todos.findIndex(todo => todo.Title === title) !== -1;
        this.todosSort = this.todosSort.filter(filter);

        return this.todosSort.map(title => todos.find(todo => todo.Title === title));
    }

    IsUnsaved = () => {
        return this.UNSAVED_additions.length || this.UNSAVED_deletions.length;
    }
    GetUnsaved = () => {
        let unsaved = [];
        for (let a in this.UNSAVED_additions) {
            const todo = this.UNSAVED_additions[a];
            unsaved.push({ Action: 'add', ...todo });
        }
        for (let a in this.UNSAVED_deletions) {
            const todo = this.UNSAVED_deletions[a];
            unsaved.push({ Action: 'rem', ...todo });
        }
        return unsaved;
    }
    Purge = () => {
        this.SAVED_todos.push(...this.UNSAVED_additions);
        this.UNSAVED_additions = [];

        for (let i = this.UNSAVED_deletions.length - 1; i >= 0; i--) {
            const index = this.GetIndex(this.SAVED_todos, this.UNSAVED_deletions[i]);
            if (index !== null) {
                this.SAVED_todos.splice(index, 1);
            }
        }
        this.UNSAVED_deletions = [];
        this.SAVED_sort = true;
    }

    /**
     * Reset todos which are scheduled to be reset (checked & repeat)
     */
    RefreshScheduleTodos() {
        const todos = this.Get();
        for (let i = 0; i < todos.length; i++) {
            let todo = todos[i];
            if (todo.Checked === 0 || todo.Schedule.Type === 'none') continue;

            let reset = false;
            const now = GetTime();
            if (todo.Schedule.Type === 'week') {
                reset ||= WeekDayBetween(todo.Schedule.Repeat, todo.Checked, now);
            } else if (todo.Schedule.Type === 'month') {
                reset ||= MonthDayBetween(todo.Schedule.Repeat, todo.Checked, now);
            }
            if (reset) {
                this.Remove(todo);
                this.Undo();
            }
        }
    }

    /**
     * Add todo or edit if already exist
     * @param {string} title Title of the todo
     * @param {string} description Description of the todo
     * @param {number} deadline Unix timestamp in seconds
     * @param {RepeatModes} repeatMode Repeat mode
     * @param {Array<number>} repeatDays Repeat days
     * @param {Skill | null} skill Skill informations
     * @param {Array<Task>} tasks Tasks informations
     * @returns {'added' | 'edited'}
     */
    Add(title, description, deadline, repeatMode, repeatDays, skill, tasks) {
        const newTodo = new Todo();
        newTodo.Checked = 0;
        newTodo.Title = title;
        newTodo.Description = description;
        newTodo.Starttime = GetTime();
        newTodo.Deadline = deadline;
        newTodo.Skill = skill;
        newTodo.Schedule = {
            Type: repeatMode,
            Repeat: repeatDays
        };
        newTodo.Tasks = tasks.filter(st => !!st.Title);

        // Check if repeat mode is valid
        if (repeatMode !== 'none' && repeatDays.length <= 0) {
            repeatMode = 'none';
        }

        // Check if not exist
        const indexTodo = this.GetIndex(this.SAVED_todos, newTodo);
        const indexUnsaved = this.GetIndex(this.UNSAVED_additions, newTodo);
        const indexDeletion = this.GetIndex(this.UNSAVED_deletions, newTodo);

        if (indexDeletion !== null) {
            this.UNSAVED_deletions.splice(indexDeletion, 1);
        }

        // Todo already exist
        if (indexTodo !== null || indexUnsaved !== null) {
            if (indexTodo !== null) {
                this.SAVED_todos.splice(indexDeletion, 1);
            }
            if (indexUnsaved !== null) {
                this.UNSAVED_additions.splice(indexUnsaved, 1);
            }
            this.UNSAVED_additions.push(newTodo);
            return 'edited';
        }

        // Todo not exist, add it
        this.UNSAVED_additions.push(newTodo);
        this.allTodos.Set(this.Get());
        return 'added';
    }

    /**
     * Remove todo
     * @param {Todo} todo
     * @returns {'removed' | 'notExist'}
     */
    Remove(todo) {
        const indexTodo = this.GetIndex(this.SAVED_todos, todo);
        const indexUnsaved = this.GetIndex(this.UNSAVED_additions, todo);
        const indexDeletion = this.GetIndex(this.UNSAVED_deletions, todo);
        let deleted = null;

        if (indexTodo !== null) {
            deleted = this.SAVED_todos.splice(indexTodo, 1)[0];
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
            this.lastDeletedTodo = deleted;
            this.allTodos.Set(this.Get());
            return 'removed';
        }

        return 'notExist';
    }

    /**
     * Change sort order of todos titles
     * @param {Todo} todo
     * @param {number} newIndex
     * @returns {boolean} Success of the operation
     */
    Move(todo, newIndex) {
        if (!this.todosSort.includes(todo.Title)) {
            this.user.interface.console.AddLog('warn', `Todos - move failed: todo not found (${todo.Title} ${newIndex})`);
            return false;
        }
        if (newIndex < 0 || newIndex > this.todosSort.length) {
            this.user.interface.console.AddLog('warn', `Todos - move failed: index out of range (${todo.Title} ${newIndex})`);
            return false;
        }
        const oldIndex = this.todosSort.indexOf(todo.Title);
        if (oldIndex === newIndex) {
            this.user.interface.console.AddLog('warn', `Todos - move failed: same index (${todo.Title} ${newIndex})`);
            return false;
        }
        this.todosSort.splice(oldIndex, 1);
        this.todosSort.splice(newIndex, 0, todo.Title);
        this.SAVED_sort = false;
        this.allTodos.Set(this.Get());
        return true;
    }

    /**
     * Change sort order of todos titles
     * @param {Todo} todo
     * @param {number} checkedTime UTC Time in seconds or 0 if unchecked
     * @returns {boolean} Success of the operation
     */
    Check(todo, checkedTime) {
        let selectedTodo = null;
        const indexTodo = this.GetIndex(this.SAVED_todos, todo);
        const indexUnsaved = this.GetIndex(this.UNSAVED_additions, todo);

        if (indexTodo !== null) selectedTodo = this.SAVED_todos.splice(indexTodo, 1)[0];
        if (indexUnsaved !== null) selectedTodo = this.UNSAVED_additions.splice(indexUnsaved, 1)[0];
        if (selectedTodo === null) {
            this.user.interface.console.AddLog('warn', `Todos - check failed: todo not found (${todo.Title} ${checkedTime})`);
            return false;
        }

        selectedTodo.Checked = checkedTime;
        this.UNSAVED_additions.push(selectedTodo);
        this.allTodos.Set(this.Get());
        return true;
    }

    /**
     * @param {Todo} todo
     * @returns {boolean} Success of the operation
     */
    Uncheck(todo) {
        return this.Check(todo, 0);
    }

    /**
     * Restore last deleted todo
     * @returns {boolean} Success of the operation
     */
    Undo() {
        if (this.lastDeletedTodo === null) return false;

        // Delete todo from UNSAVED_deletions
        const indexDeletion = this.GetIndex(this.UNSAVED_deletions, this.lastDeletedTodo);
        if (indexDeletion !== null) this.UNSAVED_deletions.splice(indexDeletion, 1);

        // Save unchecked todo in UNSAVED_additions
        this.lastDeletedTodo.Checked = 0;
        this.UNSAVED_additions.push(this.lastDeletedTodo);
        this.lastDeletedTodo = null;
        this.allTodos.Set(this.Get());

        // Save new sort
        this.SAVED_sort = false;

        return true;
    }

    /**
     * @param {Array<Todo>} arr
     * @param {Todo} todo
     * @returns {number | null} Index of todo or null if not found
     */
    GetIndex(arr, todo) {
        const index = arr.findIndex(a => a.Title === todo.Title);
        if (index === -1) return null;
        return index;
    }
}

export { Todo };
export default Todos;
