import { ClaimAll, ClaimReward } from './claim';
import { RefreshSkillSelection } from './actions';
import { UpdateActivities, UpdateSetup } from './updates';
import { GetActivitiesIdOfDay, GetDailyProgress } from './utils';

import DynamicVar from 'Utils/DynamicVar';
import { DateFormat } from 'Utils/Date';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * 
 * @typedef {import('./claim').ClaimAllType} ClaimAllType
 * @typedef {import('./claim').ClaimRewardType} ClaimRewardType
 * @typedef {import('./utils').GetActivitiesIdOfDayType} GetActivitiesIdOfDayType
 * @typedef {import('./utils').GetDailyProgressType} GetDailyProgressType
 * @typedef {import('./updates').UpdateSetupType} UpdateSetupType
 * @typedef {import('./updates').UpdateActivitiesType} UpdateActivitiesType
 * @typedef {import('./actions').RefreshSkillSelectionType} RefreshSkillSelectionType
 * 
 * @typedef {Object} ClaimType
 * @property {string} start First day YYYY-MM-DD
 * @property {number} daysCount
 * @property {Array<number>} claimed
 * 
 * @typedef {Object} TodayType
 * @property {boolean} loaded Feature availability
 * @property {string} date Date of the day YYYY-MM-DD
 * @property {Array<number>} selectedSkillsID Selected skills ID
 * @property {Array<number>} queueSkillsID Next skills ID
 * @property {number} progression Progress of the day in minutes
 * @property {boolean} claimed Is the day claimed
 */

class DailyQuest {
    config = {
        dailySettings: {
            skillsCount: 3,
            refreshCount: 5,
            activityMinutes: 15
        },

        selection: {
            /** @type {number} Quantity of worst stats to consider to select skills */
            worstStatsQuantity: 3,

            /** @type {number} Number of skills to select */
            skillsQuantity: 50
        }
    };

    /** @type {DynamicVar<TodayType>} */
    today = new DynamicVar({
        loaded: false,

        date: '',
        selectedSkillsID: [],
        queueSkillsID: [],
        progression: 0,
        claimed: false
    });

    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;

        /** @type {DynamicVar<Array<ClaimType>>} */
        this.claimsList = new DynamicVar([]);

        /** @type {boolean} */
        this.SAVED_claimsList = true;

        /** @type {boolean} Currently claiming (to prevent multiple claims) */
        this.claiming = false;

        /** @type {number} */
        this.seed = 0;

        /** @type {NodeJS.Timeout | null} Update the current activity time to tomorrow */
        this.timeout = null;

        this.listener = this.user.activities.allActivities.AddListener(() => {
            this.UpdateActivities();
        });
    }

    Init = () => {
        this.UpdateSetup();
        this.UpdateActivities();
    }

    // TODO: Implement this method
    onUnmount = () => {
        clearTimeout(this.timeout);
        this.user.activities.allActivities.RemoveListener(this.listener);
    }

    Clear() {
        this.claimsList.Set([]);
        this.today.Set({
            loaded: false,
            date: '',
            selectedSkillsID: [],
            queueSkillsID: [],
            progression: 0,
            claimed: false
        });
        this.SAVED_claimsList = true;
    }
    Load(data) {
        const contains = (key) => data.hasOwnProperty(key);
        if (contains('claimsList')) this.claimsList.Set(data['claimsList']);
        if (contains('SAVED_claimsList')) this.SAVED_claimsList = data['SAVED_claimsList'];
        if (contains('today')) this.today.Set(data['today']);
    }
    LoadOnline(data) {
        if (typeof(data) !== 'object') return;
        const contains = (key) => data.hasOwnProperty(key);
        if (contains('data')) this.claimsList.Set(data['data']);
    }
    Save() {
        const quests = {
            claimsList: this.claimsList.Get(),
            SAVED_claimsList: this.SAVED_claimsList,
            today: this.today.Get()
        };
        return quests;
    }

    IsUnsaved = () => {
        return !this.SAVED_claimsList;
    }
    GetUnsaved = () => {
        return {
            data: this.claimsList.Get()
        };
    }
    Purge = () => {
        this.SAVED_claimsList = true;
    }

    GetCurrentClaimIndex = () => {
        const claimsList = this.claimsList.Get();
        let index = claimsList.findIndex(claimList => claimList.daysCount !== claimList.claimed.length);
        if (index === -1 && claimsList.length > 0) index = claimsList.length - 1;
        return index;
    }

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
    }

    /**
     * @private
     * @type {UpdateSetupType}
     */
    UpdateSetup = UpdateSetup.bind(this);

    /**
     * @private
     * @type {UpdateActivitiesType}
     */
    UpdateActivities = UpdateActivities.bind(this);

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
