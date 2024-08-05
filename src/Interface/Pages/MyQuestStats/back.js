import React from 'react';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';

import { AddActivity } from 'Interface/Widgets';

/**
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 *
 * @typedef {Object} BackQuestPropsType
 * @property {Object} args
 * @property {MyQuest | null} args.quest
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
            user.interface.console?.AddLog('error', 'MyQuest: Quest not found');
            return;
        }

        /** @type {MyQuest} */
        this.selectedQuest = quest;
        this.activitiesTimeText = user.quests.myquests.GetQuestTimeText(this.selectedQuest);
        this.showAnimations = props.args.showAnimations ?? BackQuestProps.args.showAnimations;
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
