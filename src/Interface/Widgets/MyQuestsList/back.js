import React from 'react';

import user from 'Managers/UserManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
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
        /** @type {Array<MyQuest>} */
        quests: []
    };

    /** @param {any} props */
    constructor(props) {
        super(props);

        this.state.quests = user.quests.myquests.Get();
    }

    /** @type {Symbol | null} */
    listenerQuest = null;

    componentDidMount() {
        this.listenerQuest = user.quests.myquests.allQuests.AddListener(this.refreshQuests);
    }

    componentWillUnmount() {
        user.quests.myquests.allQuests.RemoveListener(this.listenerQuest);
    }

    refreshQuests = () => {
        const quests = user.quests.myquests.Get();
        this.setState({ quests });
    };

    /** @param {MyQuest} item */
    keyExtractor = (item) => 'quest-' + item.title + JSON.stringify(item.skills) + JSON.stringify(item.schedule);

    openMyQuests = () => user.interface.ChangePage('myquests');
}

BackQuestsList.defaultProps = QuestsProps;
BackQuestsList.prototype.props = QuestsProps;

export default BackQuestsList;
