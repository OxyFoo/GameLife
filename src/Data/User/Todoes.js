import { IUserData } from 'Types/Interface/IUserData';
import DynamicVar from 'Utils/DynamicVar';
import { GetGlobalTime } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/Data/User/Todo').Todo} Todo
 * @typedef {import('Types/Data/User/Todo').Task} Task
 * @typedef {import('Types/Data/User/Todo').TodoUnsaved} TodoUnsaved
 * @typedef {import('Types/Data/User/Todo').SaveObject_Todo} SaveObject_Quests
 */

const MAX_TODOES = 10;

/** @extends {IUserData<SaveObject_Quests>} */
class Todoes extends IUserData {
    /** @param {UserManager} user */
    constructor(user) {
        super();

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
    sortSaved = true;

    /**
     * @description All todoes (saved and unsaved)
     * @type {DynamicVar<Array<Todo>>}
     */
    // eslint-disable-next-line prettier/prettier
    allTodoes = new DynamicVar(/** @type {Array<Todo>} */ ([]));

    Clear = () => {
        this.SAVED_todoes = [];
        this.UNSAVED_additions = [];
        this.UNSAVED_deletions = [];
        this.sort = [];
        this.sortSaved = true;
        this.allTodoes.Set([]);
    };

    /**
     * Return all todoes (save and unsaved) sorted by start time (ascending)
     * @returns {Array<Todo>}
     */
    Get = () => {
        let todoes = [...this.SAVED_todoes, ...this.UNSAVED_additions];

        // Add new todoes title at the top
        for (const todo of todoes) {
            if (!this.sort.includes(todo.created)) {
                this.sort.splice(0, 0, todo.created);
                this.sortSaved = false;
            }
        }

        // Remove deleted todoes title
        this.sort = this.sort.filter((created) => {
            if (todoes.findIndex((todo) => todo.created === created) !== -1) {
                return true;
            }
            this.sortSaved = false;
            return false;
        });

        // @ts-ignore
        return this.sort
            .map((created) => todoes.find((todo) => todo.created === created) || null)
            .filter((todo) => todo !== null);
    };

    /** @param {SaveObject_Quests} data */
    Load = (data) => {
        if (typeof data.todoes !== 'undefined') {
            this.SAVED_todoes = data.todoes;
        }
        if (typeof data.additions !== 'undefined') {
            this.UNSAVED_additions = data.additions;
        }
        if (typeof data.deletions !== 'undefined') {
            this.UNSAVED_deletions = data.deletions;
        }
        if (typeof data.sort !== 'undefined') {
            this.sort = data.sort;
        }
        if (typeof data.sortSaved !== 'undefined') {
            this.sortSaved = data.sortSaved;
        }
        this.allTodoes.Set(this.Get());
    };

    /** @returns {SaveObject_Quests} */
    Save = () => {
        return {
            todoes: this.SAVED_todoes,
            additions: this.UNSAVED_additions,
            deletions: this.UNSAVED_deletions,
            sort: this.sort,
            sortSaved: this.sortSaved
        };
    };

    LoadOnline = async () => {
        const response = await this.user.server2.tcp.SendAndWait({ action: 'get-todo' });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'get-todo'
        ) {
            this.user.interface.console?.AddLog('error', '[Todo] Failed to load todo');
            return false;
        }

        this.SAVED_todoes = response.todo;
        this.sort = response.sort;
        this.user.interface.console?.AddLog('info', `[Todo] Loaded ${this.SAVED_todoes.length} todoes`);
        this.allTodoes.Set(this.Get());
        return true;
    };

    SaveOnline = async () => {
        if (!this.isUnsaved()) {
            return true;
        }

        const unsavedData = this.getUnsaved();
        const response = await this.user.server2.tcp.SendAndWait({
            action: 'save-todo',
            newTodo: unsavedData.newTodo,
            newSort: unsavedData.sort
        });

        // Check if failed
        if (
            response === 'timeout' ||
            response === 'interrupted' ||
            response === 'not-sent' ||
            response.status !== 'save-todo' ||
            response.result !== 'ok'
        ) {
            this.user.interface.console?.AddLog('error', '[Todo] Failed to save todo');
            return false;
        }

        // Update and print message
        this.purge();
        this.allTodoes.Set(this.Get());
        const length = this.allTodoes.Get().length;
        this.user.interface.console?.AddLog('info', `[Todo] Saved ${length} todo`);
        return true;
    };

    isUnsaved = () => {
        if (this.sortSaved === false) {
            return true;
        }
        if (this.UNSAVED_additions.length || this.UNSAVED_deletions.length) {
            return true;
        }
        return false;
    };

    getUnsaved = () => {
        let newTodo;
        let sort;

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
            newTodo = unsaved;
        }

        if (this.sortSaved === false) {
            sort = this.sort;
        }

        return { newTodo, sort };
    };

    purge = () => {
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
        const newTodo = /** @type {Todo} */ {
            checked: 0,
            title: title,
            description: description,
            created: GetGlobalTime(),
            deadline: deadline,
            tasks: tasks.filter((st) => !!st.title)
        };

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
        const newTodo = /** @type {Todo} */ {
            checked: 0,
            title: title,
            description: description,
            created: oldTodo.created,
            deadline: deadline,
            tasks: tasks.filter((st) => !!st.title)
        };

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
                `[Todo] Move failed: todo not found (${todo.title} ${newIndex})`
            );
            return false;
        }
        if (newIndex < 0 || newIndex > this.sort.length) {
            this.user.interface.console?.AddLog(
                'warn',
                `[Todo] Move failed: index out of range (${todo.title} ${newIndex})`
            );
            return false;
        }
        const oldIndex = this.sort.indexOf(todo.created);
        if (oldIndex === newIndex) {
            this.user.interface.console?.AddLog('warn', `[Todo] Move failed: same index (${todo.title} ${newIndex})`);
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
                `[Todo] Check failed: todo not found (${todo.title} ${checkedTime})`
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

export default Todoes;
