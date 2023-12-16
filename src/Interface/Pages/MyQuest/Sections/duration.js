import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Digit } from 'Interface/Components';
import { TIME_STEP_MINUTES } from 'Utils/Activities';

const MAX_DURATION_MINUTES = 12 * 60;

/**
 * @typedef {import('Interface/Components/Digit/back').DigitCallback} DigitCallback
 */

const DurationProps = {
    /** @type {number} Duration in minutes */
    duration: 60,

    /** @param {number} duration */
    onChange: (duration) => {}
};

class SectionDuration extends React.Component {
    state = {
        /** @type {number} */
        duration: 0
    }

    refHelp1 = null;

    onChange = () => {
        // TODO: Calculate duration
        const duration = 0;
        this.props.onChange(duration);
    }

    /** @type {DigitCallback} */
    onChangeDurationDigit = (name, index) => {
        // Get current durations (hour / minute)
        let durationHours = Math.floor(this.props.duration / 60);
        let durationMinutes = this.props.duration % 60;

        // Update duration
        if (name === 'duration_hour')
            durationHours = index;
        else if (name === 'duration_minute')
            durationMinutes = index * TIME_STEP_MINUTES;

        // Update state
        const durationTotal = durationHours * 60 + durationMinutes;
        this.props.onChange(durationTotal);
    }

    render() {
        const { duration } = this.props;
        const langDatesNames = langManager.curr['dates']['names'];

        const borderColor = {
            borderColor: themeManager.GetColor('main1', { opacity: 0.5 })
        };
        const backgroundColor = {
            backgroundColor: themeManager.GetColor('backgroundCard')
        };

        return (
            <View
                ref={ref => this.refHelp1 = ref}
                style={[backgroundColor, styles.schedulePanel]}
            >
                <Digit
                    name='duration_hour'
                    containerStyle={[styles.digitHour, borderColor]}
                    containerWidth={60}
                    fontSize={24}
                    minDigitWidth={12}
                    fadeColor='backgroundGrey'
                    initValue={Math.floor(duration / 60)}
                    maxValue={12}
                    velocity={2}
                    callback={this.onChangeDurationDigit}
                />
                <Text fontSize={24}>{langDatesNames['hours-min']}</Text>
                <Digit
                    name='duration_minute'
                    containerStyle={[styles.digitMinute, borderColor]}
                    containerWidth={60}
                    fontSize={24}
                    fadeColor='backgroundGrey'
                    initValue={duration % 60}
                    minValue={duration < 60 ? 5 : 0}
                    maxValue={duration >= MAX_DURATION_MINUTES ? 0 : 59}
                    stepValue={5}
                    velocity={duration >= MAX_DURATION_MINUTES ? .25 : 2}
                    callback={this.onChangeDurationDigit}
                />
                <Text fontSize={24}>{langDatesNames['seconds-min']}</Text>
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
        justifyContent: 'space-evenly',

        padding: 24,
        borderRadius: 12
    },
    digitHour: {
        height: 48,
        borderRadius: 4
    },
    digitMinute: {
        height: 48,
        borderRadius: 4
    }
});

export default SectionDuration;
