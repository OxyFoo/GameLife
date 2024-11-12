import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { IUserData } from 'Types/Interface/IUserData';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/Global/Rarities').Rarities} Rarities
 * @typedef {import('Types/Class/Rewards').Reward} Reward
 * @typedef {import('Types/Class/Rewards').RawReward} RawReward
 * @typedef {import('Types/Data/User/Inventory').Stuff} Stuff
 * @typedef {import('Ressources/items/stuffs/Stuffs').StuffID} StuffID
 */

/** @extends {IUserData<null>} */
class Rewards extends IUserData {
    /** @type {UserManager} */
    #user;

    /** @param {UserManager} user */
    constructor(user) {
        super('rewards');

        this.#user = user;
    }

    /**
     * Apply rewards to the user, no verification or claim, just apply the rewards
     * @param {Reward[]} rewards
     * @param {number | null} newTotalOx New total of ox, to check if the amount is correct
     * @returns {Promise<boolean>}
     */
    ExecuteRewards = async (rewards, newTotalOx = null) => {
        // Update ox amount
        const oxAmount = rewards
            .map((reward) => (reward.Type === 'OX' ? reward.Amount : 0))
            .reduce((acc, ox) => acc + ox, 0);
        this.#ExecRewardOx(oxAmount, newTotalOx);

        // Update titles
        const titlesIDs = rewards
            .map((reward) => (reward.Type === 'Title' ? reward.TitleID : 0))
            .filter((titleID) => titleID !== 0);
        this.#ExecRewardTitle(titlesIDs);

        // Update items
        /** @type {Extract<Reward, { Type: 'Item' | 'Chest' }>[]} */
        const itemsRewards = [];
        for (let i = 0; i < rewards.length; i++) {
            const reward = rewards[i];

            if (reward.Type === 'Item' || reward.Type === 'Chest') {
                itemsRewards.push(reward);
            }
        }
        this.#ExecRewardItems(itemsRewards);

        return true;
    };

    /**
     * Show rewards informations after claim
     * - Show a popup with the rewards informations if needed (ox, titles)
     * - Show the chest reward page if needed (items, chests)
     * @param {string} title Title of the popup
     * @param {string} preMessage Message de la popup à afficher avant les récompenses
     * @param {Reward[]} rewards
     */
    ShowRewards = async (title, preMessage, rewards) => {
        if (rewards.length === 0) return;

        const rewardsContainsOxOrTitles = rewards.some((reward) => reward.Type === 'OX' || reward.Type === 'Title');
        const rewardsContainsItems = rewards.some((reward) => reward.Type === 'Item' || reward.Type === 'Chest');

        // Get popup content
        if (rewardsContainsOxOrTitles) {
            const rewardText = this.GetText('claimed', rewards);
            const message = `${preMessage}\n\n${rewardText}`;

            // Show popup
            this.#user.interface.notificationsInApp?.Close();

            await new Promise((resolve) => {
                this.#user.interface.popup?.OpenT({
                    type: 'ok',
                    data: { title, message },
                    callback: resolve
                });
            });
        }

        // Show chest reward page
        if (rewardsContainsItems) {
            /** @type {Extract<Reward, { Type: 'Item' | 'Chest' }>[]} */
            const rewardsItems = [];
            for (let i = 0; i < rewards.length; i++) {
                const reward = rewards[i];

                if (reward.Type === 'Item' || reward.Type === 'Chest') {
                    rewardsItems.push(reward);
                }
            }
            this.#OpenRewardItemsRecursiveChestPage(rewardsItems);
        }
    };

    /**
     * Reward ox
     * @param {number} amount
     * @param {number | null} newTotalOx
     */
    #ExecRewardOx = (amount, newTotalOx) => {
        if (amount <= 0) return;

        const currentOwnedOx = this.#user.informations.ox.Get();
        this.#user.informations.ox.Set(currentOwnedOx + amount);

        if (newTotalOx !== null) {
            const ownedOx = this.#user.informations.ox.Get();
            if (newTotalOx !== ownedOx) {
                this.#user.interface.console?.AddLog(
                    'error',
                    `[Rewards] Ox amount mismatch: ${newTotalOx} !== ${ownedOx}`
                );
                return;
            }
        }

        return;
    };

    /**
     * Reward title
     * @param {number[]} titleIDs
     */
    #ExecRewardTitle = (titleIDs) => {
        for (let i = 0; i < titleIDs.length; i++) {
            const titleID = titleIDs[i];
            this.#user.inventory.AddTitle(titleID);
        }
    };

    /**
     * Reward items
     * @param {Extract<Reward, { Type: 'Item' | 'Chest' }>[]} rewards
     */
    #ExecRewardItems = (rewards) => {
        for (let i = 0; i < rewards.length; i++) {
            const reward = rewards[i];

            if (reward.Type === 'Item') {
                const { Stuff, Count } = reward;

                if (Stuff || Count > 0) {
                    this.#user.inventory.stuffs.push(...Array(Count).fill(Stuff));
                }
            }
        }
    };

    /**
     * Reward items recursive
     * @param {Extract<Reward, { Type: 'Item' | 'Chest' }>[]} rewards
     * @param {number} index
     */
    #OpenRewardItemsRecursiveChestPage = (rewards, index = 0) => {
        const reward = rewards[index];
        const stuff = reward.Stuff;
        const item = dataManager.items.GetByID(stuff.ItemID);

        if (item === null) {
            this.#user.interface.console?.AddLog('error', `[Rewards] Error while get item (ID: ${stuff.ItemID})`);
            return;
        }

        this.#user.interface.ChangePage('chestreward', {
            args: {
                itemID: stuff.ItemID,
                chestRarity: reward.Type === 'Chest' ? reward.ChestRarity : item.Rarity,
                callback: () => {
                    // Go to the next reward if there is one
                    if (index + 1 < rewards.length) {
                        return this.#OpenRewardItemsRecursiveChestPage.call(this, rewards, index + 1);
                    }

                    // Go back to the previous page
                    return this.#user.interface.BackHandle();
                }
            },
            storeInHistory: false
        });
    };

    /**
     * Return rewards text with correct langage \
     * /!\ Does not display the items details, to keep the suspense to display them on the "chestreward" page
     *
     * @template {'not-claim' | 'claimed'} T Template to define if detailed items should be shown.
     * @param {T} claimState Whether to show item details or not.
     * @param {{ 'not-claim': RawReward[], 'claimed': Reward[] }[T]} rewards Rewards array, type depends on the value of showItems.
     * @returns {string} The formatted rewards text.
     */
    GetText = (claimState, rewards) => {
        const lang = langManager.curr['achievements']['rewards'];
        const lines = [];
        let containsItem = false;

        for (let i = 0; i < rewards.length; i++) {
            const reward = rewards[i];

            switch (reward.Type) {
                case 'Title':
                    const titleID = reward.TitleID;
                    const title = dataManager.titles.GetByID(titleID);
                    if (title === null) {
                        this.#user.interface.console?.AddLog(
                            'error',
                            `[Achievements] Error while get title (ID: ${titleID})`
                        );
                        continue;
                    }

                    const titleName = langManager.GetText(title.Name);
                    let titleLine = lang['title'].replace('{}', titleName);

                    // Check if the title is already owned (and converted into ox)
                    let alreadyOwned = false;

                    if (claimState === 'not-claim') {
                        const ownedTitles = this.#user.inventory.titleIDs.Get();
                        alreadyOwned = ownedTitles.includes(titleID);
                    } else if (claimState === 'claimed') {
                        // eslint-disable-next-line prettier/prettier
                        const r = /** @type {Extract<Reward, { Type: 'Title' }>} */ (reward);
                        alreadyOwned = r.ConvertedIntoOx;
                    }

                    if (alreadyOwned) {
                        const titleValueStr = title.Value.toString();
                        titleLine += lang['title-conversion'].replace('{}', titleValueStr);
                    }

                    lines.push(titleLine);
                    break;

                case 'OX':
                    const oxAmount = reward.Amount;
                    const oxLine = lang['ox'].replace('{}', oxAmount.toString());
                    lines.push(oxLine);
                    break;

                case 'Item':
                    if (claimState === 'claimed') {
                        containsItem = true;
                        break;
                    }

                    // eslint-disable-next-line prettier/prettier
                    const r = /** @type {Extract<RawReward, { Type: 'Item' }>} */ (reward);

                    const item = dataManager.items.GetByID(r.ItemID);
                    if (item === null) {
                        this.#user.interface.console?.AddLog(
                            'error',
                            `[Achievements] Error while get item (ID: ${r.ItemID})`
                        );
                        continue;
                    }

                    const itemName = langManager.GetText(item.Name);
                    const itemRarity = langManager.curr['rarities'][item.Rarity];
                    const itemText = `${itemName} (${itemRarity})`;
                    const itemLine = lang['item'].replace('{}', itemText);
                    lines.push(itemLine);
                    break;

                case 'Chest':
                    const chestRarity = reward.ChestRarity;
                    const chestRarityName = langManager.curr['rarities'][chestRarity];
                    const chestLine = lang['chest'].replace('{}', chestRarityName);
                    lines.push(chestLine);
                    break;
            }
        }

        let output = lines.join('\n');
        if (containsItem && !claimState) {
            output += '\n\n' + lang['items-in-chest'];
        }

        return output;
    };
}

export default Rewards;
