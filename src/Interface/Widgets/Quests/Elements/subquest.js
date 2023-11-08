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
 * @typedef {import('Class/Quests').Subquest} Subquest
 * @typedef {'none'|'underline'|'line-through'|'underline line-through'} TextDecorationLineType
 */

const SubquestProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Subquest|null} */
    subquest: null,

    /**
     * @param {boolean} checked
     * @param {string} title
     */
    onSubquestEdit: (checked, title) => {},
    onSubquestDelete: () => {}
}

class SubquestElement extends React.Component {
    textColor = { color: themeManager.GetColor('primary') };
    hexActiveColor = themeManager.GetColor('main1');

    remove = () => {
        const { onSubquestDelete } = this.props;
        const lang = langManager.curr['quest'];
        const title = lang['alert-remsubquest-title'];
        const text = lang['alert-remsubquest-text'];
        const callback = (btn) => btn === 'yes' && onSubquestDelete();
        user.interface.popup.Open('yesno', [title, text], callback);
    }

    render() {
        const { style, subquest, onSubquestEdit } = this.props;
        if (subquest === null) return null;

        const { Checked, Title } = subquest;
        const decoration = {
            /** @type {TextDecorationLineType} */
            textDecorationLine: Checked ? 'line-through' : 'none'
        };

        const lang = langManager.curr['quest'];

        return (
            <View style={[styles.parentSubask, style]}>
                <Button
                    style={styles.checkbox}
                    color={Checked ? 'white' : 'transparent'}
                    onPress={() => onSubquestEdit(!Checked, Title)}
                    onLongPress={this.remove}
                >
                    {Checked && <Icon icon='check' color='main1' size={16} />}
                </Button>
                <TextInput
                    style={[styles.input, this.textColor, decoration]}
                    value={Title}
                    onChangeText={text => onSubquestEdit(Checked, text)}
                    selectionColor={this.hexActiveColor}
                    multiline={true}
                    maxLength={256}
                    placeholder={lang['input-subquest-placeholder']}
                />
            </View>
        );
    }
}

SubquestElement.prototype.props = SubquestProps;
SubquestElement.defaultProps = SubquestProps;

export default SubquestElement;