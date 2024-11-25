import dataManager from 'Managers/DataManager';

import { IUserData } from 'Types/Interface/IUserData';
import { DateFormat } from 'Utils/Date';
import DynamicVar from 'Utils/DynamicVar';
import { GetGlobalTime, GetMidnightTime, GetTimeToTomorrow } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/Data/User/DailyQuest').DailyQuestData} DailyQuestData
 * @typedef {import('Types/Data/User/DailyQuest').DailyQuestToday} DailyQuestToday
 * @typedef {import('Types/Data/User/DailyQuest').SaveObject_DailyQuest} SaveObject_DailyQuest
 *
 * @typedef {'success' | 'claiming' | 'not-up-to-date' | 'wrong-daily-quests' | 'error'} ClaimResult
 */

const ACTIVITY_MINUTES_PER_DAY = 15;

/** @extends {IUserData<SaveObject_DailyQuest>} */
class DailyQuest extends IUserData {
    /** @type {Symbol | null} */
    #listenerNetwork = null;

    /** @type {Symbol | null} */
    #listenerActivities = null;

    /** @type {DynamicVar<DailyQuestToday | null>} */
    // eslint-disable-next-line prettier/prettier
    today = new DynamicVar(/** @type {DailyQuestToday | null} */ (null));

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
        this.UpdateActivities();

        this.#listenerNetwork = this.user.server2.tcp.state.AddListener((state) => {
            if (state === 'connected') {
                console.log('DailyQuest: Connected to the server');
                this.LoadOnline();
            } else {
                this.today.Set(null);
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
            progression: this.GetDailyProgress(response.result.categoryID),
            claimed: false
        });

        // Update the current activity time to tomorrow
        if (this.#timeout) clearTimeout(this.#timeout);
        this.#timeout = setTimeout(this.SetupDailyQuests, GetTimeToTomorrow() * 1000);
    };

    UpdateActivities = () => {
        const currentQuest = this.today.Get();

        if (currentQuest === null) {
            this.user.interface.console?.AddLog('error', '[DailyQuest] Current quest is null');
            return;
        }

        const newProgression = this.GetDailyProgress(currentQuest.selectedCategory);

        this.today.Set({
            ...currentQuest,
            progression: newProgression
        });

        if (newProgression < ACTIVITY_MINUTES_PER_DAY || currentQuest.progression >= ACTIVITY_MINUTES_PER_DAY) {
            return;
        }

        // Check if the last day is today
        const claimList = this.GetCurrentList();
        const todayDateStr = DateFormat(new Date(), 'YYYY-MM-DD');

        if (claimList === null || claimList.daysCount === 73) {
            this.#UNSAVED_data.push({
                start: todayDateStr,
                daysCount: 1,
                claimed: []
            });
            this.claimsList.Set([...this.#SAVED_data, ...this.#UNSAVED_data]);
        } else {
            const lastDay = new Date(claimList.start + 'T00:00:00');
            lastDay.setDate(lastDay.getDate() + claimList.daysCount);
            const lastDayDateStr = DateFormat(lastDay, 'YYYY-MM-DD');

            if (lastDayDateStr === todayDateStr) {
                claimList.daysCount++;
                this.claimsList.Set([...this.#SAVED_data, ...this.#UNSAVED_data]);
            }
        }

        this.user.SaveLocal();
    };

    Clear = () => {
        this.today.Set({
            selectedCategory: 0,
            progression: 0,
            claimed: false
        });
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
    SaveOnline = async (attempt = 2) => {
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

    GetCurrentClaimIndex = () => {
        const claimsList = this.claimsList.Get();
        let index = claimsList.findIndex((claimList) => claimList.daysCount !== claimList.claimed.length);
        if (index === -1 && claimsList.length > 0) index = claimsList.length - 1;
        return index;
    };

    /** @param {DailyQuestData} claimList */
    IsCurrentList(claimList) {
        const tmpDate = new Date(claimList.start + 'T00:00:00');
        const todayDateStr = DateFormat(new Date(), 'YYYY-MM-DD');

        // Check if the last day is today
        tmpDate.setDate(tmpDate.getDate() + claimList.daysCount);
        const lastDateWithRewardStr = DateFormat(tmpDate, 'YYYY-MM-DD');
        tmpDate.setDate(tmpDate.getDate() - 1);
        const lastDate = DateFormat(tmpDate, 'YYYY-MM-DD');

        return todayDateStr === lastDate || todayDateStr === lastDateWithRewardStr;
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

        const currentQuest = this.GetCurrentList();
        if (currentQuest === null || currentQuest.start !== claimListStart) {
            return 'error';
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

        currentQuest.claimed.push(...response.result.dayIndexes);
        this.#token = response.result.token;

        this.user.rewards.ExecuteRewards(response.result.rewards, response.result.newOx);
        this.user.rewards.ShowRewards(response.result.rewards, 'only-items');

        this.claiming = false;
        return 'success';
    };
}

export { ACTIVITY_MINUTES_PER_DAY };
export default DailyQuest;
