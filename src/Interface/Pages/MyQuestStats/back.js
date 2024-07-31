import React from 'react';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';

import { AddActivity } from 'Interface/Widgets';

/**
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 */

const BackQuestProps = {
    args: {
        /** @type {MyQuest | null} */
        quest: null
    }
};

class BackQuest extends PageBase {
    /** @param {BackQuestProps} props */
    constructor(props) {
        super(props);

        const quest = props.args.quest;
        if (quest === null) {
            user.interface.BackHandle();
            user.interface.console?.AddLog('error', 'MyQuest: Quest not found');
            return;
        }

        /** @type {MyQuest} */
        this.selectedQuest = quest;
        this.activitiesTimeText = user.quests.myquests.GetQuestTimeText(quest);
    }

    onAddPress = () => {
        if (this.selectedQuest === null) return;
        const { skills } = this.selectedQuest;

        user.interface.bottomPanel?.Open({
            content: <AddActivity listSkillsIDs={skills} />,
            movable: false
        });
    };

    onEditPress = () => {
        if (this.selectedQuest === null) return;
        const quest = this.selectedQuest;

        user.interface.ChangePage('myquest', { args: { quest }, storeInHistory: false });
    };

    onBackPress = () => {
        user.interface.BackHandle();
    };
}

BackQuest.defaultProps = BackQuestProps;
BackQuest.prototype.props = BackQuestProps;

export default BackQuest;
