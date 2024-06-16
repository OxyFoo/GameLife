import { DateFormat } from 'Utils/Date';
import { GetTimeToTomorrow } from 'Utils/Time';

/**
 * @typedef {import('./index').default} DailyQuest
 * 
 * @typedef {() => void} UpdateSetupType
 * @typedef {() => void} UpdateActivitiesType
 */

/**
 * Update the daily quest setup
 * @this {DailyQuest}
 * @type {UpdateSetupType}
 */
function UpdateSetup() {
    const todayDate = DateFormat(new Date(), 'YYYY-MM-DD');

    // Update the current activity time to tomorrow
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(UpdateSetup.bind(this), GetTimeToTomorrow() * 1000);

    if (this.today.Get().date === todayDate) {
        return;
    }

    const { worstStatsQuantity, skillsQuantity } = this.config.selection;
    const { refreshCount, skillsCount } = this.config.dailySettings;

    /** @type {Array<number>} Worst skills ID */
    const worstSkillsID = this.GetActivitiesIdOfDay(worstStatsQuantity, skillsQuantity)
        .sort(() => Math.random() - 0.5);

    const newSelectedSkillsID = worstSkillsID.slice(0, skillsCount);
    const newQueueSkillsID = worstSkillsID.slice(skillsCount, skillsCount + refreshCount);

    this.today.Set({
        date: todayDate,
        loaded: true,
        selectedSkillsID: newSelectedSkillsID,
        queueSkillsID: newQueueSkillsID,
        progression: 0,
        claimed: false
    });
}

/**
 * Update the activities
 * @this {DailyQuest}
 * @type {UpdateActivitiesType}
 */
function UpdateActivities() {
    const { selectedSkillsID, progression } = this.today.Get();
    const { activityMinutes } = this.config.dailySettings;

    // Check if the progression is already completed
    if (progression >= activityMinutes) {
        return;
    }

    // Update the progression
    const newProgression = this.GetDailyProgress(selectedSkillsID);
    this.today.Set({
        ...this.today.Get(),
        progression: newProgression
    });

    // Check if the progression is completed
    if (newProgression < activityMinutes) {
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
