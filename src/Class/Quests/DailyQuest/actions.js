import { UpdateActivities } from './updates';

/**
 * @typedef {import('./index').default} DailyQuest
 * 
 * @typedef {(index: number) => void} RefreshSkillSelectionType
 */

/**
 * Refresh a skill
 * @this {DailyQuest}
 * @type {RefreshSkillSelectionType}
 */
function RefreshSkillSelection(index) {
    const { selectedSkillsID, queueSkillsID } = this.today.Get();
    const refreshesRemaining = queueSkillsID.length;

    if (refreshesRemaining === 0) {
        this.user.interface.console.AddLog('error', '[DailyQuest] You have no more refreshes remaining');
        return;
    }

    selectedSkillsID[index] = queueSkillsID[0];
    queueSkillsID.shift();

    this.today.Set({
        ...this.today.Get(),
        selectedSkillsID,
        queueSkillsID
    });

    UpdateActivities.call(this);
    this.user.LocalSave();
}

export { RefreshSkillSelection };
