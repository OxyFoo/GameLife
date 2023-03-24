const COMPARATORS = [ 'B', 'Lvl', 'Sk', 'SkT', 'St', 'HCa', 'Ca', 'It', 'Ad' ];
const OPERATORS = [ 'LT', 'GT' ];
const REWARDS = [ 'Title', 'Item', 'OX' ];

class Achievement {
    ID = 0;

    /**
     * @type {-1|0|1}\
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
}

class Condition {
    Comparator = {
        /** @type {'B'|'Lvl'|'Sk'|'SkT'|'St'|'HCa'|'Ca'|'It'|'Ad'} */
        Type: '',

        Value: 0
    };
    /** @type {'LT'|'GT'} */
    Operator = '';
    /** @type {number} */
    Value = 0;
}

class Reward {
    /** @type {'Title'|'Item'|'OX'} */
    Type = '';
    Value = 0;
}

class Achievements {
    constructor() {
        /**
         * @type {Array<Achievement>}
         */
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
     * @returns {Condition?}
     */
    parseCondition(condition) {
        if (!condition.length) {
            return null;
        }

        const elements = condition.split(' ');
        if (elements.length !== 3) {
            return null;
        }

        const [ comparator, operator, value ] = elements;

        // Get index of first number
        let index = -1;
        while (index < comparator.length && isNaN(parseInt(comparator.slice(++index))));

        if (!COMPARATORS.includes(comparator.slice(0, index))) {
            return null;
        }
        if (!OPERATORS.includes(operator)) {
            return null;
        }
        if (isNaN(parseInt(value))) {
            return null;
        }

        let output = new Condition();
        output.Comparator.Type = comparator.slice(0, index);
        output.Comparator.Value = parseFloat(comparator.slice(index)) || 0;
        output.Operator = operator;
        output.Value = parseInt(value) || 0;

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
    
            if (!REWARDS.includes(elements[0])) {
                return [];
            }
            if (elements.length !== 2) {
                return [];
            }
    
            let newReward = new Reward();
            newReward.Type = elements[0];
            newReward.Value = elements[1];

            if (!isNaN(parseInt(newReward.Value))) {
                newReward.Value = parseInt(newReward.Value);
            }

            output.push(newReward);
        }
        return output;
    }

    /**
     * @param {number} ID
     * @returns {Achievement?}
     */
    GetByID = (ID) => this.achievements.find(a => a.ID === ID) || null;

    /**
     * Returns all achievements that are visible, with solved first
     * @param {Array<number>} solvedIndexes 
     * @returns {Array<Achievement>}
     */
    GetAll = (solvedIndexes) => {
        let achievements = [];

        // Get unlocked
        const solvedAchievements = [...solvedIndexes].reverse();
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
            if (!solvedIndexes.includes(achievement.ID) && achievement.Type !== -1) {
                achievements.push(achievement);
            }
        }

        return achievements;
    }
}

export { Achievement, Condition, Reward };
export default Achievements;