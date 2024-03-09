/**
 * @typedef {'Battery'|'Level'|'Sk'|'SkT'|'St'|'HCa'|'Ca'|'ItemCount'|'Ad'|'Title'|'SelfFriend'} Comparator
 * @typedef {'None' | 'LT' | 'GT'} Operator
 * @typedef {'Title' | 'Item' | 'OX'} RewardType
 */

/** @type {Array<Comparator>} */
const COMPARATORS = [
    'Battery',
    'Level',
    'Sk',
    'SkT',
    'St',
    'HCa',
    'Ca',
    'ItemCount',
    'Ad',
    'Title',
    'SelfFriend'
];

/** @type {Array<Operator>} */
const OPERATORS = [
    'None',
    'LT',
    'GT'
];

/** @type {Array<RewardType>} */
const REWARDS = [
    'Title',
    'Item',
    'OX'
];

class Achievement {
    ID = 0;

    /**
     * @type {-1 | 0 | 1}\
     * -1: not shown if unsolved, all visible if solved\
     * 0: show condition and reward only when solved\
     * 1: all is visible
     */
    Type = 0;

    Name = { 'fr': '', 'en': '' };
    Description = { 'fr': '', 'en': '' };

    /** @type {Condition} */
    Condition = null;

    /** @type {Array<Reward>} */
    Rewards = [];

    /** @type {number} Global players percentage [0-100] */
    GlobalPercentage = 0;
}

class Condition {
    Comparator = {
        /** @type {Comparator} */
        Type: 'Ad',

        /** @type {number} */
        Value: 0
    };

    /** @type {Operator} */
    Operator = 'None';

    /** @type {string | number} */
    Value = '0';
}

class Reward {
    /** @type {RewardType} */
    Type = 'Title';

    /** @type {string | number} */
    Value = 0;
}

class Achievements {
    /** @type {Array<Achievement>} */
    achievements = [];

    Clear() {
        this.achievements = [];
    }
    Load(achievements) {
        if (typeof(achievements) === 'object') {
            this.achievements = [];
            for (let a = 0; a < achievements.length; a++) {
                let achievement = achievements[a];
                if (typeof(achievement.Condition) === 'string') {
                    achievement.Condition = this.parseCondition(achievement.Condition);
                }
                if (typeof(achievement.Rewards) === 'string') {
                    achievement.Rewards = this.parseReward(achievement.Rewards);
                }
                this.achievements.push(achievement);
            }
        }
    }
    Save() {
        return this.achievements;
    }

    /**
     * @param {string} condition
     * @returns {Condition | null}
     */
    parseCondition(condition) {
        if (!condition.length) {
            return null;
        }

        const output = new Condition();

        const elements = condition.split(' ');

        if (elements.length === 1) {
            const _comparator = /** @type {Comparator} */ (elements[0]);

            if (!COMPARATORS.includes(_comparator)) {
                return null;
            }

            output.Comparator.Type = _comparator;
            output.Comparator.Value = null;
            output.Operator = 'None';
            output.Value = null;

            return output;
        }

        else if (elements.length !== 3) {
            return null;
        }

        const [ _comparator, _operator, value ] = elements;

        // Get index of first number
        let index = -1;
        while (index < _comparator.length && isNaN(parseInt(_comparator.slice(++index))));

        const rawComparatorType = _comparator.slice(0, index);
        const rawComparatorValue = _comparator.slice(index);
        const comparatorType = COMPARATORS.find(c => c === rawComparatorType) || null;
        const comparatorValue = !isNaN(parseInt(rawComparatorValue)) ? parseInt(rawComparatorValue) : 0;
        const operator = OPERATORS.find(o => o === _operator) || null;

        if (comparatorType === null || operator === null) {
            return null;
        }

        output.Comparator.Type = comparatorType;
        output.Comparator.Value = comparatorValue;
        output.Operator = operator;
        output.Value = isNaN(parseFloat(value)) ? value : parseFloat(value);

        return output;
    }

    /**
     * @param {string} reward
     * @returns {Array<Reward>}
     */
    parseReward(reward) {
        if (!reward.length) {
            return [];
        }

        let output = [];
        const rawRewards = reward.split(',');
        for (let r = 0; r < rawRewards.length; r++) {
            const elements = rawRewards[r].split(' ');
            if (elements.length !== 2) {
                return [];
            }

            const [ _type, _value ] = elements;

            const isPureNumber = /^-?\d+(\.\d+)?$/.test(_value);
            const type = REWARDS.find(r => r === _type) || null;
            const value = isPureNumber ? parseFloat(_value) : _value;

            if (type === null || !value) {
                return [];
            }
    
            let newReward = new Reward();
            newReward.Type = type;
            newReward.Value = value;

            output.push(newReward);
        }
        return output;
    }

    /**
     * @param {number} ID
     * @returns {Achievement | null}
     */
    GetByID = (ID) => this.achievements.find(a => a.ID === ID) || null;

    /**
     * Returns all achievements that are visible, with solved first
     * @param {Array<number>} solvedIDs
     * @returns {Array<Achievement>}
     */
    GetAll = (solvedIDs) => {
        let achievements = [];

        // Get unlocked
        const solvedAchievements = [...solvedIDs].reverse();
        for (let s = 0; s < solvedAchievements.length; s++) {
            const achievementID = solvedAchievements[s];
            const achievement = this.GetByID(achievementID);
            if (achievement !== null) {
                achievements.push(achievement);
            }
        }

        // Get others
        for (let a = 0; a < this.achievements.length; a++) {
            const achievement = this.achievements[a];
            if (!solvedIDs.includes(achievement.ID) && achievement.Type !== -1) {
                achievements.push(achievement);
            }
        }

        return achievements;
    }
}

export { Achievement, Condition, Reward };
export default Achievements;
