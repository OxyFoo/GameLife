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
 * @param {RepeatModes} repeatMode Repeat mode
 * @param {Array<number>} repeatDays Array of days of week
 */

const SectionScheduleProps = {
    /** @type {OnChangeScheduleEvent} */
    onChange: (repeatMode, repeatDays) => {}
};

class SectionSchedule extends React.Component {
    state = {
        /** @type {RepeatModes} */
        repeatMode: 'week',

        /** @type {Array<number>} */
        selectedDays: []
    }

    /** @type {TextSwitch | null} */
    refTextSwitch = null;

    refHelp1 = null;

    /** @param {number} index */
    switchMode = (index) => {
        if (index < 0 || index > 1) return;
        const repeatMode = ['week', 'month'][index];
        this.setState({ repeatMode, selectedDays: [] }, this.onChange);
    }

    /**
     * @param {RepeatModes} repeatMode
     * @param {Array<number>} selectedDays
     */
    SetValues = (repeatMode, selectedDays) => {
        this.setState({
            repeatMode,
            selectedDays
        });

        const repeatModeIndex = ['week', 'month'].indexOf(repeatMode);
        this.refTextSwitch?.SetSelectedIndex(repeatModeIndex);
    }

    GetValues = () => {
        let { repeatMode, selectedDays } = this.state;
        selectedDays = selectedDays.filter(day => day <= 30);
        return { repeatMode, selectedDays };
    }

    onChange = () => {
        const { repeatMode, selectedDays } = this.state;
        this.props.onChange(repeatMode, selectedDays);
    }

    /**
     * Select or unselect a day
     * @param {number} index
     */
    onDaySelect = (index) => {
        const { selectedDays } = this.state;
        const include = selectedDays.includes(index);
        if (include) selectedDays.splice(selectedDays.indexOf(index), 1);
        else         selectedDays.push(index);
        this.setState({ selectedDays }, this.onChange);
    }

    /**
     * Select or unselect a column of days for month
     *  repeat mode or all days for week repeat mode
     * @param {number} index
     */
    onDaysSelect = (index) => {
        const { repeatMode, selectedDays } = this.state;

        if (repeatMode === 'week') {
            let days = Range(7);
            if (selectedDays.length === 7) days = [];
            this.setState({ selectedDays: days }, this.onChange);
            return;
        }

        const modulo = index % 7;
        const days = Range(31).filter(i => i % 7 === modulo);

        // Remove all column
        if (days.every(day => selectedDays.includes(day))) {
            days.forEach(day => selectedDays.splice(selectedDays.indexOf(day), 1));
        }

        // Select all column
        else {
            days.forEach(day => !selectedDays.includes(day) && selectedDays.push(day));
        }

        this.setState({ selectedDays }, this.onChange);
    }

    renderDaySelector = () => {
        const { repeatMode, selectedDays } = this.state;

        const langDates = langManager.curr['dates'];
        let elements = [];

        // Add first letter of each day
        if (repeatMode === 'week') {
            elements = langDates['days'].map(day => day.charAt(0));
            elements.push(elements.splice(0, 1)[0]);
        }

        // Add numbers from 1 to 31
        else if (repeatMode === 'month') {
            elements = Range(35).map(i => (i + 1).toString());
        }

        const styleBorder = { borderColor: themeManager.GetColor('main1') };
        const emptyButton = <View style={styles.selectorButton} />;

        return (
            <FlatList
                style={{ marginTop: 12 }}
                columnWrapperStyle={{ flex: 1 }}
                contentContainerStyle={{ justifyContent: 'space-between' }}
                data={elements}
                numColumns={7}
                renderItem={({ item, index }) => index > 30 ? emptyButton : (
                    <Button
                        style={[styles.selectorButton, styleBorder]}
                        color={selectedDays.includes(index) ? 'main1' : 'transparent'}
                        colorText={selectedDays.includes(index) ? 'white' : 'main1'}
                        rippleColor='white'
                        onPress={() => this.onDaySelect(index)}
                        onLongPress={() => this.onDaysSelect(index)}
                    >
                        {item}
                    </Button>
                )}
                keyExtractor={(item, index) => 'pickday-' + index.toString()}
            />
        );
    }

    render() {
        const lang = langManager.curr['quest'];
        const { repeatMode } = this.state;

        const backgroundColor = { backgroundColor: themeManager.GetColor('backgroundCard') };

        const dateNames = langManager.curr['dates']['names'];
        const timeIntervals = [ dateNames['weekly'], dateNames['monthly'] ];

        return (
            <>
                <Text style={styles.sectionTitle} fontSize={22}>{lang['input-repeat-title']}</Text>
                <View
                    ref={ref => this.refHelp1 = ref}
                    style={[backgroundColor, styles.schedulePanel]}
                >
                    <TextSwitch
                        ref={ref => this.refTextSwitch = ref}
                        style={styles.textSwitch}
                        texts={timeIntervals}
                        onChange={this.switchMode}
                    />
                    {repeatMode === 'month' && (
                        <Text style={styles.hintText}>
                            {lang['text-hint-select']}
                        </Text>
                    )}
                    {this.renderDaySelector()}
                </View>
            </>
        );
    }
}

SectionSchedule.prototype.props = SectionScheduleProps;
SectionSchedule.defaultProps = SectionScheduleProps;

const styles = StyleSheet.create({
    sectionTitle: {
        marginTop: 32,
        marginBottom: 12
    },
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
    }
});

export default SectionSchedule;
