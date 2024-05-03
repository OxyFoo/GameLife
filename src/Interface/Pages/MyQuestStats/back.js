import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';

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

        if (this.props.args.quest !== null) {
            /** @type {MyQuest | null} */
            const quest = this.props.args.quest;
            this.selectedQuest = quest;

            user.interface.BackHandle();
            user.interface.console.AddLog('error', 'MyQuest: Quest not found');
        }
    }

    refTuto1 = null;
    refTuto2 = null;
    refTuto3 = null;

    onAddPress = () => {
        const { skills } = this.selectedQuest;
        user.interface.ChangePage('activity', { skills }, true);
    }

    onEditPress = () => {
        const quest = this.selectedQuest;
        user.interface.ChangePage('myquest', { quest }, true);
    }
}

BackQuest.defaultProps = BackQuestProps;
BackQuest.prototype.props = BackQuestProps;

export default BackQuest;
