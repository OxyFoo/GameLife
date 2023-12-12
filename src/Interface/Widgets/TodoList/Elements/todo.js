import * as React from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, Icon, Button } from 'Interface/Components';
import { GetDate, GetTime } from 'Utils/Time';
import { DateToFormatString } from 'Utils/Date';
import { SpringAnimation, WithInterpolation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Class/Todoes').Todo} Todo
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 */

const TodoProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Todo | null} */
    todo: null,

    /** Icon to drag => onTouchStart event (todo only) */
    onDrag: () => {},

    /** @param {Todo} todo */
    onCheck: (todo) => {},

    /**
     * @param {Todo} todo
     * @param {(resolve: (cancel: () => void) => void) => void} callbackRemove
     */
    onRemove: (todo, callbackRemove) => {}
};

class TodoElement extends React.Component {
    state = {
        animElementY : new Animated.Value(0),
        animDeleteButtonX : new Animated.Value(0)
    }

    deadlineText = '';
    timeoutDeleteButton = null;

    /** @param {TodoProps} props */
    constructor(props) {
        super(props);

        const { todo } = props;
        if (todo === null) return;

        const { deadline: Deadline } = todo;

        const now = GetTime();

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
        this.props.onCheck(this.props.todo);
        if (this.props.todo.checked) {
            SpringAnimation(this.state.animDeleteButtonX, 1).start();
            this.timeoutDeleteButton = setTimeout(() => {
                SpringAnimation(this.state.animDeleteButtonX, 0).start();
            }, 5000);
        } else {
            SpringAnimation(this.state.animDeleteButtonX, 0).start();
            clearTimeout(this.timeoutDeleteButton);
        }
    }

    onRemove = () => {
        const { todo } = this.props;
        const { animElementY } = this.state;

        this.props.onRemove(todo, (resolve) => {
            SpringAnimation(animElementY, 1).start();
            setTimeout(() => {
                resolve(() => {
                    SpringAnimation(animElementY, 0).start();
                });
            }, 200);
        });
    }

    openTodo = () => {
        const { todo } = this.props;
        if (todo !== null) {
            user.interface.ChangePage('todo', { todo });
        }
    }

    render() {
        const { animElementY, animDeleteButtonX } = this.state;
        const { style, todo, onDrag } = this.props;
        if (todo === null) return null;

        const { title, checked } = todo;

        const styleAnimation = {
            transform: [
                { translateY: WithInterpolation(animElementY, 0, -46) }
            ]
        };

        const styleDeleteButton = {
            transform: [
                { translateX: WithInterpolation(animDeleteButtonX, 64, 0) }
            ]
        };


        return (
            <View style={styles.parent}>
            <Animated.View style={[styles.content, styleAnimation, style]}>
                {/* Check button */}
                <Button
                    style={styles.checkbox}
                    color={checked !== 0 ? 'white' : 'transparent'}
                    onPress={this.onCheck}
                >
                    {checked !== 0 && (
                        <Icon icon='check' color='main1' size={16} />
                    )}
                </Button>

                {/* Content */}
                <TouchableOpacity
                    style={styles.title}
                    onPress={this.openTodo}
                    activeOpacity={.6}
                >
                    {/* Title & deadline */}
                    <Text style={styles.titleText}>{title}</Text>
                    {!!this.deadlineText.length && (
                        <Text
                            style={styles.dateText}
                            color={this.colorText}
                        >
                            {this.deadlineText}
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Drag&Drop button */}
                <View onTouchStart={() => onDrag()}>
                    <Icon icon='moveVertical' color='main1' />
                </View>

                {/* Check button */}
                <Button
                    style={styles.trashButton}
                    styleAnimation={styleDeleteButton}
                    color={'backgroundCard'}
                    onPress={this.onRemove}
                >
                    <Icon icon='trash' color='danger' size={16} />
                </Button>
            </Animated.View>
            </View>
        );
    }
}

TodoElement.prototype.props = TodoProps;
TodoElement.defaultProps = TodoProps;

export default TodoElement;
