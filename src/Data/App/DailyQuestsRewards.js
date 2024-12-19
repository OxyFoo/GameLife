import { IAppData } from 'Types/Interface/IAppData';

/**
 * @typedef {import('Types/Data/App/DailyQuestReward').DailyQuestReward} DailyQuestReward
 */

/** @extends {IAppData<DailyQuestReward[]>} */
class DailyQuestsRewards extends IAppData {
    /** @type {DailyQuestReward[]} */
    dailyQuestsRewards = [];

    Clear = () => {
        this.dailyQuestsRewards = [];
    };

    /** @param {DailyQuestReward[] | undefined} contributors */
    Load = (contributors) => {
        if (typeof contributors !== 'undefined') {
            this.dailyQuestsRewards = contributors;
        }
    };

    Save = () => {
        return this.dailyQuestsRewards;
    };

    Get = () => {
        return this.dailyQuestsRewards;
    };
}

export default DailyQuestsRewards;
