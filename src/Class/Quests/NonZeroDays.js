import { DAY_TIME, GetTime } from 'Utils/Time';
import NONZERODAYS_REWARDS from 'Ressources/items/quests/NonZeroDay';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * 
 * @typedef {Object} ClaimType
 * @property {number} start Midnight Local TimeZone unix time of the first day
 * @property {number} end Midnight Local TimeZone unix time of the last day
 * @property {number} daysCount
 * @property {Array<number>} claimed
 */

class NonZeroDays {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;

        /** @type {Array<ClaimType>} */
        this.claimsList = [];

        /** @type {number} Last midnight unix time of the last day saved */
        this.lastSavedTime = 0;

        /** @type {boolean} */
        this.SAVED_claimsList = true;

        /** @type {boolean} Currently claiming (to prevent multiple claims) */
        this.claiming = false;
    }

    Clear() {
        this.claimsList = [];
        this.lastSavedTime = 0;
        this.SAVED_claimsList = true;
    }
    Load(data) {
        const contains = (key) => data.hasOwnProperty(key);
        if (contains('claimsList')) this.claimsList = data['claimsList'];
        if (contains('lastSavedTime')) this.lastSavedTime = data['lastSavedTime'];
        if (contains('SAVED_claimsList')) this.SAVED_claimsList = data['SAVED_claimsList'];
    }
    LoadOnline(data) {
        if (typeof(data) !== 'object') return;
        const contains = (key) => data.hasOwnProperty(key);
        if (contains('data')) this.claimsList = data['data'];
        if (this.claimsList.length > 0) {
            this.lastSavedTime = this.claimsList[this.claimsList.length - 1].start;
        }
    }
    Save() {
        const quests = {
            claimsList: this.claimsList,
            lastSavedTime: this.lastSavedTime,
            SAVED_claimsList: this.SAVED_claimsList
        };
        return quests;
    }

    IsUnsaved = () => {
        return !this.SAVED_claimsList;
    }
    GetUnsaved = () => {
        return {
            data: this.claimsList,
            lastSavedTime: this.lastSavedTime
        };
    }
    Purge = () => {
        this.lastSavedTime = 0;
        if (this.claimsList.length > 0) {
            this.lastSavedTime = this.claimsList[this.claimsList.length - 1].start;
        }
        this.SAVED_claimsList = true;
    }

    GetConsecutiveDays() {
        let i = 0;
        let combo = 0;
        const timeNow = GetTime(undefined, 'local');

        while (true) {
            const activities = this.user.activities
                .GetByTime(timeNow - i++ * DAY_TIME)
                .filter(activity => this.user.activities.GetExperienceStatus(activity) === 'grant');

            if (activities.length === 0) {
                if (i === 1) {
                    continue;
                }
                return combo;
            }
            combo++;
        }
    }

    RefreshCaimsList() {
        let timeStart = 0;
        if (this.claimsList.length > 0) {
            timeStart = this.claimsList[this.claimsList.length - 1].end;
        }

        const timeNow = GetTime(undefined, 'local');
        const allActivitiesTime = this.user.activities.Get()
            .filter(activity => this.user.activities.GetExperienceStatus(activity) === 'grant')
            .map(activity => activity.startTime + activity.timezone * 60 * 60)
            .filter(time => time > timeStart && time < timeNow - 2 * DAY_TIME);

        let claimIndex = this.claimsList.length === 0 ? -1 : 0;
        for (let i = 0; i < allActivitiesTime.length; i++) {
            if (claimIndex !== -1) {
                if (allActivitiesTime[i] < this.claimsList[claimIndex].end) {
                    continue;
                }

                if (allActivitiesTime[i] < this.claimsList[claimIndex].end + DAY_TIME) {
                    // Update claim
                    this.claimsList[claimIndex].end += DAY_TIME;
                    this.claimsList[claimIndex].daysCount++;
                    this.SAVED_claimsList = false;
                    continue;
                }
            }

            // New claim
            const midnight = allActivitiesTime[i] - allActivitiesTime[i] % DAY_TIME;
            this.claimsList.push({
                start: midnight,
                end: midnight + DAY_TIME,
                daysCount: 1,
                claimed: []
            });
            claimIndex++;
            this.SAVED_claimsList = false;
        }
    }

    /**
     * @param {number} claimListStart
     * @param {number} dayIndex
     * @returns {Promise<boolean>} True if the claim was successful
     */
    async ClaimReward(claimListStart, dayIndex) {
        if (this.claiming) return false;
        this.claiming = true;

        const data = {
            'claimListStart': claimListStart,
            'dayIndex': dayIndex,
            'dataToken': this.user.server.dataToken
        };
        const response = await this.user.server.Request('claimNonZeroDays', data);
        if (response === null) return false;

        // Update Ox amount
        if (response.hasOwnProperty('ox')) {
            this.user.informations.ox.Set(response['ox']);
        }

        // Update inventory
        if (!response.hasOwnProperty('newItems')) {
            return false;
        }

        const newItems = response['newItems'];
        this.user.inventory.stuffs.push(...newItems);

        // Update claims list
        const claimList = this.claimsList.find(claim => claim.start === claimListStart);
        if (claimList === undefined) {
            this.claiming = false;
            return false;
        }

        claimList.claimed.push(dayIndex + 1);
        this.SAVED_claimsList = false;

        // Save inventory
        await this.user.LocalSave();

        // Go to chest page
        const rewardIndex = NONZERODAYS_REWARDS[dayIndex].findIndex(reward => reward.type === 'chest');
        if (rewardIndex !== -1) {
            const args = {
                itemID: newItems[0]['ItemID'],
                chestRarity: NONZERODAYS_REWARDS[dayIndex][rewardIndex].value - 1,
                callback: this.user.interface.BackHandle
            };
            this.user.interface.ChangePage('chestreward', args, true);
        }

        this.claiming = false;
        return true;
    }
}

export default NonZeroDays;
