import * as React from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { GetDate, GetTime } from 'Utils/Time';
import { DateToFormatString, GetDay } from 'Utils/Date';
import { Text, Icon, Button } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Class/Tasks').Task} Task
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

const TaskProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Task|null} */
    task: null,

    /** Icon to drag => onTouchStart event (task only) */
    onDrag: () => {},

    /**
     * @param {Task} task
     * @returns {Promise<void>}
     */
    onTaskCheck: async (task) => {}
}

class TaskElement extends React.Component {
    constructor(props) {
        super(props);

        this.mountTask();
    }

    mountTask() {
        const { task } = this.props;
        if (task === null) return;

        const { Deadline, Schedule } = task;

        const d = new Date();
        d.setUTCHours(1, 0, 0, 0);
        const now = GetTime();

        /** @type {'schedule'|'deadline'|null} */
        let deadlineType = null;

        /** @type {number|null} Minimum number of days */
        let minDeltaDays = null;

        // Search next schedule
        let i = 0;
        let days = Schedule.Repeat;
        if (Schedule.Type === 'month') days = days.map(day => day + 1);

        if (days.length > 0) {
            while (minDeltaDays === null) {
                const weekMatch = Schedule.Type === 'week' && days.includes(GetDay(d));
                const monthMatch = Schedule.Type === 'month' && days.includes(d.getUTCDate());
                if (weekMatch || monthMatch) {
                    minDeltaDays = i + 1;
                    deadlineType = 'schedule';
                }
                i++;
                d.setUTCDate(d.getUTCDate() + 1);
            }
        }

        // Search next deadline (if earlier than schedule or no schedule)
        if (Deadline > 0) {
            const delta = (Deadline - now) / (60 * 60 * 24);
            if (minDeltaDays === null || delta < minDeltaDays) {
                deadlineType = 'deadline';
                minDeltaDays = delta;
            }
        }

        // Define text (deadline or schedule)
        this.text = '';
        const lang = langManager.curr['tasks'];
        if (deadlineType === 'deadline') {
            this.text = lang['task-type-deadline'] + ' ' + DateToFormatString(GetDate(Deadline));
        } else if (deadlineType === 'schedule') {
            const nextDate = GetDate(now + (minDeltaDays * 24 * 60 * 60));
            this.text = lang['task-type-repeat'] + ' ' + DateToFormatString(nextDate);
        }

        // Define color (red if overdue, orange if today, white otherwise)
        /** @type {ColorThemeText} */
        this.colorText = 'primary';
        if (minDeltaDays !== null && minDeltaDays < 0) this.colorText = 'error';
        else if (minDeltaDays !== null && minDeltaDays < 1) this.colorText = 'warning';
    }

    onCheck = () => {
        const { task, onTaskCheck } = this.props;
        onTaskCheck(task);
    }

    render() {
        const { style, task, onDrag } = this.props;
        if (task === null) return null;

        const { Title, Schedule, Checked } = task;
        const isTodo = Schedule.Type === 'none';

        const styleButtonRadius = { borderRadius: isTodo ? 8 : 200 };
        const openTask = () => user.interface.ChangePage('task', { task });

        return (
            <Animated.View
                style={[styles.parentTask, style]}
                pointerEvents={Checked === 0 || !isTodo ? 'auto' : 'none'}
            >
                <Button
                    style={[styles.checkbox, styleButtonRadius]}
                    color={Checked !== 0 ? 'white' : 'transparent'}
                    onPress={this.onCheck}
                >
                    {Checked !== 0 && (
                        <Icon icon='check' color='main1' size={16} />
                    )}
                </Button>
                <TouchableOpacity
                    style={styles.title}
                    onPress={openTask}
                    activeOpacity={.6}
                >
                    <Text style={styles.titleText}>{Title}</Text>
                    {!!this.text.length && (
                        <Text
                            style={styles.dateText}
                            color={this.colorText}
                        >
                            {this.text}
                        </Text>
                    )}
                </TouchableOpacity>
                <View onTouchStart={() => onDrag()}>
                    <Icon icon='moveVertical' color='main1' />
                </View>
            </Animated.View>
        );
    }
}

TaskElement.prototype.props = TaskProps;
TaskElement.defaultProps = TaskProps;

export default TaskElement;