import React from 'react';

import user from 'Managers/UserManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Types/Data/User/Quests').Quest} Quest
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
        this.listenerQuest = user.quests.allQuests.AddListener(this.refreshQuests);
    }

    componentWillUnmount() {
        user.quests.allQuests.RemoveListener(this.listenerQuest);
    }

    refreshQuests = () => {
        const quests = user.quests.Get();
        this.setState({ quests });
    };

    /** @param {Quest} item */
    keyExtractor = (item) => 'quest-' + item.title + JSON.stringify(item.skills) + JSON.stringify(item.schedule);

    openQuests = () => user.interface.ChangePage('quests');
}

BackQuestsList.defaultProps = QuestsProps;
BackQuestsList.prototype.props = QuestsProps;

export default BackQuestsList;
