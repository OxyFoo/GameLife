import React from 'react';

import user from 'Managers/UserManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Quests').Quest} Quest
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Quests').QuestSaved} QuestSaved
 *
 * @typedef {Object} BackQuestsListPropsType
 * @property {StyleProp} style
 */

/** @type {BackQuestsListPropsType} */
const QuestsProps = {
    style: {}
};

class BackQuestsList extends React.Component {
    state = {
        /** @type {Array<Quest>} */
        quests: []
    };

    /** @param {any} props */
    constructor(props) {
        super(props);

        this.state.quests = user.quests.Get();
    }

    /** @type {Symbol | null} */
    listenerQuest = null;

    componentDidMount() {
        this.listenerQuest = user.quests.allQuests.AddListener((newQuests) => {
            this.setState({ quests: newQuests });
        });
    }

    componentWillUnmount() {
        user.quests.allQuests.RemoveListener(this.listenerQuest);
    }

    /**
     * @param {Quest | QuestSaved} item
     * @returns {item is QuestSaved}
     */
    isSavedQuest = (item) => item.hasOwnProperty('ID');

    /** @param {Quest | QuestSaved} item */
    keyExtractor = (item) => (this.isSavedQuest(item) ? `quest-${item.ID}` : `quest-${item.title}`);

    openQuests = () => user.interface.ChangePage('quests');
}

BackQuestsList.defaultProps = QuestsProps;
BackQuestsList.prototype.props = QuestsProps;

export default BackQuestsList;
