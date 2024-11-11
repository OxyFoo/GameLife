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
    /** @param {UserManager} user */
    constructor(user) {
        super('rewards');

        this.user = user;
    }

    /**
     * Execute rewards
     * @param {Reward[]} rewards
     * @param {number | null} newTotalOx New total of ox,
     * @returns {Promise<boolean>}
     */
    ExecuteRewards = async (rewards, newTotalOx = null) => {
        // Update ox amount
        const oxAmount = rewards
            .map((reward) => (reward.Type === 'OX' ? reward.Amount : 0))
            .reduce((acc, ox) => acc + ox, 0);
        this.#RewardOx(oxAmount, newTotalOx);

        // Update titles
        const titlesIDs = rewards
            .map((reward) => (reward.Type === 'Title' ? reward.TitleID : 0))
            .filter((titleID) => titleID !== 0);
        this.#RewardTitle(titlesIDs);

        // Update items
        this.#RewardItems(rewards);

        return true;
    };

    /**
     * Reward ox
     * @param {number} amount
     * @param {number | null} newTotalOx
     */
    #RewardOx = (amount, newTotalOx) => {
        if (amount <= 0) return;

        const currentOwnedOx = this.user.informations.ox.Get();
        this.user.informations.ox.Set(currentOwnedOx + amount);

        if (newTotalOx !== null) {
            const ownedOx = this.user.informations.ox.Get();
            if (newTotalOx !== ownedOx) {
                this.user.interface.console?.AddLog(
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
    #RewardTitle = (titleIDs) => {
        for (let i = 0; i < titleIDs.length; i++) {
            const titleID = titleIDs[i];
            this.user.inventory.AddTitle(titleID);
        }
    };

    /**
     * Reward items
     * @param {Extract<Reward, { Type: 'Item' | 'Chest' }>[]} rewards
     */
    #RewardItems = (rewards) => {
        /** @type {Stuff[]} */
        const stuffs = [];
        for (let i = 0; i < rewards.length; i++) {
            const reward = rewards[i];
            if (reward.Type === 'Item') {
                stuffs.push(reward.Stuff);
            }
        }
    };

    /**
     * Return rewards text with correct langage \
     * /!\ Does not display the items details, to keep the suspense to display them on the "chestreward" page
     * @param {RawReward[] | null} rewards
     * @returns {string}
     */
    GetText = (rewards) => {
        if (rewards === null) return '';

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
                        this.user.interface.console?.AddLog(
                            'error',
                            '[Achievements] Error while get title ( ID:',
                            titleID,
                            ')'
                        );
                        continue;
                    }

                    const titleName = langManager.GetText(title.Name);
                    let titleLine = lang['title'].replace('{}', titleName);

                    // If already have this title
                    const ownedTitles = this.user.inventory.titleIDs.Get();
                    if (ownedTitles.includes(titleID)) {
                        const titleValueStr = title.Value.toString();
                        titleLine += lang['title-conversion'].replace('{}', titleValueStr);
                    }

                    lines.push(titleLine);
                    break;

                case 'Item':
                    containsItem = true;
                    break;

                case 'OX':
                    const oxAmount = reward.Amount;
                    const oxLine = lang['ox'].replace('{}', oxAmount.toString());
                    lines.push(oxLine);
                    break;
            }
        }

        let output = lines.join('\n');
        if (containsItem) {
            // TODO: Ajouter une phrase "Et des items..." => redirection chestreward
        }

        return output;
    };
}

export default Rewards;
