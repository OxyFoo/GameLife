import DynamicVar from 'Utils/DynamicVar';
import { GetTime } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * 
 * @typedef {object} Task
 * @property {boolean} checked
 * @property {string} title
 */

class Todo {
    /** @type {number} Time in seconds or 0 if unchecked */
    checked = 0;

    /** @type {string} Todo title with max 128 characters */
    title = '';

    /** @type {string} Todo description with max 2048 characters */
    description = '';

    /** @type {number} Timestamp in seconds */
    created = 0;

    /** @type {number} Timestamp in seconds, 0 if disabled */
    deadline = 0;

    /** @type {Array<Task>} Tasks informations */
    tasks = [];
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
        console.log('All new todos', todos.length, todos);
        const a = todos.length;
        console.log('UUUUUU', this.todosSort);

        // Add new todos title at the top
        for (const todo of todos) {
            if (!this.todosSort.includes(todo.title)) {
                this.todosSort.splice(0, 0, todo.title);
            }
        }

        console.log('All new todos', this.todosSort.length);
        console.log('UUUUUU', this.todosSort);

        // Remove deleted todos title
        this.todosSort = this.todosSort.filter(title => {
            console.log('Search', title, 'in', todos, todos.findIndex(todo => todo.title === title) !== -1);
            return todos.findIndex(todo => todo.title === title) !== -1;
        });

        console.log('All new todos', this.todosSort.length);
        console.log('UUUUUU', this.todosSort);

        return this.todosSort.map(title => todos.find(todo => todo.title === title));
    }

    IsUnsaved = () => {
        return this.UNSAVED_additions.length || this.UNSAVED_deletions.length;
    }
    GetUnsaved = () => {
        let unsaved = [];
        for (let a in this.UNSAVED_additions) {
            const todo = this.UNSAVED_additions[a];
            unsaved.push({ action: 'add', ...todo });
        }
        for (let a in this.UNSAVED_deletions) {
            const todo = this.UNSAVED_deletions[a];
            unsaved.push({ action: 'rem', ...todo });
        }
        console.log('Unsaved todos', this.Get());
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
        console.log('Purged todos', this.Get());
    }

    /**
     * Add todo or edit if already exist
     * @param {string} title Title of the todo
     * @param {string} description Description of the todo
     * @param {number} created Unix timestamp in seconds
     * @param {number} deadline Unix timestamp in seconds
     * @param {Array<Task>} tasks Tasks informations
     * @returns {'added' | 'edited'}
     */
    Add(title, description, created, deadline, tasks) {
        const newTodo = new Todo();
        newTodo.checked = 0;
        newTodo.title = title;
        newTodo.description = description;
        newTodo.created = created;
        newTodo.deadline = deadline;
        newTodo.tasks = tasks.filter(st => !!st.title);

        // Check if not exist
        const indexSaved = this.GetIndex(this.SAVED_todos, newTodo);
        const indexUnsaved = this.GetIndex(this.UNSAVED_additions, newTodo);
        const indexDeletion = this.GetIndex(this.UNSAVED_deletions, newTodo);

        if (indexDeletion !== null) {
            this.UNSAVED_deletions.splice(indexDeletion, 1);
        }

        // Todo already exist
        if (indexSaved !== null || indexUnsaved !== null) {
            if (indexSaved !== null) {
                this.SAVED_todos.splice(indexSaved, 1);
            }
            if (indexUnsaved !== null) {
                this.UNSAVED_additions.splice(indexUnsaved, 1);
            }
            console.log('Edited todo', newTodo);
            this.UNSAVED_additions.push(newTodo);
            this.allTodos.Set(this.Get());
            console.log('Edited todo2', newTodo);
            return 'edited';
        }

        // Todo not exist, add it
        console.log('Added todo', newTodo);
        this.UNSAVED_additions.push(newTodo);
        this.allTodos.Set(this.Get());
        console.log('Added todo2', newTodo);
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
        if (!this.todosSort.includes(todo.title)) {
            this.user.interface.console.AddLog('warn', `Todos - move failed: todo not found (${todo.title} ${newIndex})`);
            return false;
        }
        if (newIndex < 0 || newIndex > this.todosSort.length) {
            this.user.interface.console.AddLog('warn', `Todos - move failed: index out of range (${todo.title} ${newIndex})`);
            return false;
        }
        const oldIndex = this.todosSort.indexOf(todo.title);
        if (oldIndex === newIndex) {
            this.user.interface.console.AddLog('warn', `Todos - move failed: same index (${todo.title} ${newIndex})`);
            return false;
        }
        this.todosSort.splice(oldIndex, 1);
        this.todosSort.splice(newIndex, 0, todo.title);
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
            this.user.interface.console.AddLog('warn', `Todos - check failed: todo not found (${todo.title} ${checkedTime})`);
            return false;
        }

        selectedTodo.checked = checkedTime;
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
        this.lastDeletedTodo.checked = 0;
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
        const index = arr.findIndex(a => a.title === todo.title);
        if (index === -1) return null;
        return index;
    }
}

export { Todo };
export default Todos;
