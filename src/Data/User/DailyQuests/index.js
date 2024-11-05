import { ClaimAll, ClaimReward } from './claim';
import { RefreshSkillSelection } from './actions';
import { UpdateActivities, UpdateSetup } from './updates';
import { GetActivitiesIdOfDay, GetDailyProgress } from './utils';

import { IUserData } from 'Types/Interface/IUserData';
import DynamicVar from 'Utils/DynamicVar';
import { DateFormat } from 'Utils/Date';
import { Range, Round } from 'Utils/Functions';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/Data/User/DailyQuest').SaveObject_DailyQuest} SaveObject_DailyQuest
 *
 * @typedef {import('./claim').ClaimAllType} ClaimAllType
 * @typedef {import('./claim').ClaimRewardType} ClaimRewardType
 * @typedef {import('./utils').GetActivitiesIdOfDayType} GetActivitiesIdOfDayType
 * @typedef {import('./utils').GetDailyProgressType} GetDailyProgressType
 * @typedef {import('./actions').RefreshSkillSelectionType} RefreshSkillSelectionType
 *
 * @typedef {Object} ClaimType
 * @property {string} start First day YYYY-MM-DD
 * @property {number} daysCount
 * @property {number[]} claimed
 */

/** @extends {IUserData<SaveObject_DailyQuest>} */
class DailyQuest extends IUserData {
    config = {
        refresh_count_per_day: 5,
        activity_minutes_per_day: 15,

        /** @type {number} Quantity of worst stats to consider to select skills */
        worstStatsQuantity: 3,

        /** @type {number} Number of skills to select */
        preSelectionCount: 30,

        /** @type {number} Number of skills to display */
        skillsSelectionCount: 3
    };

    /** @type {Symbol | null} */
    listener = null;

    /** @param {UserManager} user */
    constructor(user) {
        super('dailyQuest');

        this.user = user;

        /** @type {DynamicVar<ClaimType[]>} */
        // eslint-disable-next-line prettier/prettier
        this.claimsList = new DynamicVar(/** @type {ClaimType[]} */ ([]));

        /** @type {boolean} */
        this.SAVED_claimsList = true;

        /** @type {boolean} Currently claiming (to prevent multiple claims) */
        this.claiming = false;

        this.tmpRemaining = this.config.refresh_count_per_day;

        this.today = new DynamicVar({
            /** @type {number[]} */
            selectedSkillsID: [],

            refreshesRemaining: 0,

            /** @type {number} Progress of the day in minutes */
            progression: 0,

            /** @type {boolean} Is the day claimed */
            claimed: false
        });

        /** @type {number} */
        this.seed = 0;

        /** @type {number[]} Worst skills ID */
        this.worstSkillsID = [];

        /** @type {number[]} Indexes of current selected skills */
        this.selectedIndexes = Range(this.config.skillsSelectionCount);

        /** @type {NodeJS.Timeout | null} Update the current activity time to tomorrow */
        this.timeout = null;
    }

    Init = () => {
        // TODO: Wait loading
        UpdateSetup.call(this);
        UpdateActivities.call(this, this.tmpRemaining);

        this.listener = this.user.activities.allActivities.AddListener(() => {
            UpdateActivities.call(this);
        });
    };

    // TODO: Implement this method
    onUnmount = () => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.user.activities.allActivities.RemoveListener(this.listener);
    };

    Clear = () => {
        this.claimsList.Set([]);
        this.today.Set({
            selectedSkillsID: [],
            refreshesRemaining: 0,
            progression: 0,
            claimed: false
        });
        this.SAVED_claimsList = true;
    };

    /** @param {Partial<SaveObject_DailyQuest>} data */
    Load = (data) => {
        if (typeof data.claimsList !== 'undefined') this.claimsList.Set(data.claimsList);
        if (typeof data.SAVED_claimsList !== 'undefined') this.SAVED_claimsList = data.SAVED_claimsList;
        if (typeof data.selectedIndex !== 'undefined') {
            const { date, indexes, remaining } = data.selectedIndex;
            if (date === DateFormat(new Date(), 'YYYY-MM-DD')) {
                this.selectedIndexes = indexes;
                this.tmpRemaining = remaining;
            }
        }
    };

    /** @returns {SaveObject_DailyQuest} */
    Save = () => {
        return {
            claimsList: this.claimsList.Get(),
            SAVED_claimsList: this.SAVED_claimsList,
            selectedIndex: {
                date: DateFormat(new Date(), 'YYYY-MM-DD'),
                indexes: this.selectedIndexes,
                remaining: this.today.Get().refreshesRemaining
            }
        };
    };

    LoadOnline = async () => {
        const response = await this.user.server2.tcp.SendAndWait({ action: 'get-daily-quest' });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'get-daily-quest' ||
            typeof response.dailyQuests === 'undefined'
        ) {
            return false;
        }

        this.claimsList.Set(response.dailyQuests);
        return true;
    };

    IsUnsaved = () => {
        return !this.SAVED_claimsList;
    };
    GetUnsaved = () => {
        return {
            data: this.claimsList.Get()
        };
    };
    Purge = () => {
        this.SAVED_claimsList = true;
    };

    GetCurrentClaimIndex = () => {
        const claimsList = this.claimsList.Get();
        let index = claimsList.findIndex((claimList) => claimList.daysCount !== claimList.claimed.length);
        if (index === -1 && claimsList.length > 0) index = claimsList.length - 1;
        return index;
    };

    /** @param {ClaimType} claimList */
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
     * @param {number[]} preSelectedSkillsIDs
     * @param {number[]} skillsIndexes
     * @returns {number[]}
     */
    GetSelectedSkillsIDs = (preSelectedSkillsIDs, skillsIndexes) => {
        const skillsID = skillsIndexes.map((index) => {
            const newIndex = Round((index + 1) * this.seed) % preSelectedSkillsIDs.length;
            const ID = preSelectedSkillsIDs[newIndex];
            return ID;
        });

        // Increment duplicates to ensure all skills are different
        for (let i = 0; i < skillsID.length; i++) {
            for (let j = i + 1; j < skillsID.length; j++) {
                if (skillsID[i] === skillsID[j]) {
                    skillsID[j]++;
                }
            }
        }

        return skillsID;
    };

    /** @type {ClaimAllType} */
    ClaimAll = ClaimAll.bind(this);

    /** @type {ClaimRewardType} */
    ClaimReward = ClaimReward.bind(this);

    /** @type {GetActivitiesIdOfDayType} */
    GetActivitiesIdOfDay = GetActivitiesIdOfDay.bind(this);

    /** @type {GetDailyProgressType} */
    GetDailyProgress = GetDailyProgress.bind(this);

    /** @type {RefreshSkillSelectionType} */
    RefreshSkillSelection = RefreshSkillSelection.bind(this);
}

export default DailyQuest;
