import DataClassTemplate from './_Template';

/**
 * @typedef {import('Types/Data/Achievements').Comparator} Comparator
 * @typedef {import('Types/Data/Achievements').Operator} Operator
 * @typedef {import('Types/Data/Achievements').RewardType} RewardType
 *
 * @typedef {import('Types/Data/Achievements').Reward} Reward
 * @typedef {import('Types/Data/Achievements').Condition} Condition
 * @typedef {import('Types/Data/Achievements').Achievement} Achievement
 */

/** @type {Array<Comparator>} */
const COMPARATORS = ['Battery', 'Level', 'Sk', 'SkT', 'St', 'HCa', 'Ca', 'ItemCount', 'Ad', 'Title', 'SelfFriend'];

/** @type {Array<Operator>} */
const OPERATORS = ['None', 'LT', 'GT'];

/** @type {Array<RewardType>} */
const REWARDS = ['Title', 'Item', 'OX'];

/** @extends {DataClassTemplate<Achievement[]>} */
class Achievements extends DataClassTemplate {
    /** @type {Array<Achievement>} */
    achievements = [];

    Clear() {
        this.achievements = [];
    }

    /** @param {Array<Achievement>} achievements */
    Load(achievements) {
        if (typeof achievements !== 'object') {
            return;
        }

        this.achievements = [];
        for (let a = 0; a < achievements.length; a++) {
            let achievement = achievements[a];
            if (typeof achievement.Condition === 'string') {
                const condition = this.parseCondition(achievement.Condition);
                if (condition !== null) {
                    achievement.Condition = condition;
                }
            }
            if (typeof achievement.Rewards === 'string') {
                achievement.Rewards = this.parseReward(achievement.Rewards);
            }
            this.achievements.push(achievement);
        }
    }

    Save() {
        return this.achievements;
    }

    Get() {
        return this.achievements;
    }

    /**
     * @param {string} str
     * @returns {str is Comparator}
     * @private
     */
    strIsComparator(str) {
        return COMPARATORS.findIndex((c) => c === str) !== -1;
    }

    /**
     * @param {string} condition
     * @returns {Condition | null}
     */
    parseCondition(condition) {
        if (!condition.length) {
            return null;
        }

        const elements = condition.split(' ');

        if (elements.length === 1 && this.strIsComparator(elements[0])) {
            const _comparator = elements[0];
            return {
                Comparator: {
                    Type: _comparator,
                    Value: null
                },
                Operator: 'None',
                Value: null
            };
        } else if (elements.length !== 3) {
            return null;
        }

        const [_comparator, _operator, value] = elements;

        if (!this.strIsComparator(_comparator)) {
            return null;
        }

        // Get index of first number
        let index = -1;
        while (index < _comparator.length && isNaN(parseInt(_comparator.slice(++index), 10)));

        const rawComparatorType = _comparator.slice(0, index);
        const rawComparatorValue = _comparator.slice(index);
        const comparatorType = COMPARATORS.find((c) => c === rawComparatorType) || null;
        const comparatorValue = !isNaN(parseInt(rawComparatorValue, 10)) ? parseInt(rawComparatorValue, 10) : 0;
        const operator = OPERATORS.find((o) => o === _operator) || null;

        if (comparatorType === null || operator === null) {
            return null;
        }

        return {
            Comparator: {
                Type: comparatorType,
                Value: comparatorValue
            },
            Operator: operator,
            Value: isNaN(parseFloat(value)) ? value : parseFloat(value)
        };
    }

    /**
     * @param {string} reward
     * @returns {Array<Reward>}
     */
    parseReward(reward) {
        if (!reward.length) {
            return [];
        }

        /** @type {Array<Reward>} */
        let output = [];
        const rawRewards = reward.split(',');
        for (let r = 0; r < rawRewards.length; r++) {
            const elements = rawRewards[r].split(' ');
            if (elements.length !== 2) {
                return [];
            }

            const [_type, _value] = elements;

            const isPureNumber = /^-?\d+(\.\d+)?$/.test(_value);
            const type = REWARDS.find((_reward) => _reward === _type) || null;
            const value = isPureNumber ? parseFloat(_value) : _value;

            if (type === null || !value) {
                return [];
            }

            output.push({
                Type: type,
                Value: value
            });
        }
        return output;
    }

    /**
     * @param {number} ID
     * @returns {Achievement | null}
     */
    GetByID = (ID) => this.achievements.find((a) => a.ID === ID) || null;

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
    };
}

export default Achievements;
