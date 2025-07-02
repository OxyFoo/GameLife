import React from 'react';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';

import { AddActivity } from 'Interface/Widgets';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Quests').Quest} Quest
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Quests').QuestSaved} QuestSaved
 *
 * @typedef {Object} BackQuestPropsType
 * @property {Object} args
 * @property {Quest | QuestSaved | null} args.quest
 * @property {boolean | undefined} [args.showAnimations]
 */

/** @type {BackQuestPropsType} */
const BackQuestProps = {
    args: {
        quest: null,
        showAnimations: true
    }
};

class BackQuest extends PageBase {
    /** @param {BackQuestProps} props */
    constructor(props) {
        super(props);

        const quest = props.args.quest;
        if (quest === null) {
            user.interface.BackHandle();
            user.interface.console?.AddLog('error', 'Quest: Quest not found');
            return;
        }

        const realQuest = user.quests.Get().find((q) => q.title === quest.title);
        if (realQuest === undefined) {
            user.interface.BackHandle();
            user.interface.console?.AddLog('error', 'Quest: Quest not found');
            return;
        }

        /** @type {Quest} */
        this.selectedQuest = realQuest;
        this.activitiesTimeText = user.quests.GetQuestTimeText(this.selectedQuest);
        this.showAnimations = props.args.showAnimations ?? BackQuestProps.args.showAnimations;
    }

    onAddPress = () => {
        if (this.selectedQuest === null) return;
        const { skills } = this.selectedQuest;

        this.fe.bottomPanel?.Open({
            content: <AddActivity listSkillsIDs={skills} />
        });
    };

    onEditPress = () => {
        if (this.selectedQuest === null) return;
        const quest = this.selectedQuest;

        user.interface.ChangePage('quest', { args: { quest }, storeInHistory: false });
    };

    onBackPress = () => {
        user.interface.BackHandle();
    };
}

BackQuest.defaultProps = BackQuestProps;
BackQuest.prototype.props = BackQuestProps;

export default BackQuest;
