import * as React from 'react';
import { View, Animated, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { StyleProp, ViewStyle } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';

import { GetTime } from '../../Utils/Time';
import { DateToFormatString, GetDay } from '../../Utils/Date';
import { Text, Icon, Button } from '../Components';
import { TimingAnimation } from '../../Utils/Animations';

/**
 * @typedef {import('../../Class/Tasks').Task} Task
 * @typedef {import('../../Class/Tasks').Subtask} Subtask
 * @typedef {import('../Components/Icon').Icons} Icons
 * @typedef {import('../../Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('../../Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

const TaskProps = {
    /** @type {StyleProp<ViewStyle>} */
    style: {},

    /** @type {Task} */
    task: null,

    /** @type {Subtask} */
    subtask: null,

    /** Icon to drag => onTouchStart event (task only) */
    onDrag: () => {},

    /**
     * @param {Task} task
     * @returns {Promise<Boolean>}
     */
    onTaskCheck: async (task) => true,

    /**
     * @param {Boolean} checked
     * @param {String} title
     */
    onSubtaskEdit: (checked, title) => {},
    onSubtaskDelete: () => {}
}

class TaskElement extends React.Component {
    state = {
        animOpacity: new Animated.Value(1)
    };

    constructor(props) {
        super(props);

        const { task, subtask } = this.props;
        if (task !== null) this.mountTask();
    }

    mountTask() {
        const { task } = this.props;
        const { Deadline, Schedule } = task;

        const d = new Date();
        d.setUTCHours(0, 0, 0, 0);
        const now = GetTime();

        /** @type {'schedule'|'deadline'|null} */
        let deadlineType = null;

        /** @type {Number?} Minimum number of days */
        let minDeltaDays = null;

        // Search next schedule
        let i = 0;
        if (Schedule !== null && Schedule.Repeat.length) {
            deadlineType = 'schedule';
            while (minDeltaDays === null) {
                const weekMatch = Schedule.Type === 'week' && Schedule.Repeat.includes(GetDay(d));
                const monthMatch = Schedule.Type === 'month' && Schedule.Repeat.includes(d.getUTCDate());
                if (weekMatch || monthMatch) minDeltaDays = i;
                d.setUTCDate(d.getUTCDate() + 1); i++;
            }
        }

        // Search next deadline (if earlier than schedule or no schedule)
        if (Deadline !== null) {
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
            this.text = lang['task-type-deadline'] + ' ' + DateToFormatString(Deadline * 1000);
        } else if (deadlineType === 'schedule') {
            const nextDate = new Date((now + (minDeltaDays * 24 * 60 * 60)) * 1000);
            this.text = lang['task-type-repeat'] + ' ' + DateToFormatString(nextDate);
        }

        // Define color (red if overdue, orange if today, white otherwise)
        /** @type {ColorThemeText} */
        this.colorText = 'primary';
        if (minDeltaDays !== null && minDeltaDays < 0) this.colorText = 'error';
        else if (minDeltaDays !== null && minDeltaDays < 1) this.colorText = 'warning';
    }

    renderTask() {
        const { animOpacity } = this.state;
        const { style, task, onDrag } = this.props;
        const { Title, Schedule, Checked } = task;
        const isTodo = Schedule === null;

        const openTask = () => user.interface.ChangePage('task', { task });
        const onCheck = () => {
            if (isTodo) {
                // Check, hide & callback to remove
                user.tasks.Check(task, true);
                const callback = () => this.props.onTaskCheck(task);
                TimingAnimation(animOpacity, 0, 500).start(callback);
            } else {
                // Switch check state & callback to edit
                this.props.onTaskCheck(task);
            }
        }

        const buttonStyle = [
            styles.checkbox,
            { borderRadius: isTodo ? 8 : 200 }
        ];

        return (
            <Animated.View style={[styles.parentTask, style, { opacity: animOpacity }]} pointerEvents={!Checked || !isTodo ? 'auto' : 'none'}>
                <Button
                    style={buttonStyle}
                    color={!!Checked ? '#fff' : 'transparent'}
                    onPress={onCheck}
                >
                    {!!Checked && <Icon icon='check' color='main1' size={16} />}
                </Button>
                <TouchableOpacity
                    style={styles.title}
                    onPress={openTask}
                    activeOpacity={.6}
                >
                    <Text style={styles.titleText}>{Title}</Text>
                    {!!this.text.length && <Text style={styles.dateText} color={this.colorText}>{this.text}</Text>}
                </TouchableOpacity>
                <View onTouchStart={() => onDrag()}>
                    <Icon icon='moveVertical' color='main1' />
                </View>
            </Animated.View>
        );
    }

    renderSubtask() {
        const { style, subtask } = this.props;
        const { Checked, Title } = subtask;
        const textColor = { color: themeManager.GetColor('primary') };
        const hexActiveColor = themeManager.GetColor('main1');
        const decoration = { textDecorationLine: Checked ? 'line-through' : 'none' };

        const remove = () => {
            const title = langManager.curr['task']['alert-remsubtask-title'];
            const text = langManager.curr['task']['alert-remsubtask-text'];
            const callback = (btn) => btn === 'yes' && this.props.onSubtaskDelete();
            user.interface.popup.Open('yesno', [title, text], callback);
        }

        return (
            <View style={[styles.parentSubask, style]}>
                <Button
                    style={styles.checkbox}
                    color={Checked ? '#fff' : 'transparent'}
                    onPress={() => this.props.onSubtaskEdit(!Checked, Title)}
                    onLongPress={remove}
                >
                    {Checked && <Icon icon='check' color='main1' size={16} />}
                </Button>
                <TextInput
                    style={[styles.input, textColor, decoration]}
                    value={Title}
                    onChangeText={text => this.props.onSubtaskEdit(Checked, text)}
                    selectionColor={hexActiveColor}
                    multiline={true}
                    maxLength={256}
                    placeholder={langManager.curr['task']['input-subtask-placeholder']}
                />
            </View>
        );
    }

    render() {
        const { task, subtask } = this.props;
        if (task !== null) return this.renderTask();
        if (subtask !== null) return this.renderSubtask();
    }
}

TaskElement.prototype.props = TaskProps;
TaskElement.defaultProps = TaskProps;

const styles = StyleSheet.create({
    parentTask: {
        height: 32,
        marginTop: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    parentSubask: {
        marginTop: 14,
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        flex: 1,
        height: '100%',
        justifyContent: 'center'
    },
    titleText: {
        height: 24,
        textAlign: 'left'
    },
    dateText: {
        textAlign: 'right',
        fontSize: 12
    },
    checkbox: {
        width: 32,
        aspectRatio: 1,
        marginRight: 16,
        paddingHorizontal: 0,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 8
    },
    input: {
        flex: 1,
        height: '100%',
        borderColor: '#fff',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderBottomRightRadius: 8
    }
});

export default TaskElement;