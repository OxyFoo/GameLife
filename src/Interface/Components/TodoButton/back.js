import * as React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { GetDate, GetGlobalTime } from 'Utils/Time';
import { DateToFormatString } from 'Utils/Date';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Class/Todoes').Todo} Todo
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 *
 * @typedef {Object} TodoPropsType
 * @property {StyleProp} style
 * @property {Todo | null} todo
 * @property {() => void} onDrag Icon to drag => onTouchStart event (todo only)
 * @property {(todo: Todo) => void} onCheck
 * @property {(todo: Todo, callbackRemove: (resolve: (cancel: () => void) => void) => void) => void} onRemove
 */

/** @type {TodoPropsType} */
const TodoProps = {
    style: {},
    todo: null,
    onDrag: () => {},
    onCheck: () => {},
    onRemove: () => {}
};

class TodoButtonBack extends React.Component {
    state = {
        animElementY: new Animated.Value(0),
        animDeleteButtonX: new Animated.Value(0)
    };

    deadlineText = '';

    /** @type {NodeJS.Timeout | null} */
    timeoutDeleteButton = null;

    /** @param {TodoProps} props */
    constructor(props) {
        super(props);

        const { todo } = props;
        if (todo === null) return;

        const { deadline: Deadline } = todo;

        const now = GetGlobalTime();

        /** @type {number | null} Minimum number of days */
        let minDeltaDays = null;

        // Search next deadline (if earlier than schedule or no schedule)
        if (Deadline > 0) {
            const delta = (Deadline - now) / (60 * 60 * 24);
            if (delta < minDeltaDays) {
                minDeltaDays = delta;

                // Define deadline text
                const lang = langManager.curr['todoes'];
                this.deadlineText = lang['todo-type-deadline'] + ' ' + DateToFormatString(GetDate(Deadline));
            }
        }

        // Define color (red if overdue, orange if today, white otherwise)
        /** @type {ThemeText} */
        this.colorText = 'primary';
        if (minDeltaDays !== null && minDeltaDays < 0) {
            this.colorText = 'error';
        } else if (minDeltaDays !== null && minDeltaDays < 1) {
            this.colorText = 'warning';
        }
    }

    onCheck = () => {
        if (this.props.todo === null) return;

        this.props.onCheck(this.props.todo);
        if (this.props.todo.checked) {
            SpringAnimation(this.state.animDeleteButtonX, 1).start();
            this.timeoutDeleteButton = setTimeout(() => {
                SpringAnimation(this.state.animDeleteButtonX, 0).start();
            }, 5000);
        } else {
            SpringAnimation(this.state.animDeleteButtonX, 0).start();
            if (this.timeoutDeleteButton !== null) {
                clearTimeout(this.timeoutDeleteButton);
                this.timeoutDeleteButton = null;
            }
        }
    };

    onRemove = () => {
        const { todo } = this.props;
        const { animElementY } = this.state;

        if (todo === null) return;

        this.props.onRemove(todo, (resolve) => {
            SpringAnimation(animElementY, 1).start();
            setTimeout(() => {
                resolve(() => {
                    SpringAnimation(animElementY, 0).start();
                });
            }, 200);
        });
    };

    openTodo = () => {
        const { todo } = this.props;
        if (todo === null) return;

        if (todo !== null) {
            user.interface.ChangePage('todo', { args: { todo } });
        }
    };
}

TodoButtonBack.prototype.props = TodoProps;
TodoButtonBack.defaultProps = TodoProps;

export default TodoButtonBack;
