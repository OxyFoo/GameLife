import * as React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { GetDate, GetGlobalTime, GetTimeToTomorrow } from 'Utils/Time';
import { DateFormat } from 'Utils/Date';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Todos').Todo} Todo
 *
 * @typedef {Object} TodoPropsType
 * @property {StyleProp} style
 * @property {Todo | null} todo
 * @property {(event: LayoutChangeEvent) => void} onLayout
 * @property {() => void} onDrag Icon to drag => onTouchStart event (todo only)
 * @property {(todo: Todo) => Promise<void>} onCheck
 * @property {(todo: Todo, callbackRemove: (resolve: (cancel: () => void) => void) => void) => void} onRemove
 */

/** @type {TodoPropsType} */
const TodoProps = {
    style: {},
    onLayout: () => {},
    todo: null,
    onDrag: () => {},
    onCheck: async () => {},
    onRemove: () => {}
};

class TodoButtonBack extends React.Component {
    state = {
        /** @type {{ deltaDays: number, text: string } | null} */
        deadline: null,
        animElementY: new Animated.Value(0),
        animDeleteButtonX: new Animated.Value(0)
    };

    /** @type {number} Used to define start of onDrag event */
    lastY = 0;

    /** @type {NodeJS.Timeout | null} */
    timeout = null;

    /** @param {TodoProps} props */
    constructor(props) {
        super(props);

        const { todo } = props;
        if (todo === null) return;

        if (todo.checked) {
            this.state.animDeleteButtonX.setValue(1);
        }
    }

    componentDidMount() {
        this.updateDate();
    }

    updateDate = () => {
        const { todo } = this.props;
        if (todo === null) return;

        const { deadline } = todo;
        const now = GetGlobalTime();

        /** @type {number | null} Minimum number of days */
        let minDeltaDays = null;

        // Search next deadline (if earlier than schedule or no schedule)
        if (deadline > 0) {
            const delta = (deadline - now) / (60 * 60 * 24);
            if (minDeltaDays === null || delta < minDeltaDays) {
                minDeltaDays = delta;
            }
        }

        if (minDeltaDays !== null) {
            this.setState({
                deadline: {
                    deltaDays: minDeltaDays,
                    text: DateFormat(GetDate(deadline), 'DD/MM/YYYY')
                }
            });
        }

        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(this.updateDate.bind(this), GetTimeToTomorrow() * 1000);
    };

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        this.lastY = event.nativeEvent.pageY;
        this.timeoutDrag = setTimeout(() => {
            this.props.onDrag();
        }, 300);
    };

    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        const deltaY = event.nativeEvent.pageY - this.lastY;
        if (Math.abs(deltaY) > 10) {
            clearTimeout(this.timeoutDrag);
        }
    };

    /** @param {GestureResponderEvent} _event */
    onTouchEnd = (_event) => {
        clearTimeout(this.timeoutDrag);
    };

    onCheck = async () => {
        if (this.props.todo === null) return;
        await this.props.onCheck(this.props.todo);

        // Animate delete button
        const toValue = this.props.todo?.checked ? 1 : 0;
        SpringAnimation(this.state.animDeleteButtonX, toValue).start();
    };

    onRemove = () => {
        const lang = langManager.curr['todo'];
        const { todo } = this.props;
        const { animElementY } = this.state;
        if (todo === null) return;

        user.interface.popup?.OpenT({
            type: 'yesno',
            data: {
                title: lang['alert-remtodo-title'],
                message: lang['alert-remtodo-message']
            },
            callback: (btn) => {
                if (btn !== 'yes') {
                    return;
                }

                this.props.onRemove(todo, (resolve) => {
                    SpringAnimation(animElementY, 1).start();
                    setTimeout(() => {
                        resolve(() => {
                            SpringAnimation(animElementY, 0).start();
                        });
                    }, 200);
                });
            }
        });
    };

    openTodo = () => {
        const { todo } = this.props;
        if (todo === null) return;

        user.interface.ChangePage('todo', { args: { todo } });
    };
}

TodoButtonBack.prototype.props = TodoProps;
TodoButtonBack.defaultProps = TodoProps;

export default TodoButtonBack;
