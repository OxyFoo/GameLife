import dataManager from 'Managers/DataManager';

import { IUserData } from 'Types/Interface/IUserData';
import { DateFormat } from 'Utils/Date';
import DynamicVar from 'Utils/DynamicVar';
import { Random } from 'Utils/Functions';
import { GetTimeToTomorrow } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/Data/User/DailyQuest').DailyQuestData} DailyQuestData
 * @typedef {import('Types/Data/User/DailyQuest').DailyQuestToday} DailyQuestToday
 * @typedef {import('Types/Data/User/DailyQuest').SaveObject_DailyQuest} SaveObject_DailyQuest
 *
 * @typedef {'success' | 'not-up-to-date' | 'wrong-daily-quests' | 'error'} ClaimResult
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

/** @type {DailyQuestData[]} */
const _INIT_CLAIMS = [];

/** @extends {IUserData<SaveObject_DailyQuest>} */
class DailyQuest extends IUserData {
    /** @type {UserManager} */
    #user;

    /** @type {DynamicVar<DailyQuestToday>} */
    currentQuest = new DynamicVar(_INIT_DAILYQUESTS);

    /** @type {DynamicVar<DailyQuestData[]>} */
    claimsList = new DynamicVar(_INIT_CLAIMS);

    /** @type {DailyQuestData[]} */
    #SAVED_data = [];

    /** @type {DailyQuestData[]} */
    #UNSAVED_data = [];

    #token = 0;

    /** @type {NodeJS.Timeout | null} Update the current activity time to tomorrow */
    #timeout = null;

    /** @type {Symbol | null} */
    #listenerNetwork = null;

    /** @type {Symbol | null} */
    #listenerActivities = null;

    /** @param {UserManager} user */
    constructor(user) {
        super('dailyQuest');

        this.#user = user;
    }

    onMount = () => {
        this.SetupDailyQuests();

        this.#listenerNetwork = this.#user.server2.tcp.state.AddListener((state) => {
            if (state === 'authenticated') {
                this.SetupDailyQuests();
            } else if (this.currentQuest.Get().selectedCategory !== null) {
                this.currentQuest.Set(_INIT_DAILYQUESTS);
            }
        });

        this.#listenerActivities = this.#user.activities.allActivities.AddListener(() => {
            // Wait for activities to be updated to avoid conflicts with the data tokens
            this.#timeout = setTimeout(this.UpdateActivities, 1000);
        });
    };

    onUnmount = () => {
        if (this.#timeout) {
            clearTimeout(this.#timeout);
        }
        this.#user.server2.tcp.state.RemoveListener(this.#listenerNetwork);
        this.#user.activities.allActivities.RemoveListener(this.#listenerActivities);
    };

    GetTodayStrDate = () => {
        return DateFormat(new Date(), 'YYYY-MM-DD');
    };

    SetupDailyQuests = async () => {
        if (!this.#user.server2.IsAuthenticated()) {
            return;
        }

        const response = await this.#user.server2.tcp.SendAndWait({ action: 'get-daily-quest-today' });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'get-daily-quest-today' ||
            response.result === 'error'
        ) {
            this.#user.interface.console?.AddLog(
                'error',
                '[DailyQuest] An error occurred while setting up the daily quest',
                response
            );
            return;
        }

        this.currentQuest.Set({
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
        const currentQuest = this.currentQuest.Get();

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

        // Not started yet or not enough progression
        else if (currentList === null && currentQuest.progression >= ACTIVITY_MINUTES_PER_DAY) {
            return;
        }

        // Update the progression
        this.currentQuest.Set({
            ...currentQuest,
            progression: newProgression
        });

        // Not enough progression
        if (newProgression < ACTIVITY_MINUTES_PER_DAY) {
            return;
        }

        // Check if the last day is today
        // const claimList = this.GetCurrentList();

        // If there is no claim list or the last day is finished, create a new claim list
        if (currentList === null || currentList.daysCount === DAILYQUEST_MAX_LENGTH) {
            this.#UNSAVED_data.push({
                start: this.GetTodayStrDate(),
                daysCount: 1,
                claimed: []
            });
            this.claimsList.Set([...this.#SAVED_data, ...this.#UNSAVED_data]);
        }

        // If the last day is today, increment the days count
        else {
            // Clone the claim list
            const newClaimList = { ...currentList };

            // Remove the list from SAVED and UNSAVED
            this.#SAVED_data = this.#SAVED_data.filter((claim) => claim.start !== newClaimList.start);
            this.#UNSAVED_data = this.#UNSAVED_data.filter((claim) => claim.start !== newClaimList.start);

            // Add the new list to UNSAVED
            newClaimList.daysCount++;
            this.#UNSAVED_data.push(newClaimList);

            // Update the claims list
            this.claimsList.Set([...this.#SAVED_data, ...this.#UNSAVED_data]);
        }

        return await this.SaveOnline();
    };

    Clear = () => {
        this.currentQuest.Set(_INIT_DAILYQUESTS);
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
        const response = await this.#user.server2.tcp.SendAndWait({ action: 'get-daily-quests', token: this.#token });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'get-daily-quests' ||
            response.result === 'error'
        ) {
            this.#user.interface.console?.AddLog(
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
        const response = await this.#user.server2.tcp.SendAndWait({
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
            this.#user.interface.console?.AddLog(
                'error',
                `[DailyQuest] An error occurred while saving the daily quest (${typeof response === 'string' ? response : JSON.stringify(response)})`
            );
            return false;
        }

        if (response.result === 'wrong-daily-quests') {
            this.#user.interface.console?.AddLog('error', '[DailyQuest] Wrong daily quests');
            return false;
        }

        if (response.result === 'not-up-to-date') {
            if (attempt <= 0) {
                this.#user.interface.console?.AddLog('error', '[DailyQuest] Not up to date, but no more attempts');
                return false;
            }

            this.#user.interface.console?.AddLog('info', '[DailyQuest] Not up to date, trying again');
            await this.LoadOnline();
            return this.SaveOnline(attempt - 1);
        }

        this.#token = response.result.token;
        this.#purge(response.result.newDailyQuests);
        this.#user.SaveLocal();

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

    /**
     * Check if the current day is completed (only for the current existing list)
     * @param {DailyQuestData} claimList
     * @returns {boolean}
     */
    IsTodayCompleted = (claimList) => {
        const todayStr = this.GetTodayStrDate();
        const completionDate = new Date(claimList.start + 'T00:00:00');
        completionDate.setDate(completionDate.getDate() + claimList.daysCount - 1);
        return DateFormat(completionDate, 'YYYY-MM-DD') === todayStr;
    };

    /** @param {DailyQuestData} claimList */
    IsCurrentList(claimList) {
        const todayDateStr = this.GetTodayStrDate();
        const todayDate = new Date(todayDateStr + 'T00:00:00');
        const firstDate = new Date(claimList.start + 'T00:00:00');
        const lastDate = new Date(firstDate);
        lastDate.setDate(lastDate.getDate() + claimList.daysCount + 1);
        return todayDate >= firstDate && todayDate < lastDate;
    }

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
        const activities = this.#user.activities.GetByDay(this.GetTodayStrDate());

        let progressMinutes = 0;
        for (let i = activities.length - 1; i >= 0; i--) {
            const { skillID, duration } = activities[i];

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
            if (!claimList.claimed.includes(i)) {
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
        const response = await this.#user.server2.tcp.SendAndWait({
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
            return 'error';
        }

        if (response.result === 'not-up-to-date') {
            return 'not-up-to-date';
        }

        if (response.result === 'wrong-daily-quests') {
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

        this.#user.rewards.ExecuteRewards(response.result.rewards, response.result.newOx);
        this.#user.rewards.ShowRewards(response.result.rewards, 'only-items');

        this.claimsList.Set([...this.#SAVED_data, ...this.#UNSAVED_data]);
        return 'success';
    };

    /**
     * @param {DailyQuestData | null} claimList Null to get the default list
     * @returns {DailyQuestDay[]}
     */
    GetClaimDays = (claimList) => {
        const today = this.currentQuest.Get();

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
        const todayDateStr = this.GetTodayStrDate();
        const isCurrentList = this.IsCurrentList(claimList);

        // Get the rewards
        const dailyQuestsRewards = dataManager.dailyQuestsRewards.Get();

        /** @type {DailyQuestDay[]} */
        const days = [];

        /** @type {'before' | 'today' | 'tomorrow' | 'after'} */
        let daysPosition = 'before';

        for (let i = 0; i < DAILYQUEST_MAX_LENGTH; i++) {
            const currentDateStr = DateFormat(tmpDate, 'YYYY-MM-DD');

            const isPast = i < claimList.daysCount;
            const isClaimed = claimList.claimed.includes(i);
            const isCompleteToday = this.IsTodayCompleted(claimList);

            if (!isPast && !isCurrentList) {
                daysPosition = 'after';
            } else if (daysPosition === 'before' && currentDateStr === todayDateStr) {
                daysPosition = 'today';
            } else if (daysPosition === 'today' /* Assuming the list progresses linearly into future days */) {
                daysPosition = 'tomorrow';
            } else if (daysPosition === 'tomorrow' /* Same */) {
                daysPosition = 'after';
            }

            /** @type {DailyQuestDayStatus} */
            let status = 'none';

            if (daysPosition === 'before') {
                if (!isClaimed) {
                    status = 'to-claim';
                } else {
                    status = 'claimed';
                }
            } else if (daysPosition === 'today') {
                if (!isCompleteToday) {
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
        return claimList.daysCount;
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
