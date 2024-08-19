import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import langManager from 'Managers/LangManager';

import { Text, Digit } from 'Interface/Components';
import { TIME_STEP_MINUTES } from 'Utils/Activities';

const MAX_DURATION_MINUTES = 12 * 60;

/**
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 *
 * @typedef {Object} DurationPropsType
 * @property {MyQuest | null} quest
 * @property {(quest: MyQuest) => void} onChangeQuest/
 */

/** @type {DurationPropsType} */
const DurationProps = {
    quest: null,
    onChangeQuest: () => {}
};

class SectionDuration extends React.Component {
    /** @param {number} index */
    onChangeDurationHour = (index) => {
        const { quest, onChangeQuest } = this.props;
        if (quest === null) return;

        // Get current durations (hour / minute)
        const duration = quest.schedule.duration;
        const durationHours = index;
        const durationMinutes = duration % 60;

        // Update state
        const durationTotal = durationHours * 60 + durationMinutes;
        onChangeQuest({
            ...quest,
            schedule: {
                ...quest.schedule,
                duration: durationTotal
            }
        });
    };

    /** @param {number} index */
    onChangeDurationMinute = (index) => {
        const { quest, onChangeQuest } = this.props;
        if (quest === null) return;

        // Get current durations (hour / minute)
        const duration = quest.schedule.duration;
        const durationHours = Math.floor(duration / 60);
        const durationMinutes = index * TIME_STEP_MINUTES;

        // Update state
        const durationTotal = durationHours * 60 + durationMinutes;
        onChangeQuest({
            ...quest,
            schedule: {
                ...quest.schedule,
                duration: durationTotal
            }
        });
    };

    render() {
        const langDatesNames = langManager.curr['dates']['names'];
        const { quest } = this.props;
        if (quest === null) return null;

        const duration = quest.schedule.duration;

        return (
            <View ref={(ref) => (this.refHelp1 = ref)} style={styles.schedulePanel}>
                <Digit
                    style={styles.digitHour}
                    minDigitWidth={30}
                    fontSize={18}
                    value={Math.floor(duration / 60)}
                    maxValue={12}
                    velocity={2}
                    onChangeValue={this.onChangeDurationHour}
                />
                <Text fontSize={24}>{langDatesNames['hours-min']}</Text>

                <Digit
                    style={styles.digitMinute}
                    fontSize={18}
                    minDigitWidth={30}
                    value={duration % 60}
                    minValue={duration < 60 ? 5 : 0}
                    maxValue={duration >= MAX_DURATION_MINUTES ? 0 : 59}
                    stepValue={5}
                    velocity={duration >= MAX_DURATION_MINUTES ? 0.5 : 2}
                    onChangeValue={this.onChangeDurationMinute}
                />
                <Text fontSize={24}>{langDatesNames['minutes-min']}</Text>
            </View>
        );
    }
}

SectionDuration.prototype.props = DurationProps;
SectionDuration.defaultProps = DurationProps;

const styles = StyleSheet.create({
    schedulePanel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    digitHour: {
        width: '30%',
        minHeight: 50,
        borderWidth: 1,
        borderRadius: 8
    },
    digitMinute: {
        width: '30%',
        minHeight: 50,
        borderWidth: 1,
        borderRadius: 8
    }
});

export default SectionDuration;
