import * as React from 'react';

import { InputText } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 *
 * @typedef {Object} SectionTitlePropsType
 * @property {StyleProp} style
 * @property {MyQuest | null} quest
 * @property {(quest: MyQuest) => void} onChangeQuest
 */

/** @type {SectionTitlePropsType} */
const SectionTitleProps = {
    style: {},
    quest: null,
    onChangeQuest: () => {}
};

class SectionTitle extends React.Component {
    /** @param {SectionTitlePropsType} nextProps */
    shouldComponentUpdate(nextProps) {
        return (
            nextProps.style !== this.props.style ||
            nextProps.quest !== this.props.quest ||
            nextProps.quest?.title !== this.props.quest?.title ||
            nextProps.onChangeQuest !== this.props.onChangeQuest
        );
    }

    /** @param {string} title */
    onChangeText = (title) => {
        const { quest, onChangeQuest } = this.props;

        if (quest === null) {
            return;
        }

        onChangeQuest({ ...quest, title });
    };

    render() {
        const { style, quest } = this.props;

        if (quest === null) {
            return null;
        }

        return (
            <InputText style={style} value={quest.title} onChangeText={this.onChangeText} maxLength={128} showCounter />
        );
    }
}

SectionTitle.prototype.props = SectionTitleProps;
SectionTitle.defaultProps = SectionTitleProps;

export default SectionTitle;
