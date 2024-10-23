import DAILY_QUEST_REWARDS from 'Ressources/items/quests/DailyQuest';

/**
 * @typedef {import('./index').default} DailyQuest
 * @typedef {import('Data/User/Inventory').Stuff} Stuff
 *
 * @typedef {'success' | 'already-claiming' | 'error'} ClaimResult
 *
 * @typedef {() => Promise<ClaimResult>} ClaimAllType
 * @typedef {(claimListStart: string, dayIndexes: number[]) => Promise<ClaimResult>} ClaimRewardType
 */

/**
 * @this {DailyQuest}
 * @type {ClaimAllType}
 */
async function ClaimAll() {
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

    return await ClaimReward.call(this, claimList.start, dayIndexes);
}

/**
 * @this {DailyQuest}
 * @type {ClaimRewardType}
 */
async function ClaimReward(claimListStart, dayIndexes) {
    // Prevent multiple claims
    if (this.claiming) {
        return 'already-claiming';
    }

    this.claiming = true;

    // TODO: Implement "server2"
    const data = {
        claimListStart: claimListStart,
        dayIndexes: dayIndexes,
        dataToken: this.user.server.dataToken
    };
    const response = await this.user.server.Request('claimDailyQuest', data);
    if (response === null) {
        this.user.interface.console?.AddLog('error', 'Claim error:', response);
        this.claiming = false;
        return 'error';
    }

    // Update Ox amount
    if (!response.hasOwnProperty('ox') || !response.hasOwnProperty('newItems')) {
        this.user.interface.console?.AddLog('error', 'Claim error: Incorrect response');
        this.claiming = false;
        return 'error';
    }

    this.user.informations.ox.Set(response['ox']);

    // Update inventory
    /** @type {Stuff[]} */
    const newItems = response['newItems'];
    if (newItems.length > 0) {
        this.user.inventory.stuffs.push(...newItems);
    }

    // Update claims list
    const claimsList = this.claimsList.Get();
    const claimListIndex = claimsList.findIndex((claim) => claim.start === claimListStart);
    if (claimListIndex === -1) {
        this.user.interface.console?.AddLog('error', 'Claim error: Claim list not found');
        this.claiming = false;
        return 'error';
    }

    claimsList[claimListIndex].claimed.push(...dayIndexes.map((dayIndex) => dayIndex + 1));
    this.claimsList.Set(claimsList);
    this.SAVED_claimsList = false;

    // Save inventory
    await this.user.LocalSave();

    // Go to chest page
    const dayChestClaim = dayIndexes.filter((dayIndex) =>
        DAILY_QUEST_REWARDS[dayIndex].find((reward) => reward.type === 'chest')
    );
    if (dayChestClaim.length !== newItems.length) {
        this.user.interface.console?.AddLog('error', 'Claim error: No chest reward (days & reward mismatch)');
        this.claiming = false;
        return 'error';
    }

    if (dayChestClaim.length > 0 && newItems.length > 0) {
        openChestPage.call(this, dayChestClaim, newItems);
    }

    this.claiming = false;
    return 'success';
}

/**
 * @this {DailyQuest}
 * @param {number[]} claimsDays
 * @param {Stuff[]} rewards
 */
function openChestPage(claimsDays, rewards) {
    const dayIndex = claimsDays[0];
    const rewardIndex = DAILY_QUEST_REWARDS[dayIndex].findIndex((reward) => reward.type === 'chest');
    this.user.interface.popup?.Close();
    this.user.interface.ChangePage('chestreward', {
        args: {
            itemID: rewards[0]['ItemID'],
            chestRarity: DAILY_QUEST_REWARDS[dayIndex][rewardIndex].value,
            callback: () => {
                // Go to the next reward if there is one
                if (claimsDays.length > 1 && rewards.length > 1) {
                    claimsDays.shift();
                    rewards.shift();
                    return openChestPage.call(this, claimsDays, rewards);
                }

                // Go back to the previous page
                return this.user.interface.BackHandle();
            }
        },
        storeInHistory: false
    });
}

export { ClaimAll, ClaimReward };
