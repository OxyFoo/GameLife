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
    const refreshesRemaining = this.today.Get().refreshesRemaining;

    if (refreshesRemaining <= 0) {
        this.user.interface.console.AddLog('error', '[DailyQuest] You have no more refreshes remaining');
        return;
    }

    const maxValue = this.selectedIndexes.reduce((a, b) => Math.max(a, b), 0);
    this.selectedIndexes[index] = maxValue + 1;

    UpdateActivities.call(this, refreshesRemaining - 1);
    this.user.LocalSave();
}

export { RefreshSkillSelection };
