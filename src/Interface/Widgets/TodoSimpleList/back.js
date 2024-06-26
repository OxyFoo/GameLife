import React from 'react';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { GetGlobalTime } from 'Utils/Time';

/**
 * @typedef {import('Class/Todoes').Todo} Todo
 */

class BackTodoSimpleList extends React.Component {
    state = {
        /** @type {Todo[]} */
        todoes: [],

        /** @type {boolean} Used to enable/disable undo button */
        undoEnabled: false
    };

    /** @type {NodeJS.Timeout | null} */
    undoTimeout = null;

    /** @param {any} props */
    constructor(props) {
        super(props);

        this.state.todoes = user.todoes.Get();
        this.listenerTodo = user.todoes.allTodoes.AddListener(this.refreshTodoes);
    }

    refreshTodoes = () => {
        this.setState({ todoes: user.todoes.Get() });
    };

    componentWillUnmount() {
        if (this.undoTimeout !== null) {
            clearTimeout(this.undoTimeout);
        }
        user.todoes.allTodoes.RemoveListener(this.listenerTodo);
    }

    /** @param {Todo} item */
    keyExtractor = (item) => 'todo-' + [item.title, ...item.created.toString(), ...item.deadline.toString()].join('-');

    /**
     * Add a new todo to the list and open the todo page\
     * Max 8 todoes
     */
    addTodo = () => {
        if (this.state.todoes.length >= 8) {
            const title = langManager.curr['todoes']['alert-todoeslimit-title'];
            const message = langManager.curr['todoes']['alert-todoeslimit-message'];
            user.interface.popup.OpenT({
                type: 'ok',
                data: { title, message }
            });
            return;
        }

        user.interface.ChangePage('todo', { storeInHistory: false });
    };

    /** @param {Todo} todo */
    onTodoCheck = (todo) => {
        if (todo.checked !== 0) {
            user.todoes.Uncheck(todo);
        } else {
            user.todoes.Check(todo, GetGlobalTime());
        }
        user.GlobalSave();
    };

    /**
     * @param {Todo} todo
     * @param {(cancelback: (cancel: () => void) => void) => void} callbackRemove
     */
    onTodoRemove = (todo, callbackRemove) => {
        // Close undo button after 10 seconds
        this.undoTimeout = setTimeout(() => {
            this.setState({ undoEnabled: false });
        }, 10 * 1000);

        // Remove todo
        callbackRemove((cancel) => {
            const success = user.todoes.Remove(todo) === 'removed';
            if (!success) {
                cancel();
                return;
            }

            this.setState({
                todoes: [...user.todoes.Get()],
                undoEnabled: true
            });
            user.GlobalSave();
        });
    };
}

export default BackTodoSimpleList;
