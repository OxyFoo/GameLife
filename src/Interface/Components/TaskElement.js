import * as React from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { StyleProp, ViewStyle } from 'react-native';

import user from '../../Managers/UserManager';

import Text from './Text';
import Icon from './Icon';
import Button from './Button';
import { DateToFormatString } from '../../Utils/Date';
import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';

/**
 * @typedef {import('../../Class/Tasks').Task} Task
 * @typedef {import('../../Class/Tasks').Subtask} Subtask
 * @typedef {import('./Icon').Icons} Icons
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

    /** Icon to drag => onTouchStart event */
    onDrag: () => {},

    onTaskCheck: () => {},
    /**
     * On edit subtask
     * @param {Boolean} checked
     * @param {String} title
     */
    onSubtaskEdit: (checked, title) => {},
    onSubtaskDelete: () => {}
}

class TaskElement extends React.Component {
    state = {
        checked: false
    };

    renderTask() {
        const { checked } = this.state;
        const { style, task, onDrag } = this.props;
        const { Title, Description, Deadline, Schedule } = task;

        let text = '';
        if (Deadline !== null) text = DateToFormatString(Deadline*1000);

        const openTask = () => user.interface.ChangePage('task', { task });

        // TODO - Add daily mode (circle)
        // TODO - Add right text automatically (deadline if defined, schedule else (X/month/week...))

        return (
            <View style={[styles.parentTask, style]}>
                <Button
                    style={styles.checkbox}
                    color={checked ? '#fff' : 'transparent'}
                    onPress={this.props.onTaskCheck}
                >
                    {checked && <Icon icon='chevron' color='main1' size={16} angle={80} />}
                </Button>
                <TouchableOpacity
                    style={styles.title}
                    onPress={openTask}
                    activeOpacity={.6}
                >
                    <Text>{Title}</Text>
                    <Text>{text}</Text>
                </TouchableOpacity>
                <View onTouchStart={() => onDrag()}>
                    <Icon icon='moveVertical' color='main1' />
                </View>
            </View>
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
                >
                    {Checked && <Icon icon='chevron' color='main1' size={16} angle={80} />}
                </Button>
                <TouchableOpacity
                    style={styles.title}
                    onLongPress={remove}
                    activeOpacity={.6}
                >
                    <TextInput
                        style={[styles.input, textColor, decoration]}
                        value={Title}
                        onChangeText={text => this.props.onSubtaskEdit(Checked, text)}
                        selectionColor={hexActiveColor}
                        multiline={true}
                        maxLength={256}
                        placeholder={langManager.curr['task']['input-subtask-placeholder']}
                    />
                </TouchableOpacity>
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
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        flex: 1,
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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