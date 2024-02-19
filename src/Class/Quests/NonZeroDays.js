import NONZERODAYS_REWARDS from 'Ressources/items/quests/NonZeroDay';
import DynamicVar from 'Utils/DynamicVar';
import { Sleep } from 'Utils/Functions';
import { DAY_TIME, GetTime } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * 
 * @typedef {import('Class/Inventory').Stuff} Stuff
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

        /** @type {DynamicVar<Array<ClaimType>>} */
        this.claimsList = new DynamicVar([]);

        /** @type {boolean} */
        this.SAVED_claimsList = true;

        /** @type {boolean} Currently claiming (to prevent multiple claims) */
        this.claiming = false;
    }

    Clear() {
        this.claimsList.Set([]);
        this.SAVED_claimsList = true;
    }
    Load(data) {
        const contains = (key) => data.hasOwnProperty(key);
        if (contains('claimsList')) this.claimsList.Set(data['claimsList']);
        if (contains('SAVED_claimsList')) this.SAVED_claimsList = data['SAVED_claimsList'];
    }
    LoadOnline(data) {
        if (typeof(data) !== 'object') return;
        const contains = (key) => data.hasOwnProperty(key);
        if (contains('data')) this.claimsList.Set(data['data']);
    }
    Save() {
        const quests = {
            claimsList: this.claimsList.Get(),
            SAVED_claimsList: this.SAVED_claimsList
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
        if (index === -1) index = claimsList.length - 1;
        return index;
    }

    /** @param {ClaimType} claimList */
    IsCurrentList(claimList) {
        const timePastLimit = GetTime(undefined, 'local') - 2 * DAY_TIME;
        return claimList.end >= timePastLimit;
    }

    RefreshCaimsList() {
        const claimsList = this.claimsList.Get();

        let timeStart = 0;
        if (claimsList.length > 0) {
            timeStart = claimsList[claimsList.length - 1].end;
        }

        const timeNow = GetTime(undefined, 'local');
        const allActivitiesTime = this.user.activities.Get()
            .filter(activity => this.user.activities.GetExperienceStatus(activity) === 'grant')
            .map(activity => activity.startTime + activity.timezone * 60 * 60)
            .filter(time => time > timeStart && time < timeNow - 2 * DAY_TIME);

        let claimIndex = claimsList.length - 1;
        for (let i = 0; i < allActivitiesTime.length; i++) {
            if (claimIndex !== -1) {
                if (allActivitiesTime[i] < claimsList[claimIndex].end) {
                    continue;
                }

                if (allActivitiesTime[i] <= claimsList[claimIndex].end + DAY_TIME &&
                    claimsList[claimIndex].daysCount < NONZERODAYS_REWARDS.length)
                {
                    // Update claim
                    claimsList[claimIndex].end += DAY_TIME;
                    claimsList[claimIndex].daysCount++;
                    this.SAVED_claimsList = false;
                    continue;
                }
            }

            // New claim
            const midnight = allActivitiesTime[i] - allActivitiesTime[i] % DAY_TIME;
            claimsList.push({
                start: midnight,
                end: midnight + DAY_TIME,
                daysCount: 1,
                claimed: []
            });
            claimIndex++;
            this.SAVED_claimsList = false;
        }

        this.claimsList.Set(claimsList);
    }

    ClaimAll = async () => {
        const claimsList = this.claimsList.Get();
        const claimListIndex = this.GetCurrentClaimIndex();
        if (claimListIndex === -1) {
            return false;
        }

        const claimList = claimsList[claimListIndex];
        const dayIndexes = [];
        for (let i = 0; i < claimList.daysCount; i++) {
            if (!claimList.claimed.includes(i + 1)) {
                dayIndexes.push(i);
            }
        }

        if (dayIndexes.length === 0) {
            return false;
        }

        return await this.ClaimReward(claimList.start, dayIndexes);
    }

    /**
     * @param {number} claimListStart
     * @param {Array<number>} dayIndexes
     * @returns {Promise<'success' | 'already-claiming' | 'error'>}
     */
    ClaimReward = async(claimListStart, dayIndexes) => {
        // Prevent multiple claims
        if (this.claiming) {
            return 'already-claiming';
        }

        this.claiming = true;

        const data = {
            'claimListStart': claimListStart,
            'dayIndexes': dayIndexes,
            'dataToken': this.user.server.dataToken
        };
        const response = await this.user.server.Request('claimNonZeroDays', data);
        if (response === null) {
            this.user.interface.console.AddLog('error', 'Claim error:', response);
            this.claiming = false;
            return 'error';
        }

        // Update Ox amount
        if (!response.hasOwnProperty('ox') || !response.hasOwnProperty('newItems')) {
            this.user.interface.console.AddLog('error', 'Claim error: Incorrect response');
            this.claiming = false;
            return 'error';
        }

        this.user.informations.ox.Set(response['ox']);

        // Update inventory
        /** @type {Array<Stuff>} */
        const newItems = response['newItems'];
        if (newItems.length > 0) {
            this.user.inventory.stuffs.push(...newItems);
        }

        // Update claims list
        const claimsList = this.claimsList.Get();
        const claimListIndex = claimsList.findIndex(claim => claim.start === claimListStart);
        if (claimListIndex === -1) {
            this.user.interface.console.AddLog('error', 'Claim error: Claim list not found');
            this.claiming = false;
            return 'error';
        }

        claimsList[claimListIndex].claimed.push(
            ...dayIndexes.map(dayIndex => dayIndex + 1)
        );
        this.claimsList.Set(claimsList);
        this.SAVED_claimsList = false;

        // Save inventory
        await this.user.LocalSave();

        // Go to chest page
        const dayChestClaim = dayIndexes.filter(dayIndex => NONZERODAYS_REWARDS[dayIndex].find(reward => reward.type === 'chest'));
        if (dayChestClaim.length !== newItems.length) {
            this.user.interface.console.AddLog('error', 'Claim error: No chest reward (days & reward mismatch)');
            this.claiming = false;
            return 'error';
        }

        /**
         * @param {Array<number>} claimsDays
         * @param {Array<Stuff>} rewards
         */
        const openChestPage = (claimsDays, rewards) => {
            const dayIndex = claimsDays[0];
            const rewardIndex = NONZERODAYS_REWARDS[dayIndex].findIndex(reward => reward.type === 'chest');
            const args = {
                itemID: rewards[0]['ItemID'],
                chestRarity: NONZERODAYS_REWARDS[dayIndex][rewardIndex].value,
                callback: () => {
                    // Go to the next reward if there is one
                    if (claimsDays.length > 1 && rewards.length > 1) {
                        claimsDays.shift();
                        rewards.shift();
                        return openChestPage(claimsDays, rewards);
                    }

                    // Go back to the previous page
                    return this.user.interface.BackHandle();
                }
            };
            this.user.interface.popup.Close();
            this.user.interface.ChangePage('chestreward', args, true, true);
        }

        if (dayChestClaim.length > 0 && newItems.length > 0) {
            openChestPage(dayChestClaim, newItems);
        }

        this.claiming = false;
        return 'success';
    }
}

export default NonZeroDays;
