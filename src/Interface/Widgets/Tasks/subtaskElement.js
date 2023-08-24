import * as React from 'react';
import { View, TextInput } from 'react-native';

import styles from './styleElement';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Icon, Button } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Class/Tasks').Subtask} Subtask
 * @typedef {'none'|'underline'|'line-through'|'underline line-through'} TextDecorationLineType
 */

const SubtaskProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Subtask|null} */
    subtask: null,

    /**
     * @param {boolean} checked
     * @param {string} title
     */
    onSubtaskEdit: (checked, title) => {},
    onSubtaskDelete: () => {}
}

class SubtaskElement extends React.Component {
    textColor = { color: themeManager.GetColor('primary') };
    hexActiveColor = themeManager.GetColor('main1');

    remove = () => {
        const { onSubtaskDelete } = this.props;
        const lang = langManager.curr['task'];
        const title = lang['alert-remsubtask-title'];
        const text = lang['alert-remsubtask-text'];
        const callback = (btn) => btn === 'yes' && onSubtaskDelete();
        user.interface.popup.Open('yesno', [title, text], callback);
    }

    render() {
        const { style, subtask, onSubtaskEdit } = this.props;
        if (subtask === null) return null;

        const { Checked, Title } = subtask;
        const decoration = {
            /** @type {TextDecorationLineType} */
            textDecorationLine: Checked ? 'line-through' : 'none'
        };

        const lang = langManager.curr['task'];

        return (
            <View style={[styles.parentSubask, style]}>
                <Button
                    style={styles.checkbox}
                    color={Checked ? 'white' : 'transparent'}
                    onPress={() => onSubtaskEdit(!Checked, Title)}
                    onLongPress={this.remove}
                >
                    {Checked && <Icon icon='check' color='main1' size={16} />}
                </Button>
                <TextInput
                    style={[styles.input, this.textColor, decoration]}
                    value={Title}
                    onChangeText={text => onSubtaskEdit(Checked, text)}
                    selectionColor={this.hexActiveColor}
                    multiline={true}
                    maxLength={256}
                    placeholder={lang['input-subtask-placeholder']}
                />
            </View>
        );
    }
}

SubtaskElement.prototype.props = SubtaskProps;
SubtaskElement.defaultProps = SubtaskProps;

export default SubtaskElement;