import React from 'react';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @typedef {import('react-native').FlatList<MyQuest>} FlatListMyQuest
 *
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 */

class BackQuestsList extends React.Component {
    state = {
        /** @type {Array<MyQuest>} */
        quests: []
    };

    /** @param {any} props */
    constructor(props) {
        super(props);

        this.state.quests = user.quests.myquests.Get().slice(0, 3);
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
        this.setState({
            quests: user.quests.myquests.Get().slice(0, 3)
        });
    };

    /** @param {MyQuest} item */
    keyExtractor = (item) => 'quest-' + item.title + JSON.stringify(item.skills) + JSON.stringify(item.schedule);

    /**
     * Add a new quest to the list and open the quest page\
     * Max 10 quests
     */
    addQuest = () => {
        if (user.quests.myquests.IsMax()) {
            const title = langManager.curr['quests']['alert-questslimit-title'];
            const message = langManager.curr['quests']['alert-questslimit-message'];
            user.interface.popup.OpenT({
                type: 'ok',
                data: { title, message }
            });
            return;
        }
        user.interface.ChangePage('myquest', { storeInHistory: false });
    };
}

export default BackQuestsList;
