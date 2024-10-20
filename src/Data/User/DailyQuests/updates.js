import { DateFormat } from 'Utils/Date';
import { MinMax } from 'Utils/Functions';
import { GetTimeToTomorrow } from 'Utils/Time';
import { GetRandomIntByDay } from 'Utils/Items';

/**
 * @typedef {import('./index').default} DailyQuest
 */

/**
 * Update the daily quest setup
 * @this {DailyQuest}
 */
function UpdateSetup() {
    /** @type {number} */
    this.seed = GetRandomIntByDay(1, this.config.preSelectionCount - 1);

    /** @type {Array<number>} Worst skills ID */
    this.worstSkillsID = this.GetActivitiesIdOfDay(this.config.preSelectionCount, this.config.worstStatsQuantity);

    const newSelectedSkillsID = this.GetSelectedSkillsIDs(this.worstSkillsID, this.selectedIndexes);

    this.today.Set({
        refreshesRemaining: this.config.refresh_count_per_day,
        selectedSkillsID: newSelectedSkillsID,
        progression: this.GetDailyProgress(newSelectedSkillsID),
        claimed: false
    });

    // Update the current activity time to tomorrow
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(UpdateSetup.bind(this), GetTimeToTomorrow() * 1000);
}

/**
 * Update the activities
 * @this {DailyQuest}
 * @param {number | null} [newRefreshQuantity] New refresh quantity
 */
function UpdateActivities(newRefreshQuantity = null) {
    const { refreshesRemaining } = this.today.Get();

    const newProgression = this.GetDailyProgress(this.GetSelectedSkillsIDs(this.worstSkillsID, this.selectedIndexes));
    const newSelectedSkillsID = this.GetSelectedSkillsIDs(this.worstSkillsID, this.selectedIndexes);
    let newRefreshesRemaining = refreshesRemaining;
    if (newRefreshQuantity !== null) {
        newRefreshesRemaining = MinMax(0, newRefreshQuantity, this.config.refresh_count_per_day);
    }

    this.today.Set({
        ...this.today.Get(),
        refreshesRemaining: newRefreshesRemaining,
        selectedSkillsID: newSelectedSkillsID,
        progression: newProgression
    });

    if (newProgression < this.config.activity_minutes_per_day) {
        return;
    }

    // Check if the last day is today
    const claimList = this.GetCurrentList();
    const claimLists = this.claimsList.Get();
    const todayDateStr = DateFormat(new Date(), 'YYYY-MM-DD');

    if (claimList === null || claimList.daysCount === 73) {
        claimLists.push({
            start: todayDateStr,
            daysCount: 1,
            claimed: []
        });
        this.claimsList.Set(claimLists);
        this.SAVED_claimsList = false;
    } else {
        const lastDay = new Date(claimList.start + 'T00:00:00');
        lastDay.setDate(lastDay.getDate() + claimList.daysCount);
        const lastDayDateStr = DateFormat(lastDay, 'YYYY-MM-DD');

        if (lastDayDateStr === todayDateStr) {
            claimList.daysCount++;
            this.claimsList.Set(claimLists);
            this.SAVED_claimsList = false;
        }
    }
}

export { UpdateSetup, UpdateActivities };
