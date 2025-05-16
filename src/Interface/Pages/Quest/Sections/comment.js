import * as React from 'react';
import { View } from 'react-native';

import langManager from 'Managers/LangManager';

import { InputText } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Quests').Quest} Quest
 *
 * @typedef {Object} SectionCommentPropsType
 * @property {StyleProp} style
 * @property {Quest | null} quest
 * @property {(quest: Quest) => void} onChangeQuest
 */

/** @type {SectionCommentPropsType} */
const SectionCommentProps = {
    style: {},
    quest: null,
    onChangeQuest: () => {}
};

class SectionComment extends React.Component {
    /** @param {string} comment */
    onChangeComment = (comment) => {
        const { quest, onChangeQuest } = this.props;
        if (quest === null) return;

        onChangeQuest({
            ...quest,
            comment: comment
        });
    };

    render() {
        const lang = langManager.curr['quest'];
        const { style, quest } = this.props;
        if (quest === null) return null;

        return (
            <View style={style}>
                <InputText
                    value={quest.comment}
                    placeholder={lang['input-comment-placeholder']}
                    onChangeText={this.onChangeComment}
                    maxLength={1024}
                    numberOfLines={2}
                    multiline={true}
                    showCounter
                />
            </View>
        );
    }
}

SectionComment.prototype.props = SectionCommentProps;
SectionComment.defaultProps = SectionCommentProps;

export default SectionComment;
