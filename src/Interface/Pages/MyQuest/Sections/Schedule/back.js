import * as React from 'react';

import { Range } from 'Utils/Functions';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Interface/Components/ComboBox/back').ComboBoxItem} ComboBoxItem
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 * @typedef {import('Class/Quests/MyQuests').RepeatModes} RepeatModes
 * @typedef {import('Class/Quests/MyQuests').FrequencyRepeatModes} FrequencyRepeatModes
 *
 * @typedef {Object} SectionSchedulePropsType
 * @property {StyleProp} style
 * @property {MyQuest | null} quest
 * @property {(quest: MyQuest) => void} onChangeQuest
 */

/** @type {RepeatModes[]} */
const TYPES = ['frequency', 'week', 'month'];

/** @type {FrequencyRepeatModes[]} */
const TYPES_FREQ = ['week', 'month'];

/** @type {SectionSchedulePropsType} */
const SectionScheduleProps = {
    style: {},
    quest: null,
    onChangeQuest: () => {}
};

class BackSectionSchedule extends React.Component {
    /** @param {number} index */
    switchMode = (index) => {
        const { quest, onChangeQuest } = this.props;
        if (quest === null) return;

        if (index < 0 || index > TYPES.length - 1 || index === TYPES.indexOf(quest.schedule.type)) {
            return;
        }

        const type = TYPES[index];
        if (type === 'week' || type === 'month') {
            onChangeQuest({
                ...quest,
                schedule: {
                    ...quest.schedule,
                    type: type,
                    repeat: []
                }
            });
        } else if (type === 'frequency') {
            onChangeQuest({
                ...quest,
                schedule: {
                    ...quest.schedule,
                    type: type,
                    quantity: 1,
                    frequencyMode: 'week'
                }
            });
        }
    };

    /**
     * Select or unselect a day
     * @param {number} index
     */
    onDaySelect = (index) => {
        const { quest, onChangeQuest } = this.props;
        if (quest === null) return;
        if (quest.schedule.type !== 'week' && quest.schedule.type !== 'month') return;

        const newRepeat = [...quest.schedule.repeat];
        if (newRepeat.includes(index)) {
            newRepeat.splice(newRepeat.indexOf(index), 1);
        } else {
            newRepeat.push(index);
        }

        onChangeQuest({
            ...quest,
            schedule: {
                ...quest.schedule,
                repeat: newRepeat.sort((a, b) => a - b)
            }
        });
    };

    /**
     * Select or unselect a column of days for month repeat mode or all days for week repeat mode
     * @param {number} index
     */
    onDaysSelect = (index) => {
        const { quest, onChangeQuest } = this.props;
        if (quest === null) return;
        if (quest.schedule.type !== 'week' && quest.schedule.type !== 'month') return;

        if (quest.schedule.type === 'week') {
            let days = Range(7);
            if (quest.schedule.repeat.length === 7) days = [];
            onChangeQuest({ ...quest, schedule: { ...quest.schedule, repeat: days } });
            return;
        }

        const modulo = index % 7;
        const days = Range(31).filter((i) => i % 7 === modulo);

        // Remove all column
        const repeat = quest.schedule.repeat;
        if (days.every((day) => repeat.includes(day))) {
            days.forEach((day) => repeat.splice(repeat.indexOf(day), 1));
        }

        // Select all column
        else {
            days.forEach((day) => !repeat.includes(day) && repeat.push(day));
        }

        onChangeQuest({
            ...quest,
            schedule: {
                ...quest.schedule,
                repeat: repeat.sort((a, b) => a - b)
            }
        });
    };

    /** @param {ComboBoxItem | null} item */
    onFrequencyChangeMode = (item) => {
        const { quest, onChangeQuest } = this.props;
        if (quest === null) return;
        if (item === null) return;
        if (quest.schedule.type !== 'frequency') return;

        onChangeQuest({
            ...quest,
            schedule: {
                ...quest.schedule,
                frequencyMode: item.key === 1 ? 'week' : 'month'
            }
        });
    };

    /** @param {number} index */
    onFrequencyChange = (index) => {
        const { quest, onChangeQuest } = this.props;
        if (quest === null) return;
        if (quest.schedule.type !== 'frequency') return;

        onChangeQuest({
            ...quest,
            schedule: {
                ...quest.schedule,
                quantity: index
            }
        });
    };
}

BackSectionSchedule.prototype.props = SectionScheduleProps;
BackSectionSchedule.defaultProps = SectionScheduleProps;

export { TYPES, TYPES_FREQ };
export default BackSectionSchedule;
