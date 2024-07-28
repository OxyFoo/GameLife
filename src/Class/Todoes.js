import DynamicVar from 'Utils/DynamicVar';
import { GetGlobalTime } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 *
 * @typedef {object} Task
 * @property {boolean} checked
 * @property {string} title
 */

const MAX_TODOES = 10;

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

/** @type {Array<Todo>} */
const EMPTY_TODO_LIST = [];

class Todoes {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;
    }

    /**
     * @type {Array<Todo>}
     */
    SAVED_todoes = [];

    /**
     * @type {Array<Todo>}
     */
    UNSAVED_additions = [];

    /**
     * @type {Array<Todo>}
     */
    UNSAVED_deletions = [];

    /**
     * Sorted todoes using titles
     * @type {Array<number>}
     */
    sort = [];

    /**
     * @type {boolean} True if todoes sort is saved
     */
    SAVED_sort = true;

    /**
     * @description All todoes (saved and unsaved)
     * @type {DynamicVar<Array<Todo>>}
     */
    allTodoes = new DynamicVar(EMPTY_TODO_LIST);

    /**
     * @description Not saved, only to undo last deletion
     * @type {Todo | null}
     */
    lastDeletedTodo = null;

    Clear() {
        this.SAVED_todoes = [];
        this.UNSAVED_additions = [];
        this.UNSAVED_deletions = [];
        this.sort = [];
        this.SAVED_sort = true;
        this.allTodoes.Set([]);
    }
    Load(data) {
        const contains = /** @param {string} key */ (key) => data.hasOwnProperty(key);
        if (contains('todoes')) this.SAVED_todoes = data['todoes'];
        if (contains('additions')) this.UNSAVED_additions = data['additions'];
        if (contains('deletions')) this.UNSAVED_deletions = data['deletions'];
        if (contains('sort')) this.sort = data['sort'];
        if (contains('sortSaved')) this.SAVED_sort = data['sortSaved'];
        this.allTodoes.Set(this.Get());
    }
    LoadOnline(data) {
        if (typeof data !== 'object') return;
        const contains = /** @param {string} key */ (key) => data.hasOwnProperty(key);

        if (contains('data')) {
            this.SAVED_todoes = data['data'].map((todo) => Object.assign(new Todo(), todo));
            this.user.interface.console?.AddLog('info', `${this.SAVED_todoes.length} todoes loaded`);
            this.allTodoes.Set(this.Get());
        }
        if (contains('sort')) this.sort = data['sort'];
    }
    Save() {
        const todoes = {
            todoes: this.SAVED_todoes,
            additions: this.UNSAVED_additions,
            deletions: this.UNSAVED_deletions,
            sort: this.sort,
            sortSaved: this.SAVED_sort
        };
        return todoes;
    }
    /**
     * Return all todoes (save and unsaved) sorted by start time (ascending)
     * @returns {Array<Todo>}
     */
    Get() {
        let todoes = [...this.SAVED_todoes, ...this.UNSAVED_additions];

        // Add new todoes title at the top
        for (const todo of todoes) {
            if (!this.sort.includes(todo.created)) {
                this.sort.splice(0, 0, todo.created);
                this.SAVED_sort = false;
            }
        }

        // Remove deleted todoes title
        this.sort = this.sort.filter((created) => {
            if (todoes.findIndex((todo) => todo.created === created) !== -1) {
                return true;
            }
            this.SAVED_sort = false;
            return false;
        });

        // @ts-ignore
        return this.sort
            .map((created) => todoes.find((todo) => todo.created === created) || null)
            .filter((todo) => todo !== null);
    }

    IsUnsaved = () => {
        if (this.SAVED_sort === false) {
            return true;
        }
        if (this.UNSAVED_additions.length || this.UNSAVED_deletions.length) {
            return true;
        }
        return false;
    };
    GetUnsaved = () => {
        const data = {};

        if (this.UNSAVED_additions.length || this.UNSAVED_deletions.length) {
            let unsaved = [];
            for (let a in this.UNSAVED_additions) {
                const todo = this.UNSAVED_additions[a];
                unsaved.push({ action: 'add', ...todo });
            }
            for (let a in this.UNSAVED_deletions) {
                const todo = this.UNSAVED_deletions[a];
                unsaved.push({ action: 'rem', ...todo });
            }
            data['content'] = unsaved;
        }

        if (this.SAVED_sort === false) {
            data['sort'] = this.sort;
        }

        return data;
    };
    Purge = () => {
        this.SAVED_todoes.push(...this.UNSAVED_additions);
        this.UNSAVED_additions = [];

        for (let i = this.UNSAVED_deletions.length - 1; i >= 0; i--) {
            const index = this.GetIndex(this.SAVED_todoes, this.UNSAVED_deletions[i]);
            if (index !== null) {
                this.SAVED_todoes.splice(index, 1);
            }
        }
        this.UNSAVED_deletions = [];
        this.SAVED_sort = true;
    };

    IsMax = () => {
        return this.Get().length >= MAX_TODOES;
    };

    /**
     * Add todo or edit if already exist
     * @param {string} title Title of the todo
     * @param {string} description Description of the todo
     * @param {number} deadline Unix timestamp in seconds
     * @param {Array<Task>} tasks Tasks informations
     * @returns {boolean}
     */
    Add(title, description, deadline, tasks) {
        const newTodo = new Todo();
        newTodo.checked = 0;
        newTodo.title = title;
        newTodo.description = description;
        newTodo.created = GetGlobalTime();
        newTodo.deadline = deadline;
        newTodo.tasks = tasks.filter((st) => !!st.title);

        // Check if not exist
        const indexSaved = this.GetIndex(this.SAVED_todoes, newTodo);
        const indexUnsaved = this.GetIndex(this.UNSAVED_additions, newTodo);
        const indexDeletion = this.GetIndex(this.UNSAVED_deletions, newTodo);

        // Todo already exist
        if (indexSaved !== null || indexUnsaved !== null) {
            return false;
        }

        if (indexDeletion !== null) {
            this.UNSAVED_deletions.splice(indexDeletion, 1);
        }

        // Todo not exist, add it
        this.UNSAVED_additions.push(newTodo);
        this.allTodoes.Set(this.Get());
        return true;
    }

    /**
     * @param {Todo} oldTodo
     * @param {string} title Title of the todo
     * @param {string} description Description of the todo
     * @param {number} deadline Unix timestamp in seconds
     * @param {Array<Task>} tasks Tasks informations
     * @returns {boolean}
     */
    Edit(oldTodo, title, description, deadline, tasks) {
        const newTodo = new Todo();
        newTodo.checked = 0;
        newTodo.title = title;
        newTodo.description = description;
        newTodo.created = oldTodo.created;
        newTodo.deadline = deadline;
        newTodo.tasks = tasks.filter((st) => !!st.title);

        // Check if not exist
        const indexSaved = this.GetIndex(this.SAVED_todoes, newTodo);
        const indexUnsaved = this.GetIndex(this.UNSAVED_additions, newTodo);
        const indexDeletion = this.GetIndex(this.UNSAVED_deletions, newTodo);

        // Todo already exist
        if (indexSaved === null && indexUnsaved === null) {
            return false;
        }

        if (indexDeletion !== null) {
            this.UNSAVED_deletions.splice(indexDeletion, 1);
        }

        if (indexSaved !== null) {
            this.SAVED_todoes.splice(indexSaved, 1);
        }
        if (indexUnsaved !== null) {
            this.UNSAVED_additions.splice(indexUnsaved, 1);
        }
        this.UNSAVED_additions.push(newTodo);
        this.allTodoes.Set(this.Get());
        return true;
    }

    /**
     * Remove todo
     * @param {Todo} todo
     * @returns {'removed' | 'notExist'}
     */
    Remove(todo) {
        const indexTodo = this.GetIndex(this.SAVED_todoes, todo);
        const indexUnsaved = this.GetIndex(this.UNSAVED_additions, todo);
        const indexDeletion = this.GetIndex(this.UNSAVED_deletions, todo);
        let deleted = null;

        if (indexTodo !== null) {
            deleted = this.SAVED_todoes.splice(indexTodo, 1)[0];
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
            this.allTodoes.Set(this.Get());
            return 'removed';
        }

        return 'notExist';
    }

    /**
     * Change sort order of todoes titles
     * @param {Todo} todo
     * @param {number} newIndex
     * @returns {boolean} Success of the operation
     */
    Move(todo, newIndex) {
        if (!this.sort.includes(todo.created)) {
            this.user.interface.console?.AddLog(
                'warn',
                `Todoes - move failed: todo not found (${todo.title} ${newIndex})`
            );
            return false;
        }
        if (newIndex < 0 || newIndex > this.sort.length) {
            this.user.interface.console?.AddLog(
                'warn',
                `Todoes - move failed: index out of range (${todo.title} ${newIndex})`
            );
            return false;
        }
        const oldIndex = this.sort.indexOf(todo.created);
        if (oldIndex === newIndex) {
            this.user.interface.console?.AddLog('warn', `Todoes - move failed: same index (${todo.title} ${newIndex})`);
            return false;
        }
        this.sort.splice(oldIndex, 1);
        this.sort.splice(newIndex, 0, todo.created);
        this.SAVED_sort = false;
        this.allTodoes.Set(this.Get());
        return true;
    }

    /**
     * Change sort order of todoes titles
     * @param {Todo} todo
     * @param {number} checkedTime UTC Time in seconds or 0 if unchecked
     * @returns {boolean} Success of the operation
     */
    Check(todo, checkedTime) {
        let selectedTodo = null;
        const indexTodo = this.GetIndex(this.SAVED_todoes, todo);
        const indexUnsaved = this.GetIndex(this.UNSAVED_additions, todo);

        if (indexTodo !== null) selectedTodo = this.SAVED_todoes.splice(indexTodo, 1)[0];
        if (indexUnsaved !== null) selectedTodo = this.UNSAVED_additions.splice(indexUnsaved, 1)[0];
        if (selectedTodo === null) {
            this.user.interface.console?.AddLog(
                'warn',
                `Todoes - check failed: todo not found (${todo.title} ${checkedTime})`
            );
            return false;
        }

        selectedTodo.checked = checkedTime;
        this.UNSAVED_additions.push(selectedTodo);
        this.allTodoes.Set(this.Get());
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
        this.allTodoes.Set(this.Get());

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
        const index = arr.findIndex((a) => a.created === todo.created);
        if (index === -1) return null;
        return index;
    }
}

export { Todo };
export default Todoes;
