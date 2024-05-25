import { ClaimAll, ClaimReward } from './claim';
import { RefreshSkillSelection } from './actions';
import { UpdateActivities, UpdateSetup } from './updates';
import { GetActivitiesIdOfDay, GetDailyProgress } from './utils';

import DynamicVar from 'Utils/DynamicVar';
import { DateFormat } from 'Utils/Date';
import { Range, Round } from 'Utils/Functions';
import { DAY_TIME, GetLocalTime } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
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
 * @property {Array<number>} claimed
 */

class DailyQuest {
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

    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;

        /** @type {DynamicVar<Array<ClaimType>>} */
        this.claimsList = new DynamicVar([]);

        /** @type {boolean} */
        this.SAVED_claimsList = true;

        /** @type {boolean} Currently claiming (to prevent multiple claims) */
        this.claiming = false;

        this.tmpRemaining = this.config.refresh_count_per_day;

        this.today = new DynamicVar({
            /** @type {Array<number>} */
            selectedSkillsID: [],

            refreshesRemaining: 0,

            /** @type {number} Progress of the day in minutes */
            progression: 0,

            /** @type {boolean} Is the day claimed */
            claimed: false
        });

        /** @type {number} */
        this.seed = 0;

        /** @type {Array<number>} Worst skills ID */
        this.worstSkillsID = [];

        /** @type {Array<number>} Indexes of current selected skills */
        this.selectedIndexes = Range(this.config.skillsSelectionCount);

        /** @type {NodeJS.Timeout | null} Update the current activity time to tomorrow */
        this.timeout = null;

        this.listener = this.user.activities.allActivities.AddListener(() => {
            UpdateActivities.call(this);
        });
    }

    Init = () => {
        UpdateSetup.call(this);
        UpdateActivities.call(this, this.tmpRemaining);
    }

    // TODO: Implement this method
    onUnmount = () => {
        clearTimeout(this.timeout);
        this.user.activities.allActivities.RemoveListener(this.listener);
    }

    Clear() {
        this.claimsList.Set([]);
        this.today.Set({
            selectedSkillsID: [],
            refreshesRemaining: 0,
            progression: 0,
            claimed: false
        });
        this.SAVED_claimsList = true;
    }
    Load(data) {
        const contains = (key) => data.hasOwnProperty(key);
        if (contains('claimsList')) this.claimsList.Set(data['claimsList']);
        if (contains('SAVED_claimsList')) this.SAVED_claimsList = data['SAVED_claimsList'];
        if (contains('selectedIndex')) {
            const { date, indexes, remaining } = data['selectedIndex'];
            if (date === DateFormat(new Date(), 'YYYY-MM-DD')) {
                this.selectedIndexes = indexes;
                this.tmpRemaining = remaining;
            }
        }
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
            selectedIndex: {
                date: DateFormat(new Date(), 'YYYY-MM-DD'),
                indexes: this.selectedIndexes,
                remaining: this.today.Get().refreshesRemaining
            }
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
        const firstDay = new Date(claimList.start);
        const currentDay = GetLocalTime(firstDay) + claimList.daysCount * DAY_TIME;
        return currentDay > GetLocalTime();
    }

    /**
     * @param {number[]} preSelectedSkillsIDs
     * @param {number[]} skillsIndexes
     * @returns {number[]}
     */
    GetSelectedSkillsIDs = (preSelectedSkillsIDs, skillsIndexes) => {
        const skillsID = skillsIndexes.map(index => {
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
    }

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
