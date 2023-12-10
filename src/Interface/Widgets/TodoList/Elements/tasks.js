import * as React from 'react';
import { View, TextInput } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Icon, Button } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Class/Todos').Task} Task
 * @typedef {'none' | 'underline' | 'line-through' | 'underline line-through'} TextDecorationLineType
 */

const TaskProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Task | null} */
    task: null,

    /**
     * @param {boolean} checked
     * @param {string} title
     */
    onTaskEdit: (checked, title) => {},
    onTaskDelete: () => {}
};

class TaskElement extends React.Component {
    textColor = { color: themeManager.GetColor('primary') };
    hexActiveColor = themeManager.GetColor('main1');

    remove = () => {
        const { onTaskDelete } = this.props;
        const lang = langManager.curr['todo'];
        const title = lang['alert-remtask-title'];
        const text = lang['alert-remtask-text'];
        const callback = (btn) => btn === 'yes' && onTaskDelete();
        user.interface.popup.Open('yesno', [title, text], callback);
    }

    render() {
        const { style, task, onTaskEdit } = this.props;
        if (task === null) return null;

        const { Checked, Title } = task;
        const decoration = {
            /** @type {TextDecorationLineType} */
            textDecorationLine: Checked ? 'line-through' : 'none'
        };

        const lang = langManager.curr['todo'];

        return (
            <View style={[styles.parentTask, style]}>
                <Button
                    style={styles.checkbox}
                    color={Checked ? 'white' : 'transparent'}
                    onPress={() => onTaskEdit(!Checked, Title)}
                    onLongPress={this.remove}
                >
                    {Checked && <Icon icon='check' color='main1' size={16} />}
                </Button>
                <TextInput
                    style={[styles.input, this.textColor, decoration]}
                    value={Title}
                    onChangeText={text => onTaskEdit(!!Checked, text)} // TODO: !! added, right?
                    selectionColor={this.hexActiveColor}
                    multiline={true}
                    maxLength={256}
                    placeholder={lang['input-task-placeholder']}
                />
            </View>
        );
    }
}

TaskElement.prototype.props = TaskProps;
TaskElement.defaultProps = TaskProps;

export default TaskElement;
