import * as React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Range } from 'Utils/Functions';
import { Text, Button, TextSwitch } from 'Interface/Components';

/**
 * @typedef {import('Class/Quests').RepeatModes} RepeatModes
 * 
 * @callback OnChangeScheduleEvent
 * @param {RepeatModes} type Repeat mode
 * @param {Array<number>} repeat Array of days of week
 */

/** @type {RepeatModes[]} */
const TYPES = [ 'week', 'month' ];

const SectionScheduleProps = {
    schedule: {
        /** @type {RepeatModes} */
        type: 'week',

        /** @type {Array<number>} */
        repeat: []
    },

    /** @type {OnChangeScheduleEvent} */
    onChange: (type, repeat) => {}
};

class SectionSchedule extends React.Component {
    refHelp1 = null;

    /** @param {number} index */
    switchMode = (index) => {
        if (index < 0 || index > 1) return;
        this.props.onChange(TYPES[index], []);
    }

    /**
     * Select or unselect a day
     * @param {number} index
     */
    onDaySelect = (index) => {
        const { schedule: { type, repeat } } = this.props;
        const include = repeat.includes(index);
        if (include) repeat.splice(repeat.indexOf(index), 1);
        else         repeat.push(index);
        this.props.onChange(type, repeat);
    }

    /**
     * Select or unselect a column of days for month
     *  repeat mode or all days for week repeat mode
     * @param {number} index
     */
    onDaysSelect = (index) => {
        const { schedule: { type, repeat } } = this.props;

        if (type === 'week') {
            let days = Range(7);
            if (repeat.length === 7) days = [];
            this.props.onChange(type, days);
            return;
        }

        const modulo = index % 7;
        const days = Range(31).filter(i => i % 7 === modulo);

        // Remove all column
        if (days.every(day => repeat.includes(day))) {
            days.forEach(day => repeat.splice(repeat.indexOf(day), 1));
        }

        // Select all column
        else {
            days.forEach(day => !repeat.includes(day) && repeat.push(day));
        }

        this.props.onChange(type, repeat);
    }

    renderDay = ({ item, index }) => {
        const { schedule: { repeat } } = this.props;

        if (index > 30) {
            return (
                <View style={styles.selectorButton} />
            );
        }

        const styleBorder = { borderColor: themeManager.GetColor('main1') };

        return (
            <Button
                style={[styles.selectorButton, styleBorder]}
                color={repeat.includes(index) ? 'main1' : 'transparent'}
                colorText={repeat.includes(index) ? 'white' : 'main1'}
                rippleColor='white'
                onPress={() => this.onDaySelect(index)}
                onLongPress={() => this.onDaysSelect(index)}
            >
                {item}
            </Button>
        );
    }

    renderDaySelector = () => {
        const { schedule: { type } } = this.props;
        const langDates = langManager.curr['dates'];

        let elements = [];

        // Add first letter of each day
        if (type === 'week') {
            elements = langDates['days'].map(day => day.charAt(0));
            elements.push(elements.splice(0, 1)[0]);
        }

        // Add numbers from 1 to 31
        else if (type === 'month') {
            elements = Range(35).map(i => (i + 1).toString());
        }

        return (
            <FlatList
                style={styles.daysFlatlist}
                columnWrapperStyle={styles.daysColumnWrapperStyle}
                contentContainerStyle={styles.daysContentContainerStyle}
                data={elements}
                numColumns={7}
                renderItem={this.renderDay}
                keyExtractor={(item, index) => 'pickday-' + index.toString()}
            />
        );
    }

    render() {
        const lang = langManager.curr['quest'];
        const { schedule: { type } } = this.props;

        const backgroundColor = { backgroundColor: themeManager.GetColor('backgroundCard') };

        const dateNames = langManager.curr['dates']['names'];
        const timeIntervals = [ dateNames['weekly'], dateNames['monthly'] ];

        return (
            <View
                ref={ref => this.refHelp1 = ref}
                style={[backgroundColor, styles.schedulePanel]}
            >
                <TextSwitch
                    style={styles.textSwitch}
                    texts={timeIntervals}
                    initialIndex={TYPES.indexOf(type)}
                    onChange={this.switchMode}
                />
                {type === 'month' && (
                    <Text style={styles.hintText}>
                        {lang['text-hint-select']}
                    </Text>
                )}
                {this.renderDaySelector()}
            </View>
        );
    }
}

SectionSchedule.prototype.props = SectionScheduleProps;
SectionSchedule.defaultProps = SectionScheduleProps;

const styles = StyleSheet.create({
    schedulePanel: {
        padding: 24,
        borderRadius: 12
    },
    textSwitch: {
        height: 46
    },
    hintText: {
        marginTop: 12
    },
    selectorButton: {
        flex: 1/7,
        aspectRatio: 1,
        margin: 4,
        paddingHorizontal: 0,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'transparent'
    },

    daysFlatlist: {
        marginTop: 12
    },
    daysColumnWrapperStyle: {
        flex: 1
    },
    daysContentContainerStyle: {
        justifyContent: 'space-between'
    }
});

export default SectionSchedule;
