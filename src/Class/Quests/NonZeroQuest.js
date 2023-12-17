import { DAY_TIME, GetTime } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 */

class NonZeroQuest {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;

        /** @type {number} */
        this.lastIndexClaim = 0;
    }

    Clear() {
        this.lastIndexClaim = 0;
    }
    Load(quests) {
        const contains = (key) => quests.hasOwnProperty(key);
        if (contains('lastIndexClaim')) this.lastIndexClaim = quests['lastIndexClaim'];
    }
    LoadOnline(quests) {
        if (typeof(quests) !== 'object') return;
    }
    Save() {
        const quests = {
            lastIndexClaim: this.lastIndexClaim
        };
        return quests;
    }

    IsUnsaved = () => {
        return false;
    }
    GetUnsaved = () => {
        return [];
    }
    Purge = () => {
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
}

export default NonZeroQuest;
