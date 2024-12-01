import dataManager from 'Managers/DataManager';

import { IUserData } from 'Types/Interface/IUserData';
import { DateFormat } from 'Utils/Date';
import DynamicVar from 'Utils/DynamicVar';
import { Random } from 'Utils/Functions';
import { GetGlobalTime, GetMidnightTime, GetTimeToTomorrow } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/Data/User/DailyQuest').DailyQuestData} DailyQuestData
 * @typedef {import('Types/Data/User/DailyQuest').DailyQuestToday} DailyQuestToday
 * @typedef {import('Types/Data/User/DailyQuest').SaveObject_DailyQuest} SaveObject_DailyQuest
 *
 * @typedef {'success' | 'claiming' | 'not-up-to-date' | 'wrong-daily-quests' | 'error'} ClaimResult
 *
 * @typedef {'none' | 'to-do' | 'to-claim' | 'claim-tomorrow' | 'claimed'} DailyQuestDayStatus
 *
 * @typedef {object} DailyQuestDay
 * @property {number} index
 * @property {DailyQuestDayStatus} status
 * @property {import('Class/Rewards').RawReward[]} rewards
 */

const ACTIVITY_MINUTES_PER_DAY = 15;

const DAILYQUEST_MAX_LENGTH = 73;

/** @type {DailyQuestToday} */
const _INIT_DAILYQUESTS = {
    selectedCategory: null,
    progression: 0
};

/** @extends {IUserData<SaveObject_DailyQuest>} */
class DailyQuest extends IUserData {
    /** @type {Symbol | null} */
    #listenerNetwork = null;

    /** @type {Symbol | null} */
    #listenerActivities = null;

    /** @type {DynamicVar<DailyQuestToday>} */
    today = new DynamicVar(_INIT_DAILYQUESTS);

    /** @type {boolean} Currently claiming (to prevent multiple claims) */
    claiming = false;

    /** @type {DynamicVar<DailyQuestData[]>} */
    // eslint-disable-next-line prettier/prettier
    claimsList = new DynamicVar(/** @type {DailyQuestData[]} */ ([]));

    /** @type {DailyQuestData[]} */
    #SAVED_data = [];

    /** @type {DailyQuestData[]} */
    #UNSAVED_data = [];

    /** @type {NodeJS.Timeout | null} Update the current activity time to tomorrow */
    #timeout = null;

    #token = 0;

    /** @param {UserManager} user */
    constructor(user) {
        super('dailyQuest');

        this.user = user;
    }

    onMount = () => {
        this.SetupDailyQuests();

        this.#listenerNetwork = this.user.server2.tcp.state.AddListener((state) => {
            if (state === 'connected') {
                this.LoadOnline();
            } else {
                this.today.Set(_INIT_DAILYQUESTS);
            }
        });
        this.#listenerActivities = this.user.activities.allActivities.AddListener(() => {
            this.UpdateActivities();
        });
    };

    onUnmount = () => {
        if (this.#timeout) {
            clearTimeout(this.#timeout);
        }
        this.user.server2.tcp.state.RemoveListener(this.#listenerNetwork);
        this.user.activities.allActivities.RemoveListener(this.#listenerActivities);
    };

    SetupDailyQuests = async () => {
        if (!this.user.server2.IsAuthenticated()) {
            return Promise.resolve();
        }

        const response = await this.user.server2.tcp.SendAndWait({ action: 'get-daily-quest-today' });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'get-daily-quest-today' ||
            response.result === 'error'
        ) {
            this.user.interface.console?.AddLog(
                'error',
                '[DailyQuest] An error occurred while setting up the daily quest'
            );
            return;
        }

        this.today.Set({
            selectedCategory: response.result.categoryID,
            progression: this.GetDailyProgress(response.result.categoryID)
        });

        // Update the current activity time to tomorrow
        if (this.#timeout) clearTimeout(this.#timeout);

        await this.UpdateActivities();
        const randomDelta = Random(1, 120);
        this.#timeout = setTimeout(this.SetupDailyQuests, (GetTimeToTomorrow() + randomDelta) * 1000);
    };

    UpdateActivities = async () => {
        const currentQuest = this.today.Get();

        // Not initialized yet
        if (currentQuest.selectedCategory === null) {
            return;
        }

        // Check the current progression
        const currentList = this.GetCurrentList();
        const newProgression = this.GetDailyProgress(currentQuest.selectedCategory);

        // If the current quest is already finished, do nothing
        if (currentList !== null && this.IsTodayCompleted(currentList)) {
            return;
        }

        // If the quest has not started but not completed yet
        else if (currentList === null && newProgression < ACTIVITY_MINUTES_PER_DAY) {
            return;
        }

        // Update the progression
        this.today.Set({
            ...currentQuest,
            progression: newProgression
        });

        // Not enough progression
        if (newProgression < ACTIVITY_MINUTES_PER_DAY) {
            return;
        }

        // Check if the last day is today
        const claimList = this.GetCurrentList();
        const todayDateStr = DateFormat(new Date(), 'YYYY-MM-DD');

        // If there is no claim list or the last day is finished, create a new claim list
        if (claimList === null || claimList.daysCount === DAILYQUEST_MAX_LENGTH) {
            this.#UNSAVED_data.push({
                start: todayDateStr,
                daysCount: 1,
                claimed: []
            });
            this.claimsList.Set([...this.#SAVED_data, ...this.#UNSAVED_data]);
        }

        // If the last day is today, increment the days count
        else {
            // Remove the list from SAVED
            this.#SAVED_data = this.#SAVED_data.filter((claim) => claim.start !== claimList.start);

            // Add the new list to UNSAVED
            claimList.daysCount++;
            this.#UNSAVED_data.push(claimList);

            // Update the claims list
            this.claimsList.Set([...this.#SAVED_data, ...this.#UNSAVED_data]);
        }

        return await this.SaveOnline();
    };

    Clear = () => {
        this.today.Set(_INIT_DAILYQUESTS);
        this.claimsList.Set([]);
        this.#SAVED_data = [];
        this.#UNSAVED_data = [];
        this.#token = 0;
    };

    /** @param {Partial<SaveObject_DailyQuest>} data */
    Load = (data) => {
        if (typeof data.SAVED_data !== 'undefined') this.#SAVED_data = data.SAVED_data;
        if (typeof data.UNSAVED_data !== 'undefined') this.#UNSAVED_data = data.UNSAVED_data;
        if (typeof data.token !== 'undefined') this.#token = data.token;

        this.claimsList.Set([...this.#SAVED_data, ...this.#UNSAVED_data]);
    };

    /** @returns {SaveObject_DailyQuest} */
    Save = () => {
        return {
            SAVED_data: this.#SAVED_data,
            UNSAVED_data: this.#UNSAVED_data,
            token: this.#token
        };
    };

    LoadOnline = async () => {
        const response = await this.user.server2.tcp.SendAndWait({ action: 'get-daily-quests', token: this.#token });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'get-daily-quests' ||
            response.result === 'error'
        ) {
            this.user.interface.console?.AddLog(
                'error',
                '[DailyQuest] An error occurred while loading the daily quest'
            );
            return false;
        }

        if (response.result === 'already-up-to-date') {
            return true;
        }

        this.#SAVED_data = response.result.claimData;
        this.#token = response.result.token;

        this.claimsList.Set([...this.#SAVED_data, ...this.#UNSAVED_data]);
        return true;
    };

    /** @returns {Promise<boolean>} */
    SaveOnline = async (attempt = 1) => {
        if (!this.#isUnsaved()) return true;

        const data = this.#getUnsaved();
        const response = await this.user.server2.tcp.SendAndWait({
            action: 'save-daily-quests',
            token: this.#token,
            newDailyQuests: data
        });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'save-daily-quests' ||
            response.result === 'error'
        ) {
            this.user.interface.console?.AddLog('error', '[DailyQuest] An error occurred while saving the daily quest');
            return false;
        }

        if (response.result === 'wrong-daily-quests') {
            this.user.interface.console?.AddLog('error', '[DailyQuest] Wrong daily quests');
            return false;
        }

        if (response.result === 'not-up-to-date') {
            if (attempt <= 0) {
                this.user.interface.console?.AddLog('error', '[DailyQuest] Not up to date, but no more attempts');
                return false;
            }

            this.user.interface.console?.AddLog('info', '[DailyQuest] Not up to date, trying again');
            await this.LoadOnline();
            return this.SaveOnline(attempt - 1);
        }

        this.#token = response.result.token;
        this.#purge(response.result.newDailyQuests);
        this.user.SaveLocal();

        return true;
    };

    #isUnsaved = () => {
        return this.#UNSAVED_data.length > 0;
    };

    #getUnsaved = () => {
        return this.#UNSAVED_data;
    };

    /** @param {DailyQuestData[]} newData */
    #purge = (newData) => {
        this.#SAVED_data.push(...newData);
        this.#UNSAVED_data = [];
        this.claimsList.Set([...this.#SAVED_data]);
    };

    /**
     * @returns {number} Index of the current claim list or -1 if there is no current claim list
     */
    GetCurrentClaimIndex = () => {
        const claimsList = this.claimsList.Get();

        // Get last not full claimed list
        let index = claimsList.findIndex((claimList) => claimList.daysCount !== claimList.claimed.length);

        // If there is no list, get the last list
        if (index === -1 && claimsList.length > 0) {
            index = claimsList.length - 1;
        }

        return index;
    };

    /** @param {DailyQuestData} claimList */
    IsCurrentList(claimList) {
        const todayDateStr = DateFormat(new Date(), 'YYYY-MM-DD');
        const tmpDate = new Date(claimList.start + 'T00:00:00');

        // Check if the last day is today
        tmpDate.setDate(tmpDate.getDate() + claimList.daysCount - 1);
        const lastDateStrWithoutComplete = DateFormat(tmpDate, 'YYYY-MM-DD');
        tmpDate.setDate(tmpDate.getDate() + 1);
        const lastDateStrWithComplete = DateFormat(tmpDate, 'YYYY-MM-DD');

        return todayDateStr === lastDateStrWithComplete || todayDateStr === lastDateStrWithoutComplete;
    }

    /**
     * Check if the current day is completed (only for the current existing list)
     * @param {DailyQuestData} claimList
     * @returns {boolean}
     */
    IsTodayCompleted = (claimList) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDateStr = DateFormat(tomorrow, 'YYYY-MM-DD');

        const tmpDate = new Date(claimList.start + 'T00:00:00');
        tmpDate.setDate(tmpDate.getDate() + claimList.daysCount);
        const lastDateStr = DateFormat(tmpDate, 'YYYY-MM-DD');

        return tomorrowDateStr === lastDateStr;
    };

    GetCurrentList = () => {
        const claimLists = this.claimsList.Get();
        if (claimLists.length === 0) return null;

        const lastClaimList = claimLists[claimLists.length - 1];
        if (!this.IsCurrentList(lastClaimList)) return null;

        return lastClaimList;
    };

    /**
     * @param {number} categoryID
     * @returns {number} Progress in minutes
     */
    GetDailyProgress(categoryID) {
        const now = GetGlobalTime();
        const midnight = GetMidnightTime(now);
        const activities = this.user.activities.Get();

        let progressMinutes = 0;
        for (let i = activities.length - 1; i >= 0; i--) {
            const { skillID, startTime, duration } = activities[i];
            if (startTime < midnight) {
                break;
            }

            const skill = dataManager.skills.GetByID(skillID);
            if (skill === null) {
                continue;
            }

            if (skill.CategoryID === categoryID) {
                progressMinutes += duration;
            }
        }

        return progressMinutes;
    }

    /** @returns {Promise<ClaimResult>} */
    ClaimAll = async () => {
        const claimsList = this.claimsList.Get();
        const claimListIndex = this.GetCurrentClaimIndex();
        if (claimListIndex === -1) {
            return 'error';
        }

        const claimList = claimsList[claimListIndex];
        const dayIndexes = [];
        for (let i = 0; i < claimList.daysCount; i++) {
            if (!claimList.claimed.includes(i + 1)) {
                dayIndexes.push(i);
            }
        }

        if (dayIndexes.length === 0) {
            return 'error';
        }

        return await this.ClaimReward(claimList.start, dayIndexes);
    };

    /**
     * @param {string} claimListStart
     * @param {number[]} indexesToClaim
     * @returns {Promise<ClaimResult>}
     */
    ClaimReward = async (claimListStart, indexesToClaim) => {
        // Prevent multiple claims
        if (this.claiming) {
            return 'claiming';
        }

        this.claiming = true;

        const response = await this.user.server2.tcp.SendAndWait({
            action: 'claim-daily-quest',
            claimStart: claimListStart,
            indexesToClaim,
            token: this.#token
        });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'claim-daily-quest' ||
            response.result === 'error'
        ) {
            this.claiming = false;
            return 'error';
        }

        if (response.result === 'not-up-to-date') {
            this.claiming = false;
            return 'not-up-to-date';
        }

        if (response.result === 'wrong-daily-quests') {
            this.claiming = false;
            return 'wrong-daily-quests';
        }

        const currentQuestIndexSaved = this.#SAVED_data.findIndex((claim) => claim.start === claimListStart);
        const currentQuestIndexUnsaved = this.#UNSAVED_data.findIndex((claim) => claim.start === claimListStart);
        if (currentQuestIndexUnsaved !== -1) {
            this.#UNSAVED_data[currentQuestIndexUnsaved].claimed.push(...response.result.dayIndexes);
        } else if (currentQuestIndexSaved !== -1) {
            this.#SAVED_data[currentQuestIndexSaved].claimed.push(...response.result.dayIndexes);
        }

        this.#token = response.result.token;

        this.user.rewards.ExecuteRewards(response.result.rewards, response.result.newOx);
        this.user.rewards.ShowRewards(response.result.rewards, 'only-items');

        this.claiming = false;
        this.claimsList.Set([...this.#SAVED_data, ...this.#UNSAVED_data]);
        return 'success';
    };

    /**
     * @param {DailyQuestData | null} claimList Null to get the default list
     * @returns {DailyQuestDay[]}
     */
    GetClaimDays = (claimList) => {
        const today = this.today.Get();

        // If not initialized: return default list
        if (today === null || claimList === null) {
            const dailyQuestsRewards = dataManager.dailyQuestsRewards.Get();
            return dailyQuestsRewards.map((reward, index) => ({
                index,
                status: index === 0 ? 'to-do' : index === 1 ? 'claim-tomorrow' : 'none',
                rewards: reward.rewards
            }));
        }

        // Get the start date
        const tmpDate = new Date(claimList.start + 'T00:00:00');
        const todayDateStr = DateFormat(new Date(), 'YYYY-MM-DD');

        // Get the rewards
        const dailyQuestsRewards = dataManager.dailyQuestsRewards.Get();

        /** @type {DailyQuestDay[]} */
        const days = [];

        /** @type {'before' | 'today' | 'tomorrow' | 'after'} */
        let daysPosition = 'before';

        for (let i = 0; i < DAILYQUEST_MAX_LENGTH; i++) {
            const currentDateStr = DateFormat(tmpDate, 'YYYY-MM-DD');

            if (daysPosition === 'before' && currentDateStr === todayDateStr) {
                daysPosition = 'today';
            } else if (daysPosition === 'today' /* Assuming the list progresses linearly into future days */) {
                daysPosition = 'tomorrow';
            } else if (daysPosition === 'tomorrow' /* Same */) {
                daysPosition = 'after';
            }

            const isClaimed = claimList.claimed.includes(i);

            /** @type {DailyQuestDayStatus} */
            let status = 'none';

            if (daysPosition === 'before') {
                if (!isClaimed) {
                    status = 'to-claim';
                } else {
                    status = 'claimed';
                }
            } else if (daysPosition === 'today') {
                if (today.progression < ACTIVITY_MINUTES_PER_DAY) {
                    status = 'to-do';
                } else if (!isClaimed) {
                    status = 'to-claim';
                } else {
                    status = 'claimed';
                }
            } else if (daysPosition === 'tomorrow') {
                status = 'claim-tomorrow';
            }

            // Get rewards from app data
            /** @type {DailyQuestDay['rewards']} */
            const rewards = dailyQuestsRewards.find((r) => r.index === i)?.rewards ?? [];

            days.push({
                index: i,
                status,
                rewards
            });

            // Increment the date
            tmpDate.setDate(tmpDate.getDate() + 1);
        }

        return days;
    };

    /**
     * @param {DailyQuestData} claimList
     * @returns {number} Streak
     */
    GetStreak = (claimList) => {
        return claimList.claimed.length;
    };

    /**
     * @param {DailyQuestData} claimList
     * @returns {number}
     */
    GetLastUnclaimedDayIndex = (claimList) => {
        let i;

        for (i = 0; i < claimList.daysCount; i++) {
            if (!claimList.claimed.includes(i)) {
                break;
            }
        }

        return i;
    };
}

export { ACTIVITY_MINUTES_PER_DAY };
export default DailyQuest;
