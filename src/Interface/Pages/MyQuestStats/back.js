import { PageBase } from 'Interface/Components';
import user from 'Managers/UserManager';

/**
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 */

class BackQuest extends PageBase {
    constructor(props) {
        super(props);

        if (this.props.args?.quest) {
            /** @type {MyQuest | null} */
            const quest = this.props.args.quest || null;
            this.selectedQuest = quest;

            if (quest === null) {
                user.interface.BackHandle();
                user.interface.console.AddLog('error', 'MyQuest: Quest not found');
                return;
            }
        }
    }

    onAddPress = () => {
        const { skills } = this.selectedQuest;
        user.interface.ChangePage('activity', { skills }, true);
    }

    onEditPress = () => {
        const quest = this.selectedQuest;
        user.interface.ChangePage('myquest', { quest }, true);
    }
}

export default BackQuest;
