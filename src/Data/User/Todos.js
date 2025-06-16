import { IUserData } from '@oxyfoo/gamelife-types/Interface/IUserData';
import DynamicVar from 'Utils/DynamicVar';
import { GetGlobalTime } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Todos').Todo} Todo
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Todos').Task} Task
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Todos').TodoSaved} TodoSaved
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Todos').SaveObject_Todos} SaveObject_Todos
 */

const MAX_TODOS = 10;
const MAX_TASKS = 20;

/** @extends {IUserData<SaveObject_Todos>} */
class Todos extends IUserData {
    /** @param {UserManager} user */
    constructor(user) {
        super('todos');

        this.user = user;
    }

    /** @type {TodoSaved[]} */
    #SAVED_todos = [];

    /** @type {Todo[]} */
    #UNSAVED_additions = [];

    /** @type {TodoSaved[]} */
    #UNSAVED_editions = [];

    /** @type {number[]} */
    #UNSAVED_deletions = [];

    /**
     * Sorted todos using titles
     * @type {number[]}
     */
    #sort = [];

    /**
     * @type {boolean} True if todos sort is saved
     */
    #sortSaved = true;

    /**
     * @description All todos (saved and unsaved)
     * @type {DynamicVar<Todo[]>}
     */
    todos = new DynamicVar(/** @type {Todo[]} */ ([]));

    #token = 0;

    Clear = () => {
        this.#SAVED_todos = [];
        this.#UNSAVED_additions = [];
        this.#UNSAVED_editions = [];
        this.#UNSAVED_deletions = [];
        this.#sort = [];
        this.#sortSaved = true;
        this.#token = 0;
        this.todos.Set([]);
    };

    /**
     * Return all todos (save and unsaved) sorted by start time (ascending)
     * @returns {(Todo | TodoSaved)[]}
     */
    Get = () => {
        // Saved todos
        let todos = [...this.#SAVED_todos];

        // Apply unsaved editions
        for (const edition of this.#UNSAVED_editions) {
            const index = todos.findIndex((todo) => todo.ID === edition.ID);
            if (index !== null) {
                todos[index] = edition;
            }
        }

        // Apply unsaved deletions
        for (const deletion of this.#UNSAVED_deletions) {
            const index = todos.findIndex((todo) => todo.ID === deletion);
            if (index !== null) {
                todos.splice(index, 1);
            }
        }

        // Apply unsaved additions
        /** @type {(Todo | TodoSaved)[]} */
        const allTodos = [...todos, ...this.#UNSAVED_additions];

        /** @type {(Todo | TodoSaved)[]} */
        const sortedTodos = [];
        for (const created of this.GetSort(allTodos)) {
            const todo = allTodos.find((t) => t.created === created);
            if (todo !== undefined) {
                sortedTodos.push(todo);
            }
        }

        return sortedTodos;
    };

    GetSort = (todos = this.Get()) => {
        // Add new todos title at the top
        for (const todo of todos) {
            if (!this.#sort.includes(todo.created)) {
                this.#sort.splice(0, 0, todo.created);
                this.#sortSaved = false;
            }
        }

        // Remove deleted todos title
        this.#sort = this.#sort.filter((created) => {
            if (todos.findIndex((todo) => todo.created === created) !== -1) {
                return true;
            }
            this.#sortSaved = false;
            return false;
        });

        return this.#sort;
    };

    /** @param {Partial<SaveObject_Todos>} data */
    Load = (data) => {
        if (typeof data.todos !== 'undefined') this.#SAVED_todos = data.todos;
        if (typeof data.additions !== 'undefined') this.#UNSAVED_additions = data.additions;
        if (typeof data.editions !== 'undefined') this.#UNSAVED_editions = data.editions;
        if (typeof data.deletions !== 'undefined') this.#UNSAVED_deletions = data.deletions;
        if (typeof data.sort !== 'undefined') this.#sort = data.sort;
        if (typeof data.sortSaved !== 'undefined') this.#sortSaved = data.sortSaved;
        if (typeof data.token !== 'undefined') this.#token = data.token;
        this.todos.Set(this.Get());
    };

    /** @returns {SaveObject_Todos} */
    Save = () => {
        return {
            todos: this.#SAVED_todos,
            additions: this.#UNSAVED_additions,
            editions: this.#UNSAVED_editions,
            deletions: this.#UNSAVED_deletions,
            sort: this.#sort,
            sortSaved: this.#sortSaved,
            token: this.#token
        };
    };

    LoadOnline = async () => {
        const response = await this.user.server2.tcp.SendAndWait({ action: 'get-todo', token: this.#token });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'get-todo' ||
            response.result === 'error'
        ) {
            this.user.interface.console?.AddLog('error', '[Todos] Failed to load todo');
            return false;
        }

        if (response.result === 'already-up-to-date') {
            return true;
        }

        this.#SAVED_todos = response.result.todo;
        this.#sort = response.result.sort;
        this.#token = response.result.token;
        this.user.interface.console?.AddLog('info', `[Todos] Loaded ${this.#SAVED_todos.length} todos`);
        this.todos.Set(this.Get());
        return true;
    };

    /**
     * Save todos online
     * @param {number} [attempt] Number of attempt left
     * @returns {Promise<boolean>}
     */
    SaveOnline = async (attempt = 1) => {
        if (!this.#isUnsaved()) {
            return true;
        }

        const unsavedData = this.#getUnsaved();
        const response = await this.user.server2.tcp.SendAndWait({
            action: 'save-todo',
            todoToAdd: unsavedData.newTodo.todoToAdd,
            todoToEdit: unsavedData.newTodo.todoToEdit,
            todoToDelete: unsavedData.newTodo.todoToDelete,
            newSort: unsavedData.sort,
            token: this.#token
        });

        // Check if failed
        if (
            response === 'timeout' ||
            response === 'interrupted' ||
            response === 'not-sent' ||
            response.status !== 'save-todo' ||
            response.result === 'error'
        ) {
            this.user.interface.console?.AddLog('error', '[Todos] Failed to save todo');
            return false;
        }

        if (response.result === 'wrong-todo') {
            this.user.interface.console?.AddLog('error', `[Todos] Wrong todo data, reseting todo`, unsavedData);
            this.Clear();
            await this.LoadOnline();
            return false;
        }

        if (response.result === 'not-up-to-date') {
            if (attempt <= 0) {
                this.user.interface.console?.AddLog(
                    'error',
                    `[Todos] Failed to save todo: "not-up-to-date", no more attempt`
                );
                return false;
            }

            this.user.interface.console?.AddLog('error', `[Todos] Failed to save todo: "not-up-to-date", retrying`);
            await this.LoadOnline();
            return this.SaveOnline(attempt - 1);
        }

        // Update and print message
        this.#purge(response.result.newTodos);
        this.todos.Set(this.Get());
        this.#token = response.result.token;
        const length = this.todos.Get().length;
        this.user.interface.console?.AddLog('info', `[Todos] Saved ${length} todo`);
        return true;
    };

    #isUnsaved = () => {
        return (
            this.#UNSAVED_additions.length > 0 ||
            this.#UNSAVED_editions.length > 0 ||
            this.#UNSAVED_deletions.length > 0 ||
            this.#sortSaved === false
        );
    };

    #getUnsaved = () => {
        return {
            newTodo: {
                todoToAdd: this.#UNSAVED_additions,
                todoToEdit: this.#UNSAVED_editions,
                todoToDelete: this.#UNSAVED_deletions
            },
            sort: this.#sort
        };
    };

    /**
     * Apply unsaved editions
     * @param {TodoSaved[]} newTodos
     */
    #purge = (newTodos) => {
        // Apply editions
        for (const edition of this.#UNSAVED_editions) {
            const index = this.#SAVED_todos.findIndex((todo) => todo.ID === edition.ID);
            if (index !== null) {
                this.#SAVED_todos[index] = edition;
            }
        }

        // Apply deletions
        for (const deletion of this.#UNSAVED_deletions) {
            const index = this.#SAVED_todos.findIndex((todo) => todo.ID === deletion);
            if (index !== null) {
                this.#SAVED_todos.splice(index, 1);
            }
        }

        // Apply additions
        this.#SAVED_todos.push(...newTodos);

        // Clear unsaved
        this.#UNSAVED_additions = [];
        this.#UNSAVED_editions = [];
        this.#UNSAVED_deletions = [];
        this.#sortSaved = true;
    };

    IsMax = () => {
        return this.Get().length >= MAX_TODOS;
    };

    /**
     * Add todo or edit if already exist
     * @param {string} title Title of the todo
     * @param {string} description Description of the todo
     * @param {number} deadline Unix timestamp in seconds
     * @param {Task[]} tasks Tasks informations
     * @returns {boolean}
     */
    Add(title, description, deadline, tasks) {
        /** @type {Todo} */
        const newTodo = {
            checked: 0,
            title: title,
            description: description,
            created: GetGlobalTime(),
            deadline: deadline,
            tasks: tasks.filter((st) => !!st.title)
        };

        // Check if not exist
        const indexSaved = this.#getIndex(this.#SAVED_todos, newTodo);
        const indexUnsaved = this.#getIndex(this.#UNSAVED_additions, newTodo);

        // Todo already exist
        if (indexSaved !== null || indexUnsaved !== null) {
            return false;
        }

        // Todo not exist, add it
        this.#UNSAVED_additions.push(newTodo);
        this.todos.Set(this.Get());
        return true;
    }

    /**
     * @param {Todo | TodoSaved} oldTodo Old todo, from Get()
     * @param {Partial<Todo | TodoSaved>} newTodo New todo, from oldTodo with changes \
     * `ID` and `created` will be ignored, and `checked` will be set to 0 by default
     * @returns {'not-exist' | (Todo | TodoSaved)}
     */
    Edit(oldTodo, newTodo) {
        const isSavedActivity = Object.keys(oldTodo).includes('ID');

        let refToNewTodo = oldTodo;

        if (isSavedActivity) {
            const _oldTodo = /** @type {TodoSaved} */ (oldTodo);

            /** @type {TodoSaved} */
            const _newTodo = {
                ID: _oldTodo.ID,
                checked: newTodo.checked ?? 0,
                title: newTodo.title ?? _oldTodo.title,
                description: newTodo.description ?? _oldTodo.description,
                created: _oldTodo.created,
                deadline: newTodo.deadline ?? _oldTodo.deadline,
                tasks: newTodo.tasks ? newTodo.tasks.filter((st) => !!st.title) : _oldTodo.tasks
            };

            refToNewTodo = _newTodo;

            // Check if not exist
            const indexSaved = this.#SAVED_todos.findIndex((todo) => todo.ID === _oldTodo.ID);
            if (indexSaved === -1) {
                return 'not-exist';
            }

            const indexUnsavedEdition = this.#UNSAVED_editions.findIndex((todo) => todo.ID === _oldTodo.ID);

            // Todo already exist
            if (indexUnsavedEdition === -1) {
                this.#UNSAVED_editions.push(_newTodo);
            }

            // Todo not edited yet
            else {
                this.#UNSAVED_editions[indexUnsavedEdition] = _newTodo;
            }
        } else {
            /** @type {Todo} */
            const _newTodo = {
                checked: newTodo.checked ?? 0,
                title: newTodo.title ?? oldTodo.title,
                description: newTodo.description ?? oldTodo.description,
                created: oldTodo.created,
                deadline: newTodo.deadline ?? oldTodo.deadline,
                tasks: newTodo.tasks ? newTodo.tasks.filter((st) => !!st.title) : oldTodo.tasks
            };

            refToNewTodo = _newTodo;

            // Check if not exist
            const indexUnsaved = this.#getIndex(this.#UNSAVED_additions, oldTodo);

            // Todo already exist
            if (indexUnsaved === null) {
                return 'not-exist';
            }

            this.#UNSAVED_additions[indexUnsaved] = _newTodo;
        }

        this.todos.Set(this.Get());
        return refToNewTodo;
    }

    /**
     * Remove todo
     * @param {Todo | TodoSaved} todo
     * @returns {'removed' | 'notExist'}
     */
    Remove(todo) {
        const isSavedTodo = Object.keys(todo).includes('ID');

        if (isSavedTodo) {
            const _todo = /** @type {TodoSaved} */ (todo);
            const index = this.#getIndex(this.#SAVED_todos, todo);
            if (index === null) {
                return 'notExist';
            }
            this.#UNSAVED_deletions.push(_todo.ID);
        } else {
            const index = this.#getIndex(this.#UNSAVED_additions, todo);
            if (index === null) {
                return 'notExist';
            }
            this.#UNSAVED_additions.splice(index, 1);
        }

        this.todos.Set(this.Get());
        return 'removed';
    }

    /**
     * Change sort order of todos titles
     * @param {Todo} todo
     * @param {number} newIndex
     * @returns {boolean} Success of the operation
     */
    Move(todo, newIndex) {
        // Check if todo exist
        if (!this.#sort.includes(todo.created)) {
            this.user.interface.console?.AddLog(
                'warn',
                `[Todos] Move failed: todo not found (${todo.title} ${newIndex})`
            );
            return false;
        }

        // Check if index is valid
        if (newIndex < 0 || newIndex > this.#sort.length) {
            this.user.interface.console?.AddLog(
                'warn',
                `[Todos] Move failed: index out of range (${todo.title} ${newIndex})`
            );
            return false;
        }

        // Check if index is the same
        const oldIndex = this.#sort.indexOf(todo.created);
        if (oldIndex === newIndex) {
            this.user.interface.console?.AddLog('warn', `[Todos] Move failed: same index (${todo.title} ${newIndex})`);
            return false;
        }

        // Update sort
        this.#sort.splice(oldIndex, 1);
        this.#sort.splice(newIndex, 0, todo.created);
        this.#sortSaved = false;
        this.todos.Set(this.Get());
        return true;
    }

    /**
     * Change sort order of todos titles
     * @param {Todo} todo
     * @param {number} checkedTime UTC Time in seconds or 0 if unchecked
     * @returns {boolean} Success of the operation
     */
    Check(todo, checkedTime = GetGlobalTime()) {
        return this.Edit(todo, { checked: checkedTime }) !== 'not-exist';
    }

    /**
     * @param {Todo} todo
     * @returns {boolean} Success of the operation
     */
    Uncheck(todo) {
        return this.Edit(todo, { checked: 0 }) !== 'not-exist';
    }

    /**
     * @param {(Todo | TodoSaved)[]} arr
     * @param {(Todo | TodoSaved)} todo
     * @returns {number | null} Index of todo or null if not found
     */
    #getIndex(arr, todo) {
        const index = arr.findIndex((a) => a.created === todo.created);
        if (index === -1) return null;
        return index;
    }
}

export { MAX_TODOS, MAX_TASKS };
export default Todos;
